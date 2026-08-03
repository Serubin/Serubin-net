import AdmZip from 'adm-zip';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { ReadableStream } from 'node:stream/web';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { PORTFOLIO_DIR } from '../lib/portfolioPaths';

const PREFIX = '[fetch-portfolio]';

export function isPortfolioFetchDebug(): boolean {
  return (
    process.env.PORTFOLIO_FETCH_DEBUG === '1' ||
    process.env.PORTFOLIO_FETCH_DEBUG === 'true'
  );
}

function log(kind: 'info' | 'debug', message: string, detail?: Record<string, unknown>): void {
  if (kind === 'debug' && !isPortfolioFetchDebug()) return;
  const tag = kind === 'debug' ? `${PREFIX}:debug` : PREFIX;
  if (detail) {
    console.log(tag, message, detail);
  } else {
    console.log(tag, message);
  }
}

/** Log URL without query (avoids leaking presigned tokens). */
export function safeUrlForLog(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    return `${u.protocol}//${u.host}${u.pathname}`;
  } catch {
    return '(invalid URL)';
  }
}

/** Resolve a ZIP entry to an absolute path under rootDir, or null if unsafe (zip-slip). */
export function resolveSafeZipEntryTarget(rootDir: string, entryName: string): string | null {
  const normalized = entryName.replace(/\\/g, '/').replace(/^\/+/, '');
  const trimmed = normalized.replace(/\/+$/, '');
  if (!trimmed) return null;

  const segments = trimmed.split('/').filter((s) => s.length > 0);
  if (segments.length === 0) return null;
  if (segments[0] === '__MACOSX') return null;
  for (const s of segments) {
    if (s === '..') return null;
  }

  const resolved = path.resolve(rootDir, ...segments);
  const rootResolved = path.resolve(rootDir);
  const rootPrefix = rootResolved.endsWith(path.sep) ? rootResolved : rootResolved + path.sep;
  if (resolved !== rootResolved && !resolved.startsWith(rootPrefix)) {
    return null;
  }
  return resolved;
}

function zipEntryTopSegment(entryName: string): string | undefined {
  const normalized = entryName.replace(/\\/g, '/').replace(/^\/+/, '');
  return normalized.split('/').filter(Boolean)[0];
}

type ExtractStats = {
  filesWritten: number;
  skippedUnsafe: number;
  skippedDirectory: number;
  skippedMacosx: number;
};

async function extractAdmZipToPortfolioDir(zip: AdmZip): Promise<ExtractStats> {
  let filesWritten = 0;
  let skippedUnsafe = 0;
  let skippedDirectory = 0;
  let skippedMacosx = 0;

  const entries = zip.getEntries();
  log('debug', 'zip entries', { total: entries.length });

  let loggedSamples = 0;
  for (const entry of entries) {
    if (entry.isDirectory) {
      skippedDirectory += 1;
      continue;
    }
    const rawName = entry.entryName;
    const target = resolveSafeZipEntryTarget(PORTFOLIO_DIR, rawName);
    if (!target) {
      if (zipEntryTopSegment(rawName) === '__MACOSX') {
        skippedMacosx += 1;
        log('debug', 'skipped __MACOSX entry', { entryName: rawName });
      } else {
        skippedUnsafe += 1;
        console.warn(`${PREFIX} skipped unsafe path: ${rawName}`);
      }
      continue;
    }

    if (isPortfolioFetchDebug() && loggedSamples < 12) {
      log('debug', 'extract', { entryName: rawName, target });
      loggedSamples += 1;
    }

    const data = entry.getData();
    await fs.promises.mkdir(path.dirname(target), { recursive: true });
    await fs.promises.writeFile(target, data);
    filesWritten += 1;
  }

  return {
    filesWritten,
    skippedUnsafe,
    skippedDirectory,
    skippedMacosx,
  };
}

const IGNORABLE_ROOT_FILES = new Set(['.ds_store', 'thumbs.db']);

function isIgnorablePortfolioRootFile(name: string): boolean {
  return IGNORABLE_ROOT_FILES.has(name.toLowerCase());
}

/**
 * If the archive expanded to a single wrapper folder (e.g. `MyExport/AlbumA/...`),
 * move contents up into `portfolioRoot` so album dirs sit directly under `images/portfolio`.
 * Repeats while one non-`__MACOSX` directory wraps everything and there are no other files.
 */
async function hoistSingleTopLevelWrappers(
  portfolioRoot: string,
  maxDepth: number
): Promise<number> {
  let hoisted = 0;
  for (let i = 0; i < maxDepth; i += 1) {
    const entries = await fs.promises.readdir(portfolioRoot, { withFileTypes: true });
    const nonMacosxDirs = entries.filter((e) => e.isDirectory() && e.name !== '__MACOSX');
    const significantFiles = entries.filter(
      (e) => e.isFile() && !isIgnorablePortfolioRootFile(e.name)
    );

    if (nonMacosxDirs.length !== 1 || significantFiles.length > 0) {
      break;
    }

    const wrapperName = nonMacosxDirs[0].name;
    const inner = path.join(portfolioRoot, wrapperName);
    const innerEntries = await fs.promises.readdir(inner, { withFileTypes: true });
    for (const e of innerEntries) {
      await fs.promises.rename(path.join(inner, e.name), path.join(portfolioRoot, e.name));
    }
    await fs.promises.rm(inner, { recursive: true, force: true });
    hoisted += 1;
    log('info', 'hoisted single top-level directory', { wrapperName, step: hoisted });
  }
  return hoisted;
}

/**
 * If PORTFOLIO_SOURCE_ZIP_URL is set, download the ZIP and replace images/portfolio contents.
 * No-op when unset (local folder unchanged).
 * Optional PORTFOLIO_SOURCE_AUTH_TOKEN sends `Authorization: Bearer <token>`.
 */
export async function fetchAndInstallPortfolioSources(): Promise<void> {
  const url = process.env.PORTFOLIO_SOURCE_ZIP_URL?.trim();
  if (!url) {
    log('info', 'PORTFOLIO_SOURCE_ZIP_URL not set, skipping remote fetch');
    return;
  }

  const authToken = process.env.PORTFOLIO_SOURCE_AUTH_TOKEN?.trim();
  const init: RequestInit = {};
  if (authToken) {
    init.headers = { Authorization: `Bearer ${authToken}` };
  }

  const t0 = Date.now();
  log('info', 'starting download', {
    url: safeUrlForLog(url),
    portfolioDir: PORTFOLIO_DIR,
    cwd: process.cwd(),
    debug: isPortfolioFetchDebug(),
    bearerAuth: Boolean(authToken),
  });

  const res = await fetch(url, init);
  const ct = res.headers.get('content-type');
  const cl = res.headers.get('content-length');
  log('info', 'response', {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    contentType: ct,
    contentLength: cl,
  });

  if (!res.ok) {
    const bodyPreview = await readBodyPreviewForError(res);
    if (bodyPreview) {
      log('info', 'error response body (preview)', { preview: bodyPreview });
    }
    throw new Error(`Portfolio ZIP fetch failed: ${res.status} ${res.statusText}`);
  }

  if (!res.body) {
    throw new Error('Portfolio ZIP response has no body');
  }

  const tmpZip = path.join(os.tmpdir(), `portfolio-${process.pid}-${Date.now()}.zip`);
  log('debug', 'streaming to temp file', { tmpZip });

  const nodeReadable = Readable.fromWeb(res.body as ReadableStream);
  await pipeline(nodeReadable, fs.createWriteStream(tmpZip));

  const stat = await fs.promises.stat(tmpZip);
  log('info', 'download complete', { bytes: stat.size, tmpZip });

  try {
    log('info', 'replacing portfolio directory', { PORTFOLIO_DIR });
    await fs.promises.rm(PORTFOLIO_DIR, { recursive: true, force: true });
    await fs.promises.mkdir(PORTFOLIO_DIR, { recursive: true });

    const zip = new AdmZip(tmpZip);
    const counts = await extractAdmZipToPortfolioDir(zip);
    const hoistSteps = await hoistSingleTopLevelWrappers(PORTFOLIO_DIR, 8);
    log('info', 'extract complete', {
      ...counts,
      hoistSteps,
      ms: Date.now() - t0,
    });

    if (counts.filesWritten === 0) {
      console.warn(
        `${PREFIX} no files were extracted — check ZIP layout (expect album folders at zip root with images inside) and PORTFOLIO_FETCH_DEBUG=1`
      );
    }
  } finally {
    await fs.promises.unlink(tmpZip).catch(() => undefined);
    log('debug', 'removed temp zip');
  }
}

const ERROR_BODY_PREVIEW_BYTES = 512;

async function readBodyPreviewForError(res: Response): Promise<string | undefined> {
  try {
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) return undefined;
    const slice = buf.subarray(0, ERROR_BODY_PREVIEW_BYTES);
    const text = slice.toString('utf8').replace(/\s+/g, ' ').trim();
    return text.length > 200 ? `${text.slice(0, 200)}…` : text;
  } catch {
    return undefined;
  }
}

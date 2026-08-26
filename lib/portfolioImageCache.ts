import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PORTFOLIO_DIR } from './portfolioPaths';

export { PORTFOLIO_DIR };
export const CACHE_ROOT = path.join(process.cwd(), '.cache/portfolio-rendered');

const WATERMARK_TEXT = '\u00a9 Solomon Rubin';
export const MAX_OUTPUT_WIDTH = 1920;
export const FULL_WEBP_QUALITY = 65;
export const PLACEHOLDER_MAX_WIDTH = 40;
export const PLACEHOLDER_BLUR_SIGMA = 4;
export const PLACEHOLDER_WEBP_QUALITY = 50;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export function isPortfolioImageFile(fileName: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

export function createWatermarkSvg(width: number, height: number): Buffer {
  const fontSize = Math.max(Math.floor(Math.min(width, height) / 12), 24);
  const spacing = fontSize * 4;
  const rows = Math.ceil(height / spacing) + 2;
  const cols = Math.ceil(width / spacing) + 2;

  let texts = '';
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const x = c * spacing;
      const y = r * spacing;
      texts += `<text x="${x}" y="${y}" font-size="${fontSize}" font-family="sans-serif" fill="white" opacity="0.3" transform="rotate(-30, ${x}, ${y})">${WATERMARK_TEXT}</text>`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${texts}</svg>`;
  return Buffer.from(svg);
}

export function portfolioCachePaths(segments: string[]): {
  main: string;
  watermarked: string;
  placeholder: string;
} {
  const albumDir = segments[0];
  const fileName = segments.slice(1).join(path.sep);
  const dir = path.join(CACHE_ROOT, albumDir);
  return {
    main: path.join(dir, `${fileName}.main.webp`),
    watermarked: path.join(dir, `${fileName}.watermarked.webp`),
    placeholder: path.join(dir, `${fileName}.placeholder.webp`),
  };
}

function listPortfolioImageJobs(): { albumDir: string; fileName: string; absSource: string }[] {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    return [];
  }

  const out: { albumDir: string; fileName: string; absSource: string }[] = [];
  const entries = fs.readdirSync(PORTFOLIO_DIR, { withFileTypes: true });

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const albumPath = path.join(PORTFOLIO_DIR, e.name);
    for (const f of fs.readdirSync(albumPath)) {
      if (!isPortfolioImageFile(f)) continue;
      out.push({
        albumDir: e.name,
        fileName: f,
        absSource: path.join(albumPath, f),
      });
    }
  }

  return out;
}

async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>
): Promise<void> {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const i = index++;
      if (i >= items.length) break;
      await worker(items[i]);
    }
  });
  await Promise.all(runners);
}

async function writeImageCaches(job: {
  albumDir: string;
  fileName: string;
  absSource: string;
}): Promise<void> {
  const { main, watermarked, placeholder } = portfolioCachePaths([
    job.albumDir,
    job.fileName,
  ]);
  await fs.promises.mkdir(path.dirname(main), { recursive: true });

  const mainBuf = await sharp(job.absSource)
    .rotate()
    .resize(MAX_OUTPUT_WIDTH, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: FULL_WEBP_QUALITY })
    .toBuffer();

  await fs.promises.writeFile(main, mainBuf);

  const meta = await sharp(mainBuf).metadata();
  const watermarkSvg = createWatermarkSvg(
    meta.width ?? 800,
    meta.height ?? 600
  );
  const watermarkedBuf = await sharp(mainBuf)
    .composite([{ input: watermarkSvg, top: 0, left: 0 }])
    .webp({ quality: FULL_WEBP_QUALITY })
    .toBuffer();

  await fs.promises.writeFile(watermarked, watermarkedBuf);

  const placeholderBuf = await sharp(job.absSource)
    .rotate()
    .resize(PLACEHOLDER_MAX_WIDTH, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .blur(PLACEHOLDER_BLUR_SIGMA)
    .webp({ quality: PLACEHOLDER_WEBP_QUALITY })
    .toBuffer();

  await fs.promises.writeFile(placeholder, placeholderBuf);
}

export async function warmPortfolioImageCache(): Promise<void> {
  const jobs = listPortfolioImageJobs();
  await runPool(jobs, 3, writeImageCaches);
}

let warmupPromise: Promise<void> | null = null;

/** Dev-only background warm; `predev` / `prestart` already run `prepare:portfolio` (fetch + warm) before the server. */
export function ensurePortfolioCacheWarmup(): void {
  if (warmupPromise !== null) return;
  warmupPromise = warmPortfolioImageCache().catch((err) => {
    console.error('[portfolioImageCache] warmup failed', err);
    warmupPromise = null;
  });
}

export async function renderPlaceholderWebP(absSourcePath: string): Promise<Buffer> {
  return sharp(absSourcePath)
    .rotate()
    .resize(PLACEHOLDER_MAX_WIDTH, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .blur(PLACEHOLDER_BLUR_SIGMA)
    .webp({ quality: PLACEHOLDER_WEBP_QUALITY })
    .toBuffer();
}

export async function renderMainWebP(absSourcePath: string): Promise<Buffer> {
  return sharp(absSourcePath)
    .rotate()
    .resize(MAX_OUTPUT_WIDTH, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: FULL_WEBP_QUALITY })
    .toBuffer();
}

export async function renderWatermarkedWebP(absSourcePath: string): Promise<Buffer> {
  const mainBuf = await renderMainWebP(absSourcePath);
  const meta = await sharp(mainBuf).metadata();
  const watermarkSvg = createWatermarkSvg(
    meta.width ?? 800,
    meta.height ?? 600
  );
  return sharp(mainBuf)
    .composite([{ input: watermarkSvg, top: 0, left: 0 }])
    .webp({ quality: FULL_WEBP_QUALITY })
    .toBuffer();
}

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const ALBUM_META_FILE = 'album.yml';
const MAX_META_BYTES = 64 * 1024;
const MAX_TITLE_LENGTH = 120;
const FOCUS_PATTERN = /^(\d{1,3})% (\d{1,3})%$/;

export type PhotoMeta = { title?: string; focus?: string };

function parseFocus(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const match = FOCUS_PATTERN.exec(value.trim());
  if (!match) return undefined;
  const [x, y] = [Number(match[1]), Number(match[2])];
  return x <= 100 && y <= 100 ? `${x}% ${y}%` : undefined;
}

function parseTitle(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const title = value.trim().slice(0, MAX_TITLE_LENGTH);
  return title || undefined;
}

/**
 * Reads optional per-photo metadata from `<album>/album.yml`, keyed by file name.
 * The file arrives in a downloaded ZIP, so every value is validated and anything malformed is dropped.
 */
export function readAlbumMeta(albumPath: string, files: readonly string[]): Map<string, PhotoMeta> {
  const meta = new Map<string, PhotoMeta>();
  const metaPath = path.join(albumPath, ALBUM_META_FILE);

  let parsed: unknown;
  try {
    const stat = fs.statSync(metaPath, { throwIfNoEntry: false });
    if (!stat?.isFile()) return meta;
    if (stat.size > MAX_META_BYTES) {
      console.warn(`[albumMeta] ignoring ${metaPath}: larger than ${MAX_META_BYTES} bytes`);
      return meta;
    }
    parsed = yaml.load(fs.readFileSync(metaPath, 'utf8'));
  } catch (err) {
    console.warn(`[albumMeta] ignoring ${metaPath}:`, err instanceof Error ? err.message : err);
    return meta;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return meta;

  const known = new Set(files);
  for (const [file, entry] of Object.entries(parsed)) {
    if (!known.has(file) || !entry || typeof entry !== 'object') continue;
    const { title, focus } = entry as Record<string, unknown>;
    const photoMeta: PhotoMeta = { title: parseTitle(title), focus: parseFocus(focus) };
    if (photoMeta.title || photoMeta.focus) meta.set(file, photoMeta);
  }
  return meta;
}

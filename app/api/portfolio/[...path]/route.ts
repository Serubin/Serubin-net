import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import {
  PORTFOLIO_VIEW_COOKIE,
  verifyPortfolioViewCookie,
} from '../../../../lib/portfolioViewCookie';

const PORTFOLIO_DIR = path.join(process.cwd(), 'images/portfolio');
const WATERMARK_TEXT = '\u00a9 Solomon Rubin';
const MAX_OUTPUT_WIDTH = 1920;

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

function createWatermarkSvg(width: number, height: number): Buffer {
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

/**
 * Same-origin <img src="/api/portfolio/..."> sends Sec-Fetch-Dest: image.
 * Opening that URL in a new tab is a top-level navigation (typically document), so we watermark
 * direct views while keeping embeds clean for visitors who have the HttpOnly cookie.
 */
function isEmbeddedImageRequest(request: NextRequest): boolean {
  return request.headers.get('Sec-Fetch-Dest') === 'image';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;

  if (segments.some((s) => s === '..' || s.includes('\0'))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const filePath = path.join(PORTFOLIO_DIR, ...segments);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext];

  if (!mimeType || !fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const cookieOk = await verifyPortfolioViewCookie(
    request.cookies.get(PORTFOLIO_VIEW_COOKIE)?.value
  );
  const shouldWatermark =
    !cookieOk || !isEmbeddedImageRequest(request);

  const resized = await sharp(filePath)
    .rotate()
    .resize(MAX_OUTPUT_WIDTH, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();

  let buffer: Buffer;
  if (shouldWatermark) {
    const meta = await sharp(resized).metadata();
    const watermarkSvg = createWatermarkSvg(
      meta.width ?? 800,
      meta.height ?? 600
    );
    buffer = await sharp(resized)
      .composite([{ input: watermarkSvg, top: 0, left: 0 }])
      .toBuffer();
  } else {
    buffer = resized;
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'no-store',
    },
  });
}

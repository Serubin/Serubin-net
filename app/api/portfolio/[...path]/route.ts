import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import {
  PORTFOLIO_DIR,
  ensurePortfolioCacheWarmup,
  portfolioCachePaths,
  renderMainWebP,
  renderPlaceholderWebP,
  renderWatermarkedWebP,
} from '../../../../lib/portfolioImageCache';
import {
  PORTFOLIO_VIEW_COOKIE,
  verifyPortfolioViewCookie,
} from '../../../../lib/portfolioViewCookie';

if (process.env.NODE_ENV === 'development') {
  ensurePortfolioCacheWarmup();
}

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/**
 * Same-origin <img src="/api/portfolio/..."> sends Sec-Fetch-Dest: image.
 * Opening that URL in a new tab is a top-level navigation (typically document), so we watermark
 * direct views while keeping embeds clean for visitors who have the HttpOnly cookie.
 */
function isEmbeddedImageRequest(request: NextRequest): boolean {
  return request.headers.get('Sec-Fetch-Dest') === 'image';
}

async function readFileOrNull(filePath: string): Promise<Buffer | null> {
  try {
    return await fs.promises.readFile(filePath);
  } catch (e: unknown) {
    const code = e && typeof e === 'object' && 'code' in e ? (e as NodeJS.ErrnoException).code : undefined;
    if (code === 'ENOENT') return null;
    throw e;
  }
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

  const cachePaths = portfolioCachePaths(segments);
  const isPlaceholder = request.nextUrl.searchParams.get('p') === '1';

  if (isPlaceholder) {
    let buffer =
      (await readFileOrNull(cachePaths.placeholder)) ??
      (await renderPlaceholderWebP(filePath));

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'no-store',
      },
    });
  }

  const cookieOk = await verifyPortfolioViewCookie(
    request.cookies.get(PORTFOLIO_VIEW_COOKIE)?.value
  );
  const shouldWatermark =
    !cookieOk || !isEmbeddedImageRequest(request);

  const cacheFile = shouldWatermark ? cachePaths.watermarked : cachePaths.main;
  let buffer =
    (await readFileOrNull(cacheFile)) ??
    (shouldWatermark
      ? await renderWatermarkedWebP(filePath)
      : await renderMainWebP(filePath));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'no-store',
    },
  });
}

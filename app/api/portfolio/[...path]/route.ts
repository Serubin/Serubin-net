import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { logger } from '../../../../lib/log';
import {
  PORTFOLIO_DIR,
  type PortfolioImageVariant,
  portfolioCachePaths,
  portfolioImageRenderSeconds,
  portfolioImageRequests,
  renderMainWebP,
  renderPlaceholderWebP,
  renderWatermarkedWebP,
} from '../../../../lib/portfolioImageCache';
import {
  PORTFOLIO_VIEW_COOKIE,
  verifyPortfolioViewCookie,
} from '../../../../lib/portfolioViewCookie';

const log = logger('portfolio-image');

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

async function cachedOrRender(
  variant: PortfolioImageVariant,
  cacheFile: string,
  render: () => Promise<Buffer>,
  image: string
): Promise<Buffer> {
  const cached = await readFileOrNull(cacheFile);
  if (cached) {
    portfolioImageRequests.inc({ variant, cache: 'hit' });
    return cached;
  }

  portfolioImageRequests.inc({ variant, cache: 'miss' });
  const started = performance.now();
  const buffer = await render();
  const seconds = (performance.now() - started) / 1000;
  portfolioImageRenderSeconds.observe({ variant }, seconds);
  log.info('cache miss, rendered on request', {
    image,
    variant,
    render_ms: Math.round(seconds * 1000),
  });
  return buffer;
}

function webpResponse(buffer: Buffer): NextResponse {
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'no-store',
    },
  });
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
  const image = segments.join('/');
  let variant: PortfolioImageVariant | undefined;

  try {
    if (request.nextUrl.searchParams.get('p') === '1') {
      variant = 'placeholder';
      return webpResponse(
        await cachedOrRender(variant, cachePaths.placeholder, () => renderPlaceholderWebP(filePath), image)
      );
    }

    const cookieOk = await verifyPortfolioViewCookie(
      request.cookies.get(PORTFOLIO_VIEW_COOKIE)?.value
    );
    const shouldWatermark =
      !cookieOk || !isEmbeddedImageRequest(request);

    variant = shouldWatermark ? 'watermarked' : 'main';
    const buffer = shouldWatermark
      ? await cachedOrRender(variant, cachePaths.watermarked, () => renderWatermarkedWebP(filePath), image)
      : await cachedOrRender(variant, cachePaths.main, () => renderMainWebP(filePath), image);
    return webpResponse(buffer);
  } catch (err) {
    log.error('failed to serve portfolio image', { image, variant, err });
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

import type { IncomingMessage, ServerResponse } from 'http';
import { isIPv4, isIPv6 } from 'net';
import { logger } from './log';
import { counter, histogram } from './metrics';

const log = logger('http');

const httpRequests = counter('http_requests_total', 'HTTP requests by method, route and status.', [
  'method',
  'route',
  'status',
]);
const httpDuration = histogram('http_request_duration_seconds', 'HTTP request duration by method and route.', [
  'method',
  'route',
]);

const KNOWN_METHODS = new Set(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
const MAX_PATH = 512;
const MAX_UA = 256;
const MAX_HOST = 256;

function stripQuery(url: string): string {
  const end = url.search(/[?#]/);
  return end === -1 ? url : url.slice(0, end);
}

function cap(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

/** Expands an IPv6 address to its eight hex groups, or null if it is malformed. */
function ipv6Groups(ip: string): string[] | null {
  const parts = ip.split('::');
  if (parts.length > 2) return null;
  const toGroups = (s: string) =>
    s === '' ? [] : s.split(':').flatMap((g) => (g.includes('.') ? ['0', '0'] : [g]));
  const head = toGroups(parts[0]);
  const tail = parts.length === 2 ? toGroups(parts[1]) : [];
  const missing = 8 - head.length - tail.length;
  if (missing < 0 || (parts.length === 1 && missing !== 0)) return null;
  return [...head, ...Array(missing).fill('0'), ...tail];
}

/** Truncates to /24 (IPv4) or /48 (IPv6) so access logs hold a network, not a person. */
export function truncateIp(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let ip = raw.trim().replace(/%.*$/, '');
  if (ip.toLowerCase().startsWith('::ffff:') && isIPv4(ip.slice(7))) {
    ip = ip.slice(7);
  }
  if (isIPv4(ip)) {
    return `${ip.split('.').slice(0, 3).join('.')}.0/24`;
  }
  if (isIPv6(ip)) {
    const groups = ipv6Groups(ip);
    if (!groups) return 'invalid';
    const prefix = groups.slice(0, 3).map((g) => parseInt(g, 16).toString(16));
    return `${prefix.join(':')}::/48`;
  }
  return 'invalid';
}

/** Traefik replaces client-sent X-Forwarded-For, so the rightmost entry is the address it saw. */
function clientIp(req: IncomingMessage): string | undefined {
  const header = req.headers['x-forwarded-for'];
  const value = Array.isArray(header) ? header.join(',') : header;
  const last = value
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .pop();
  return truncateIp(last ?? req.socket.remoteAddress);
}

/** Maps a pathname onto a bounded set of route labels for metrics. */
export function routeLabel(pathname: string, pageSegments: ReadonlySet<string>): string {
  if (pathname === '/') return '/';
  if (pathname.startsWith('/_next/static/')) return '/_next/static';
  if (pathname.startsWith('/_next/image')) return '/_next/image';
  if (pathname.startsWith('/_next/')) return '/_next/other';
  if (pathname.startsWith('/api/portfolio/')) return '/api/portfolio';
  if (pathname.startsWith('/js/script') || pathname.startsWith('/proxy/api/event')) return 'plausible';
  if (pathname === '/favicon.ico') return '/favicon.ico';
  const segment = pathname.split('/')[1];
  return pageSegments.has(segment) ? `/${segment}` : 'other';
}

function chunkBytes(chunk: unknown, encoding: unknown): number {
  if (typeof chunk === 'string') {
    return Buffer.byteLength(chunk, typeof encoding === 'string' ? (encoding as BufferEncoding) : 'utf8');
  }
  if (chunk instanceof Uint8Array) return chunk.byteLength;
  return 0;
}

/** Counts body bytes as written, since streamed responses carry no Content-Length. */
function countBytes(res: ServerResponse): () => number {
  let bytes = 0;
  const write = res.write.bind(res) as (...args: unknown[]) => boolean;
  const end = res.end.bind(res) as (...args: unknown[]) => ServerResponse;
  res.write = ((...args: unknown[]) => {
    bytes += chunkBytes(args[0], args[1]);
    return write(...args);
  }) as ServerResponse['write'];
  res.end = ((...args: unknown[]) => {
    if (typeof args[0] !== 'function') bytes += chunkBytes(args[0], args[1]);
    return end(...args);
  }) as ServerResponse['end'];
  return () => bytes;
}

/** Records one access log line and request metrics when the response finishes or the client aborts. */
export function instrumentRequest(
  req: IncomingMessage,
  res: ServerResponse,
  pageSegments: ReadonlySet<string>
): void {
  const started = process.hrtime.bigint();
  const bytes = countBytes(res);
  let recorded = false;

  const record = () => {
    if (recorded) return;
    recorded = true;

    const seconds = Number(process.hrtime.bigint() - started) / 1e9;
    const path = stripQuery(req.url ?? '/');
    const method = KNOWN_METHODS.has(req.method ?? '') ? (req.method as string) : 'other';
    const route = routeLabel(path, pageSegments);
    const aborted = !res.writableFinished;
    // 499 (nginx's "client closed request"): statusCode is still the default 200 if nothing was sent.
    const status = aborted && !res.headersSent ? 499 : res.statusCode;

    httpRequests.inc({ method, route, status: String(status) });
    httpDuration.observe({ method, route }, seconds);

    if (route === '/_next/static' && !aborted && (status < 300 || status === 304)) return;

    const referer = req.headers.referer;
    const fields = {
      kind: 'access',
      method: req.method,
      path: cap(path, MAX_PATH),
      route,
      status,
      bytes: bytes(),
      duration_ms: Math.round(seconds * 1000 * 10) / 10,
      host: req.headers.host ? cap(req.headers.host, MAX_HOST) : undefined,
      referer: referer ? cap(stripQuery(referer), MAX_PATH) : undefined,
      ua: req.headers['user-agent'] ? cap(req.headers['user-agent'], MAX_UA) : undefined,
      ip: clientIp(req),
      aborted: aborted || undefined,
    };
    if (status >= 500) {
      log.warn('request', fields);
    } else {
      log.info('request', fields);
    }
  };

  res.once('finish', record);
  res.once('close', record);
}

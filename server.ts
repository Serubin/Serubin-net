// Custom Next.js server: access logs, a Prometheus endpoint, and portfolio prep before serving.
// usage: tsx server.ts  (NODE_ENV=production for a production server)
import http from 'http';
import next from 'next';
import { loadScriptEnv } from './scripts/loadScriptEnv';
import { fetchAndInstallPortfolioSources } from './scripts/fetchPortfolioZip';
import { instrumentRequest } from './lib/accessLog';
import getStaticContent from './lib/contentData';
import { logger } from './lib/log';
import { METRICS_CONTENT_TYPE, renderMetrics } from './lib/metrics';
import { warmPortfolioImageCache } from './lib/portfolioImageCache';
import type { NavData } from './lib/types';

const log = logger('server');

// Longer than Traefik's 90s backend idle timeout, so Traefik never reuses a socket Node closed.
const KEEP_ALIVE_TIMEOUT_MS = 95_000;
const SHUTDOWN_DRAIN_MS = 5_000;
const SHUTDOWN_HARD_LIMIT_MS = 15_000;

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number.parseInt(value ?? '', 10);
  return Number.isInteger(port) && port >= 0 && port <= 65535 ? port : fallback;
}

/** First path segments the catch-all page and /resume serve, for bounded route labels. */
function pageSegments(): Set<string> {
  const { nav } = getStaticContent(['nav']) as { nav: NavData };
  const segments = nav.links
    .map((l) => l.link)
    .filter((link) => link.startsWith('/'))
    .map((link) => link.split('/')[1]);
  return new Set([...segments, 'resume']);
}

function startMetricsServer(port: number): http.Server | null {
  if (port === 0) {
    log.info('metrics server disabled');
    return null;
  }
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url?.split('?')[0] === '/metrics') {
      res.writeHead(200, { 'Content-Type': METRICS_CONTENT_TYPE });
      res.end(renderMetrics());
      return;
    }
    res.writeHead(404).end();
  });
  server.on('error', (err) => log.error('metrics server failed', { port, err }));
  server.listen(port, () => log.info('metrics server listening', { port }));
  return server;
}

async function main() {
  loadScriptEnv();
  const dev = process.env.NODE_ENV !== 'production';
  const port = parsePort(process.env.PORT, 3000);
  const metricsServer = startMetricsServer(parsePort(process.env.METRICS_PORT, 9464));

  let appServer: http.Server | null = null;
  let shuttingDown = false;
  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    const drainMs = dev || !appServer ? 0 : SHUTDOWN_DRAIN_MS;
    log.info('shutting down', { signal, drain_ms: drainMs });
    setTimeout(() => {
      log.warn('shutdown timed out, exiting');
      process.exit(1);
    }, SHUTDOWN_HARD_LIMIT_MS).unref();
    // Keep serving while the endpoint removal propagates to Traefik, then stop accepting.
    setTimeout(() => {
      metricsServer?.close();
      if (!appServer) process.exit(0);
      const server = appServer;
      server.close(() => {
        log.info('server closed');
        process.exit(0);
      });
      server.closeIdleConnections();
      // Pooled keep-alive sockets that were busy at close() would otherwise hold it open.
      setTimeout(() => server.closeAllConnections(), SHUTDOWN_DRAIN_MS).unref();
    }, drainMs);
  };
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));

  await fetchAndInstallPortfolioSources();
  await warmPortfolioImageCache();

  const app = next({ dev, hostname: 'localhost', port });
  const handle = app.getRequestHandler();
  await app.prepare();
  const segments = pageSegments();

  appServer = http.createServer((req, res) => {
    // Kubelet probes; this server only listens once warm-up and Next are ready.
    if (req.url === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
      return;
    }
    instrumentRequest(req, res, segments);
    if (shuttingDown) res.setHeader('Connection', 'close');
    handle(req, res).catch((err: unknown) => {
      log.error('unhandled request error', { path: req.url?.split('?')[0], err });
      if (!res.headersSent) res.statusCode = 500;
      res.end();
    });
  });
  appServer.keepAliveTimeout = KEEP_ALIVE_TIMEOUT_MS;
  appServer.headersTimeout = KEEP_ALIVE_TIMEOUT_MS + 1_000;
  appServer.listen(port, () => log.info('server listening', { port, dev }));
}

process.on('unhandledRejection', (reason) => {
  log.error('unhandled promise rejection', { err: reason });
});

main().catch((err: unknown) => {
  log.error('startup failed', { err });
  process.exit(1);
});

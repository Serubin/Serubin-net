import type { Instrumentation } from 'next';

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  // The logger is Node-only; any edge-runtime error is left to Next's own output.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { logger } = await import('./lib/log');
  logger('next').error('request error', {
    err,
    digest: (err as { digest?: string }).digest,
    method: request.method,
    path: request.path.split('?')[0],
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};

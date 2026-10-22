import { warmPortfolioImageCache } from '../lib/portfolioImageCache';
import { loadScriptEnv } from './loadScriptEnv';
import { logger } from '../lib/log';

const log = logger('warm-portfolio-cache');

async function main() {
  loadScriptEnv();
  try {
    const { failed } = await warmPortfolioImageCache();
    process.exit(failed.length > 0 ? 1 : 0);
  } catch (err) {
    log.error('cache warm failed', { err });
    process.exit(1);
  }
}

void main();

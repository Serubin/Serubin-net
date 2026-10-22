import { fetchAndInstallPortfolioSources } from './fetchPortfolioZip';
import { loadScriptEnv } from './loadScriptEnv';
import { logger } from '../lib/log';

const log = logger('fetch-portfolio-sources');

async function main() {
  loadScriptEnv();
  try {
    await fetchAndInstallPortfolioSources();
    process.exit(0);
  } catch (err) {
    log.error('portfolio source fetch failed', { err });
    process.exit(1);
  }
}

void main();

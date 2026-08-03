import {
  fetchAndInstallPortfolioSources,
  isPortfolioFetchDebug,
} from './fetchPortfolioZip';
import { loadScriptEnv } from './loadScriptEnv';

async function main() {
  loadScriptEnv();
  try {
    await fetchAndInstallPortfolioSources();
    process.exit(0);
  } catch (err) {
    console.error('[fetch-portfolio-sources]', err);
    if (isPortfolioFetchDebug() && err instanceof Error && err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

void main();

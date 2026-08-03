import { warmPortfolioImageCache } from '../lib/portfolioImageCache';
import { loadScriptEnv } from './loadScriptEnv';

async function main() {
  loadScriptEnv();
  try {
    await warmPortfolioImageCache();
    process.exit(0);
  } catch (err) {
    console.error('[warm-portfolio-cache]', err);
    process.exit(1);
  }
}

void main();

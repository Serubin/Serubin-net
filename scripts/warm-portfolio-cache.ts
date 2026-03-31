import { warmPortfolioImageCache } from '../lib/portfolioImageCache';

async function main() {
  try {
    await warmPortfolioImageCache();
    process.exit(0);
  } catch (err) {
    console.error('[warm-portfolio-cache]', err);
    process.exit(1);
  }
}

void main();

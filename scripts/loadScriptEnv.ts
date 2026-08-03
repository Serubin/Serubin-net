import { loadEnvConfig } from '@next/env';
import path from 'path';

/**
 * Load `.env*` from the project root the same way Next.js does, so standalone
 * `tsx` scripts see `PORTFOLIO_*` and other vars from `.env` / `.env.local`.
 */
export function loadScriptEnv(): void {
  const projectDir = path.resolve(process.cwd());
  const dev = process.env.NODE_ENV !== 'production';
  loadEnvConfig(projectDir, dev);
}

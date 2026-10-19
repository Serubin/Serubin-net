import type { CSSProperties } from 'react';

/**
 * Grid dimensions that fit `n` cells into a near-square grid: ceil(√n) columns.
 * Returns the CSS variables `%fillGrid` reads; `-p` swaps rows and columns for portrait viewports.
 */
export function fillGridVars(n: number): CSSProperties {
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  return {
    '--cols': cols,
    '--rows': rows,
    '--cols-p': rows,
    '--rows-p': cols,
  } as CSSProperties;
}

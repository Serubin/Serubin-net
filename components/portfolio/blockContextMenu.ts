import type { MouseEvent } from 'react';

export function blockContextMenu(e: MouseEvent) {
  e.preventDefault();
}

import { useEffect } from 'react';
import { ColorModeType } from '../types';
import { SectionForegroundColorAttribute } from './useSectionForegroundColor';

// Quiet time before a scroll counts as stopped; scrollend fires between wheel notches.
const SCROLL_IDLE_MS = 80;

/**
 * Reports the ink of whichever section sits under the nav as the scroll container moves,
 * and whether it is scrolling. Reports no ink until the first scroll, so the route's
 * default ink holds on first paint.
 */
export default function useSectionInk(
  setInk: (ink: ColorModeType | null) => void,
  setScrolling: (scrolling: boolean) => void
) {
  useEffect(() => {
    const container = document.querySelector('[data-scroll-container]');
    if (!container) return;

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const stopScrolling = () => {
      clearTimeout(idleTimer);
      setScrolling(false);
    };

    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(stopScrolling, SCROLL_IDLE_MS);

      const viewportRef = 32;
      let nearestSection: Element | null = null;

      document.querySelectorAll(`[${SectionForegroundColorAttribute}]`).forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportRef && rect.bottom >= viewportRef) {
          nearestSection = section;
        }
      });

      if (nearestSection) {
        setInk((nearestSection as Element).getAttribute(SectionForegroundColorAttribute) as ColorModeType);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      stopScrolling();
      setInk(null);
    };
  }, [setInk, setScrolling]);
}

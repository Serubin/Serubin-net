import { useEffect } from 'react';
import { ColorModeType } from '../types';
import { SectionForegroundColorAttribute } from './useSectionForegroundColor';

/**
 * Reports the ink of whichever section sits under the nav as the scroll container moves.
 * Reports nothing until the first scroll, so the route's default ink holds on first paint.
 */
export default function useSectionInk(setInk: (ink: ColorModeType | null) => void) {
  useEffect(() => {
    const container = document.querySelector('[data-scroll-container]');
    if (!container) return;

    const handleScroll = () => {
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
      setInk(null);
    };
  }, [setInk]);
}

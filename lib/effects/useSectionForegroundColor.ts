import { useEffect, RefObject } from 'react';
import { ColorModeType } from '../types';

export default function useSectionForegroundColor(
  sectionRef: RefObject<HTMLElement | null>,
  colorMode: ColorModeType
) {
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.setAttribute(SectionForegroundColorAttribute, colorMode);
    }
  }, [sectionRef, colorMode]);
}

export const SectionForegroundColorAttribute = 'data-section-fg-color';

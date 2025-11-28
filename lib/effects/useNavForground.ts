import { useEffect, useRef, useState } from 'react';
import { ColorMode, ColorModeType } from '../types';
import { SectionForegroundColorAttribute } from './useSectionForegroundColor';

export default function useNavForegroundColor(defaultColor: ColorModeType = ColorMode.Light) {
  const [textColor, setTextColor] = useState<ColorModeType>(defaultColor);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    scrollContainerRef.current = document.querySelector('[data-scroll-container]');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const viewportRef = 32;
      let nearestSection: Element | null = null;

      const sectionRefs = document.querySelectorAll(`[${SectionForegroundColorAttribute}]`);
      sectionRefs.forEach((section) => {
        const rect = section.getBoundingClientRect();

        // Check if section is in viewport
        if (rect.top <= viewportRef && rect.bottom >= viewportRef) {
          nearestSection = section;
        }
      });

      // If we found a nearest section, get its data-bg-color value
      if (nearestSection) {
        const bgColor = (nearestSection as Element).getAttribute(SectionForegroundColorAttribute) as ColorModeType;
        setTextColor(bgColor);
      }
    };

    // Add event listener for scroll
    scrollContainerRef.current?.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
  }, [setTextColor, scrollContainerRef]);

  return textColor;
}
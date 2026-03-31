"use client";
import { useEffect, useRef, useCallback } from 'react';
import { classNames as c } from '../lib/utils';
import styles from '../styles/SnapScroll.module.scss';

type SnapScrollProps = {
  children: React.ReactNode;
  /** Section to scroll to on initial mount (instant, no animation) */
  initialSectionId?: string;
  /** When set, triggers a programmatic smooth scroll. Change `key` to re-trigger. */
  scrollTarget?: { section: string; key: number } | null;
  onSectionChange?: (sectionId: string) => void;
};

type SnapScrollSectionProps = {
  id: string;
  children: React.ReactNode;
};

const SnapScroll = ({ children, initialSectionId, scrollTarget, onSectionChange }: SnapScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);
  const lastScrollTargetKey = useRef<number>(-1);

  // Observe which section is dominant in the viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onSectionChange) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingProgrammatically.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const id = (entry.target as HTMLElement).id;
            if (id) onSectionChange(id);
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    const sections = container.querySelectorAll(`:scope > .${styles.section}`);
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [onSectionChange]);

  const scrollToSection = useCallback((sectionId: string, behavior: ScrollBehavior) => {
    const container = containerRef.current;
    if (!container) return;
    const target = container.querySelector(`#${sectionId}`);
    if (!target) return;

    isScrollingProgrammatically.current = true;
    target.scrollIntoView({ behavior, block: 'start' });

    // Prefer scrollend; timeout covers browsers without it (and edge cases where scrollend never fires).
    const resetFlag = () => {
      isScrollingProgrammatically.current = false;
      container.removeEventListener('scrollend', resetFlag);
    };
    container.addEventListener('scrollend', resetFlag, { once: true });
    setTimeout(() => {
      isScrollingProgrammatically.current = false;
    }, 1000);
  }, []);

  // Initial scroll on mount (instant, no animation)
  useEffect(() => {
    if (initialSectionId && initialSectionId !== 'hero') {
      requestAnimationFrame(() => {
        scrollToSection(initialSectionId, 'instant');
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Programmatic scroll triggered by popstate (browser back/forward)
  useEffect(() => {
    if (!scrollTarget || scrollTarget.key === lastScrollTargetKey.current) return;
    lastScrollTargetKey.current = scrollTarget.key;
    scrollToSection(scrollTarget.section, 'smooth');
  }, [scrollTarget, scrollToSection]);

  return (
    <div ref={containerRef} className={c(styles.container)} data-scroll-container>
      {children}
    </div>
  );
};

const SnapScrollSection = ({ id, children }: SnapScrollSectionProps) => {
  return (
    <div id={id} className={c(styles.section)}>
      {children}
    </div>
  );
};

SnapScroll.Section = SnapScrollSection;

export default SnapScroll;
export { SnapScrollSection as Section };

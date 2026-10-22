"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

export type Section = "hero" | "portfolio" | "projects";

interface RouteState {
  currentAlbumSlug: string | null;
  /** Changes on popstate and goToSection — use to trigger programmatic scroll */
  scrollTarget: { section: Section; key: number } | null;
  updateSectionFromScroll: (section: string) => void;
  selectAlbum: (slug: string) => void;
  deselectAlbum: () => void;
  goToSection: (section: Section) => void;
}

function buildUrl(section: Section, albumSlug: string | null): string {
  if (section === "portfolio" && albumSlug) return `/photography/${encodeURIComponent(albumSlug)}`;
  if (section === "portfolio") return `/photography`;
  if (section === "projects") return `/projects`;
  return `/`;
}

export function parseUrl(pathname: string): { section: Section; albumSlug: string | null } {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'photography') {
    return {
      section: 'portfolio',
      albumSlug: segments[1] ? decodeURIComponent(segments[1]) : null,
    };
  }
  if (segments[0] === 'projects') return { section: 'projects', albumSlug: null };
  return { section: 'hero', albumSlug: null };
}

export default function useRouteSync(
  initialSection: Section,
  initialAlbumSlug: string | null
): RouteState {
  const [currentAlbumSlug, setCurrentAlbumSlug] = useState<string | null>(initialAlbumSlug);
  const [scrollTarget, setScrollTarget] = useState<{ section: Section; key: number } | null>(null);
  const currentSectionRef = useRef<Section>(initialSection);
  const currentAlbumSlugRef = useRef<string | null>(initialAlbumSlug);
  const scrollKey = useRef(0);

  const requestScroll = useCallback((section: Section) => {
    scrollKey.current += 1;
    setScrollTarget({ section, key: scrollKey.current });
  }, []);

  const setAlbum = useCallback((slug: string | null) => {
    currentAlbumSlugRef.current = slug;
    setCurrentAlbumSlug(slug);
  }, []);

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const { section, albumSlug } = parseUrl(window.location.pathname);
      currentSectionRef.current = section;
      setAlbum(albumSlug);
      requestScroll(section);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [requestScroll, setAlbum]);

  const updateSectionFromScroll = useCallback((sectionId: string) => {
    const section = sectionId as Section;
    if (currentSectionRef.current === section) return;
    currentSectionRef.current = section;
    // Use replaceState for scroll — no history entry
    const albumSlug = section === 'portfolio' ? currentAlbumSlugRef.current : null;
    window.history.replaceState(null, '', buildUrl(section, albumSlug));
  }, []);

  const selectAlbum = useCallback((slug: string) => {
    currentSectionRef.current = 'portfolio';
    setAlbum(slug);
    window.history.pushState(null, '', buildUrl('portfolio', slug));
  }, [setAlbum]);

  const deselectAlbum = useCallback(() => {
    setAlbum(null);
    window.history.pushState(null, '', buildUrl('portfolio', null));
  }, [setAlbum]);

  const goToSection = useCallback((section: Section) => {
    if (currentSectionRef.current === section && currentAlbumSlugRef.current === null) {
      requestScroll(section);
      return;
    }
    currentSectionRef.current = section;
    setAlbum(null);
    window.history.pushState(null, '', buildUrl(section, null));
    requestScroll(section);
  }, [requestScroll, setAlbum]);

  return {
    currentAlbumSlug,
    scrollTarget,
    updateSectionFromScroll,
    selectAlbum,
    deselectAlbum,
    goToSection,
  };
}

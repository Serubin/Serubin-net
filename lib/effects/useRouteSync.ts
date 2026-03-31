"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

type Section = "hero" | "portfolio";

interface RouteState {
  currentAlbumSlug: string | null;
  /** Increments only on popstate — use to trigger programmatic scroll */
  scrollTarget: { section: Section; key: number } | null;
  updateSectionFromScroll: (section: string) => void;
  selectAlbum: (slug: string) => void;
  deselectAlbum: () => void;
}

function buildUrl(section: Section, albumSlug: string | null): string {
  if (section === "portfolio" && albumSlug) return `/photography/${albumSlug}`;
  if (section === "portfolio") return `/photography`;
  return `/`;
}

function parseUrl(pathname: string): { section: Section; albumSlug: string | null } {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'photography') {
    return {
      section: 'portfolio',
      albumSlug: segments[1] ?? null,
    };
  }
  return { section: 'hero', albumSlug: null };
}

export default function useRouteSync(
  initialSection: Section,
  initialAlbumSlug: string | null
): RouteState {
  const [currentSection, setCurrentSection] = useState<Section>(initialSection);
  const [currentAlbumSlug, setCurrentAlbumSlug] = useState<string | null>(initialAlbumSlug);
  const [scrollTarget, setScrollTarget] = useState<{ section: Section; key: number } | null>(null);
  const popstateKey = useRef(0);

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const { section, albumSlug } = parseUrl(window.location.pathname);
      setCurrentSection(section);
      setCurrentAlbumSlug(albumSlug);
      // Signal that a programmatic scroll is needed
      popstateKey.current += 1;
      setScrollTarget({ section, key: popstateKey.current });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateSectionFromScroll = useCallback((sectionId: string) => {
    const section = sectionId as Section;
    setCurrentSection(prev => {
      if (prev === section) return prev;
      // Use replaceState for scroll — no history entry
      const url = buildUrl(section, section === 'portfolio' ? currentAlbumSlug : null);
      window.history.replaceState(null, '', url);
      return section;
    });
  }, [currentAlbumSlug]);

  const selectAlbum = useCallback((slug: string) => {
    setCurrentAlbumSlug(slug);
    setCurrentSection('portfolio');
    window.history.pushState(null, '', `/photography/${slug}`);
  }, []);

  const deselectAlbum = useCallback(() => {
    setCurrentAlbumSlug(null);
    window.history.pushState(null, '', '/photography');
  }, []);

  return {
    currentAlbumSlug,
    scrollTarget,
    updateSectionFromScroll,
    selectAlbum,
    deselectAlbum,
  };
}

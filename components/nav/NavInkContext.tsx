'use client';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ColorModeType, NavSection, ReactChildren } from '../../lib/types';

/** Scrolls the current page to `section`; returns false when this page has no such section. */
export type SectionHandler = (section: NavSection | 'hero') => boolean;

type NavInkState = {
  /** Ink set by the page under the nav, or null to fall back to the route's default. */
  ink: ColorModeType | null;
  setInk: (ink: ColorModeType | null) => void;
  /** Registers the page's in-place section scroller; the returned cleanup unregisters it. */
  registerSectionHandler: (handler: SectionHandler) => () => void;
  goToSection: SectionHandler;
};

const NavInkContext = createContext<NavInkState | null>(null);

export function NavInkProvider({ children }: ReactChildren) {
  const [ink, setInk] = useState<ColorModeType | null>(null);
  const handlerRef = useRef<SectionHandler | null>(null);

  const registerSectionHandler = useCallback((handler: SectionHandler) => {
    handlerRef.current = handler;
    return () => {
      if (handlerRef.current === handler) handlerRef.current = null;
    };
  }, []);

  const goToSection = useCallback<SectionHandler>(
    (section) => handlerRef.current?.(section) ?? false,
    []
  );

  const value = useMemo(
    () => ({ ink, setInk, registerSectionHandler, goToSection }),
    [ink, registerSectionHandler, goToSection]
  );

  return <NavInkContext.Provider value={value}>{children}</NavInkContext.Provider>;
}

export function useNavInk(): NavInkState {
  const ctx = useContext(NavInkContext);
  if (!ctx) throw new Error('useNavInk must be used inside NavInkProvider');
  return ctx;
}

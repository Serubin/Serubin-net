"use client";
import { type JSX, useEffect, useState } from 'react';
import { Album, HeroData, PortfolioData } from '../lib/types';
import useRouteSync, { parseUrl } from '../lib/effects/useRouteSync';
import useSectionInk from '../lib/effects/useNavForground';
import { useNavInk } from './nav/NavInkContext';
import SnapScroll from './SnapScroll';
import Hero from './sections/Hero';
import Portfolio from './sections/Portfolio';

type MainPageProps = {
  heroData: HeroData;
  portfolioData: PortfolioData;
  initialSection: "hero" | "portfolio";
  initialAlbumSlug: string | null;
};

export default function MainPage({
  heroData,
  portfolioData,
  initialSection,
  initialAlbumSlug,
}: MainPageProps): JSX.Element {
  // Back into a pushState entry restores this page with the props of the URL it was pushed from.
  // Arrivals from other routes render before the URL updates, so only a URL the server would render is trusted.
  const [initial] = useState(() => {
    const fromProps = { section: initialSection, albumSlug: initialAlbumSlug };
    if (typeof window === 'undefined') return fromProps;
    const segments = window.location.pathname.split('/').filter(Boolean);
    const { section, albumSlug } = parseUrl(window.location.pathname);
    const servable = segments.length === 0 || (segments[0] === 'photography' && (segments.length === 1 ||
      (segments.length === 2 && portfolioData.albums.some((album) => album.slug === albumSlug))));
    return servable ? { section, albumSlug } : fromProps;
  });
  const {
    currentAlbumSlug,
    scrollTarget,
    updateSectionFromScroll,
    selectAlbum,
    deselectAlbum,
    goToSection,
  } = useRouteSync(initial.section, initial.albumSlug);
  const { setInk, setScrolling, registerSectionHandler } = useNavInk();

  useSectionInk(setInk, setScrolling);

  useEffect(() => registerSectionHandler((section) => {
    if (section === 'hero') goToSection('hero');
    else if (section === 'photography') goToSection('portfolio');
    else return false;
    return true;
  }), [registerSectionHandler, goToSection]);

  return (
    <SnapScroll
      initialSectionId={initial.section}
      scrollTarget={scrollTarget}
      onSectionChange={updateSectionFromScroll}
    >
      <SnapScroll.Section id="hero">
        <Hero name={heroData.name} tags={heroData.tags} />
      </SnapScroll.Section>
      <SnapScroll.Section id="portfolio">
        <Portfolio
          title={portfolioData.title}
          albums={portfolioData.albums}
          selectedAlbumSlug={currentAlbumSlug}
          onSelectAlbum={(album: Album) => selectAlbum(album.slug)}
          onBack={deselectAlbum}
          initiallyVisible={initial.section === 'portfolio'}
        />
      </SnapScroll.Section>
    </SnapScroll>
  );
}

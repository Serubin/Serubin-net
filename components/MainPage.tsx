"use client";
import { type JSX, useEffect } from 'react';
import { Album, HeroData, PortfolioData } from '../lib/types';
import useRouteSync from '../lib/effects/useRouteSync';
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
  const {
    currentAlbumSlug,
    scrollTarget,
    updateSectionFromScroll,
    selectAlbum,
    deselectAlbum,
    goToSection,
  } = useRouteSync(initialSection, initialAlbumSlug);
  const { setInk, registerSectionHandler } = useNavInk();

  useSectionInk(setInk);

  useEffect(() => registerSectionHandler((section) => {
    if (section === 'hero') goToSection('hero');
    else if (section === 'photography') goToSection('portfolio');
    else return false;
    return true;
  }), [registerSectionHandler, goToSection]);

  return (
    <SnapScroll
      initialSectionId={initialSection}
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
          initiallyVisible={initialSection === 'portfolio'}
        />
      </SnapScroll.Section>
    </SnapScroll>
  );
}

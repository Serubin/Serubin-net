"use client";
import { type JSX } from 'react';
import { Album, HeroData, NavData, PortfolioData } from '../lib/types';
import useRouteSync from '../lib/effects/useRouteSync';
import Nav from './nav';
import SnapScroll from './SnapScroll';
import Hero from './sections/Hero';
import Portfolio from './sections/Portfolio';

type MainPageProps = {
  heroData: HeroData;
  navData: NavData;
  portfolioData: PortfolioData;
  initialSection: "hero" | "portfolio";
  initialAlbumSlug: string | null;
};

export default function MainPage({
  heroData,
  navData,
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
  } = useRouteSync(initialSection, initialAlbumSlug);

  return (
    <>
      <Nav links={navData.links} />
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
    </>
  );
}

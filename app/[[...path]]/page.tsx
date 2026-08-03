import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import getStaticContent from '../../lib/contentData';
import getPortfolioData from '../../lib/portfolioData';
import { HeroData, NavData } from '../../lib/types';
import MainPage from '../../components/MainPage';

type StaticContent = {
  hero: HeroData;
  nav: NavData;
};

type PageProps = {
  params: Promise<{ path?: string[] }>;
};

export const metadata: Metadata = {
  title: 'Solomon Rubin',
};

export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
  const { path: segments } = await params;

  let initialSection: "hero" | "portfolio" = "hero";
  let initialAlbumSlug: string | null = null;

  if (segments && segments.length > 0) {
    if (segments[0] !== 'photography' || segments.length > 2) {
      notFound();
    }
    initialSection = 'portfolio';
    if (segments.length === 2) {
      initialAlbumSlug = decodeURIComponent(segments[1]);
    }
  }

  const {
    hero: { name, tags },
    nav: { links },
  } = getStaticContent(['hero', 'nav']) as StaticContent;

  const portfolioData = getPortfolioData();

  // Validate album slug if provided
  if (initialAlbumSlug) {
    const validSlugs = portfolioData.albums.map(a => a.slug);
    if (!validSlugs.includes(initialAlbumSlug)) {
      notFound();
    }
  }

  return (
    <MainPage
      heroData={{ name, tags }}
      navData={{ links }}
      portfolioData={portfolioData}
      initialSection={initialSection}
      initialAlbumSlug={initialAlbumSlug}
    />
  );
}

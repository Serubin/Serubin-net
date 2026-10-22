import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import getStaticContent from '../../lib/contentData';
import getPortfolioData from '../../lib/portfolioData';
import { HeroData, Project } from '../../lib/types';
import type { Section } from '../../lib/effects/useRouteSync';
import MainPage from '../../components/MainPage';

type StaticContent = {
  hero: HeroData;
  projects: Project[];
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

  let initialSection: Section = "hero";
  let initialAlbumSlug: string | null = null;

  if (segments && segments.length > 0) {
    if (segments[0] === 'projects' && segments.length === 1) {
      initialSection = 'projects';
    } else if (segments[0] !== 'photography' || segments.length > 2) {
      notFound();
    } else {
      initialSection = 'portfolio';
    }
    if (initialSection === 'portfolio' && segments.length === 2) {
      initialAlbumSlug = decodeURIComponent(segments[1]);
    }
  }

  const {
    hero: { name, tags },
    projects,
  } = getStaticContent(['hero', 'projects']) as StaticContent;

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
      portfolioData={portfolioData}
      projects={projects}
      initialSection={initialSection}
      initialAlbumSlug={initialAlbumSlug}
    />
  );
}

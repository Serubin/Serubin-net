import fs from 'fs';
import path from 'path';
import { PORTFOLIO_DIR } from './portfolioPaths';
import { Album, PortfolioData } from './types';
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function isImage(fileName: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function portfolioImageUrl(albumDir: string, fileName: string): string {
  return `/api/portfolio/${encodeURIComponent(albumDir)}/${encodeURIComponent(fileName)}`;
}

function portfolioPlaceholderSrc(imageUrl: string): string {
  const u = new URL(imageUrl, 'https://portfolio.placeholder');
  u.searchParams.set('p', '1');
  return `${u.pathname}${u.search}`;
}

export default function getPortfolioData(): PortfolioData {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    return { title: 'Photography', albums: [] };
  }

  const entries = fs.readdirSync(PORTFOLIO_DIR, { withFileTypes: true });
  const albumDirs = entries
    .filter((e) => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const albums: Album[] = albumDirs
    .map((dir) => {
      const albumPath = path.join(PORTFOLIO_DIR, dir.name);
      const files = fs.readdirSync(albumPath)
        .filter(isImage)
        .sort((a, b) => a.localeCompare(b));

      if (files.length === 0) return null;

      const coverFile =
        files.find((f) => path.parse(f).name.toLowerCase() === 'cover') ??
        files[0];
      const name = slugToTitle(dir.name);
      const coverUrl = portfolioImageUrl(dir.name, coverFile);
      return {
        name,
        slug: dir.name,
        cover: coverUrl,
        coverPlaceholder: portfolioPlaceholderSrc(coverUrl),
        photos: files.map((f) => {
          const src = portfolioImageUrl(dir.name, f);
          return {
            src,
            placeholderSrc: portfolioPlaceholderSrc(src),
            alt: path.parse(f).name.replace(/[-_]/g, ' '),
          };
        }),
      };
    })
    .filter((album): album is Album => album !== null);

  return { title: 'Photography', albums };
}

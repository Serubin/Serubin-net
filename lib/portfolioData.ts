import fs from 'fs';
import path from 'path';
import { Album, PortfolioData } from './types';

const PORTFOLIO_DIR = path.join(process.cwd(), 'public/images/portfolio');
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

      const coverFile = files.find((f) => path.parse(f).name.toLowerCase() === 'cover') ?? files[0];
      const publicBase = `/images/portfolio/${dir.name}`;

      return {
        name: slugToTitle(dir.name),
        slug: dir.name,
        cover: `${publicBase}/${coverFile}`,
        photos: files.map((f) => ({
          src: `${publicBase}/${f}`,
          alt: path.parse(f).name.replace(/[-_]/g, ' '),
        })),
      };
    })
    .filter((album): album is Album => album !== null);

  return { title: 'Photography', albums };
}

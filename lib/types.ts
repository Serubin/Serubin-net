export interface ReactChildren {
  children: React.ReactNode
}

export type HeroData = {
  name: string;
  tags: string[];
};

export type NavData = {
  links: SocialLink[];
}

export type NavSection = 'photography' | 'projects' | 'resume';

export type SocialLink = {
  name: string;
  icon: string;
  link: string;
  /** In-app section this link targets; omitted for external links. */
  section?: NavSection;
  /** Navigate with a full page load instead of client-side routing. */
  fullLoad?: boolean;
};

export type Photo = {
  src: string;
  placeholderSrc: string;
  alt: string;
  /** Display title from album.yml; overrides the file-derived `alt` in the lightbox. */
  title?: string;
  /** CSS object-position ("x% y%") for cropped views, from album.yml. */
  focus?: string;
};

export type Album = {
  name: string;
  slug: string;
  cover: string;
  coverPlaceholder: string;
  coverFocus?: string;
  photos: Photo[];
};

export type PortfolioData = {
  title: string;
  albums: Album[];
};

export enum ColorMode {
  Light = 'light',
  Dark = 'dark',
}
export type ColorModeType = (typeof ColorMode)[keyof typeof ColorMode];

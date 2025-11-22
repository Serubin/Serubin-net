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

export type SocialLink = {
  name: string;
  icon: string;
  link: string;
};

export type AboutData = {
  text: string;
};
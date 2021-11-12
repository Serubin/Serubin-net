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

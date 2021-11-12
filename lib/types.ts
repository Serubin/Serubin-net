export type AboutData = {
  name: string;
  tags: string[];
  about: string;
  links: SocialLink[];
};

export type SocialLink = {
  name: string;
  icon: string;
  link: string;
};

import { ImageLoaderProps } from 'next/image';

export const c = (cls: string | string[]) => {
  if (Array.isArray(cls)) {
    return cls.join(" ");
  }

  return cls;
};

export const loader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality}`;
};

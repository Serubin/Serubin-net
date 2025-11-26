import Image, { ImageProps } from 'next/image';

export default function ImageWrapped({src, alt, ...props}: ImageProps) {
  return <Image src={src} alt={alt} {...props} unoptimized={true} />;
}

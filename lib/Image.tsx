import Image, { ImageProps } from 'next/image';
import { imageLoader } from '../lib/utils';

export default function ImageWrapped({src, alt, ...props}: ImageProps) {
  return <Image src={src} alt={alt} {...props} loader={imageLoader} />;
}

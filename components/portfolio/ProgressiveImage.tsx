"use client";
import { useLayoutEffect, useRef, useState } from 'react';
import styles from '../../styles/sections/Portfolio.module.scss';

type ProgressiveImageProps = {
  src: string;
  placeholderSrc: string;
  alt: string;
  variant: 'cover' | 'contain';
  wrapperClassName?: string;
};

export default function ProgressiveImage({
  src,
  placeholderSrc,
  alt,
  variant,
  wrapperClassName,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const fullRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    setLoaded(false);
    const el = fullRef.current;
    if (el?.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  if (variant === 'cover') {
    return (
      <div
        className={`${styles.progressiveWrapCover} ${wrapperClassName ?? ''}`.trim()}
      >
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden
          className={styles.progressivePlaceholderCover}
          loading="lazy"
          decoding="async"
          style={{ opacity: loaded ? 0 : 1 }}
        />
        <img
          ref={fullRef}
          src={src}
          alt={alt}
          className={styles.progressiveFullCover}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.progressiveWrapIntrinsic} ${wrapperClassName ?? ''}`.trim()}
    >
      <img
        src={placeholderSrc}
        alt=""
        aria-hidden
        className={styles.progressivePlaceholderIntrinsic}
        loading="lazy"
        decoding="async"
        style={{ opacity: loaded ? 0 : 1 }}
      />
      <img
        ref={fullRef}
        src={src}
        alt={alt}
        className={styles.progressiveFullIntrinsic}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}

"use client";
import { useCallback, useState } from 'react';
import styles from '../../styles/sections/Portfolio.module.scss';

type ProgressiveImageProps = {
  src: string;
  placeholderSrc: string;
  alt: string;
  variant: 'cover' | 'contain';
  wrapperClassName?: string;
  onLoad?: () => void;
};

export default function ProgressiveImage({
  src,
  placeholderSrc,
  alt,
  variant,
  wrapperClassName,
  onLoad,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState(src);

  if (src !== loadedSrc) {
    setLoadedSrc(src);
    setLoaded(false);
  }

  // An image that finished loading before hydration never fires onLoad.
  const fullRef = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);

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
          onLoad={() => {
            setLoaded(true);
            onLoad?.();
          }}
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
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}

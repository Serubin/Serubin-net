"use client";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Album } from '../../lib/types';
import { stagger, fadeIn } from '../../lib/animations';
import { fillGridVars } from '../../lib/fillGrid';
import Lightbox from './Lightbox';
import ProgressiveImage from './ProgressiveImage';
import styles from '../../styles/sections/Portfolio.module.scss';

type AlbumViewProps = {
  album: Album;
  onBack: () => void;
  isActive: boolean;
};

export default function AlbumView({ album, onBack, isActive }: AlbumViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [wasActive, setWasActive] = useState(isActive);

  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (!isActive) setLightboxIndex(null);
  }

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listening = isActive && lightboxIndex === null;

  // Escape returns to the album list, unless the nav has the key or the album is scrolled out of view.
  useEffect(() => {
    if (!listening) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || (e.target instanceof Element && e.target.closest('nav'))) return;
      const box = wrapperRef.current?.getBoundingClientRect();
      if (!box || box.top > innerHeight / 2 || box.bottom < innerHeight / 2) return;
      onBack();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [listening, onBack]);

  return (
    <div ref={wrapperRef} className={styles.albumViewWrapper}>
      <div className={styles.albumHeader}>
        <button className={styles.backButton} onClick={onBack} aria-label="Back to albums">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={styles.albumName}>{album.name}</h2>
      </div>

      <motion.div
        className={styles.photoGrid}
        style={fillGridVars(album.photos.length)}
        variants={stagger(0.04)}
        initial="hidden"
        animate="visible"
      >
        {album.photos.map((photo, index) => (
          <motion.button
            key={photo.src}
            type="button"
            className={styles.photoThumb}
            aria-label={photo.title ? `Open ${photo.title}` : `Open photo ${index + 1} of ${album.photos.length}`}
            variants={fadeIn({ scale: 0.9 })}
            onClick={() => setLightboxIndex(index)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressiveImage
              variant="cover"
              src={photo.src}
              placeholderSrc={photo.placeholderSrc}
              alt=""
              objectPosition={photo.focus}
            />
          </motion.button>
        ))}
      </motion.div>

      {lightboxIndex !== null && (
        <Lightbox
          albumName={album.name}
          photos={album.photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

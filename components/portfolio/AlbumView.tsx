"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Album } from '../../lib/types';
import { stagger, fadeIn } from '../../lib/animations';
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

  useEffect(() => {
    if (!isActive) setLightboxIndex(null);
  }, [isActive]);

  return (
    <div className={styles.albumViewWrapper}>
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
        variants={stagger(0.04)}
        initial="hidden"
        animate="visible"
      >
        {album.photos.map((photo, index) => (
          <motion.div
            key={photo.src}
            className={styles.photoThumb}
            variants={fadeIn({ scale: 0.9 })}
            onClick={() => setLightboxIndex(index)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <ProgressiveImage
              variant="cover"
              src={photo.src}
              placeholderSrc={photo.placeholderSrc}
              alt={photo.alt}
            />
          </motion.div>
        ))}
      </motion.div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={album.photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

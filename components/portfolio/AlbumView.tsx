"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Album } from '../../lib/types';
import { stagger, fadeIn } from '../../lib/animations';
import Lightbox from './Lightbox';
import styles from '../../styles/sections/Portfolio.module.scss';

type AlbumViewProps = {
  album: Album;
  onBack: () => void;
};

export default function AlbumView({ album, onBack }: AlbumViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
            <Image
              className={styles.photoThumbImage}
              src={photo.src}
              alt={photo.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
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

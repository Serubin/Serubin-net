"use client";
import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '../../lib/types';
import { blockContextMenu } from './blockContextMenu';
import ProgressiveImage from './ProgressiveImage';
import styles from '../../styles/sections/Portfolio.module.scss';

type LightboxProps = {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICON_PREV = "M15 18L9 12L15 6";
const ICON_NEXT = "M9 18L15 12L9 6";
const ICON_CLOSE = "M18 6L6 18M6 6L18 18";

export default function Lightbox({ photos, currentIndex, onClose, onNavigate }: LightboxProps) {
  const photo = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1);
  }, [onClose, onNavigate, currentIndex, hasPrev, hasNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className={styles.lightboxOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onContextMenu={blockContextMenu}
      >
        <div className={styles.lightboxCounter}>
          {currentIndex + 1} / {photos.length}
        </div>

        <button className={styles.lightboxClose} onClick={onClose} aria-label="Close">
          <Icon d={ICON_CLOSE} />
        </button>

        {hasPrev && (
          <button
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={() => onNavigate(currentIndex - 1)}
            aria-label="Previous photo"
          >
            <Icon d={ICON_PREV} />
          </button>
        )}

        {hasNext && (
          <button
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={() => onNavigate(currentIndex + 1)}
            aria-label="Next photo"
          >
            <Icon d={ICON_NEXT} />
          </button>
        )}

        <div className={styles.lightboxContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className={styles.lightboxImageWrapper}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ProgressiveImage
                variant="contain"
                src={photo.src}
                placeholderSrc={photo.placeholderSrc}
                alt={photo.alt}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {photo.alt && (
          <div className={styles.lightboxCaption}>{photo.alt}</div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

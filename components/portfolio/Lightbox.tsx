"use client";
import { useEffect, useCallback, useState } from 'react';
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

  // Track which photos have been visited to keep them in DOM
  const [visitedIndices, setVisitedIndices] = useState<ReadonlySet<number>>(
    () => new Set([currentIndex])
  );

  // Track whether the primary photo has finished loading
  const [primaryLoaded, setPrimaryLoaded] = useState(false);

  useEffect(() => {
    setPrimaryLoaded(false); // reset when navigating to a new photo
    setVisitedIndices(prev => {
      if (prev.has(currentIndex)) return prev; // already mounted — no re-render
      return new Set(prev).add(currentIndex);  // first visit — mount new ProgressiveImage
    });
  }, [currentIndex]);

  // Prefetch adjacent photos after primary photo loads
  useEffect(() => {
    if (!primaryLoaded) return; // wait for primary photo to finish loading
    setVisitedIndices(prev => {
      let updated = prev;
      // Prefetch previous photo
      if (currentIndex > 0 && !prev.has(currentIndex - 1)) {
        updated = new Set(updated).add(currentIndex - 1);
      }
      // Prefetch next photo
      if (currentIndex < photos.length - 1 && !prev.has(currentIndex + 1)) {
        updated = new Set(updated).add(currentIndex + 1);
      }
      return updated === prev ? prev : updated;
    });
  }, [primaryLoaded, currentIndex, photos.length]);

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
          <div className={styles.lightboxImageStack}>
            {Array.from(visitedIndices).map(index => {
              const p = photos[index];
              const isActive = index === currentIndex;
              return (
                <div
                  key={index}
                  className={styles.lightboxImageWrapper}
                  style={{
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <ProgressiveImage
                    variant="contain"
                    src={p.src}
                    placeholderSrc={p.placeholderSrc}
                    alt={p.alt}
                    onLoad={isActive ? () => setPrimaryLoaded(true) : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {photo.alt && (
          <div className={styles.lightboxCaption}>{photo.alt}</div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

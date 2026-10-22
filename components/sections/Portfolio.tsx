"use client";
import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Album, PortfolioData, ColorMode } from '../../lib/types';
import { classNames as c } from '../../lib/utils';
import useSectionForegroundColor from '../../lib/effects/useSectionForegroundColor';
import AlbumGrid from '../portfolio/AlbumGrid';
import AlbumView from '../portfolio/AlbumView';
import styles from '../../styles/sections/Portfolio.module.scss';

const slideTransition = (x: number) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -x },
  transition: { duration: 0.3, ease: 'easeInOut' },
});

const flexFill = { flex: 1, minHeight: 0, display: 'flex' } as const;

export default function Portfolio({ title, albums }: PortfolioData) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useSectionForegroundColor(sectionRef, ColorMode.Dark);

  return (
    <div ref={sectionRef} className={c(styles.portfolio)}>
      <h2 className={c(styles.sectionTitle)}>{title}</h2>

      <AnimatePresence mode="wait">
        {selectedAlbum ? (
          <motion.div key={selectedAlbum.slug} style={flexFill} {...slideTransition(30)}>
            <AlbumView album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />
          </motion.div>
        ) : (
          <motion.div key="grid" style={flexFill} {...slideTransition(-30)}>
            <AlbumGrid albums={albums} onSelectAlbum={setSelectedAlbum} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

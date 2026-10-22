"use client";
import { useRef, useState, useEffect } from 'react';
import { Album, PortfolioData, ColorMode } from '../../lib/types';
import useSectionForegroundColor from '../../lib/effects/useSectionForegroundColor';
import AlbumGrid from '../portfolio/AlbumGrid';
import AlbumView from '../portfolio/AlbumView';
import { blockContextMenu } from '../portfolio/blockContextMenu';
import styles from '../../styles/sections/Portfolio.module.scss';

export default function Portfolio({ title, albums }: PortfolioData) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [visitedAlbumSlugs, setVisitedAlbumSlugs] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  useEffect(() => {
    if (selectedAlbum) {
      setVisitedAlbumSlugs(prev =>
        prev.has(selectedAlbum.slug) ? prev : new Set(prev).add(selectedAlbum.slug)
      );
    }
  }, [selectedAlbum]);

  useSectionForegroundColor(sectionRef, ColorMode.Dark);

  return (
    <div ref={sectionRef} className={styles.portfolio}>
      <h2 className={styles.sectionTitle}>{title}</h2>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }} onContextMenu={blockContextMenu}>
        {/* AlbumGrid — always mounted */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          opacity: selectedAlbum ? 0 : 1,
          pointerEvents: selectedAlbum ? 'none' : 'auto',
          transition: 'opacity 0.3s ease',
        }}>
          <AlbumGrid albums={albums} onSelectAlbum={setSelectedAlbum} />
        </div>

        {/* AlbumView — one per visited album, kept mounted */}
        {Array.from(visitedAlbumSlugs).map(slug => {
          const album = albums.find(a => a.slug === slug)!;
          const isActive = selectedAlbum?.slug === slug;
          return (
            <div key={slug} style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
            }}>
              <AlbumView album={album} onBack={() => setSelectedAlbum(null)} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

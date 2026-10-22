"use client";
import { useRef, useState, useEffect } from 'react';
import { Album, PortfolioData, ColorMode } from '../../lib/types';
import useSectionForegroundColor from '../../lib/effects/useSectionForegroundColor';
import AlbumGrid from '../portfolio/AlbumGrid';
import AlbumView from '../portfolio/AlbumView';
import { blockContextMenu } from '../portfolio/blockContextMenu';
import styles from '../../styles/sections/Portfolio.module.scss';

type PortfolioProps = PortfolioData & {
  selectedAlbumSlug: string | null;
  onSelectAlbum: (album: Album) => void;
  onBack: () => void;
  initiallyVisible?: boolean;
};

export default function Portfolio({
  title,
  albums,
  selectedAlbumSlug,
  onSelectAlbum,
  onBack,
  initiallyVisible = false,
}: PortfolioProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const selectedAlbum = selectedAlbumSlug
    ? albums.find(a => a.slug === selectedAlbumSlug) ?? null
    : null;

  const [visitedAlbumSlugs, setVisitedAlbumSlugs] = useState<ReadonlySet<string>>(
    () => new Set(selectedAlbumSlug ? [selectedAlbumSlug] : [])
  );
  const [hasBeenVisible, setHasBeenVisible] = useState(initiallyVisible);

  useEffect(() => {
    if (selectedAlbumSlug) {
      setVisitedAlbumSlugs(prev =>
        prev.has(selectedAlbumSlug) ? prev : new Set(prev).add(selectedAlbumSlug)
      );
    }
  }, [selectedAlbumSlug]);

  useEffect(() => {
    if (hasBeenVisible) return;
    const el = sectionRef.current;
    if (!el) return;
    const scrollContainer = el.closest<HTMLElement>('[data-scroll-container]');
    if (!scrollContainer) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const checkVisible = () => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top;
      if (isVisible) {
        setHasBeenVisible(true);
        scrollContainer.removeEventListener('scroll', checkVisible);
      }
    };

    scrollContainer.addEventListener('scroll', checkVisible, { passive: true });
    checkVisible();
    return () => scrollContainer.removeEventListener('scroll', checkVisible);
  }, [hasBeenVisible]);

  useSectionForegroundColor(sectionRef, ColorMode.Dark);

  return (
    <div ref={sectionRef} className={styles.portfolio}>
      <h2 className={styles.sectionTitle}>{title}</h2>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }} onContextMenu={blockContextMenu}>
        {/* AlbumGrid — mounted only after section enters viewport */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          opacity: selectedAlbum ? 0 : 1,
          pointerEvents: selectedAlbum ? 'none' : 'auto',
          transition: 'opacity 0.3s ease',
        }}>
          {hasBeenVisible && (
            <AlbumGrid albums={albums} onSelectAlbum={onSelectAlbum} />
          )}
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
              <AlbumView album={album} onBack={onBack} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { motion } from 'framer-motion';
import { Album } from '../../lib/types';
import { stagger, fadeIn } from '../../lib/animations';
import { fillGridVars } from '../../lib/fillGrid';
import ProgressiveImage from './ProgressiveImage';
import styles from '../../styles/sections/Portfolio.module.scss';

type AlbumGridProps = {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
};

export default function AlbumGrid({ albums, onSelectAlbum }: AlbumGridProps) {
  return (
    <motion.div
      className={styles.albumGrid}
      style={fillGridVars(albums.length)}
      variants={stagger(0.08)}
      initial="hidden"
      animate="visible"
    >
      {albums.map((album) => (
        <motion.a
          key={album.slug}
          href={`/photography/${encodeURIComponent(album.slug)}`}
          className={styles.albumCard}
          variants={fadeIn({ y: 20 })}
          onClick={(e) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            onSelectAlbum(album);
          }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.albumCover}>
            {/* Decorative: the album name below labels the link */}
            <ProgressiveImage
              variant="cover"
              src={album.cover}
              placeholderSrc={album.coverPlaceholder}
              alt=""
            />
          </div>
          <div className={styles.albumMeta}>
            <h3 className={styles.albumTitle}>{album.name}</h3>
            <span className={styles.albumCount}>{album.photos.length} photos</span>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}

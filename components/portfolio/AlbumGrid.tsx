"use client";
import { motion } from 'framer-motion';
import { Album } from '../../lib/types';
import { stagger, fadeIn } from '../../lib/animations';
import styles from '../../styles/sections/Portfolio.module.scss';

type AlbumGridProps = {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
};

export default function AlbumGrid({ albums, onSelectAlbum }: AlbumGridProps) {
  return (
    <motion.div
      className={styles.albumGrid}
      variants={stagger(0.08)}
      initial="hidden"
      animate="visible"
    >
      {albums.map((album) => (
        <motion.div
          key={album.slug}
          className={styles.albumCard}
          variants={fadeIn({ y: 20 })}
          onClick={() => onSelectAlbum(album)}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <img
            className={styles.albumCardImage}
            src={album.cover}
            alt={album.name}
            decoding="async"
            loading="lazy"
          />
          <div className={styles.albumCardLabel}>
            <h3>{album.name}</h3>
            <p>{album.photos.length} photos</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

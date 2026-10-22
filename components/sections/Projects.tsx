"use client";
import { useId, useRef, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import Image, { getImageProps } from 'next/image';
import { ColorMode, Project } from '../../lib/types';
import useSectionForegroundColor from '../../lib/effects/useSectionForegroundColor';
import { stagger, fadeIn } from '../../lib/animations';
import { fillGridVars } from '../../lib/fillGrid';
import styles from '../../styles/sections/Projects.module.scss';

type ProjectsProps = {
  projects: Project[];
};

const coverProps = { fill: true, sizes: '50vw' } as const;

function Cover({ image, portrait, focus }: { image: string; portrait?: string; focus?: string }) {
  if (!portrait) {
    return <Image src={image} alt="" {...coverProps} style={{ objectFit: 'cover', objectPosition: focus }} />;
  }
  const { props: { srcSet: portraitSrcSet } } = getImageProps({ src: portrait, alt: '', ...coverProps });
  const { props } = getImageProps({ src: image, alt: '', ...coverProps });
  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portraitSrcSet} sizes={coverProps.sizes} />
      <img {...props} alt="" className={styles.cover} style={{ ...props.style, '--focus': focus } as CSSProperties} />
    </picture>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();
  useSectionForegroundColor(sectionRef, ColorMode.Dark);

  return (
    <div ref={sectionRef} className={styles.projects}>
      <h2 className={styles.sectionTitle}>Projects</h2>
      <motion.div
        className={styles.projectGrid}
        style={fillGridVars(projects.length)}
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {projects.map((project, i) => (
          <motion.a
            key={project.href}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-labelledby={`${idPrefix}-${i}-name`}
            aria-describedby={`${idPrefix}-${i}-desc`}
            className={styles.projectCard}
            variants={fadeIn({ y: 20 })}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {/* Decorative: the name below labels the link */}
            <div className={styles.projectFrame} aria-hidden="true">
              {project.image ? (
                <Cover image={project.image} portrait={project.portrait} focus={project.focus} />
              ) : (
                <span>{project.name}</span>
              )}
            </div>
            <div className={styles.projectMeta}>
              <h3 id={`${idPrefix}-${i}-name`} className={styles.projectName}>
                {project.name}
                <span className={styles.srOnly}> (opens in new tab)</span>
              </h3>
              <p id={`${idPrefix}-${i}-desc`} className={styles.projectDescription}>{project.description}</p>
              <p className={styles.projectTags}>{project.tags.join(' · ')}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}

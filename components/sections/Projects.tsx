"use client";
import { useId, useRef } from 'react';
import { motion } from 'framer-motion';
import { ColorMode, Project } from '../../lib/types';
import useSectionForegroundColor from '../../lib/effects/useSectionForegroundColor';
import { stagger, fadeIn } from '../../lib/animations';
import { fillGridVars } from '../../lib/fillGrid';
import styles from '../../styles/sections/Projects.module.scss';

type ProjectsProps = {
  projects: Project[];
};

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
              <span>{project.name}</span>
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

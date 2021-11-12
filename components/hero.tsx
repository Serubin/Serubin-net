import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeUp, fadeDown, fadeLeft } from '../lib/animations';
import { c } from '../lib/utils';
import styles from '../styles/Hero.module.scss';

export type HeroProps = {
  name: string;
  tags: string[];
};

const isLast = (idx: number, total: number) => {
  return idx === total - 1;
};

export default function Hero({ name, tags }: HeroProps) {
  return (
    <header className={c(styles.hero)}>
      <section className={c(styles.innerWrapper)}>
        <div>
          <motion.p {...fadeDown()}>Hi, I&apos;m</motion.p>
          <motion.h1 {...fadeLeft()}>{name}</motion.h1>
            <motion.ul {...fadeUp()}>
              {tags.map((tag, idx) => (<React.Fragment key={idx}>
                <li>{tag}</li>
                {!isLast(idx, tags.length) && (<li>|</li>)}
              </React.Fragment>))}
            </motion.ul>
        </div>
        <motion.div className={c(styles.profileImageWrapper)} {...fadeLeft()}>
          <Image alt={name} src="/images/profile.jpg" layout="intrinsic" width={150} height={150} />
        </motion.div>
      </section>
      <div className={c([styles.chevronDown, styles.continue])}></div>
    </header>
  );
}

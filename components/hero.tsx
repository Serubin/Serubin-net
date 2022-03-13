import React from 'react';
import { motion } from 'framer-motion';
import Image from '../lib/Image';
import { fadeUp, fadeDown, fadeLeft } from '../lib/animations';
import { c } from '../lib/utils';
import styles from '../styles/Hero.module.scss';
import hero from '../public/images/hero.jpg';
import heroLqip from '../public/images/hero.base64';
import profile from '../public/images/profile.jpg';
import profileLqip from '../public/images/profile.base64';

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
      <Image src={hero} alt="background of a beach" layout="fill" objectFit="cover" placeholder="blur" blurDataURL={heroLqip.trim()} unoptimized={true}/>
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
          <Image alt={name} src={profile} layout="intrinsic" width={150} height={150} placeholder="blur" blurDataURL={profileLqip.trim()} />
        </motion.div>
      </section>
      <div className={c([styles.chevronDown, styles.continue])}></div>
    </header>
  );
}

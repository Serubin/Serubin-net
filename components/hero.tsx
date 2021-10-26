import Image from 'next/image'
import { c } from '../lib/utils';
import styles from '../styles/Hero.module.scss'

export type HeroProps = {
  name: string;
  tags: string[];
};

const isLast = (idx: number, total: number) => {
  return idx === total - 1;
}

export default function Hero({ name, tags }: HeroProps) {
  return (
    <header className={c(styles.hero)}>
      <section className={c(styles.innerWrapper)}>
        <div>
          <p>Hi, I&apos;m</p>
          <h1>{name}</h1>
          <ul>
            {tags.map((tag, idx) => (<>
              <li key={tag}>{tag}</li>
              {!isLast(idx, tags.length) && (<li key={idx}>|</li>)}
            </>))}
          </ul>
        </div>
        <div className={c(styles.profileImageWrapper)}>
          <Image alt={name} src="/images/profile.jpg" layout="intrinsic" width={150} height={150} />
        </div>
      </section>
      <div className={c([styles.chevronDown, styles.continue])}></div>
    </header>
  );
}

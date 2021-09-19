import Image from 'next/image'
import styles from '../styles/Hero.module.css'

export type HeroProps = {
  name: string;
  tags: string[];
};

export default function Hero({ name, tags }: HeroProps) {
  return (
    <div className={styles.hero}>
      <div>
        <h1>{name}</h1>
        <ul>
          {tags.map(tag => (<li key={tag}>{tag}</li>))}
        </ul>
      </div>
      <div>
        <Image alt={name} src="/images/profile.jpg" layout="intrinsic" width={450} height={450} />
      </div>
    </div>
  );
}

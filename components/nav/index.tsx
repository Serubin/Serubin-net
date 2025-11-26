import { classNames as c } from '../../lib/utils';
import Link from 'next/link';
import styles from '../../styles/sections/Nav.module.scss';
import { SocialLink } from '../../lib/types';
import Logo from './logo';

type PropsType = {
  links: SocialLink[];
}

export default function Nav({ links }: PropsType) {
  return (
    <nav className={c(styles.navigation)}>
      <section className={c(styles.left)}>
        <Link href="/" passHref>
          <Logo />
        </Link>
      </section>

      <section className={c(styles.right)}>
        <ul className={c(styles.linkList)}>
          {links.map((link: SocialLink) => (
            <li key={link.name}>
              <a href={link.link} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  );
}


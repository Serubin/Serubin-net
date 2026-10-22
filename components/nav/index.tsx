'use client';
import { useState, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { classNames as c } from '../../lib/utils';
import styles from '../../styles/sections/Nav.module.scss';
import { ColorMode, NavSection, SocialLink } from '../../lib/types';
import Logo from './logo';
import { useNavInk, SectionHandler } from './NavInkContext';

type PropsType = {
  links: SocialLink[];
}

function sectionFromPath(pathname: string): NavSection | 'hero' {
  const first = pathname.split('/').filter(Boolean)[0];
  return first === 'photography' || first === 'projects' || first === 'resume' ? first : 'hero';
}

function isPlainClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/** Scrolls in place when the current page owns the section; otherwise lets the Link navigate. */
function sectionClick(goToSection: SectionHandler, section: NavSection | 'hero') {
  return (e: MouseEvent) => {
    if (isPlainClick(e) && goToSection(section)) e.preventDefault();
  };
}

export default function Nav({ links }: PropsType) {
  const pathname = usePathname() ?? '/';
  const { ink, scrolling, goToSection } = useNavInk();
  const current = sectionFromPath(pathname);
  const textColor = ink ?? (current === 'hero' ? ColorMode.Light : ColorMode.Dark);
  // The resume's global stylesheet would outlive a client-side exit, so leave it with full loads.
  const fullLoadOnly = current === 'resume';
  const expanded = current !== 'hero';
  // The logo holds its form mid-scroll and changes once the scroll settles.
  const [logoExpanded, setLogoExpanded] = useState(expanded);
  if (!scrolling && logoExpanded !== expanded) setLogoExpanded(expanded);

  return (
    <nav className={c(styles.navigation, styles[textColor], fullLoadOnly ? styles.document : '')}>
      <section className={c(styles.left)}>
        {fullLoadOnly ? (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- deliberate full load, see fullLoadOnly
          <a href="/" className={styles.logoLink}>
            <Logo expanded={logoExpanded} />
          </a>
        ) : (
          <Link href="/" className={styles.logoLink} onClick={sectionClick(goToSection, 'hero')}>
            <Logo expanded={logoExpanded} />
          </Link>
        )}
      </section>

      <section className={c(styles.right)}>
        <ul className={c(styles.linkList)}>
          {links.map((link: SocialLink) => (
            <li key={link.name} className={link.section === current ? styles.active : undefined}>
              {link.section && !link.fullLoad && !fullLoadOnly ? (
                <Link
                  href={link.link}
                  aria-current={link.section === current ? 'page' : undefined}
                  onClick={sectionClick(goToSection, link.section)}
                >
                  {link.name}
                </Link>
              ) : link.section ? (
                <a href={link.link} aria-current={link.section === current ? 'page' : undefined}>
                  {link.name}
                </a>
              ) : (
                <a href={link.link} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </nav>
  );
}

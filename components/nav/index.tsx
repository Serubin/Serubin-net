'use client';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
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
  const expanded = current === 'photography' || current === 'projects';
  // The logo holds its form mid-scroll and changes once the scroll settles.
  const [logoExpanded, setLogoExpanded] = useState(expanded);
  if (!scrolling && logoExpanded !== expanded) setLogoExpanded(expanded);

  // Below medium everything but Resume collapses into More, which closes on any navigation.
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreOpenedOn, setMoreOpenedOn] = useState(pathname);
  if (moreOpenedOn !== pathname) {
    setMoreOpenedOn(pathname);
    if (moreOpen) setMoreOpen(false);
  }
  const moreRef = useRef<HTMLLIElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const inMore = (link: SocialLink) => link.section !== 'resume';
  const moreActive = links.some((link) => inMore(link) && link.section === current);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMoreOpen(false);
      moreButtonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [moreOpen]);

  // The chosen link is hidden once the panel closes, so keyboard focus returns to More.
  const closeMoreFromLink = () => {
    setMoreOpen(false);
    document.getElementById(`${panelId}-button`)?.focus({ preventScroll: true });
  };

  const renderLink = (link: SocialLink, onNavigate?: () => void) => link.section ? (
    <Link
      href={link.link}
      aria-current={link.section === current ? 'page' : undefined}
      onClick={(e) => { sectionClick(goToSection, link.section!)(e); onNavigate?.(); }}
    >
      {link.name}
    </Link>
  ) : (
    <a href={link.link} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
      {link.name}
    </a>
  );

  return (
    <nav className={c(styles.navigation, styles[textColor], current === 'resume' ? styles.document : '')}>
      <section className={c(styles.left)}>
        <Link href="/" className={styles.logoLink} onClick={sectionClick(goToSection, 'hero')}>
          <Logo expanded={logoExpanded} />
        </Link>
      </section>

      <section className={c(styles.right)}>
        <ul className={c(styles.linkList)}>
          {links.map((link: SocialLink) => (
            <li
              key={link.name}
              className={c(link.section === current ? styles.active : '', inMore(link) ? styles.collapsible : '')}
            >
              {renderLink(link)}
            </li>
          ))}
          <li
            ref={moreRef}
            className={styles.moreItem}
            onBlur={(e) => { if (!moreRef.current?.contains(e.relatedTarget)) setMoreOpen(false); }}
          >
            <button
              ref={moreButtonRef}
              id={`${panelId}-button`}
              type="button"
              className={c(styles.more, moreActive ? styles.moreActive : '')}
              aria-expanded={moreOpen}
              aria-controls={panelId}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              More
            </button>
            <ul id={panelId} className={styles.morePanel} hidden={!moreOpen}>
              {links.filter(inMore).map((link) => (
                <li key={link.name} className={link.section === current ? styles.active : undefined}>
                  {renderLink(link, closeMoreFromLink)}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </section>
    </nav>
  );
}

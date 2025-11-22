import React  from 'react';
import type { NextPage, GetStaticProps, Metadata } from 'next';
import styles from '../styles/Index.module.scss';
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/hero';
import { HeroData, NavData, AboutData } from '../lib/types';
import Nav from '../components/nav';
import { type JSX } from 'react';
import About from '../components/about';
import SnapScroll from '../lib/SnapScroll';

type StaticContent = {
  hero: HeroData;
  nav: NavData;
  about: AboutData;
}


export const metadata: Metadata = {
  title: 'Solomon Rubin',
};

const Index = (): JSX.Element => {
  const {
    hero: { name, tags },
    nav: { links } ,
    about: { text },
  } = getStaticContent(['hero', 'nav', 'about']) as StaticContent;

  return (
    <>
      <Nav links={links} />
      <SnapScroll>
        <SnapScroll.Section id="hero">
          <Hero name={name} tags={tags} />
        </SnapScroll.Section>
        <SnapScroll.Section id="about">
          <About text={text} />
        </SnapScroll.Section>
      </SnapScroll>
    </>
  );
};

export default Index;

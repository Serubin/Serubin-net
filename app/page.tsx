import React  from 'react';
import type { NextPage, GetStaticProps, Metadata } from 'next';
import styles from '../styles/Index.module.scss';
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/sections/Hero';
import { HeroData, NavData } from '../lib/types';
import Nav from '../components/nav';
import { type JSX } from 'react';

type StaticContent = {
  hero: HeroData;
  nav: NavData;
}


export const metadata: Metadata = {
  title: 'Solomon Rubin',
};

const Index = (): JSX.Element => {
  const {
    hero: { name, tags },
    nav: { links } ,
  } = getStaticContent(['hero', 'nav']) as StaticContent;

  return (
    <>
      <Nav links={links} />
      <div className={styles.container}>
          <Hero name={name} tags={tags} />
      </div>
    </>
  );
};

export default Index;

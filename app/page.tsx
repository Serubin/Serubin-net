import React  from 'react';
import type { NextPage, GetStaticProps, Metadata } from 'next';
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/sections/Hero';
import { HeroData, NavData } from '../lib/types';
import Nav from '../components/nav';
import { type JSX } from 'react';
import SnapScroll from '../components/SnapScroll';

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
      <SnapScroll>
        <SnapScroll.Section id="hero">
          <Hero name={name} tags={tags} />
        </SnapScroll.Section>
      </SnapScroll>
    </>
  );
};

export default Index;

import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import styles from '../styles/Index.module.scss';
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/hero';
import { HeroData, NavData } from '../lib/types';
import Nav from '../components/nav';

type Props = {
  hero: HeroData;
  nav: NavData;
}

const Index: NextPage<Props> = ({ hero, nav }): JSX.Element => {
  const { name, tags } = hero;
  const { links } = nav;

  return (
    <>
      <Head>
        <title>Solomon Rubin</title>
        <script defer data-domain="serubin.net" src="https://stats.serubin.net/js/script.js"></script>
      </Head>
      <Script id="stat-js" src="https://stats.serubin.net/js/app.js" data-domain="serubin-net" strategy="lazyOnload" />
      <Nav links={links} />
      <div className={styles.container}>
          <Hero name={name} tags={tags} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data: any = getStaticContent(['hero', 'nav']);

  return {
    props: {
      ...data,
    }
  };
};

export default Index;

import type { NextPage, GetStaticProps } from 'next'
import styles from '../styles/Index.module.scss'
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/hero'
import { HeroData, NavData } from '../lib/types';
import Nav from '../components/nav'

type Props = {
  hero: HeroData;
  nav: NavData;
}

const Index: NextPage<Props> = ({ hero, nav }): JSX.Element => {
  const { name, tags } = hero;
  const { links } = nav;

  return (
    <>
      <Nav links={links} />
      <div className={styles.container}>
          <Hero name={name} tags={tags} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data: any = getStaticContent(['hero', 'nav']);

  return {
    props: {
      ...data,
    }
  };
}

export default Index

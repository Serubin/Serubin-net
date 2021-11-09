import type { NextPage, GetStaticProps } from 'next'
import styles from '../styles/Index.module.scss'
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/hero'
import { AboutData } from '../lib/types';
import Nav from '../components/nav'
import About from '../components/about';

const Index: NextPage = ({ staticData }): JSX.Element => {
  const { name, tags, about, links }: AboutData = staticData.about;

  return (
    <>
      <Nav links={links} />
      <div className={styles.container}>
          <Hero name={name} tags={tags} />
          <About text={about} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = getStaticContent(['about']);

  return {
    props: {
      staticData: data,
    }
  };
}

export default Index

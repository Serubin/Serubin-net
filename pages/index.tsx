import type { NextPage, GetStaticProps } from 'next'
import styles from '../styles/Index.module.scss'
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/hero'
import { AboutData } from '../lib/types';

const Index: NextPage = ({ staticData }) => {
  const { name, tags, about }: AboutData = staticData.about;

  return (
    <>
      <div className={styles.container}>
          <Hero name={name} tags={tags} />
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

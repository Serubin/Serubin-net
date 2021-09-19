import type { NextPage, GetStaticProps } from 'next'
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/hero'
import styles from '../styles/Index.module.css'

const Index: NextPage = ({ staticData }) => {
  const { name, tags }: HeroProps = staticData.hero;

  return (
    <div className={styles.container}>
        <Hero name={name} tags={tags}/>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = getStaticContent(['hero']);

  return {
    props: {
      staticData: data,
    }
  };
}

export default Index

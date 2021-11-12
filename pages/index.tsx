import type { NextPage, GetStaticProps } from 'next'
import styles from '../styles/Index.module.scss'
import getStaticContent from '../lib/contentData';
import Hero, { HeroProps } from '../components/hero'
import { AboutData } from '../lib/types';
import Nav from '../components/nav'

type Props = {
  staticData: {
    about: AboutData;
  };
}

const Index: NextPage<Props> = ({ staticData }): JSX.Element => {
  const { name, tags, about, links } = staticData.about;

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
  const data = getStaticContent(['about']);

  return {
    props: {
      staticData: data,
    }
  };
}

export default Index

import type { NextPage } from 'next';
import Head from 'next/head';
import type { Resume as ResumeType } from '../resume/lib/types';
import getStaticContent from '../lib/contentData';
import Resume from '../resume/components/resume';

type Props = {
  resume: ResumeType;
};

const ResumePage: NextPage<Props> = ({ resume }) => {
  return (<>
    <Head>
      <title>Solomon Rubin | Resume</title>
      <script defer data-domain="serubin.net" src="https://stats.serubin.net/js/app.js"></script>
    </Head>
    <Resume resume={resume}/>
  </>);
};

export const getStaticProps = async () => {
  // Work around for ts spread - this is not safe
  const data: any = getStaticContent(['resume'], 'resume/data/');

  return {
    props: {
      ...data,
    }
  };
};

export default ResumePage;

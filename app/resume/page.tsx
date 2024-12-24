import type { Metadata, NextPage } from 'next';
import type { Resume as ResumeType } from '../../resume/lib/types';
import getStaticContent from '../../lib/contentData';
import Resume from '../../resume/components/resume';

type Props = {
  resume: ResumeType;
};

export const metadata: Metadata = {
  title: 'Solomon Rubin | Resume',
};

const ResumePage = () => {
  const { resume }: any = getStaticContent(['resume'], 'resume/data/');
  return (<>
    <Resume resume={resume}/>
  </>);
};

export default ResumePage;

import { ReactChildren } from '../../lib/types';
import { classNames as c } from '../../lib/utils';
import '../../styles/resume-scope.scss';
import styles from '../../styles/sections/ResumePage.module.scss';

// The submodule's ResumeHead imports its stylesheet globally, so its <head> links are rendered here
// instead; precedence keeps them loaded across client-side visits.
export default function ResumeLayout({ children }: ReactChildren) {
  return (
    <>
      <link href="https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet" precedence="default" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- only the resume uses these faces */}
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&family=Roboto:wght@400;700&family=Varela+Round&display=swap" rel="stylesheet" precedence="default" />
      <div className={c('resume-scope', styles.resumePage)}>{children}</div>
    </>
  );
}

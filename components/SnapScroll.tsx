import { classNames as c } from '../lib/utils';
import styles from '../styles/SnapScroll.module.scss';
// @ts-ignore: No types available for css-scroll-snap-polyfill

type SnapScrollProps = {
  children: React.ReactNode;
};

type SnapScrollSectionProps = {
  id: string;
  children: React.ReactNode;
}

const SnapScroll = ({ children }: SnapScrollProps) => {
  return (
    <div className={c(styles.container)}>
      {children}
    </div>
  );
};

const SnapScrollSection = ({ id, children }: SnapScrollSectionProps) => {
  return (
    <div id={id} className={c(styles.section)}>
      {children}
    </div>
  );
};

SnapScroll.Section = SnapScrollSection;

export default SnapScroll;
export { SnapScrollSection as Section };
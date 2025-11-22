import { c } from './utils';
import styles from '../styles/SnapScroll.module.scss';

type SnapScrollProps = {
  children: React.ReactNode;
}

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
    <section id={id} className={c(styles.section)}>
      {children}
    </section>
  );
};

SnapScroll.Section = SnapScrollSection;

export default SnapScroll;
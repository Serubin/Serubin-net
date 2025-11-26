import { classNames as c } from '../../lib/utils';
import styles from '../../styles/sections/About.module.scss';

type AboutProps = {
  text: string;
};

export default function About({ text }: AboutProps) {
  return (
    <article className={c(styles.about)}>
      <p dangerouslySetInnerHTML={{ __html: text }}></p>
    </article>
  );
}

import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This custom 404 page will just redirect to /
// This is fine for this site because there are only two pages
const NotFound: NextPage = (): JSX.Element => {
  const { push } = useRouter();
  useEffect(() => push('/'));

  return <></>;
};
export default NotFound;

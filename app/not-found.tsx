'use client';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';

// This custom 404 page will just redirect to /
// This is fine for this site because there are only two pages
const NotFound = (): JSX.Element => {
  const { push } = useRouter();
  useEffect(() => push('/'));

  return <></>;
};
export default NotFound;

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ResumePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <Head>
      <meta httpEquiv="refresh" content="0;url=/" />
      <link rel="canonical" href="https://andgoliath.me/" />
    </Head>
  );
};

export default ResumePage;

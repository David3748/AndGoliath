import React, { ReactNode } from 'react';
import Head from 'next/head';

interface SimpleLayoutProps {
  children: ReactNode;
  title?: string;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children, title = '&Goliath' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="A personal website showcasing my favorite things" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default SimpleLayout;

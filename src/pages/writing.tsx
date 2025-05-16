import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NewspaperSlingshotAnimation from '../components/NewspaperSlingshotAnimation';
import { getAllArticles, Article } from '../lib/articles';

interface WritingPageProps {
  articles: Article[];
}

const Writing: NextPage<WritingPageProps> = ({ articles }) => {
  return (
    <Layout title="&Goliath | Writing">
      <motion.div
        initial={{ opacity: 0, x: 50 }} // Slide from right and fade in
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-serif text-foreground border-b border-current-line pb-2 mt-8">
            Writing
          </h1>
          <NewspaperSlingshotAnimation className="w-16 h-16" articles={articles} />
        </div>


        <ul className="space-y-6">
          {articles.map((article, index) => (
            <motion.li
              key={article.slug}
              className="bg-current-line rounded-lg p-4 shadow-sm border border-current-line hover:shadow-md transition-shadow"
              initial={{ opacity: 0, x: 50 }} // Start from right and fade out
              animate={{ opacity: 1, x: 0 }}   // Slide in from right to position and fade in
              transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered delay
            >
              <Link href={`/writing/${article.slug}`} className="block">
                <h2 className="text-lg font-medium text-foreground hover:text-primary transition-colors">{article.title}</h2>
                {article.subtitle && (
                  <p className="text-sm text-gray-400">{article.subtitle}</p>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>

      </motion.div>
    </Layout>
  );
};

export async function getStaticProps() {
  let articles = await getAllArticles();
  articles = articles.map(article => ({
    ...article,
    subtitle: article.subtitle === undefined ? null : article.subtitle,
  }));
  return {
    props: {
      articles,
    },
  };
}

export default Writing;
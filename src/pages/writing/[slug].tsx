import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import { getArticleBySlug, getAllArticles } from '../../lib/articles';
import { Article } from '../../lib/articles';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa'; // Import back arrow icon

interface ArticlePageProps {
  article: Article;
}

const ArticlePage: NextPage<ArticlePageProps> = ({ article }) => {
  return (
    <Layout title={`&Goliath | Writing - ${article.title}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link href="/writing" className="text-primary hover:text-secondary transition-colors">
            <FaArrowLeft className="inline-block mr-2" /> Back to Writing
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif mb-4 md:mb-6 text-foreground border-b border-current-line pb-2 mt-8">
          {article.title}
        </h1>
        <p className="text-gray-400 mb-8">{article.subtitle}</p>

        <div className="prose prose-lg max-w-none text-foreground">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{article.content}</ReactMarkdown>
        </div>

      </motion.div>
    </Layout>
  );
};

export async function getStaticPaths() {
  const articles = await getAllArticles();
  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
    },
  };
}

export default ArticlePage;
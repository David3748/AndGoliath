import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypePrism from 'rehype-prism-plus';
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
        {article.subtitle && (
          <p className="text-gray-400 mb-8">{article.subtitle}</p>
        )}

        <div className="prose prose-lg max-w-none text-foreground">
          <ReactMarkdown 
            rehypePlugins={[rehypeRaw, [rehypePrism, { ignoreMissing: true }]]}
            components={{
              // Custom image component to handle image sizing
              img: ({ node, ...props }) => (
                <div className="my-8">
                  <img 
                    {...props} 
                    className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
                    alt={props.alt || ''}
                  />
                </div>
              ),
              // Custom span component to handle footnotes
              span: ({ node, className, ...props }) => {
                if (className === 'footnote') {
                  return <span className="footnote" {...props} />;
                }
                // eslint-disable-next-line jsx-a11y/alt-text -- This is a general span, not an image
                return <span {...props} />;
              },
              // Custom paragraph component to unwrap standalone images
              p: (paragraph) => {
                const { node } = paragraph;
                if (node && node.children && node.children.length === 1 && node.children[0].type === 'element' && node.children[0].tagName === 'img') {
                  // Render the image component directly, without the <p> wrapper
                  // The custom 'img' component will provide its own div wrapper
                  // ReactMarkdown will automatically use the custom 'img' component for this child
                  return <>{paragraph.children}</>;
                }
                return <p>{paragraph.children}</p>;
              }
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

      </motion.div>
    </Layout>
  );
};

export async function getStaticPaths() {
  const articles = await getAllArticles();
  // Ensure subtitles are null instead of undefined for paths generation, if necessary
  // Although for paths, only slug is critical. This ensures consistency if more fields were used.
  const safeArticles = articles.map(article => ({
    ...article,
    subtitle: article.subtitle === undefined ? null : article.subtitle,
  }));
  // Exclude articles that have dedicated custom pages
  const customPages = ['Cities', 'Books2026'];
  const paths = safeArticles
    .filter((article) => !customPages.includes(article.slug))
    .map((article) => ({
      params: { slug: article.slug },
    }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  let article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      notFound: true,
    };
  }

  // Ensure subtitle is null instead of undefined for JSON serialization
  const serializableArticle = {
    ...article,
    subtitle: article.subtitle === undefined ? null : article.subtitle,
  };

  return {
    props: {
      article: serializableArticle,
    },
  };
}

export default ArticlePage;
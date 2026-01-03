import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import { favorites } from '../../data/favorites';
import Link from 'next/link';
import { FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';

const AllFavorites: NextPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <Layout title="&Goliath | All Favorites">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <Link
            href="/favorites"
            className="inline-flex items-center text-primary hover:text-purple transition-colors mb-4"
          >
            <FaArrowLeft className="mr-2" size={14} />
            Back to random favorites
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-serif text-foreground border-b border-current-line pb-2 mt-4">
            All My Favorite Things
          </h1>
          
          <p className="text-gray-400 mt-3 italic text-sm">
            Listed by category, in no particular order within each
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {favorites.map((category) => (
            <motion.div
              key={category.id}
              variants={categoryVariants}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <h2 className="text-xl font-serif text-primary mb-4 border-b border-gray-800 pb-2">
                {category.title}
              </h2>
              
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start py-1 group"
                  >
                    <span className="text-gray-500 mr-3 mt-1">•</span>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors flex items-center"
                      >
                        <span>{item.name}</span>
                        <FaExternalLinkAlt
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          size={10}
                        />
                      </a>
                    ) : (
                      <span className="text-foreground">{item.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/favorites"
            className="inline-block px-4 py-2 bg-primary text-background rounded-md hover:bg-purple transition-colors"
          >
            Back to random favorites
          </Link>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AllFavorites;


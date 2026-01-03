import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import SlingshotAnimation from '../components/SlingshotAnimation';
import Link from 'next/link';
import { FaMapPin } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const Home: NextPage = () => {
  return (
    <Layout title="&Goliath | Home">
      <section id="about" className="mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="prose prose-lg max-w-none"
        >
          <div className="flex items-center mb-4 md:mb-6">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-100 mr-4">
              Hi, I'm{' '}
              <TypeAnimation
                sequence={[
                  'David Lieman', // Type full name
                  1000, // Wait 1s
                  'David', // Delete "Lieman"
                  500, // Wait before next animation starts
                ]}
                wrapper="span"
                speed={50}
                deletionSpeed={80}
                repeat={0}
                cursor={false}
                className="text-primary"
              />
            </h1>
            {/* Slingshot next to name */}
            <SlingshotAnimation className="w-16 h-16" />
          </div>

          <div className="flex items-center text-gray-400 mb-4 md:mb-6">
            <FaMapPin className="mr-2" /> {/* Pin icon */}
            <TypeAnimation
              sequence={[
                2000, // Wait for name animation to finish first
                'London, UK', // Type location
                1000, // Wait at final state
              ]}
              wrapper="span"
              speed={50}
              repeat={0}
              cursor={false}
            />
          </div>

          <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-base md:text-lg">
            <TypeAnimation
              sequence={[
                4000, // Wait for previous animations
                "We're here ", // Type beginning
                500, // Small pause
                "We're here because we're here", // Finish typing
                500, // Wait at final state
                "We're here ", // Go back to "We're here"
                500, // Wait at "We're here"
              ]}
              wrapper="span"
              speed={50}
              repeat={0}
              cursor={false}
            />
            <Link href="/because" className="text-primary hover:underline">because</Link>
          </p>
        </motion.div>
      </section>

      <section className="mb-16 md:mb-20 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-md"
        >
          <h2 className="text-xl md:text-2xl font-serif mb-3 md:mb-4 text-gray-100">
            Favorite Things
          </h2>
          <Link href="/favorites">
            <motion.div
              className="inline-block px-4 py-2 md:px-5 md:py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm md:text-base"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              View Favorites
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-md"
        >
          <h2 className="text-xl md:text-2xl font-serif mb-3 md:mb-4 text-gray-100">
            Resume
          </h2>
          <Link href="/resume">
            <motion.div
              className="inline-block px-4 py-2 md:px-5 md:py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm md:text-base"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              View Resume
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-md"
        >
          <h2 className="text-xl md:text-2xl font-serif mb-3 md:mb-4 text-gray-100">
            Writing
          </h2>
          <Link href="/writing">
            <motion.div
              className="inline-block px-4 py-2 md:px-5 md:py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm md:text-base"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              View Writing
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-sm hover:shadow-md transition-shadow rounded-md"
        >
          <h2 className="text-xl md:text-2xl font-serif mb-3 md:mb-4 text-gray-100">
            Projects
          </h2>
          <Link href="/projects">
            <motion.div
              className="inline-block px-4 py-2 md:px-5 md:py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm md:text-base"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              View Projects
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Home;
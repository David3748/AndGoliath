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
                'College Park, MD', // Type location
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

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-16 md:mb-20 max-w-2xl"
      >
        <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-4 md:mb-6">
          I'm currently spending my time thinking about religion, photography, the Sabbath, math puzzles, Blood on the Clocktower, and making my mind a better place to live in.
        </p>
        <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-4 md:mb-6">
          I'm currently trying to find interesting conversations, the Great American Novel, uncorrelated alpha, and meaning.
        </p>
        <p className="text-gray-300 leading-relaxed text-base md:text-lg">
          If you've ended up on this website, I'd love to{' '}
          <a
            href="https://calendly.com/lieman/one-on-one"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            talk
          </a>
          .
        </p>
      </motion.section>
    </Layout>
  );
};

export default Home;
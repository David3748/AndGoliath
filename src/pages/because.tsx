import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import SimpleLayout from '../components/SimpleLayout';
import Link from 'next/link';

const Because: NextPage = () => {
  return (
    <SimpleLayout title="&Goliath | Because">
      <section className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="prose prose-lg max-w-none text-center"
        >
          <h1 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8 text-gray-100">
            We're here <Link href="/" className="text-primary hover:underline">because</Link>
          </h1>
        </motion.div>
      </section>
    </SimpleLayout>
  );
};

export default Because;
import { useState } from 'react';
import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaBook,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';

interface BookData {
  title: string;
  author: string;
  color: string;
  review: string;
  rating?: number;
}

const books: BookData[] = [
  {
    title: 'Dune Messiah',
    author: 'Frank Herbert',
    color: '#FFB86C',
    review: "I thought it was disappointing. It took me three tries to read the book. Maybe I'm just not equipped to appreciate Messiah yet.",
    rating: 3.5,
  },
  {
    title: '1984',
    author: 'George Orwell',
    color: '#FF5555',
    review: "Not at all worrying in current contexts.",
    rating: 4,
  },
  {
    title: 'The Remains of the Day',
    author: 'Kazuo Ishiguro',
    color: '#50FA7B',
    review: "Well-written and kinda boring.",
    rating: 3.9,
  },
  {
    title: 'Grapes of Wrath',
    author: 'John Steinbeck',
    color: '#8BE9FD',
    review: "I flew through this. Steinbeck is maybe my favorite dead author. Made me like 10% more communist.",
    rating: 4.6,
  },
];

const StickyNote: React.FC<{ book: BookData; onClose: () => void }> = ({ book, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60" />
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ scale: 0.8, rotate: -2, opacity: 0 }}
        animate={{ scale: 1, rotate: 1, opacity: 1 }}
        exit={{ scale: 0.8, rotate: 2, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-sm shadow-2xl p-6 pb-8"
          style={{
            background: '#2A2D3E',
            borderTop: `4px solid ${book.color}`,
            boxShadow: '4px 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top tape effect */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm opacity-30"
            style={{ background: book.color }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-comment hover:text-foreground transition-colors text-lg"
          >
            &times;
          </button>

          {/* Book icon and title */}
          <div className="flex items-start gap-3 mb-1">
            <FaBook className="text-2xl mt-1 flex-shrink-0" style={{ color: book.color }} />
            <h2 className="text-xl font-serif text-foreground">{book.title}</h2>
          </div>
          <p className="text-sm text-comment ml-9 mb-4">{book.author}</p>

          {/* Review content */}
          <div className="font-serif text-gray-300 leading-relaxed min-h-[80px]">
            {book.review ? (
              <p>{book.review}</p>
            ) : (
              <p className="text-comment italic">Review coming soon...</p>
            )}
          </div>

          {/* Rating */}
          <div className="mt-4 pt-3 border-t border-gray-600/30 flex items-center gap-2">
            <span className="text-sm text-comment">Rating:</span>
            <div className="flex items-center gap-0.5">
              {book.rating != null ? (
                <>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const fill = Math.min(1, Math.max(0, book.rating! - (star - 1)));
                    if (fill >= 1) {
                      return <FaStar key={star} className="text-sm" style={{ color: book.color }} />;
                    } else if (fill <= 0) {
                      return <FaRegStar key={star} className="text-sm text-comment" />;
                    }
                    return (
                      <span key={star} className="relative inline-block text-sm">
                        <FaRegStar className="text-comment" />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                          <FaStar style={{ color: book.color }} />
                        </span>
                      </span>
                    );
                  })}
                  <span className="ml-1.5 text-sm text-comment">{book.rating}/5</span>
                </>
              ) : (
                [1, 2, 3, 4, 5].map((star) => (
                  <FaRegStar key={star} className="text-sm text-comment" />
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Books2026Page: NextPage = () => {
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);

  return (
    <Layout title="&Goliath | Writing - Books 2026">
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

        <h1 className="text-3xl md:text-4xl font-serif mb-2 text-foreground border-b border-current-line pb-2 mt-8">
          Books 2026
        </h1>
        <p className="text-gray-400 mb-8">What I read this year</p>

        {books.length === 0 ? (
          <p className="text-comment italic font-serif">No books yet...</p>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
            {books.map((book, index) => (
              <motion.button
                key={book.title}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-current-line border border-current-line hover:border-comment transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBook(book)}
              >
                <FaBook
                  className="text-3xl md:text-4xl transition-colors"
                  style={{ color: book.color }}
                />
                <span className="text-xs md:text-sm text-gray-400 group-hover:text-foreground transition-colors text-center leading-tight">
                  {book.title}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedBook && (
            <StickyNote book={selectedBook} onClose={() => setSelectedBook(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default Books2026Page;

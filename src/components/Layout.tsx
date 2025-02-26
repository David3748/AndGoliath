import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaBars, FaTimes, FaCalendar } from 'react-icons/fa';
import SlingshotAnimation from './SlingshotAnimation';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  isSimple?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title = '&Goliath', isSimple = false }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [router.pathname]);

  const isActive = (pathname: string) => {
    return router.pathname === pathname;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-foreground w-full">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center space-x-2"
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-2"
              >
                <h1 className="text-xl md:text-2xl font-serif tracking-wide">
                  <span className="text-primary">&</span> <span className="text-foreground">Goliath</span>
                </h1>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/favorites"
                className={`text-${isActive('/favorites') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
              >
                Favorites
              </Link>
              <Link
                href="/resume"
                className={`text-${isActive('/resume') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
              >
                Resume
              </Link>
              <Link
                href="/writing"
                className={`text-${isActive('/writing') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
              >
                Writing
              </Link>
              <Link
                href="/projects"
                className={`text-${isActive('/projects') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
              >
                Projects
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Mobile Menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden mt-2"
            >
              <div className="flex flex-col space-y-4">
                  <Link
                    href="/favorites"
                    className={`text-${isActive('/favorites') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <Link
                    href="/resume"
                    className={`text-${isActive('/resume') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Resume
                  </Link>
                  <Link
                    href="/writing"
                    className={`text-${isActive('/writing') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Writing
                  </Link>
                  <Link
                    href="/projects"
                    className={`text-${isActive('/projects') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className={`flex-grow ${isSimple ? 'container mx-auto px-4 py-8' : 'container mx-auto px-4 py-8 md:py-10'}`}>
        {children}
      </main>

      <footer className="py-6 md:py-8 border-t border-current-line">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/David3748"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://calendly.com/lieman/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Calendly"
            >
              <FaCalendar size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/david-lieman/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaBars, FaTimes, FaCalendar } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = '&Goliath' }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Head>
        <title>{title}</title>
        <meta name="description" content="A personal website showcasing my favorite things" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className="py-6 md:py-8 border-b border-current-line">
        <div className="container mx-auto px-4 max-w-3xl">
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
                href="/"
                className={`text-${isActive('/') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
              >
                Home
              </Link>
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
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 py-4 border-t border-current-line"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className={`text-${isActive('/') ? 'primary' : 'foreground'} hover:text-primary transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
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
              </div>
            </motion.nav>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-3xl">
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
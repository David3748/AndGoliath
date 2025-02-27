import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

interface Project {
  title: string;
  subtitle: string;
  technologies: string[];
  githubUrl: string;
}

interface ProjectsPageProps {
  projects: Project[];
}

// Variants for sliding animation based on navigation direction
const slideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const Projects: NextPage<ProjectsPageProps> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleChangeIndex = (newIndex: number) => {
    if (newIndex > activeIndex) {
      setDirection(1);
    } else if (newIndex < activeIndex) {
      setDirection(-1);
    }
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleChangeIndex((activeIndex + 1) % projects.length);
      } else if (e.key === 'ArrowLeft') {
        handleChangeIndex((activeIndex - 1 + projects.length) % projects.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, projects.length]);

  const getNavigationCardStyle = (index: number) => {
    const isActive = activeIndex === index;
    const totalProjects = projects.length;
    const cardWidth = 120;
    const selectedOffset = -20;
    const offset = (index - activeIndex) * 60;
    const distance = Math.abs(index - activeIndex);
    const zIndex = totalProjects - distance;

    return {
      left: `calc(50% + ${offset}px - ${cardWidth / 2}px)`,
      zIndex: zIndex,
      opacity: isActive ? 1 : 0.7 - distance * 0.1,
      transform: isActive
        ? `translateY(${selectedOffset}px) scale(1.1)`
        : `translateY(0) scale(${1 - distance * 0.05})`,
      width: `${cardWidth}px`,
      filter: isActive ? 'brightness(1.1)' : 'brightness(0.9)',
    };
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleChangeIndex((activeIndex + 1) % projects.length),
    onSwipedRight: () => handleChangeIndex((activeIndex - 1 + projects.length) % projects.length),
    trackMouse: true,
  });

  return (
    <Layout title="&Goliath | Projects">
      <div className="flex flex-col pb-12">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground border-b border-current-line pb-2 mt-6 mb-8">
          Projects
        </h1>

        {/* Main project display area with fixed height to prevent overlap */}
        <div className="relative" style={{ height: '300px' }} {...swipeHandlers}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg absolute w-full"
            >
              {/* Project content (same as before) */}
              <div className="flex justify-between items-start mb-4">
                <Link
                  href={projects[activeIndex].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:underline"
                >
                  <h2 className="text-xl md:text-2xl font-medium text-gray-100 hover:text-primary transition-colors">
                    <span className="text-primary">{projects[activeIndex].title.charAt(0)}</span>
                    {projects[activeIndex].title.slice(1)}
                  </h2>
                </Link>
                <span className="bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-400">
                  {activeIndex + 1} / {projects.length}
                </span>
              </div>
              <p className="text-gray-400 mb-6 text-lg">{projects[activeIndex].subtitle}</p>
              <ul className="flex flex-wrap mb-6">
                {projects[activeIndex].technologies.map((tech, techIndex) => (
                  <li
                    key={techIndex}
                    className="bg-gray-800 text-primary rounded-full px-3 py-1 mr-2 mb-2 text-sm"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end">
                <a
                  href={projects[activeIndex].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm transition-colors"
                >
                  View Project →
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Bar - positioned below the card display */}
        <div className="relative h-20 mt-2">
          <div className="absolute w-full">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="absolute top-0 h-20 bg-gray-900 rounded-md border border-gray-800 cursor-pointer transition-all duration-300 ease-out flex items-center justify-center shadow-md hover:shadow-lg"
                style={getNavigationCardStyle(index)}
                onClick={() => handleChangeIndex(index)}
                whileHover={{ y: -5 }}
              >
                <div className="p-2 text-center">
                  <span className="block font-medium text-gray-200 truncate px-2">
                    {project.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const projects: Project[] = [
    {
      title: '&Goliath',
      subtitle: 'punny personal website',
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
      githubUrl: 'https://github.com/David3748/AndGoliath',
    },
    {
      title: 'Project Two',
      subtitle: 'TBD',
      technologies: [],
      githubUrl: '',
    },
    {
      title: 'Project Three',
      subtitle: 'TBD',
      technologies: [],
      githubUrl: '',
    },
    {
      title: 'Project Four',
      subtitle: 'TBD',
      technologies: [],
      githubUrl: '',
    },
  ];

  return {
    props: {
      projects,
    },
  };
};

export default Projects;
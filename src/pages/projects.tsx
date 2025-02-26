import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // Import useEffect

interface Project {
  title: string;
  subtitle: string;
  technologies: string[];
  githubUrl: string;
}

interface ProjectsPageProps {
  projects: Project[];
}

const Projects: NextPage<ProjectsPageProps> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [basePosition, setBasePosition] = useState(0); // State for basePosition

  useEffect(() => {
    // Calculate basePosition after component mounts and window is defined
    if (typeof window !== 'undefined') {
      setBasePosition(window.innerWidth / 2 - 60); // Calculate initial basePosition
    }
  }, []); // Empty dependency array ensures this runs only once after mount


  // Get the navigation card styles for horizontal deck
  const getNavigationCardStyle = (index: number) => {
    const isActive = activeIndex === index;
    const totalProjects = projects.length;
    const cardWidth = 120; // Increased width for project names
    const selectedOffset = -20; // How much the selected card moves up

    // Calculate horizontal position
    const basePositionValue = basePosition;
    const offset = (index - activeIndex) * 60; // Increased horizontal spacing
    const centerPosition = basePositionValue + offset; // Use state basePosition


    // Calculate z-index to determine stacking order
    const distance = Math.abs(index - activeIndex);
    const zIndex = totalProjects - distance;

    return {
      left: `${centerPosition}px`,
      zIndex: zIndex,
      opacity: isActive ? 1 : 0.7 - (distance * 0.1),
      transform: isActive
        ? `translateY(${selectedOffset}px) scale(1.1)`
        : `translateY(0) scale(${1 - (distance * 0.05)})`,
      width: `${cardWidth}px`,
      filter: isActive ? 'brightness(1.1)' : 'brightness(0.9)'
    };
  };

  return (
    <Layout title="&Goliath | Projects">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="min-h-screen"
      >
        <h1 className="text-2xl md:text-3xl font-serif text-foreground border-b border-current-line pb-2 mt-8 mb-12">
          Projects
        </h1>

        {/* Main project display area */}
        <div className="mb-16">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <Link href={projects[activeIndex].githubUrl} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                <h2 className="text-xl md:text-2xl font-medium text-gray-100 hover:text-primary transition-colors">
                  <span className="text-primary">
                    {projects[activeIndex].title.charAt(0)}
                  </span>
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

            {/* View project button */}
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
        </div>

        {/* Horizontal deck navigation */}
        <div className="relative h-32 mt-8 mb-4">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="absolute top-0 h-20 bg-gray-900 rounded-md border border-gray-800 cursor-pointer transition-all duration-300 ease-out flex items-center justify-center shadow-md hover:shadow-lg"
                style={getNavigationCardStyle(index)}
                onClick={() => setActiveIndex(index)}
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

        {/* Subtle helper text */}
        <div className="text-center text-gray-500 text-sm mt-6">
          Click on the cards above to navigate between projects
        </div>
      </motion.div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  // Replace this with your actual project data fetching logic
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
    // Add more projects here
  ];

  return {
    props: {
      projects,
    },
  };
}

export default Projects;
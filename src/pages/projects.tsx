import type { NextPage } from 'next';
import Layout from '../components/Layout';
import ProjectButton, { playPressSound, playReleaseSound } from '../components/ProjectButton';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface Project {
  title: string;
  subtitle: string;
  technologies: string[];
  githubUrl: string;
  id?: string;
}

type DeckProject = Project & { id: string };

/* --------------------------------------------------------------------------
   ProjectsRow component (Row of buttons at bottom)
   ------------------------------------------------------------------------*/
const ProjectsRow: React.FC<{ projects: Project[] }> = ({ projects = [] }) => {
  const deck: DeckProject[] = projects.map((p, i) => {
    const id = `${p.title.replace(/\s+/g, '-')}-${i}`.toLowerCase();
    return { ...p, id };
  });

  const [selected, setSelected] = useState<DeckProject | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

  // Define different colors for each button - using theme colors
  const buttonColors = [
    '#B39DFF', // primary (bright purple)
    '#FF79C6', // pink/secondary
    '#8BE9FD', // cyan
    '#50FA7B', // green
    '#FFB86C', // orange
    '#F1FA8C', // yellow
  ];

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyNum = parseInt(event.key);
      if (keyNum >= 1 && keyNum <= 4 && keyNum <= deck.length) {
        event.preventDefault();
        // Only play sound if key wasn't already pressed (prevent key repeat)
        if (!pressedKeys.has(keyNum)) {
          setPressedKeys(prev => new Set(prev).add(keyNum));
          playPressSound(); // Play press sound on key down
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyNum = parseInt(event.key);
      if (keyNum >= 1 && keyNum <= 4 && keyNum <= deck.length) {
        event.preventDefault();
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyNum);
          return newSet;
        });
        
        playReleaseSound(); // Play release sound on key up
        
        // Trigger button action on key release
        const projectIndex = keyNum - 1;
        if (deck[projectIndex]) {
          setSelected(deck[projectIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [deck, pressedKeys]);

  const handleButtonClick = (proj: DeckProject, keyNumber: number) => {
    // Simulate key press visual feedback for mouse clicks
    setPressedKeys(prev => new Set(prev).add(keyNumber));
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyNumber);
        return newSet;
      });
    }, 150);
    
    setSelected(proj);
  };

  return (
    <div className="relative h-[calc(100vh-200px)] w-full overflow-hidden">
      {/* Main content area - takes up most of the space */}
      <div className="flex-1"></div>

      {/* Bottom row of buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-8 flex-wrap justify-center max-w-5xl px-4">
          {deck.map((proj, i) => {
            const keyNumber = i + 1;
            return (
              <ProjectButton
                key={proj.id}
                title={proj.title}
                keyNumber={keyNumber}
                color={buttonColors[i % buttonColors.length]}
                size="medium"
                isPressed={pressedKeys.has(keyNumber)}
                onClick={() => handleButtonClick(proj, keyNumber)}
              />
            );
          })}
        </div>
      </div>

      {/* Project description modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            className="fixed top-0 left-0 right-0 z-[900] flex justify-center pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background overlay - only covers top portion */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            
            <motion.div
              className="bg-background w-11/12 max-w-lg p-6 md:p-8 rounded-xl shadow-2xl border border-current-line relative z-10"
              initial={{ opacity: 0, scale: 0.9, y: -50 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-3 text-primary">{selected.title}</h2>
              <p className="mb-4 text-foreground/90 whitespace-pre-wrap">{selected.subtitle}</p>
              {selected.technologies.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2 text-gray-400">Technologies Used:</h4>
                  <ul className="flex flex-wrap gap-2">
                    {selected.technologies.map((tech) => (
                      <li key={tech} className="text-xs bg-gray-800 text-primary px-2.5 py-1 rounded-full">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selected.githubUrl && (
                <Link href={selected.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-primary hover:bg-primary/90 text-background font-medium px-4 py-2 rounded-md text-sm transition-colors">
                  View on GitHub →
                </Link>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-foreground transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close project details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: NextPage<ProjectsPageProps> = ({ projects }) => {
  return (
    <Layout title="&Goliath | Projects">
      <ProjectsRow projects={projects} />
    </Layout>
  );
};

export const getStaticProps = async () => {
  const projectsData: Omit<Project, 'id'>[] = [
    {
      title: '&Goliath',
      subtitle: 'punny personal website',
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
      githubUrl: 'https://github.com/David3748/AndGoliath',
    },
    {
      title: 'Are We Judgemental',
      subtitle: 'An analysis comparing UMD CS students and Redditors on AITA questions ',
      technologies: ['Python', 'pandas', 'scipy', 'numpy', 'Jupyter Notebooks', 'praw', 'Reddit API'],
      githubUrl: 'https://david3748.github.io/Are-We-Judgemental-Website/',
    },
    {
      title: 'Prediction Market',
      subtitle: 'Prediction market website for collective behavior class',
      technologies: ['React', 'Tailwind CSS', 'JavaScript', 'JSONBin.io']      ,
      githubUrl: 'https://david3748.github.io/prediction-market/',
    },
    {
        title: 'Transit Topography',
        subtitle: 'Interactive isochrone visualization showing travel time zones via public transit and walking. Uses real-time transit data from OpenStreetMap, Dijkstra\'s algorithm for pathfinding, and dynamic canvas rendering to display how far you can travel from any point in 5-minute intervals.',
        technologies: ['JavaScript', 'Leaflet.js', 'Overpass API', 'LocationIQ API', 'HTML','Tailwind CSS'],
        githubUrl: 'https://github.com/David3748/Transit-Topography', 
      },,
  ];

  return {
    props: {
      projects: projectsData,
    },
  };
};

export default ProjectsPage;
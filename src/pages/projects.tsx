import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Project {
  title: string;
  subtitle: string;
  technologies: string[];
  githubUrl: string;
  id?: string;
}

type DeckProject = Project & { id: string };

/* --------------------------------------------------------------------------
// ... existing code ...
/* --------------------------------------------------------------------------
   Helper utilities
   ------------------------------------------------------------------------*/
// Restore random positioning helpers
const randomTranslations = () => ({
    x: Math.random() * 100 - 50, // Smaller random offset relative to fan position
    y: Math.random() * 100 - 50,
});

const randomInitialTilt = () => ({
  rotateX: Math.random() * 8 - 4, // Slightly less tilt
  rotateY: Math.random() * 8 - 4,
  rotateZ: Math.random() * 4 - 2,
});

// Restore spin duration
const randomSpinDuration = () => Math.random() * 10 + 15; 

/* --------------------------------------------------------------------------
   CardDeck component (Fanning + Flying Animation)
   ------------------------------------------------------------------------*/
const CardDeck: React.FC<{ projects: Project[] }> = ({ projects = [] }) => {
  const deck: DeckProject[] = projects.map((p, i) => {
    const id = `${p.title.replace(/\s+/g, '-')}-${i}`.toLowerCase();
    return { ...p, id };
  });

  const [exploded, setExploded] = useState(false);
  const [selected, setSelected] = useState<DeckProject | null>(null);
  // Restore positions state to store random offsets/spin
  const [positions, setPositions] = useState<Record<string, { 
    x: number; y: number; 
    rotateX: number; rotateY: number; rotateZ: number; 
    spinY: number; 
  }>>({});
  // State to hold viewport width
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  // Ref for the drag constraints container
  const constraintsRef = useRef(null);

  // Effect to get viewport width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    // Set initial width
    if (typeof window !== 'undefined') {
      updateWidth();
      window.addEventListener('resize', updateWidth);
      // Cleanup listener on unmount
      return () => window.removeEventListener('resize', updateWidth);
    }
    return undefined; // Return undefined if window is not available (SSR)
  }, []);

  // Restore useEffect to set random positions/spin once
  useEffect(() => {
    const posData: typeof positions = {};
    deck.forEach((proj) => {
      posData[proj.id] = { 
        ...randomTranslations(), 
        ...randomInitialTilt(), 
        spinY: randomSpinDuration() 
      };
    });
    setPositions(posData);
  }, [projects]); // Re-calculate if projects change

  const handleCardClick = useCallback(
    (proj: DeckProject) => {
      if (!exploded) {
        setExploded(true);
        return;
      }
      setSelected(proj);
    },
    [exploded]
  );

  // Define constants for the fan layout
  const numCards = deck.length;
  const cardSpacing = 150; // Increased from 50 for more horizontal spread
  const fanAngle = 8; // Slightly increased angle for more fan
  const arcRadius = 450; // Adjust arc slightly if needed with new spacing
  const centerIndex = (numCards - 1) / 2;

  // Define card width (based on w-48 -> 12rem -> 192px) + buffer
  const cardWidth = 192;
  const buffer = 20; // Px buffer from screen edge

  return (
    <div ref={constraintsRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center" style={{ perspective: '1200px' }}>
      {/* "Click to deal" Prompt */}
      <AnimatePresence>
        {!exploded && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-[25%] text-gray-400 text-lg z-[1] pointer-events-none"
          >
            click on the orginal David Project
          </motion.p>
        )}
      </AnimatePresence>

      {deck.map((proj, i) => {
        // Get stored random positions/tilts
        const randomPos = positions[proj.id] || { x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, spinY: 15 }; // Default fallback
        const isSelected = selected?.id === proj.id;
        const indexOffset = i - centerIndex;

        // Calculate fanned position and rotation
        const targetX = indexOffset * cardSpacing;
        // Calculate Y based on an arc. Using cosine: 0 offset is lowest point.
        const angleRad = (indexOffset * fanAngle * Math.PI) / 180; // Basic angle for rotation
        // More pronounced arc: targetY = -Math.abs(indexOffset) * 20; // Example simple V shape
        // Cosine arc: Higher value means lower Y position in this setup
        const targetY = -arcRadius * (1 - Math.cos(angleRad * 0.5)); // Adjust multiplier (0.5) for arc shape
        const targetRotateZ = indexOffset * fanAngle;

        // --- Boundary Clamping Logic --- 
        let finalX = targetX + randomPos.x;
        let finalY = targetY + randomPos.y;
        let yOffset = 0;

        if (viewportWidth > 0) { // Only clamp if viewport width is known
            const maxHorizontalDisplacement = (viewportWidth / 2) - (cardWidth / 2) - buffer;
            const intendedX = targetX + randomPos.x; // Where card wants to go horizontally

            if (Math.abs(intendedX) > maxHorizontalDisplacement) {
                const clampedX = Math.sign(intendedX) * maxHorizontalDisplacement;
                const excessX = Math.abs(intendedX) - maxHorizontalDisplacement;
                // Apply vertical offset based on excess horizontal distance
                // Move card further up the more it's pushed out - adjust multiplier as needed
                yOffset = -excessX * 0.4; 
                finalX = clampedX; // Use clamped horizontal position
            }
        }
        // Apply calculated yOffset to the final Y position
        finalY = targetY + randomPos.y + yOffset;
        // --- End Boundary Clamping Logic ---

        return (
          <motion.div
            key={proj.id}
            layoutId={proj.id}
            className="absolute cursor-pointer select-none"
            style={{ transformStyle: 'preserve-3d' }}
            initial={{
              x: i * 4,          // Increased horizontal offset per card
              y: -i * 4,         // Increased vertical offset per card
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,        // Keep initial Z rotation 0 for clean stack
              zIndex: deck.length - i // Keep zIndex layering
            }}
            animate={
              exploded
                ? isSelected
                  ? { // Selected state: Neutral position (same as before)
                      x: 0,
                      y: -100, // Raise it slightly
                      rotateX: 0,
                      rotateY: 0, // Ensure it faces forward
                      rotateZ: 0,
                      zIndex: 999,
                      scale: 1.1,
                    }
                  : { // Fanned out + Flying state (NO SPIN - FRONT FACING)
                      // Use clamped/adjusted positions
                      x: finalX,
                      y: finalY,
                      // Apply random tilt
                      rotateX: randomPos.rotateX,
                      // Keep card face up (Set to 180 degrees)
                      rotateY: 180,
                      // Combine Fan angle with Random tilt
                      rotateZ: targetRotateZ + randomPos.rotateZ,
                      zIndex: i,
                      scale: 1,
                    }
                : { x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, zIndex: deck.length - i }
            }
            transition={
              exploded
                ? { // Spring for initial fan-out/selection
                    // Apply spring to position and tilt changes - INCREASED STIFFNESS
                    x: { type: 'spring', stiffness: 180, damping: 20, delay: i * 0.02 }, // Faster spring
                    y: { type: 'spring', stiffness: 180, damping: 20, delay: i * 0.02 }, // Faster spring
                    rotateX: { type: 'spring', stiffness: 180, damping: 20, delay: i * 0.02 }, // Faster spring
                    rotateZ: { type: 'spring', stiffness: 180, damping: 20, delay: i * 0.02 }, // Faster spring
                    scale: { type: 'spring', stiffness: 180, damping: 20 }, // Faster selection scale
                    // RotateY now uses the same spring transition when moving between states
                    rotateY: { type: 'spring', stiffness: 180, damping: 20 }, // Spring to 0 when selected/unselected
                  }
                : { type: 'spring', stiffness: 230, damping: 24 }
            }
            drag={exploded && !isSelected}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            whileDrag={{ zIndex: 1000, scale: 1.05 }}
            whileHover={!isSelected ? { scale: 1.08, y: finalY - 10, zIndex: 998 } : {}}
            onClick={() => handleCardClick(proj)}
          >
            <div className="relative w-48 h-64 rounded-lg shadow-xl" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 w-full h-full bg-gray-700 border border-current-line rounded-lg flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: 'hidden' }} draggable={false}>
                <img src="/card-back-themed.png" alt="Card back" className="w-full h-full object-cover opacity-60" />
              </div>
              <div
                className="absolute inset-0 bg-background border border-current-line rounded-lg flex flex-col items-center justify-center text-foreground p-4 text-center"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden'
                }}
                aria-hidden
              >
                <h3 className="text-md font-semibold mb-2 text-primary">{proj.title}</h3>
                <p className="text-xs text-foreground/80 px-1 line-clamp-3">{proj.subtitle}</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[900]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              layoutId={selected.id}
              className="bg-background w-11/12 max-w-lg p-6 md:p-8 rounded-xl shadow-2xl border border-current-line relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
      <CardDeck projects={projects} />
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
      title: 'Project Four',
      subtitle: 'TBD',
      technologies: [],
      githubUrl: '',
    },
  ];

  return {
    props: {
      projects: projectsData,
    },
  };
};

export default ProjectsPage;
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Project {
  title: string;
  subtitle: string;
  technologies: string[];
  githubUrl: string;
  id?: string;
}

interface ProjectsGalleryProps {
  projects: Project[];
}

const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to active item
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const activeItem = container.children[activeIndex] as HTMLElement;
      
      if (activeItem) {
        const scrollLeft = activeItem.offsetLeft - (container.clientWidth / 2) + (activeItem.clientWidth / 2);
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className="relative w-full h-screen flex flex-col justify-center overflow-hidden bg-[#0F111D]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mb-8 px-8 md:px-16">
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
          The Gallery
        </h2>
        <p className="text-gray-400 text-lg max-w-xl">
          A curated collection of digital experiments and tools.
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="flex gap-8 px-[50vw] overflow-x-auto snap-x snap-mandatory no-scrollbar py-12 items-center h-[60vh]"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={project.title}
              className={`relative flex-shrink-0 w-[80vw] md:w-[600px] h-[400px] md:h-[500px] rounded-3xl overflow-hidden snap-center cursor-pointer transition-all duration-500 border border-white/10 ${
                isActive ? 'scale-100 opacity-100 shadow-2xl shadow-primary/20' : 'scale-90 opacity-50 hover:opacity-70'
              }`}
              onClick={() => setActiveIndex(index)}
              layout
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-[#1A1D2E] bg-opacity-90 backdrop-blur-xl">
                {/* Abstract decorative shapes based on index */}
                <div className={`absolute top-0 right-0 w-full h-full opacity-20 bg-gradient-to-br ${
                  index % 3 === 0 ? 'from-primary to-transparent' : 
                  index % 3 === 1 ? 'from-secondary to-transparent' : 
                  'from-cyan to-transparent'
                }`} />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col p-8 md:p-12">
                <div className="flex-1">
                  <motion.div 
                    className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10"
                  >
                    <span className="text-3xl font-bold text-white">
                      {project.title.charAt(0)}
                    </span>
                  </motion.div>
                  
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif">
                    {project.title}
                  </h3>
                  
                  <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-md">
                    {project.subtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.githubUrl && (
                    <Link 
                      href={project.githubUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors group w-fit"
                    >
                      <span className="font-medium">View Project</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-primary w-8' : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGallery;

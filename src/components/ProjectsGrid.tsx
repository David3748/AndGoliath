import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Project {
    title: string;
    subtitle: string;
    technologies: string[];
    githubUrl: string;
    imageUrl?: string;
    id?: string;
}

interface ProjectsGridProps {
    projects: Project[];
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
    return (
        <div className="min-h-screen bg-[#0F111D] py-24 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Projects
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#1A1D2E] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors duration-300 flex flex-col h-full"
                        >
                            {/* Card Header/Visual */}
                            <div className={`h-64 w-full relative overflow-hidden bg-gradient-to-br ${index % 4 === 0 ? 'from-primary/20 to-purple-900/20' :
                                index % 4 === 1 ? 'from-secondary/20 to-pink-900/20' :
                                    index % 4 === 2 ? 'from-cyan/20 to-blue-900/20' :
                                        'from-green/20 to-emerald-900/20'
                                }`}>
                                {project.imageUrl ? (
                                    <div className="absolute inset-0">
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-110 transform">
                                        <span className="text-9xl font-serif font-bold text-white mix-blend-overlay select-none">
                                            {project.title.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Overlay Link */}
                                {project.githubUrl && (
                                    <Link
                                        href={project.githubUrl}
                                        target="_blank"
                                        className="absolute inset-0 z-10"
                                        aria-label={`View ${project.title}`}
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors z-20"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </a>
                                    )}
                                </div>

                                <p className="text-gray-400 text-base leading-relaxed mb-6 flex-1">
                                    {project.subtitle}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.technologies.map(tech => (
                                        <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsGrid;

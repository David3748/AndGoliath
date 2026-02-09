import type { NextPage } from 'next';
import Layout from '../components/Layout';
import ProjectsGrid from '../components/ProjectsGrid';
import React from 'react';

export interface Project {
  title: string;
  subtitle: string;
  technologies: string[];
  githubUrl: string;
  imageUrl?: string;
  id?: string;
}

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: NextPage<ProjectsPageProps> = ({ projects }) => {
  return (
    <Layout title="&Goliath | Projects">
      <div className="min-h-screen">
        <ProjectsGrid projects={projects} />
      </div>
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
      imageUrl: '/images/andgoliath.svg',
    },
    {
      title: 'Are We Judgemental',
      subtitle: 'An analysis comparing UMD CS students and Redditors on AITA questions ',
      technologies: ['Python', 'pandas', 'scipy', 'numpy', 'Jupyter Notebooks', 'praw', 'Reddit API'],
      githubUrl: 'https://david3748.github.io/Are-We-Judgemental-Website/',
      imageUrl: '/images/are-we-judgemental.png',
    },
{
      title: 'Transit Topography',
      subtitle: 'Isochrome maps of Transit Times',
      technologies: ['JavaScript', 'Leaflet.js', 'Overpass API', 'LocationIQ API', 'HTML', 'Tailwind CSS'],
      githubUrl: 'https://david3748.github.io/Transit-Topography',
      imageUrl: '/images/transit-topography.png',
    },
  ];

  return {
    props: {
      projects: projectsData,
    },
  };
};

export default ProjectsPage;
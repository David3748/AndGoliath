import React, { useEffect, useState, useMemo } from 'react';

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

interface WaterfallTheme {
  image: string;
  // Background / overlay
  bg: string;
  bg2: string;
  overlayStart: string;
  overlayEnd: string;
  glow: string;
  warmGlow: string;
  // Surface (card backgrounds) – translucent
  surface: string;
  surface2: string;
  // Text
  fg: string;
  dim: string;
  muted: string;
  // Accents
  line: string;
  primary: string;
  accent: string;
  // Header / footer
  headerBg: string;
  headerBorder: string;
  headerInset: string;
  footerBorder: string;
  footerBg: string;
}

const THEMES: Record<string, WaterfallTheme> = {
  'senju-2.jpg': {
    // Charcoal / ash monochrome
    image: '/images/waterfalls/senju-2.jpg',
    bg: '#1a1918',
    bg2: '#232220',
    overlayStart: 'rgba(26, 25, 24, 0.90)',
    overlayEnd: 'rgba(18, 17, 16, 0.96)',
    glow: 'rgba(200, 198, 195, 0.14)',
    warmGlow: 'rgba(180, 175, 168, 0.08)',
    surface: 'rgba(42, 40, 38, 0.55)',
    surface2: 'rgba(32, 30, 28, 0.65)',
    fg: '#f0eeeb',
    dim: '#b8b4ae',
    muted: '#8a8680',
    line: 'rgba(120, 116, 110, 0.30)',
    primary: '#d8d4ce',
    accent: '#c4bfb6',
    headerBg: 'rgba(26, 25, 24, 0.55)',
    headerBorder: 'rgba(216, 212, 206, 0.12)',
    headerInset: 'rgba(240, 238, 235, 0.05)',
    footerBorder: 'rgba(216, 212, 206, 0.14)',
    footerBg: 'rgba(26, 25, 24, 0.42)',
  },
  'senju-3.jpg': {
    // Warm rose / umber
    image: '/images/waterfalls/senju-3.jpg',
    bg: '#2b1a1a',
    bg2: '#3d2222',
    overlayStart: 'rgba(45, 24, 24, 0.88)',
    overlayEnd: 'rgba(28, 14, 14, 0.95)',
    glow: 'rgba(220, 160, 155, 0.16)',
    warmGlow: 'rgba(200, 140, 130, 0.12)',
    surface: 'rgba(70, 40, 38, 0.50)',
    surface2: 'rgba(50, 28, 26, 0.62)',
    fg: '#f5e8e6',
    dim: '#d4b0aa',
    muted: '#a88078',
    line: 'rgba(180, 130, 120, 0.32)',
    primary: '#e8c4bc',
    accent: '#e0b8a8',
    headerBg: 'rgba(45, 24, 24, 0.55)',
    headerBorder: 'rgba(232, 196, 188, 0.14)',
    headerInset: 'rgba(245, 232, 230, 0.05)',
    footerBorder: 'rgba(232, 196, 188, 0.16)',
    footerBg: 'rgba(45, 24, 24, 0.42)',
  },
  'senju-4.jpg': {
    // Indigo / blue-purple (current)
    image: '/images/waterfalls/senju-4.jpg',
    bg: '#121026',
    bg2: '#1a1730',
    overlayStart: 'rgba(18, 16, 38, 0.88)',
    overlayEnd: 'rgba(14, 12, 30, 0.94)',
    glow: 'rgba(160, 155, 210, 0.15)',
    warmGlow: 'rgba(190, 185, 210, 0.10)',
    surface: 'rgba(40, 35, 70, 0.52)',
    surface2: 'rgba(28, 25, 55, 0.62)',
    fg: '#f0eef5',
    dim: '#b8b3c8',
    muted: '#8a84a0',
    line: 'rgba(140, 135, 180, 0.30)',
    primary: '#c9c3db',
    accent: '#d4cfc0',
    headerBg: 'rgba(18, 16, 38, 0.55)',
    headerBorder: 'rgba(201, 195, 219, 0.14)',
    headerInset: 'rgba(240, 238, 245, 0.06)',
    footerBorder: 'rgba(201, 195, 219, 0.16)',
    footerBg: 'rgba(18, 16, 38, 0.42)',
  },
  'senju-5.jpg': {
    // Slate / muted brick
    image: '/images/waterfalls/senju-5.jpg',
    bg: '#1f1c1c',
    bg2: '#2a2626',
    overlayStart: 'rgba(32, 28, 28, 0.90)',
    overlayEnd: 'rgba(20, 16, 16, 0.96)',
    glow: 'rgba(180, 160, 158, 0.13)',
    warmGlow: 'rgba(160, 120, 115, 0.09)',
    surface: 'rgba(48, 42, 42, 0.55)',
    surface2: 'rgba(36, 30, 30, 0.65)',
    fg: '#f0eceb',
    dim: '#c0b4b0',
    muted: '#948884',
    line: 'rgba(140, 128, 124, 0.30)',
    primary: '#d8d0cc',
    accent: '#c8b8b0',
    headerBg: 'rgba(32, 28, 28, 0.55)',
    headerBorder: 'rgba(216, 208, 204, 0.12)',
    headerInset: 'rgba(240, 236, 235, 0.05)',
    footerBorder: 'rgba(216, 208, 204, 0.14)',
    footerBg: 'rgba(32, 28, 28, 0.42)',
  },
  'senju-7.jpg': {
    // Sage / olive
    image: '/images/waterfalls/senju-7.jpg',
    bg: '#1a2018',
    bg2: '#242c22',
    overlayStart: 'rgba(26, 32, 24, 0.88)',
    overlayEnd: 'rgba(16, 22, 14, 0.94)',
    glow: 'rgba(160, 190, 165, 0.14)',
    warmGlow: 'rgba(170, 185, 155, 0.10)',
    surface: 'rgba(42, 52, 40, 0.52)',
    surface2: 'rgba(30, 38, 28, 0.62)',
    fg: '#eef2ec',
    dim: '#b8c4b0',
    muted: '#889880',
    line: 'rgba(130, 150, 120, 0.30)',
    primary: '#c8d4c0',
    accent: '#d0d4b8',
    headerBg: 'rgba(26, 32, 24, 0.55)',
    headerBorder: 'rgba(200, 212, 192, 0.14)',
    headerInset: 'rgba(238, 242, 236, 0.06)',
    footerBorder: 'rgba(200, 212, 192, 0.16)',
    footerBg: 'rgba(26, 32, 24, 0.42)',
  },
  'senju-8.jpg': {
    // Gold / amber
    image: '/images/waterfalls/senju-8.jpg',
    bg: '#2a2418',
    bg2: '#383020',
    overlayStart: 'rgba(42, 36, 24, 0.85)',
    overlayEnd: 'rgba(26, 22, 14, 0.92)',
    glow: 'rgba(230, 200, 130, 0.18)',
    warmGlow: 'rgba(220, 190, 110, 0.14)',
    surface: 'rgba(60, 52, 36, 0.48)',
    surface2: 'rgba(44, 38, 26, 0.58)',
    fg: '#f5f0e4',
    dim: '#d8cca8',
    muted: '#b0a078',
    line: 'rgba(180, 160, 110, 0.32)',
    primary: '#ecdca0',
    accent: '#e8d8a0',
    headerBg: 'rgba(42, 36, 24, 0.55)',
    headerBorder: 'rgba(236, 220, 160, 0.16)',
    headerInset: 'rgba(245, 240, 228, 0.06)',
    footerBorder: 'rgba(236, 220, 160, 0.18)',
    footerBg: 'rgba(42, 36, 24, 0.42)',
  },
  'senju-9.jpg': {
    // Lavender / periwinkle
    image: '/images/waterfalls/senju-9.jpg',
    bg: '#1a1a2e',
    bg2: '#222240',
    overlayStart: 'rgba(26, 26, 46, 0.88)',
    overlayEnd: 'rgba(16, 16, 32, 0.94)',
    glow: 'rgba(170, 170, 220, 0.15)',
    warmGlow: 'rgba(180, 175, 210, 0.10)',
    surface: 'rgba(45, 45, 80, 0.52)',
    surface2: 'rgba(32, 32, 60, 0.62)',
    fg: '#f0f0f8',
    dim: '#c0c0dc',
    muted: '#9090b8',
    line: 'rgba(140, 140, 190, 0.30)',
    primary: '#d0d0ec',
    accent: '#c8c8e0',
    headerBg: 'rgba(26, 26, 46, 0.55)',
    headerBorder: 'rgba(208, 208, 236, 0.14)',
    headerInset: 'rgba(240, 240, 248, 0.06)',
    footerBorder: 'rgba(208, 208, 236, 0.16)',
    footerBg: 'rgba(26, 26, 46, 0.42)',
  },
};

const WATERFALL_KEYS = Object.keys(THEMES);

const projectKind = (title: string) => {
  if (title === '&Goliath') return 'Site';
  if (title === 'MMOthello') return 'Game';
  if (title === 'Are We Judgemental') return 'Analysis';
  if (title === 'Transit Topography') return 'Map';
  return 'Project';
};

const imagePosition = (title: string) => {
  if (title === 'Transit Topography') return '62% 52%';
  if (title === 'Are We Judgemental') return '50% 42%';
  if (title === 'MMOthello') return '50% 45%';
  return 'center';
};

const imageFit = (title: string) => (title === '&Goliath' ? 'contain' : 'cover');

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const [key, setKey] = useState<string>(WATERFALL_KEYS[0]);
  const [mounted, setMounted] = useState(false);

  const theme = useMemo(() => THEMES[key], [key]);

  useEffect(() => {
    const randomKey = WATERFALL_KEYS[Math.floor(Math.random() * WATERFALL_KEYS.length)];
    setKey(randomKey);
    setMounted(true);
  }, []);

  useEffect(() => {
    const className = 'projects-marine-theme';
    document.body.classList.add(className);
    const root = document.documentElement;
    root.style.setProperty('--pr-bg-image', `url('${theme.image}')`);
    root.style.setProperty('--pr-overlay-start', theme.overlayStart);
    root.style.setProperty('--pr-overlay-end', theme.overlayEnd);
    root.style.setProperty('--pr-glow', theme.glow);
    root.style.setProperty('--pr-warm-glow', theme.warmGlow);
    root.style.setProperty('--pr-surface', theme.surface);
    root.style.setProperty('--pr-surface-2', theme.surface2);
    root.style.setProperty('--pr-fg', theme.fg);
    root.style.setProperty('--pr-dim', theme.dim);
    root.style.setProperty('--pr-muted', theme.muted);
    root.style.setProperty('--pr-line', theme.line);
    root.style.setProperty('--pr-primary', theme.primary);
    root.style.setProperty('--pr-accent', theme.accent);
    root.style.setProperty('--pr-header-bg', theme.headerBg);
    root.style.setProperty('--pr-header-border', theme.headerBorder);
    root.style.setProperty('--pr-header-inset', theme.headerInset);
    root.style.setProperty('--pr-footer-border', theme.footerBorder);
    root.style.setProperty('--pr-footer-bg', theme.footerBg);
    return () => {
      document.body.classList.remove(className);
      const props = [
        '--pr-bg-image','--pr-overlay-start','--pr-overlay-end','--pr-glow',
        '--pr-warm-glow','--pr-surface','--pr-surface-2','--pr-fg','--pr-dim',
        '--pr-muted','--pr-line','--pr-primary','--pr-accent','--pr-header-bg',
        '--pr-header-border','--pr-header-inset','--pr-footer-border','--pr-footer-bg',
      ];
      props.forEach((p) => root.style.removeProperty(p));
    };
  }, [theme]);

  return (
    <div className="project-room">
      <div className="project-page">
        <header className="project-head">
          <h1>Projects</h1>
        </header>

        <section className="project-stack">
          {projects.map((project, index) => (
            <a
              key={project.title}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card ${index === 0 ? 'wide tilt-r' : index === 1 ? 'tilt-l' : ''}`}
            >
              <span className="corner" aria-hidden />
              <div className="meta">
                <span>
                  {String(index + 1).padStart(2, '0')} · {projectKind(project.title)}
                </span>
                <span className="launch">Open →</span>
              </div>

              <div className="project-image">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={{
                      objectPosition: imagePosition(project.title),
                      objectFit: imageFit(project.title),
                    }}
                    className={project.title === '&Goliath' ? 'logo-image' : ''}
                  />
                ) : (
                  <span>{project.title.charAt(0)}</span>
                )}
              </div>

              <div className="copy">
                <h2>{project.title}</h2>
                <p className="dek">{project.subtitle}</p>
              </div>

              <div className="foot">
                <div className="tag-row">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.technologies.length > 4 && (
                  <span className="more">+{project.technologies.length - 4}</span>
                )}
              </div>
            </a>
          ))}
        </section>
      </div>

      <style jsx>{`
        .project-room {
          --pr-image-filter: saturate(0.92) brightness(0.78) contrast(1.08);

          width: 100vw;
          min-height: calc(100vh - 4rem);
          margin: -2rem calc(50% - 50vw) -2rem;
          color: var(--pr-fg);
          background:
            radial-gradient(circle at 82% 0, var(--pr-glow), transparent 34%),
            radial-gradient(circle at 12% 16%, var(--pr-warm-glow), transparent 28%),
            linear-gradient(180deg, var(--pr-overlay-start), var(--pr-overlay-end)),
            var(--pr-bg-image) center center / cover no-repeat;
          overflow: hidden;
        }

        .project-page {
          max-width: min(1180px, 100%);
          min-height: inherit;
          margin: 0 auto;
          padding: clamp(44px, 7vw, 76px) clamp(20px, 5vw, 48px) clamp(72px, 10vw, 112px);
        }

        .project-head {
          margin-bottom: clamp(32px, 5vw, 56px);
        }

        h1 {
          margin: 0;
          color: var(--pr-primary);
          font-family: Merriweather, "IBM Plex Serif", Georgia, serif;
          font-size: clamp(60px, 9vw, 112px);
          font-weight: 300;
          line-height: 0.95;
          text-shadow: 0 2px 24px rgba(0,0,0,0.35);
        }

        .project-stack {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: clamp(16px, 2.5vw, 28px);
          align-items: stretch;
        }

        .project-card {
          grid-column: span 4;
          position: relative;
          display: flex;
          min-height: 410px;
          flex-direction: column;
          gap: 14px;
          padding: clamp(18px, 2.4vw, 26px);
          color: var(--pr-fg);
          text-decoration: none;
          background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--pr-surface) 90%, white 10%),
            var(--pr-surface-2)
          );
          border: 1px solid var(--pr-line);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 18px 42px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(14px) saturate(1.15);
          -webkit-backdrop-filter: blur(14px) saturate(1.15);
          transition: transform 220ms cubic-bezier(.2, .8, .2, 1), border-color 180ms, box-shadow 220ms;
        }

        .project-card.wide {
          grid-column: span 6;
        }

        .project-card:hover {
          transform: translateY(-4px) rotate(0deg) !important;
          border-color: var(--pr-primary);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 24px 56px rgba(0, 0, 0, 0.30);
          z-index: 2;
        }

        .project-card.tilt-l {
          transform: rotate(-0.45deg);
        }

        .project-card.tilt-r {
          transform: rotate(0.35deg);
        }

        .corner {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
          background:
            linear-gradient(225deg, var(--pr-overlay-start) 50%, transparent 50%),
            linear-gradient(225deg, var(--pr-line) 50%, transparent 50%);
        }

        .meta,
        .foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: var(--pr-muted);
          font-family: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .launch,
        .more {
          color: var(--pr-accent);
          white-space: nowrap;
        }

        .project-image {
          position: relative;
          height: clamp(150px, 20vw, 220px);
          overflow: hidden;
          border: 1px solid var(--pr-line);
          background: color-mix(in srgb, var(--pr-overlay-start) 60%, black 40%);
        }

        .project-image img {
          width: 100%;
          height: 100%;
          filter: var(--pr-image-filter);
          transition: transform 500ms ease, filter 220ms ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.035);
          filter: saturate(1) brightness(0.86) contrast(1.08);
        }

        .project-image .logo-image {
          padding: clamp(26px, 5vw, 54px);
        }

        .project-image span {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: var(--pr-primary);
          font-family: Merriweather, Georgia, serif;
          font-size: 80px;
        }

        .copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        h2 {
          margin: 0;
          color: var(--pr-fg);
          font-family: Merriweather, "IBM Plex Serif", Georgia, serif;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 400;
          line-height: 1.05;
        }

        .dek {
          margin: 0;
          color: var(--pr-dim);
          font-family: Merriweather, "IBM Plex Serif", Georgia, serif;
          font-size: 15px;
          font-style: italic;
          line-height: 1.55;
        }

        .foot {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px dashed var(--pr-line);
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag {
          border: 1px solid var(--pr-line);
          background: rgba(255, 255, 255, 0.04);
          color: var(--pr-dim);
          padding: 3px 8px;
          font-size: 9px;
          letter-spacing: 0.13em;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 1040px) {
          .project-card,
          .project-card.wide {
            grid-column: span 6;
          }
        }

        @media (max-width: 820px) {
          .project-room {
            margin-top: -2rem;
          }

          .project-card,
          .project-card.wide {
            grid-column: span 12;
            min-height: auto;
          }

          .project-card.tilt-l,
          .project-card.tilt-r {
            transform: none;
          }
        }

        @media (min-width: 768px) {
          .project-room {
            min-height: calc(100vh - 5rem);
            margin-top: -2.5rem;
            margin-bottom: -2.5rem;
          }
        }
      `}</style>
      <style jsx global>{`
        body.projects-marine-theme {
          background:
            radial-gradient(circle at 82% 0, var(--pr-glow), transparent 34%),
            radial-gradient(circle at 12% 16%, var(--pr-warm-glow), transparent 28%),
            linear-gradient(180deg, var(--pr-overlay-start), var(--pr-overlay-end)),
            var(--pr-bg-image) center center / cover no-repeat !important;
        }

        body.projects-marine-theme .site-shell,
        body.projects-marine-theme .site-main {
          background: transparent !important;
        }

        body.projects-marine-theme .site-header {
          background: var(--pr-header-bg) !important;
          background-image: none !important;
          border-bottom: 1px solid var(--pr-header-border) !important;
          box-shadow:
            inset 0 1px 0 var(--pr-header-inset),
            0 8px 32px rgba(0, 0, 0, 0.18) !important;
          backdrop-filter: blur(18px) saturate(1.25);
          -webkit-backdrop-filter: blur(18px) saturate(1.25);
        }

        body.projects-marine-theme .site-footer {
          border-top-color: var(--pr-footer-border) !important;
          background: var(--pr-footer-bg);
        }
      `}</style>
    </div>
  );
};

export default ProjectsGrid;

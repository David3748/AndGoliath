import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface PageNode {
  name: string;
  path: string;
  description: string;
}

interface Connection {
  from: string;
  to: string;
}

interface PositionedPage extends PageNode {
  x: number;
  y: number;
}

const centerPage: PageNode = { name: 'Home', path: '/', description: 'you are here' };

const outerPages: PageNode[] = [
  { name: 'Favorites', path: '/favorites', description: 'things I like' },
  { name: 'Gallery', path: '/gallery', description: 'photos' },
  { name: 'Writing', path: '/writing', description: 'essays & thoughts' },
  { name: 'Projects', path: '/projects', description: "things I'm building" },
  { name: 'AndGo', path: '/andgo', description: 'go game' },
  { name: 'Resume', path: '/resume', description: 'work history' },
];

const pagesData: PageNode[] = [centerPage, ...outerPages];

const connectionsData: Connection[] = [
  // Center to all outer
  { from: '/', to: '/favorites' },
  { from: '/', to: '/gallery' },
  { from: '/', to: '/writing' },
  { from: '/', to: '/projects' },
  { from: '/', to: '/andgo' },
  { from: '/', to: '/resume' },
  // Outer ring
  { from: '/favorites', to: '/gallery' },
  { from: '/gallery', to: '/writing' },
  { from: '/writing', to: '/projects' },
  { from: '/projects', to: '/andgo' },
  { from: '/andgo', to: '/resume' },
  { from: '/resume', to: '/favorites' },
  // Star diagonals across outer ring
  { from: '/favorites', to: '/writing' },
  { from: '/favorites', to: '/projects' },
  { from: '/favorites', to: '/andgo' },
  { from: '/gallery', to: '/projects' },
  { from: '/gallery', to: '/andgo' },
  { from: '/gallery', to: '/resume' },
  { from: '/writing', to: '/andgo' },
  { from: '/writing', to: '/resume' },
  { from: '/projects', to: '/resume' },
];

function calculatePositions(width: number, height: number): PositionedPage[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  const positions: PositionedPage[] = [
    { ...centerPage, x: centerX, y: centerY },
  ];

  outerPages.forEach((page, i) => {
    const angle = -Math.PI / 2 + (i / outerPages.length) * Math.PI * 2;
    positions.push({
      ...page,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  });

  return positions;
}

export default function SiteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<PositionedPage[]>([]);
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const calculateLayout = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = width;
    setDimensions({ width, height });
    setPositions(calculatePositions(width, height));
  }, []);

  useEffect(() => {
    calculateLayout();
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateLayout, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [calculateLayout]);

  const connectionLines = useMemo(() => {
    const lines: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      key: string;
      active: boolean;
    }[] = [];

    for (const conn of connectionsData) {
      const fromPage = positions.find((p) => p.path === conn.from);
      const toPage = positions.find((p) => p.path === conn.to);

      if (fromPage && toPage) {
        const isActive =
          hoveredPage === conn.from || hoveredPage === conn.to;
        lines.push({
          x1: fromPage.x,
          y1: fromPage.y,
          x2: toPage.x,
          y2: toPage.y,
          key: `${conn.from}-${conn.to}`,
          active: isActive,
        });
      }
    }

    return lines;
  }, [positions, hoveredPage]);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

  return (
    <div className="w-full flex items-center justify-center min-h-[50vh]">
      <div
        ref={containerRef}
        className="relative w-full rounded-xl border border-gray-800/60 overflow-hidden"
        style={{ height: dimensions.width || 300 }}
      >
        {/* SVG layer for connections and dots */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {dimensions.width > 0 && (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#94A3B8"
              strokeWidth={0.5}
              opacity={0.08}
              strokeDasharray="4 8"
            />
          )}

          {connectionLines.map((line) => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.active ? '#B39DFF' : '#94A3B8'}
              strokeWidth={line.active ? 1.5 : 0.6}
              opacity={line.active ? 0.6 : 0.45}
              className="transition-all duration-300"
            />
          ))}

          {positions.map((page) => (
            <circle
              key={`${page.path}-dot`}
              cx={page.x}
              cy={page.y}
              r={page.path === '/' ? 4 : 3}
              fill="#94A3B8"
              opacity={hoveredPage === page.path ? 0.7 : 0.35}
              className="transition-opacity duration-300"
            />
          ))}
        </svg>

        {/* HTML text labels */}
        {positions.map((page) => {
          const isHighlighted =
            hoveredPage &&
            (page.path === hoveredPage ||
              connectionsData.some(
                (c) =>
                  (c.from === hoveredPage && c.to === page.path) ||
                  (c.to === hoveredPage && c.from === page.path)
              ));
          const isCurrentHovered = hoveredPage === page.path;

          return (
            <Link
              key={page.path}
              href={page.path}
              className={`
                absolute flex flex-col items-center gap-0.5
                text-center no-underline transition-colors duration-200
                ${page.path === '/' ? 'font-semibold text-gray-100' : 'text-gray-300'}
                ${isHighlighted || isCurrentHovered ? 'text-primary' : ''}
              `}
              style={{
                left: page.x,
                top: page.y,
                transform: 'translate(-50%, -50%)',
                fontSize: page.path === '/' ? '0.85rem' : '0.75rem',
                zIndex: 1,
                padding: '0.5rem',
              }}
              onMouseEnter={() => setHoveredPage(page.path)}
              onMouseLeave={() => setHoveredPage(null)}
            >
              <span
                className="font-medium tracking-tight transition-transform duration-200"
                style={{
                  transform: isCurrentHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {page.name}
              </span>
              {page.description && (
                <span
                  className="text-[0.65em] whitespace-nowrap transition-all duration-200"
                  style={{
                    opacity: isHighlighted || isCurrentHovered ? 0.6 : 0,
                    transform:
                      isHighlighted || isCurrentHovered
                        ? 'translateY(0)'
                        : 'translateY(-4px)',
                  }}
                >
                  {page.description}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

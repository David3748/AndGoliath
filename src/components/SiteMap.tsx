import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

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
  { from: '/', to: '/favorites' },
  { from: '/', to: '/gallery' },
  { from: '/', to: '/writing' },
  { from: '/', to: '/projects' },
  { from: '/', to: '/andgo' },
  { from: '/', to: '/resume' },
  { from: '/favorites', to: '/gallery' },
  { from: '/gallery', to: '/writing' },
  { from: '/writing', to: '/projects' },
  { from: '/projects', to: '/andgo' },
  { from: '/andgo', to: '/resume' },
  { from: '/resume', to: '/favorites' },
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

const WIND_UP_MS = 350;
const HOLD_MS = 120;
const LAUNCH_SPEED = 1200;
const AIR_FRICTION = 0.995;
const NAV_DELAY_MS = 600;

export default function SiteMap() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<PositionedPage[]>([]);
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [firing, setFiring] = useState<{
    path: string;
    phase: 'windup' | 'hold' | 'launch';
    x: number;
    y: number;
    vx: number;
    vy: number;
    progress: number;
    exited: boolean;
    anchor: { x: number; y: number };
    center: { x: number; y: number };
    // viewport offset of the container at animation start
    containerOffset: { x: number; y: number };
  } | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const navigatedRef = useRef(false);

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

  useEffect(() => () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  const getNodePosition = (path: string) => {
    return positions.find((p) => p.path === path) ?? null;
  };

  const getPouchPosition = (path: string) => {
    if (!firing || firing.path !== path) return null;
    const { progress, phase, anchor, center, x, y } = firing;

    if (phase === 'launch') {
      return {
        x,
        y,
        scale: Math.max(0.3, 1.3 - progress * 0.9),
        opacity: Math.max(0, 1 - progress * 0.9),
      };
    }

    const dx = anchor.x - center.x;
    const dy = anchor.y - center.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dx / len;
    const ny = dy / len;

    if (phase === 'windup') {
      const eased = 1 - Math.pow(1 - progress, 3);
      const pullDist = len * 0.35 * eased;
      return {
        x: anchor.x + nx * pullDist,
        y: anchor.y + ny * pullDist,
        scale: 1 + eased * 0.3,
        opacity: 1,
      };
    } else {
      const pullDist = len * 0.35;
      return {
        x: anchor.x + nx * pullDist,
        y: anchor.y + ny * pullDist,
        scale: 1.3,
        opacity: 1,
      };
    }
  };

  const connectionLines = useMemo(() => {
    const lines: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      key: string;
      active: boolean;
      isElastic: boolean;
      elasticPhase: 'windup' | 'hold' | 'launch' | null;
      elasticProgress: number;
    }[] = [];

    const pouch = firing ? getPouchPosition(firing.path) : null;

    for (const conn of connectionsData) {
      const fromPage = getNodePosition(conn.from);
      const toPage = getNodePosition(conn.to);
      if (!fromPage || !toPage) continue;

      const isActive = hoveredPage === conn.from || hoveredPage === conn.to;

      const touchesFiring =
        firing && (conn.from === firing.path || conn.to === firing.path);

      if (touchesFiring && pouch && !firing.exited) {
        const otherPath = conn.from === firing.path ? conn.to : conn.from;
        const otherPage = getNodePosition(otherPath);
        if (!otherPage) continue;

        lines.push({
          x1: otherPage.x,
          y1: otherPage.y,
          x2: pouch.x,
          y2: pouch.y,
          key: `${conn.from}-${conn.to}-elastic`,
          active: true,
          isElastic: true,
          elasticPhase: firing.phase,
          elasticProgress: firing.progress,
        });
        continue;
      }

      lines.push({
        x1: fromPage.x,
        y1: fromPage.y,
        x2: toPage.x,
        y2: toPage.y,
        key: `${conn.from}-${conn.to}`,
        active: isActive,
        isElastic: false,
        elasticPhase: null,
        elasticProgress: 0,
      });
    }

    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, hoveredPage, firing]);

  const fireSlingshot = (page: PositionedPage) => {
    if (firing || !dimensions.width) return;
    if (page.path === '/') {
      router.push(page.path);
      return;
    }

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const w = dimensions.width;
    const h = dimensions.height;

    const dx = page.x - centerX;
    const dy = page.y - centerY;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dx / len;
    const ny = dy / len;

    const pullDist = len * 0.35;
    const startX = page.x + nx * pullDist;
    const startY = page.y + ny * pullDist;

    const vx = -nx * LAUNCH_SPEED;
    const vy = -ny * LAUNCH_SPEED;

    // Capture container viewport position at start
    const containerRect = containerRef.current?.getBoundingClientRect();
    const containerOffset = {
      x: containerRect?.left ?? 0,
      y: containerRect?.top ?? 0,
    };

    navigatedRef.current = false;
    const startTime = performance.now();
    let lastTime = startTime;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      let dt = (now - lastTime) / 1000;
      lastTime = now;
      if (dt > 0.05) dt = 0.05;

      let phase: 'windup' | 'hold' | 'launch';
      let progress: number;

      if (elapsed < WIND_UP_MS) {
        phase = 'windup';
        progress = elapsed / WIND_UP_MS;
      } else if (elapsed < WIND_UP_MS + HOLD_MS) {
        phase = 'hold';
        progress = 1;
      } else {
        phase = 'launch';
        const launchElapsed = elapsed - WIND_UP_MS - HOLD_MS;
        progress = Math.min(1, launchElapsed / 2000);
      }

      if (phase === 'launch') {
        setFiring((prev) => {
          if (!prev || prev.phase !== 'launch') {
            return {
              path: page.path,
              phase: 'launch',
              x: startX,
              y: startY,
              vx,
              vy,
              progress: 0,
              exited: false,
              anchor: { x: page.x, y: page.y },
              center: { x: centerX, y: centerY },
              containerOffset,
            };
          }

          let newX = prev.x + prev.vx * dt;
          let newY = prev.y + prev.vy * dt;
          let newVx = prev.vx * AIR_FRICTION;
          let newVy = prev.vy * AIR_FRICTION;

          const exited = prev.exited || newX < -50 || newX > w + 50 || newY < -50 || newY > h + 50;

          const newProgress = Math.min(1, prev.progress + dt * 0.45);

          return {
            ...prev,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            progress: newProgress,
            exited,
          };
        });

        const launchElapsed = elapsed - WIND_UP_MS - HOLD_MS;
        if (!navigatedRef.current && launchElapsed > NAV_DELAY_MS) {
          navigatedRef.current = true;
          router.push(page.path);
        }

        if ((firing as any)?.progress >= 1) {
          setTimeout(() => setFiring(null), 100);
          return;
        }

        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      setFiring({
        path: page.path,
        phase,
        progress,
        x: startX,
        y: startY,
        vx,
        vy,
        exited: false,
        anchor: { x: page.x, y: page.y },
        center: { x: centerX, y: centerY },
        containerOffset,
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

  // The flying ball overlay (fixed, covers whole page, not clipped)
  const flyingBall = useMemo(() => {
    if (!firing) return null;
    const pouch = getPouchPosition(firing.path);
    if (!pouch) return null;
    const page = pagesData.find((p) => p.path === firing.path);
    if (!page) return null;

    const viewportX = pouch.x + firing.containerOffset.x;
    const viewportY = pouch.y + firing.containerOffset.y;

    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div
          className="absolute flex flex-col items-center gap-0.5 text-center text-primary"
          style={{
            left: viewportX,
            top: viewportY,
            transform: `translate(-50%, -50%) scale(${pouch.scale})`,
            fontSize: '0.75rem',
            opacity: pouch.opacity,
            transition: 'none',
          }}
        >
          <span className="font-medium tracking-tight inline-block">
            {page.name}
          </span>
          {page.description && (
            <span className="text-[0.65em] whitespace-nowrap opacity-60">
              {page.description}
            </span>
          )}
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firing]);

  return (
    <div className="w-full flex items-center justify-center min-h-[50vh]">
      {flyingBall}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl border border-gray-800/60 overflow-hidden select-none"
        style={{ height: dimensions.width || 300 }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0, overflow: 'visible' }}
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

          {connectionLines.map((line) => {
            if (line.isElastic) {
              const windupOpacity = 0.5 + line.elasticProgress * 0.4;
              const holdOpacity = 0.95;
              const launchOpacity = (1 - line.elasticProgress) * 0.7;
              const opacity =
                line.elasticPhase === 'windup'
                  ? windupOpacity
                  : line.elasticPhase === 'hold'
                  ? holdOpacity
                  : launchOpacity;

              const windupWidth = 1.5 + line.elasticProgress * 2;
              const holdWidth = 3.5;
              const launchWidth = (1 - line.elasticProgress) * 3.5;
              const width =
                line.elasticPhase === 'windup'
                  ? windupWidth
                  : line.elasticPhase === 'hold'
                  ? holdWidth
                  : launchWidth;

              return (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#FF79C6"
                  strokeWidth={width}
                  opacity={opacity}
                  strokeLinecap="round"
                  style={{ transition: 'none' }}
                />
              );
            }

            return (
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
            );
          })}

          {positions.map((page) => {
            const isFiring = firing?.path === page.path;
            if (isFiring) return null;
            return (
              <circle
                key={`${page.path}-dot`}
                cx={page.x}
                cy={page.y}
                r={page.path === '/' ? 4 : 3}
                fill="#94A3B8"
                opacity={hoveredPage === page.path ? 0.8 : 0.35}
                className="transition-opacity duration-300"
              />
            );
          })}
        </svg>

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
          const isFiring = firing?.path === page.path;

          const pos = { x: page.x, y: page.y };

          const style: React.CSSProperties = {
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            fontSize: page.path === '/' ? '0.85rem' : '0.75rem',
            zIndex: 1,
            padding: '0.5rem',
            cursor: page.path === '/' ? 'default' : 'pointer',
            opacity: isFiring ? 0 : 1,
            transition: 'all 200ms',
            pointerEvents: isFiring ? 'none' : 'auto',
          };

          const className = `
            absolute flex flex-col items-center gap-0.5
            text-center no-underline
            ${page.path === '/' ? 'font-semibold text-gray-100' : 'text-gray-300'}
            ${isHighlighted || isCurrentHovered ? 'text-primary' : ''}
          `;

          const content = (
            <>
              <span className="font-medium tracking-tight inline-block">
                {page.name}
              </span>
              {page.description && (
                <span
                  className="text-[0.65em] whitespace-nowrap"
                  style={{
                    opacity: isHighlighted || isCurrentHovered ? 0.6 : 0,
                    transform:
                      isHighlighted || isCurrentHovered
                        ? 'translateY(0)'
                        : 'translateY(-4px)',
                    transition: 'opacity 200ms, transform 200ms',
                  }}
                >
                  {page.description}
                </span>
              )}
            </>
          );

          if (page.path === '/') {
            return (
              <a
                key={page.path}
                href={page.path}
                className={className}
                style={style}
                onMouseEnter={() => setHoveredPage(page.path)}
                onMouseLeave={() => setHoveredPage(null)}
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={page.path}
              role="link"
              tabIndex={0}
              className={className}
              style={style}
              onMouseEnter={() => setHoveredPage(page.path)}
              onMouseLeave={() => setHoveredPage(null)}
              onClick={() => fireSlingshot(page)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fireSlingshot(page);
                }
              }}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

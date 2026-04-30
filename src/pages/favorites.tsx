import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { favorites, FavoriteItem } from '../data/favorites';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import SlingshotAnimation from '../components/musicNote';
import VideoSlingshotAnimation from '../components/Slingshot Music Video Animation';
import { TypeAnimation } from 'react-type-animation'; // Import TypeAnimation

interface SelectedItem extends FavoriteItem {
  category: string;
  categoryId: string;
}

type ExcludedByCategory = Record<string, string[]>;
type CursorTrailPetal = {
  id: number;
  x: number;
  y: number;
  shapeIdx: number;
  colorIdx: number;
  scale: number;
  rotation: number;
  createdAt: number;
};

const getRandomFavoritesFromDifferentCategories = (
  allFavorites: typeof favorites,
  count: number = 5,
  excludedByCategory: ExcludedByCategory = {}
): { selectedItems: SelectedItem[]; updatedExcluded: ExcludedByCategory } => {
  // Filter out categories that have items.
  const availableCategories = allFavorites.filter(category => category.items && category.items.length > 0);
  // Shuffle categories and take up to `count` of them.
  const shuffledCategories = [...availableCategories].sort(() => Math.random() - 0.5);
  const chosenCategories = shuffledCategories.slice(0, count);
  const selectedItems: SelectedItem[] = [];
  const updatedExcluded: ExcludedByCategory = { ...excludedByCategory };

  chosenCategories.forEach(category => {
    // Start with an empty array if no exclusions exist yet.
    let currentExcluded = updatedExcluded[category.id] || [];
    // Filter items that haven't been shown yet.
    let availableItems = category.items.filter(item => !currentExcluded.includes(item.id));
    // If all items have been seen, reset for this category.
    if (availableItems.length === 0) {
      currentExcluded = [];
      availableItems = [...category.items];
    }
    // Pick a random item from the available items.
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    selectedItems.push({ ...randomItem, category: category.title, categoryId: category.id });
    // Update this category’s exclusion list.
    currentExcluded.push(randomItem.id);
    updatedExcluded[category.id] = currentExcluded;
  });

  return { selectedItems, updatedExcluded };
};

interface PetalShape {
  d: string;
  stroke?: boolean;
}

interface Theme {
  id: string;
  label: string;
  shapes: PetalShape[];
  htmlBg: string;
  bodyBg: string;
  headerBg: string;
  headerBorder: string;
  footerBorder: string;
  petalFills: string[];
  buttonBg: string;
  buttonHoverBg: string;
  buttonText: string;
  outlineColor: string;
  outlineHoverText: string;
  categoryText: string;
  cardBg: string;
  cardBorder: string;
  cardText: string;
  linkHover: string;
  musicFrame: string;
  musicNote: string;
  videoFrame: string;
  videoStone: string;
  navAccent: string;
}

// Cherry blossom shapes — sakura petal has a notched/heart-shaped tip and tapered base
const SAKURA_PETAL = "M12 22 C9 22, 6 19, 6 14 C6 10, 8 6, 12 3 C16 6, 18 10, 18 14 C18 19, 15 22, 12 22 Z M10 5 C11 6, 11 7, 12 8 C13 7, 13 6, 14 5 C13 4, 12 3.5, 12 3 C12 3.5, 11 4, 10 5 Z";
const SAKURA_PETAL_TILTED = "M14 22 C10 22, 7 19, 7 14 C7 10, 9 6, 14 3 C17 7, 18 11, 17 15 C16 19, 15 22, 14 22 Z M12 5 C13 6, 13.5 7, 14 8 C14.5 7, 15 6, 16 5 C15 4, 14.5 3.5, 14 3 C14 3.5, 13 4, 12 5 Z";
const SAKURA_FLOWER_FULL = "M12 12 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M12 3 C10 5, 9 7, 10 9 C10.5 10, 11.5 10, 12 10 C12.5 10, 13.5 10, 14 9 C15 7, 14 5, 12 3 C12 4, 12 4, 12 5 C12 4, 12 4, 12 3 Z M21 12 C19 10, 17 9, 15 10 C14 10.5, 14 11.5, 14 12 C14 12.5, 14 13.5, 15 14 C17 15, 19 14, 21 12 C20 12, 20 12, 19 12 C20 12, 20 12, 21 12 Z M12 21 C14 19, 15 17, 14 15 C13.5 14, 12.5 14, 12 14 C11.5 14, 10.5 14, 10 15 C9 17, 10 19, 12 21 Z M3 12 C5 14, 7 15, 9 14 C10 13.5, 10 12.5, 10 12 C10 11.5, 10 10.5, 9 10 C7 9, 5 10, 3 12 Z";
const SAKURA_PETAL_SMALL = "M12 20 C10 20, 8 18, 8 14 C8 11, 10 8, 12 6 C14 8, 16 11, 16 14 C16 18, 14 20, 12 20 Z M11 7 C11.5 7.5, 11.5 8, 12 8.5 C12.5 8, 12.5 7.5, 13 7 C12.5 6.5, 12 6.2, 12 6 C12 6.2, 11.5 6.5, 11 7 Z";

// Rose petal shapes (single petals, curved)
const ROSE_PETAL_CURL = "M12 3 C8 5, 5 9, 6 14 C7 18, 11 21, 14 19 C16 17, 16 13, 14 10 C13 7, 12 4, 12 3 Z";
const ROSE_PETAL_SOLO = "M12 2 C9 5, 8 9, 9 13 C10 16, 13 18, 16 16 C18 13, 17 9, 14 5 C13 3, 12 2, 12 2 Z";
const ROSE_PETAL_WIDE = "M12 3 C7 6, 5 11, 7 16 C9 20, 15 20, 17 16 C19 11, 17 6, 12 3 Z";
const ROSE_FULL = "M12 4 C8 4, 5 7, 5 11 C5 13, 6 14, 7 14 C7 17, 9 20, 12 20 C15 20, 17 17, 17 14 C18 14, 19 13, 19 11 C19 7, 16 4, 12 4 Z M12 8 C10 8, 9 10, 10 12 C11 13, 13 13, 14 12 C15 10, 14 8, 12 8 Z";

// Autumn leaf shapes
const LEAF_OAK = "M12 3 C7 5, 4 10, 5 16 C5 18, 7 20, 9 20 C13 20, 18 16, 19 9 C19 6, 17 4, 14 3 Z";
const LEAF_MAPLE = "M12 2 L14 7 L19 6 L16 11 L21 13 L16 15 L17 20 L13 18 L12 22 L11 18 L7 20 L8 15 L3 13 L8 11 L5 6 L10 7 Z";
const LEAF_ELONGATED = "M12 2 C10 8, 8 12, 8 16 C8 19, 10 22, 12 22 C14 22, 16 19, 16 16 C16 12, 14 8, 12 2 Z M12 4 L12 22";
const LEAF_BIRCH = "M12 3 C9 6, 7 11, 7 16 C7 19, 9 21, 12 21 C15 21, 17 19, 17 16 C17 11, 15 6, 12 3 Z";

// Snowflake shapes
const SNOW_SIMPLE = "M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19 M12 5 L10 7 M12 5 L14 7 M12 19 L10 17 M12 19 L14 17";
const SNOW_HEXAGON = "M12 2 L12 22 M3 7 L21 17 M3 17 L21 7 M12 6 L10 4 M12 6 L14 4 M12 18 L10 20 M12 18 L14 20 M6 9 L4 8 M18 15 L20 16 M6 15 L4 16 M18 9 L20 8";
const SNOW_STAR = "M12 2 L13 10 L21 8 L14 13 L18 21 L12 16 L6 21 L10 13 L3 8 L11 10 Z";
const SNOW_DOT = "M12 12 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M12 12 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0";


const THEMES: Theme[] = [
  {
    id: 'blossoms',
    label: 'cherry blossoms',
    shapes: [{ d: SAKURA_PETAL }, { d: SAKURA_PETAL_TILTED }, { d: SAKURA_FLOWER_FULL }, { d: SAKURA_PETAL_SMALL }],
    htmlBg: '#2a0f22',
    bodyBg: `radial-gradient(ellipse 60% 50% at 80% 0%, rgba(255, 170, 200, 0.55), transparent 70%),
             radial-gradient(ellipse 70% 60% at 15% 95%, rgba(220, 130, 175, 0.45), transparent 70%),
             radial-gradient(ellipse 50% 40% at 50% 50%, rgba(120, 60, 100, 0.25), transparent 80%),
             linear-gradient(180deg, #3a1530 0%, #28102a 55%, #18081e 100%)`,
    headerBg: 'rgba(29, 14, 28, 0.55)',
    headerBorder: 'rgba(255, 192, 213, 0.16)',
    footerBorder: 'rgba(255, 192, 213, 0.2)',
    petalFills: ['rgba(255, 183, 207, 0.85)', 'rgba(255, 210, 225, 0.78)', 'rgba(255, 158, 193, 0.72)', 'rgba(255, 232, 240, 0.7)'],
    buttonBg: '#ff9ec1',
    buttonHoverBg: '#ffb7d3',
    buttonText: '#3a1530',
    outlineColor: '#ffb7d3',
    outlineHoverText: '#3a1530',
    categoryText: '#ffb7d3',
    cardBg: 'rgba(58, 21, 48, 0.55)',
    cardBorder: 'rgba(255, 183, 207, 0.22)',
    cardText: '#ffe7f0',
    linkHover: '#ffd2e3',
    musicFrame: '#c64b8c',
    musicNote: '#ffd2ef',
    videoFrame: '#ff8fc9',
    videoStone: '#ffb2dd',
    navAccent: '#ffb7d3',
  },
  {
    id: 'roses',
    label: 'roses',
    shapes: [{ d: ROSE_PETAL_CURL }, { d: ROSE_PETAL_WIDE }, { d: ROSE_FULL }, { d: ROSE_PETAL_SOLO }],
    htmlBg: '#1a0808',
    bodyBg: `radial-gradient(ellipse 60% 50% at 20% 10%, rgba(220, 50, 80, 0.45), transparent 65%),
             radial-gradient(ellipse 70% 55% at 90% 90%, rgba(120, 25, 35, 0.55), transparent 70%),
             radial-gradient(ellipse 40% 30% at 50% 50%, rgba(60, 20, 25, 0.4), transparent 80%),
             linear-gradient(180deg, #2a0a10 0%, #1a0608 60%, #0d0304 100%)`,
    headerBg: 'rgba(26, 6, 8, 0.6)',
    headerBorder: 'rgba(220, 80, 100, 0.18)',
    footerBorder: 'rgba(220, 80, 100, 0.22)',
    petalFills: ['rgba(220, 40, 70, 0.85)', 'rgba(180, 30, 55, 0.8)', 'rgba(255, 90, 110, 0.7)', 'rgba(140, 20, 40, 0.78)'],
    buttonBg: '#dc2846',
    buttonHoverBg: '#ff5a6e',
    buttonText: '#1a0608',
    outlineColor: '#ff7a8c',
    outlineHoverText: '#1a0608',
    categoryText: '#ff8a9c',
    cardBg: 'rgba(40, 10, 14, 0.6)',
    cardBorder: 'rgba(220, 80, 100, 0.22)',
    cardText: '#ffe0e4',
    linkHover: '#ff9eaa',
    musicFrame: '#8a1a28',
    musicNote: '#ff7a8c',
    videoFrame: '#dc2846',
    videoStone: '#ff5a6e',
    navAccent: '#ff7a8c',
  },
  {
    id: 'autumn',
    label: 'autumn leaves',
    shapes: [{ d: LEAF_OAK }, { d: LEAF_MAPLE }, { d: LEAF_ELONGATED }, { d: LEAF_BIRCH }],
    htmlBg: '#1a0e05',
    bodyBg: `radial-gradient(ellipse 60% 50% at 75% 5%, rgba(255, 140, 50, 0.45), transparent 65%),
             radial-gradient(ellipse 70% 60% at 10% 90%, rgba(180, 80, 30, 0.5), transparent 70%),
             radial-gradient(ellipse 50% 40% at 40% 50%, rgba(80, 35, 15, 0.35), transparent 80%),
             linear-gradient(180deg, #2a1208 0%, #1c0c05 55%, #0e0602 100%)`,
    headerBg: 'rgba(28, 12, 5, 0.6)',
    headerBorder: 'rgba(255, 160, 80, 0.18)',
    footerBorder: 'rgba(255, 160, 80, 0.22)',
    petalFills: ['rgba(255, 140, 50, 0.85)', 'rgba(220, 90, 30, 0.8)', 'rgba(255, 200, 90, 0.78)', 'rgba(180, 60, 25, 0.78)'],
    buttonBg: '#ff8c32',
    buttonHoverBg: '#ffb05a',
    buttonText: '#1c0c05',
    outlineColor: '#ffb05a',
    outlineHoverText: '#1c0c05',
    categoryText: '#ffb05a',
    cardBg: 'rgba(42, 18, 8, 0.55)',
    cardBorder: 'rgba(255, 160, 80, 0.22)',
    cardText: '#ffe9d1',
    linkHover: '#ffc88a',
    musicFrame: '#a85020',
    musicNote: '#ffd29a',
    videoFrame: '#ff8c32',
    videoStone: '#ffb05a',
    navAccent: '#ffb05a',
  },
  {
    id: 'snow',
    label: 'snowflakes',
    shapes: [{ d: SNOW_SIMPLE, stroke: true }, { d: SNOW_HEXAGON, stroke: true }, { d: SNOW_STAR }, { d: SNOW_DOT }],
    htmlBg: '#0a1424',
    bodyBg: `radial-gradient(ellipse 60% 50% at 70% 0%, rgba(150, 200, 255, 0.4), transparent 70%),
             radial-gradient(ellipse 70% 55% at 15% 95%, rgba(80, 130, 200, 0.35), transparent 70%),
             radial-gradient(ellipse 50% 40% at 50% 50%, rgba(40, 70, 120, 0.3), transparent 80%),
             linear-gradient(180deg, #14223a 0%, #0c1828 55%, #050b18 100%)`,
    headerBg: 'rgba(12, 24, 40, 0.6)',
    headerBorder: 'rgba(180, 220, 255, 0.18)',
    footerBorder: 'rgba(180, 220, 255, 0.22)',
    petalFills: ['rgba(220, 235, 255, 0.85)', 'rgba(180, 210, 245, 0.8)', 'rgba(255, 255, 255, 0.7)', 'rgba(150, 190, 235, 0.75)'],
    buttonBg: '#a8d0ff',
    buttonHoverBg: '#d0e4ff',
    buttonText: '#0c1828',
    outlineColor: '#a8d0ff',
    outlineHoverText: '#0c1828',
    categoryText: '#a8d0ff',
    cardBg: 'rgba(20, 34, 58, 0.55)',
    cardBorder: 'rgba(180, 220, 255, 0.2)',
    cardText: '#e6f0ff',
    linkHover: '#c8dcff',
    musicFrame: '#3a72b8',
    musicNote: '#d0e4ff',
    videoFrame: '#a8d0ff',
    videoStone: '#e0eeff',
    navAccent: '#a8d0ff',
  },
];

const Favorites: NextPage = () => {
  const [randomFavorites, setRandomFavorites] = useState<SelectedItem[]>([]);
  const [excludedByCategory, setExcludedByCategory] = useState<ExcludedByCategory>({});
  const [viewportHeight, setViewportHeight] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [cursorTrail, setCursorTrail] = useState<CursorTrailPetal[]>([]);
  const theme = THEMES[themeIndex];
  const bgRef = useRef<HTMLDivElement>(null);

  // Calculate how many items are needed to fill the screen
  const calculateItemsNeeded = () => {
    if (viewportHeight === 0) return 5; // Default fallback

    // Approximate space taken by other elements (header, buttons, margins, etc.)
    // Increased to ensure "But wait, there's more" button is visible
    const otherElementsHeight = 450; // Adjusted to reserve space for the button
    const availableHeight = viewportHeight - otherElementsHeight;

    // Approximate height of each favorite item including margins
    const itemHeight = 120; // Adjust based on actual item height

    // Calculate how many items would fit, ensuring we don't completely fill the viewport
    const itemsNeeded = Math.max(3, Math.ceil(availableHeight / itemHeight));

    // Limit to available categories if needed
    return Math.min(itemsNeeded, favorites.length);
  };

  useEffect(() => {
    // Get initial viewport height
    setViewportHeight(window.innerHeight);

    // Update on window resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const className = 'favorites-themed';
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, []);

  useEffect(() => {
    const REPEL_RADIUS = 140;
    const REPEL_STRENGTH = 80;
    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = 0;
    let pending = false;

    const tick = () => {
      pending = false;
      const container = bgRef.current;
      if (!container) return;
      const petals = container.querySelectorAll<HTMLElement>('.petal');
      petals.forEach((petal) => {
        const rect = petal.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0.01) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          const nx = (dx / dist) * force;
          const ny = (dy / dist) * force;
          petal.style.setProperty('--rx', `${nx.toFixed(1)}px`);
          petal.style.setProperty('--ry', `${ny.toFixed(1)}px`);
        } else {
          petal.style.setProperty('--rx', '0px');
          petal.style.setProperty('--ry', '0px');
        }
      });
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const TRAIL_INTERVAL_MS = 35;
    const TRAIL_LIFETIME_MS = 450;
    const MAX_TRAIL_COUNT = 16;
    let lastSpawn = 0;
    let nextId = 0;

    const cleanupTimer = window.setInterval(() => {
      const now = Date.now();
      setCursorTrail((prev) => prev.filter((petal) => now - petal.createdAt < TRAIL_LIFETIME_MS));
    }, 120);

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn < TRAIL_INTERVAL_MS) return;
      lastSpawn = now;

      const nextPetal: CursorTrailPetal = {
        id: nextId++,
        x: e.clientX,
        y: e.clientY,
        shapeIdx: Math.floor(Math.random() * theme.shapes.length),
        colorIdx: Math.floor(Math.random() * 4),
        scale: 0.32 + Math.random() * 0.22,
        rotation: Math.random() * 360,
        createdAt: now,
      };

      setCursorTrail((prev) => [...prev.slice(-MAX_TRAIL_COUNT + 1), nextPetal]);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.clearInterval(cleanupTimer);
      setCursorTrail([]);
    };
  }, [theme.id, theme.shapes.length]);

  useEffect(() => {
    // Only generate favorites when we have viewport height
    if (viewportHeight > 0) {
      const itemCount = calculateItemsNeeded();
      const { selectedItems, updatedExcluded } = getRandomFavoritesFromDifferentCategories(
        favorites,
        itemCount
      );
      setRandomFavorites(selectedItems);
      setExcludedByCategory(updatedExcluded);
    }
  }, [viewportHeight]);

  const openRandomSong = () => {
    const songsArtistsCategory = favorites.find(category => category.id === 'songs-artists');
    if (songsArtistsCategory && songsArtistsCategory.items.length > 0) {
      const songWithUrls = songsArtistsCategory.items.filter(item => item.url);
      if (songWithUrls.length > 0) {
        const randomSong = songWithUrls[Math.floor(Math.random() * songWithUrls.length)];
        window.open(randomSong.url, '_blank');
      } else {
        console.error('No songs with URLs available.');
      }
    } else {
      console.error('No songs available in favorites.');
    }
  };

  const openRandomVideo = () => {
    const videosCategory = favorites.find(category => category.id === 'videos');
    if (videosCategory && videosCategory.items.length > 0) {
      const videosWithUrls = videosCategory.items.filter(item => item.url);
      if (videosWithUrls.length > 0) {
        const randomVideo = videosWithUrls[Math.floor(Math.random() * videosWithUrls.length)];
        window.open(randomVideo.url, '_blank');
      } else {
        console.error('No videos with URLs available.');
      }
    } else {
      console.error('No videos available in favorites.');
    }
  };

  const handleMoreFavorites = () => {
    const itemCount = calculateItemsNeeded();
    const { selectedItems, updatedExcluded } = getRandomFavoritesFromDifferentCategories(
      favorites,
      itemCount,
      excludedByCategory
    );
    setRandomFavorites(selectedItems);
    setExcludedByCategory(updatedExcluded);
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  return (
    <Layout title="&Goliath | My Favorite Things">
      <div ref={bgRef} className={`favorites-blossom-bg theme-${theme.id}`} aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => {
          const flowerIdx = theme.shapes.length - 2;
          const flowerEligible = theme.id === 'blossoms' || theme.id === 'roses';
          const isFlower = flowerEligible && (i % 10 === 3);
          const shapeIdx = isFlower ? flowerIdx : (i * 7) % (theme.shapes.length - (flowerEligible ? 1 : 0));
          const shape = theme.shapes[isFlower ? flowerIdx : (shapeIdx >= flowerIdx && flowerEligible ? shapeIdx + 1 : shapeIdx)];
          const baseScale = 0.6 + ((i * 0.13) % 0.7);
          const scale = isFlower ? baseScale * 1.4 : baseScale;
          return (
            <span key={`${theme.id}-${i}`} className={`petal petal-${i % 4} ${isFlower ? 'is-flower' : ''}`} style={{
              left: `${(i * 3.7) % 100}%`,
              ['--scale' as string]: scale,
            }}>
              <span className="petal-inner" style={{
                animationDelay: `${(i * 0.6) % 14}s`,
                animationDuration: `${12 + ((i * 1.3) % 10)}s`,
              }}>
                <svg viewBox="0 0 24 24">
                  {shape.stroke ? (
                    <path d={shape.d} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  ) : (
                    <path d={shape.d} />
                  )}
                </svg>
              </span>
            </span>
          );
        })}
      </div>
      <div className="favorites-cursor-trail" aria-hidden="true">
        {cursorTrail.map((petal) => {
          const shape = theme.shapes[petal.shapeIdx];
          return (
            <span
              key={`${theme.id}-trail-${petal.id}`}
              className={`cursor-trail-petal petal-${petal.colorIdx}`}
              style={{
                left: `${petal.x}px`,
                top: `${petal.y}px`,
                ['--trail-scale' as string]: petal.scale,
                ['--trail-rotation' as string]: `${petal.rotation}deg`,
              }}
            >
              <svg viewBox="0 0 24 24">
                {shape.stroke ? (
                  <path d={shape.d} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                ) : (
                  <path d={shape.d} />
                )}
              </svg>
            </span>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-serif text-foreground border-b border-current-line pb-2 mt-8">
            <TypeAnimation
              sequence={[
                'Raindrops on roses and whiskers on kittens',
                200, // Wait 1s
                'Bright copper kettles and warm woolen mittens',
                200, // Wait 1s
                'Brown paper packages tied up with strings',
                200, // Wait 1s
                'These are a few of my favorite things',
                () => {
                  // Replace with the final text without animation
                  setTimeout(() => {
                    const heading = document.querySelector('h1.text-2xl.md\\:text-3xl.font-serif.text-foreground.border-b.border-current-line.pb-2.mt-8');
                    if (heading) {
                      heading.textContent = 'These are a few of my favorite things';
                    }
                  }, 0);
                }
              ]}
              speed={50}
              deletionSpeed={50}
              repeat={0}
              cursor={false}
              wrapper="span"
              style={{ display: 'inline-block' }} // To ensure inline behavior
            />
          </h1>

          <div className="flex justify-center space-x-8 mb-4 md:mb-0">
            <div className="text-center">
              <SlingshotAnimation
                className="w-12 h-12 md:w-16 md:h-16"
                onLaunch={openRandomSong}
                frameColor={theme.musicFrame}
                noteColor={theme.musicNote}
              />
            </div>

            <div className="text-center">
              <VideoSlingshotAnimation
                className="w-12 h-12 md:w-16 md:h-16"
                onLaunch={openRandomVideo}
                frameColor={theme.videoFrame}
                stoneColor={theme.videoStone}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {randomFavorites.map((item, index) => (
            <motion.div
              key={`${item.categoryId}-${item.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              className="favorites-item p-4 rounded-lg shadow-sm transition-shadow"
            >
              <div className="favorites-item-cat text-sm mb-1">{item.category}</div>
              <h3 className="favorites-item-name text-lg font-medium">
                {item.url ? (
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="favorites-item-link transition-colors"
                  >
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center space-y-4">
          <button
            onClick={handleMoreFavorites}
            className="favorites-cta mb-2 px-4 py-2 rounded-md transition-colors"
          >
            But wait, there&apos;s more
          </button>

          <div>
            <Link
              href="/favorites/all"
              className="favorites-cta-outline inline-block px-4 py-2 rounded-md transition-colors"
            >
              See all favorites by category
            </Link>
          </div>
        </div>
      </motion.div>
      <style jsx global>{`
        html:has(body.favorites-themed) {
          background: ${theme.htmlBg} !important;
          transition: background 600ms ease;
        }
        body.favorites-themed {
          background: ${theme.bodyBg} !important;
          background-attachment: fixed !important;
          transition: background 600ms ease;
          min-height: 100vh;
        }
        body.favorites-themed .site-shell,
        body.favorites-themed .site-main {
          background: transparent !important;
          position: relative;
        }
        body.favorites-themed .site-main {
          z-index: 1;
        }
        body.favorites-themed .site-header {
          background: ${theme.headerBg} !important;
          border-bottom: 1px solid ${theme.headerBorder} !important;
          backdrop-filter: blur(14px) saturate(1.2);
          -webkit-backdrop-filter: blur(14px) saturate(1.2);
          transition: background 600ms ease, border-color 600ms ease;
        }
        body.favorites-themed .site-header h1 .text-primary,
        body.favorites-themed .site-header .text-primary {
          color: ${theme.navAccent} !important;
          transition: color 600ms ease;
        }
        body.favorites-themed .site-header nav a:hover,
        body.favorites-themed .site-header nav a.text-primary {
          color: ${theme.navAccent} !important;
        }
        body.favorites-themed .site-footer {
          border-top-color: ${theme.footerBorder} !important;
          position: relative;
          z-index: 1;
          transition: border-color 600ms ease;
        }
        .favorites-blossom-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .favorites-blossom-bg .petal {
          position: absolute;
          top: -6vh;
          width: 26px;
          height: 26px;
          transform: translate3d(var(--rx, 0px), var(--ry, 0px), 0) scale(var(--scale, 1));
          transition: transform 220ms cubic-bezier(.2, .8, .2, 1);
          will-change: transform;
        }
        .favorites-blossom-bg .petal-inner {
          display: block;
          width: 100%;
          height: 100%;
          opacity: 0;
          animation-name: blossomFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        .favorites-blossom-bg .petal svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .favorites-blossom-bg .petal-0 svg path { fill: ${theme.petalFills[0]}; }
        .favorites-blossom-bg .petal-1 svg path { fill: ${theme.petalFills[1]}; }
        .favorites-blossom-bg .petal-2 svg path { fill: ${theme.petalFills[2]}; }
        .favorites-blossom-bg .petal-3 svg path { fill: ${theme.petalFills[3]}; }
        .favorites-blossom-bg .petal-0 { color: ${theme.petalFills[0]}; }
        .favorites-blossom-bg .petal-1 { color: ${theme.petalFills[1]}; }
        .favorites-blossom-bg .petal-2 { color: ${theme.petalFills[2]}; }
        .favorites-blossom-bg .petal-3 { color: ${theme.petalFills[3]}; }
        .favorites-blossom-bg .petal.is-flower { width: 36px; height: 36px; filter: drop-shadow(0 0 6px ${theme.petalFills[0]}); }
        .favorites-cursor-trail {
          position: fixed;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        .favorites-cursor-trail .cursor-trail-petal {
          position: fixed;
          width: 16px;
          height: 16px;
          transform: translate3d(-50%, -50%, 0) rotate(var(--trail-rotation, 0deg)) scale(var(--trail-scale, 0.4));
          transform-origin: center;
          animation: cursorTrailFade 460ms ease-out forwards;
          will-change: transform, opacity;
        }
        .favorites-cursor-trail .cursor-trail-petal svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .favorites-cursor-trail .petal-0 svg path { fill: ${theme.petalFills[0]}; }
        .favorites-cursor-trail .petal-1 svg path { fill: ${theme.petalFills[1]}; }
        .favorites-cursor-trail .petal-2 svg path { fill: ${theme.petalFills[2]}; }
        .favorites-cursor-trail .petal-3 svg path { fill: ${theme.petalFills[3]}; }
        .favorites-cursor-trail .petal-0 { color: ${theme.petalFills[0]}; }
        .favorites-cursor-trail .petal-1 { color: ${theme.petalFills[1]}; }
        .favorites-cursor-trail .petal-2 { color: ${theme.petalFills[2]}; }
        .favorites-cursor-trail .petal-3 { color: ${theme.petalFills[3]}; }
        .favorites-cta {
          background: ${theme.buttonBg};
          color: ${theme.buttonText};
          border: 1px solid ${theme.buttonBg};
          font-weight: 500;
        }
        .favorites-cta:hover {
          background: ${theme.buttonHoverBg};
          border-color: ${theme.buttonHoverBg};
        }
        .favorites-cta-outline {
          border: 1px solid ${theme.outlineColor};
          color: ${theme.outlineColor};
          background: transparent;
        }
        .favorites-cta-outline:hover {
          background: ${theme.outlineColor};
          color: ${theme.outlineHoverText};
        }
        .favorites-item {
          background: ${theme.cardBg};
          border: 1px solid ${theme.cardBorder};
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .favorites-item-cat { color: ${theme.categoryText}; }
        .favorites-item-name { color: ${theme.cardText}; }
        .favorites-item-link { color: ${theme.cardText}; }
        .favorites-item-link:hover { color: ${theme.linkHover}; }
        @keyframes blossomFall {
          0% {
            transform: translate3d(0, -8vh, 0) rotate(0deg);
            opacity: 0;
          }
          8% { opacity: 1; }
          50% {
            transform: translate3d(40px, 50vh, 0) rotate(220deg);
          }
          92% { opacity: 1; }
          100% {
            transform: translate3d(-30px, 110vh, 0) rotate(540deg);
            opacity: 0;
          }
        }
        @keyframes cursorTrailFade {
          0% {
            opacity: 0.9;
            transform: translate3d(-50%, -50%, 0) rotate(var(--trail-rotation, 0deg)) scale(var(--trail-scale, 0.4));
          }
          100% {
            opacity: 0;
            transform: translate3d(-50%, -50%, 0) translateY(8px) rotate(calc(var(--trail-rotation, 0deg) + 22deg)) scale(calc(var(--trail-scale, 0.4) * 0.75));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .favorites-blossom-bg .petal-inner { animation: none; opacity: 0.4; }
          .favorites-cursor-trail { display: none; }
        }
      `}</style>
    </Layout>
  );
};

export default Favorites;
import { useEffect, useId, useRef, useState } from 'react';
import { cities, type City } from '../../data/cities';
import land from '../../data/cityAtlasLand.json';
import styles from '../../styles/Cities.module.css';

export type Region = 'all' | 'us' | 'europe' | 'home' | 'italy';
export const regions: { id: Region; name: string; center: [number, number]; span: number }[] = [
  { id: 'all', name: 'All places', center: [-48, 52], span: 172 },
  { id: 'us', name: 'United States', center: [-97, 39], span: 66 },
  { id: 'europe', name: 'Europe', center: [9, 50.5], span: 68 },
  { id: 'home', name: 'Maryland', center: [-76.82, 39.11], span: 1.45 },
  { id: 'italy', name: 'Italy', center: [11.1, 44.1], span: 12 },
];

export const citiesInRegion = (region: Region) => cities.filter((city) => region === 'all' || city.region === region || (region === 'home' && city.nearHome) || (region === 'italy' && city.location === 'Italy'));

// Mercator coordinates match the locally bundled Natural Earth outlines.
const mercatorY = (latitude: number) => {
  const projected = -Math.log(Math.tan(Math.PI / 4 + Math.max(-85, Math.min(85, latitude)) * Math.PI / 360)) * 180 / Math.PI;
  // Normalize tiny math differences between server and browser engines for hydration.
  return Number(projected.toFixed(8));
};
const WIDTH = 1000;
const labelOffsets: Record<string, [number, number, 'left' | 'right']> = {
  'sf': [15, 0, 'right'], 'chicago': [-15, -7, 'left'], 'nyc': [15, 8, 'right'], 'boston': [15, -12, 'right'],
  'bergen': [15, -5, 'right'], 'copenhagen': [15, 0, 'right'], 'london': [-15, -4, 'left'], 'madrid': [-15, 0, 'left'],
  'prague': [-15, -18, 'left'], 'vienna': [-15, 4, 'left'], 'budapest': [15, 10, 'right'],
  'milan': [-15, -8, 'left'], 'florence': [-15, -12, 'left'], 'orvieto': [15, -8, 'right'], 'rome': [15, 16, 'right'],
  'ellicott-city': [-15, -16, 'left'], 'baltimore': [15, -2, 'right'], 'college-park': [15, -8, 'right'], 'washington-dc': [-15, 16, 'left'],
};

interface Props {
  region: Region;
  selectedCity: City;
  zoom: number;
  onSelect: (city: City) => void;
  onRegionChange: (region: Region) => void;
}

export default function CityAtlas({ region, selectedCity, zoom, onSelect, onRegionChange }: Props) {
  const id = useId().replace(/:/g, '');
  const mapRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(650);
  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setHeight(WIDTH * entry.contentRect.height / entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const view = regions.find((item) => item.id === region)!;
  const center = zoom > 1 ? [selectedCity.longitude, selectedCity.latitude] : view.center;
  const scale = WIDTH / view.span * zoom;
  const offsetX = WIDTH / 2 - center[0] * scale;
  const offsetY = height / 2 - mercatorY(center[1]) * scale;
  const project = (longitude: number, latitude: number) => [offsetX + longitude * scale, offsetY + mercatorY(latitude) * scale];
  const showHomeCluster = (region === 'all' || region === 'us') && zoom === 1;
  const showEuropeClusters = region === 'all' && zoom === 1;
  const showItalyCluster = (region === 'all' || region === 'europe') && zoom === 1;
  const mapCities = citiesInRegion(region).filter((city) => !(showHomeCluster && city.nearHome) && !(showItalyCluster && city.location === 'Italy') && !(showEuropeClusters && ['prague', 'vienna', 'budapest'].includes(city.id)));
  const clusters: { name: string; count: number; coordinates: [number, number]; region: Region; offset: [number, number, 'left' | 'right'] }[] = [
    ...(showHomeCluster ? [{ name: 'Maryland', count: 4, coordinates: [-76.82, 39.11] as [number, number], region: 'home' as Region, offset: [-15, 26, 'left'] as [number, number, 'left'] }] : []),
    ...(showEuropeClusters ? [
      { name: 'Central Europe', count: 3, coordinates: [16.4, 48.6] as [number, number], region: 'europe' as Region, offset: [-15, 4, 'left'] as [number, number, 'left'] },
    ] : []),
    ...(showItalyCluster ? [{ name: 'Italy', count: 4, coordinates: [11.8, 43.4] as [number, number], region: 'italy' as Region, offset: [15, 14, 'right'] as [number, number, 'right'] }] : []),
  ];
  const graticuleStep = region === 'home' ? 0.2 : region === 'italy' ? 2 : 10;
  const longitudeStart = Math.floor((center[0] - view.span / zoom / 2) / graticuleStep) * graticuleStep;
  const longitudes = Array.from({ length: Math.ceil(view.span / zoom / graticuleStep) + 1 }, (_, i) => longitudeStart + i * graticuleStep);
  const latitudes = Array.from({ length: Math.ceil(160 / graticuleStep) }, (_, i) => -80 + i * graticuleStep).filter((latitude) => {
    const y = project(0, latitude)[1];
    return y > 0 && y < height;
  });

  return (
    <div ref={mapRef} className={`${styles.map} ${region === 'all' ? styles.worldMap : ''}`}>
      <svg className={styles.geography} viewBox={`0 0 ${WIDTH} ${height}`} aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-sea`}><stop offset="0" stopColor="#202134" /><stop offset="1" stopColor="#151623" /></radialGradient>
          <pattern id={`${id}-grain`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".45" fill="#b8b2d4" opacity=".13" /></pattern>
        </defs>
        <rect width={WIDTH} height={height} fill={`url(#${id}-sea)`} />
        <g className={styles.graticule}>
          {longitudes.map((longitude) => <line key={`lon-${longitude}`} x1={project(longitude, 0)[0]} x2={project(longitude, 0)[0]} y1="0" y2={height} />)}
          {latitudes.map((latitude) => <line key={`lat-${latitude}`} x1="0" x2={WIDTH} y1={project(0, latitude)[1]} y2={project(0, latitude)[1]} />)}
        </g>
        <path className={styles.land} d={land.path} transform={`translate(${offsetX} ${offsetY}) scale(${scale})`} vectorEffect="non-scaling-stroke" />
        <rect width={WIDTH} height={height} fill={`url(#${id}-grain)`} />
        {region === 'all' && zoom === 1 && <text className={styles.ocean} x="450" y="445" textAnchor="middle" transform="rotate(-15 450 445)">ATLANTIC OCEAN</text>}
        {region === 'us' && zoom === 1 && <text className={styles.ocean} x="480" y="450" textAnchor="middle">UNITED STATES</text>}
        {region === 'home' && zoom === 1 && <text className={styles.ocean} x="530" y="485" textAnchor="middle">MARYLAND</text>}
        {region === 'italy' && zoom === 1 && <text className={styles.ocean} x="750" y="500" textAnchor="middle">ADRIATIC SEA</text>}
      </svg>
      <span className={styles.mapTitle}>{view.name} <span>/ {citiesInRegion(region).length} notes</span></span>
      <div className={styles.compass} aria-hidden="true"><span>N</span><svg viewBox="0 0 24 44"><path d="M12 2 21 35 12 28 3 35Z" fill="none" stroke="currentColor" /><path d="M12 2V28L3 35Z" fill="currentColor" /></svg></div>
      <div className={styles.pins} aria-label="Cities on the map">
        {mapCities.map((city) => {
          const [x, y] = project(city.longitude, city.latitude);
          if (x < 20 || x > WIDTH - 20 || y < 30 || y > height - 20) return null;
          const [dx, dy, side] = labelOffsets[city.id];
          const active = city.id === selectedCity.id;
          return <button key={city.id} className={`${styles.pin} ${active ? styles.selectedPin : ''}`} style={{ left: `${x / WIDTH * 100}%`, top: `${y / height * 100}%` }} onClick={() => onSelect(city)} aria-label={`Read ${city.name} note, ${city.rating} out of 5`} aria-pressed={active}>
            <span className={styles.pinDot} /><span className={`${styles.pinLabel} ${side === 'left' ? styles.labelLeft : ''}`} style={{ left: dx, top: dy }}>{city.name}</span>
          </button>;
        })}
        {clusters.map((cluster) => {
          const [x, y] = project(...cluster.coordinates);
          const [dx, dy, side] = cluster.offset;
          const active = cluster.region === 'home' ? selectedCity.nearHome : cluster.region === 'italy' ? selectedCity.location === 'Italy' : ['prague', 'vienna', 'budapest'].includes(selectedCity.id);
          return <button key={cluster.name} className={`${styles.pin} ${styles.cluster} ${active ? styles.selectedPin : ''}`} style={{ left: `${x / WIDTH * 100}%`, top: `${y / height * 100}%` }} onClick={() => onRegionChange(cluster.region)} aria-label={`Explore ${cluster.count} cities in ${cluster.name}`}>
            <span className={styles.clusterCount}>{cluster.count}</span><span className={`${styles.pinLabel} ${side === 'left' ? styles.labelLeft : ''}`} style={{ left: dx, top: dy }}>{cluster.name}<span> ↗</span></span>
          </button>;
        })}
      </div>
      <a className={styles.mapCredit} href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Map: Natural Earth</a>
    </div>
  );
}

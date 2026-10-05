import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaRandom } from 'react-icons/fa';
import Layout from '../../components/Layout';
import CityAtlas, { regions, citiesInRegion, type Region } from '../../components/cities/CityAtlas';
import { cities, type City } from '../../data/cities';
import styles from '../../styles/Cities.module.css';

const cityNumber = (city: City) => String(cities.indexOf(city) + 1).padStart(2, '0');
const coordinates = (city: City) => `${city.latitude.toFixed(2)}° N / ${Math.abs(city.longitude).toFixed(2)}° ${city.longitude < 0 ? 'W' : 'E'}`;

const CitiesPage: NextPage = () => {
  const [selectedCity, setSelectedCity] = useState(cities[4]);
  const [region, setRegion] = useState<Region>('all');
  const [ranked, setRanked] = useState(false);
  const [zoom, setZoom] = useState(1);
  const visibleCities = citiesInRegion(region);
  const indexedCities = ranked ? [...visibleCities].sort((a, b) => b.rating - a.rating) : visibleCities;
  const selectedIndex = indexedCities.indexOf(selectedCity);

  useEffect(() => {
    const readHash = () => {
      const city = cities.find((entry) => `#${entry.id}` === window.location.hash);
      if (city) {
        setSelectedCity(city);
        setRegion(city.nearHome ? 'home' : city.location === 'Italy' ? 'italy' : city.region);
        setZoom(1);
      }
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  const selectCity = (city: City) => {
    setSelectedCity(city);
    window.history.replaceState(null, '', `#${city.id}`);
  };

  const changeRegion = (next: Region) => {
    setRegion(next);
    setZoom(1);
    const nextCities = citiesInRegion(next);
    if (!nextCities.includes(selectedCity)) selectCity([...nextCities].sort((a, b) => b.rating - a.rating)[0]);
  };

  const stepCity = (direction: number) => {
    selectCity(indexedCities[(selectedIndex + direction + indexedCities.length) % indexedCities.length]);
  };

  return (
    <Layout title="&Goliath | Cities" description="Cities, with personal notes and ratings.">
      <div className={styles.page}>
        <Link href="/writing" className={styles.back}><FaArrowLeft aria-hidden="true" /> Back to Writing</Link>
        <header className={styles.heading}>
          <div>
            <h1>Cities</h1>
            <p className={styles.subtitle}>On places</p>
          </div>
          <button className={styles.wander} onClick={() => {
              const otherCities = cities.filter((city) => city !== selectedCity);
              const city = otherCities[Math.floor(Math.random() * otherCities.length)];
              setRegion(city.nearHome ? 'home' : city.region);
              setZoom(1);
              selectCity(city);
          }}><FaRandom aria-hidden="true" /> Random city</button>
        </header>

        <div className={styles.explorer}>
          <section className={styles.mapSection} aria-label="City atlas">
            <div className={styles.regionBar} aria-label="Map regions">
              {regions.map((item) => <button key={item.id} aria-pressed={region === item.id} onClick={() => changeRegion(item.id)}>{item.name}<span>{citiesInRegion(item.id).length}</span></button>)}
            </div>
            <CityAtlas region={region} selectedCity={selectedCity} zoom={zoom} onSelect={selectCity} onRegionChange={changeRegion} />
            <div className={styles.mapFooter}>
              <div className={styles.zoomControls} aria-label="Map zoom">
                <button aria-label="Zoom out" disabled={zoom === 1} onClick={() => setZoom(Math.max(1, zoom - 0.5))}>−</button>
                <button aria-label="Reset map zoom" disabled={zoom === 1} onClick={() => setZoom(1)}>{zoom === 1 ? 'Fit' : `${zoom}×`}</button>
                <button aria-label="Zoom in on selected city" disabled={zoom === 3} onClick={() => setZoom(Math.min(3, zoom + 0.5))}>+</button>
              </div>
            </div>
          </section>

          <section className={styles.note} aria-label="Selected city note" aria-live="polite" aria-atomic="true">
            <div key={selectedCity.id} className={styles.noteContent}>
              <div className={styles.noteTop}><span>Note {cityNumber(selectedCity)} / {cities.length}</span><span className={styles.noteMark} aria-hidden="true">↗</span></div>
              <p className={styles.location}>{selectedCity.location}</p>
              <h2>{selectedCity.name}</h2>
              <p className={styles.coordinates}>{coordinates(selectedCity)}</p>
              <div className={styles.review}><span className={styles.quoteMark} aria-hidden="true">“</span><p>{selectedCity.review}</p></div>
              <div className={styles.rating}>
                <span className={styles.ratingNumber}>{selectedCity.rating.toFixed(1)}<small>/ 5</small></span>
                <div><span className={styles.ratingLabel}>Rating</span><span className={styles.ratingTrack} aria-hidden="true"><span style={{ width: `${selectedCity.rating * 20}%` }} /></span></div>
              </div>
            </div>
            <div className={styles.noteNav}>
              <button aria-label="Previous city" onClick={() => stepCity(-1)}><FaArrowLeft aria-hidden="true" /> Previous</button>
              <button aria-label="Next city" onClick={() => stepCity(1)}>Next <FaArrowRight aria-hidden="true" /></button>
            </div>
          </section>
        </div>

        <section className={styles.index} aria-label="All city notes">
          <div className={styles.indexHeader}>
            <h2>Index <span>{visibleCities.length} places</span></h2>
            <div className={styles.sortControls} aria-label="Sort cities">
              <button aria-pressed={!ranked} onClick={() => setRanked(false)}>Original order</button><span aria-hidden="true">/</span>
              <button aria-pressed={ranked} onClick={() => setRanked(true)}>Highest rated</button>
            </div>
          </div>
          <div className={styles.cityIndex}>
            {indexedCities.map((city) => <button key={city.id} className={city === selectedCity ? styles.activeCity : ''} aria-pressed={city === selectedCity} aria-label={`${city.name}, ${city.rating} out of 5`} onClick={() => { selectCity(city); setZoom(1); }}>
              <span className={styles.cityNumber}>{cityNumber(city)}</span><span className={styles.cityName}>{city.name}</span>
              <span className={styles.cityScore}>{city.rating.toFixed(1)}<span>↗</span></span>
            </button>)}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CitiesPage;

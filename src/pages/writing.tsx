import { useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAllArticles, Article } from '../lib/articles';

interface WritingPageProps {
  articles: Article[];
}

type FilterKind = 'all' | 'essay' | 'notes' | 'log';
type SortKind = 'newest' | 'longest' | 'az';
type SortDirection = 'asc' | 'desc';
type CardId = 'goliath' | 'planes' | 'mechanized' | 'experience' | 'books' | 'cities' | 'stocks';

interface CardMeta {
  id: CardId;
  category: Exclude<FilterKind, 'all'>;
  title: string;
  dateSort: string;
  lengthScore: number;
}

interface RatedItem {
  name: string;
  rating: number;
}

const CARD_META: CardMeta[] = [
  { id: 'goliath', category: 'essay', title: 'In defense of Goliath', dateSort: '2026-02-10', lengthScore: 6 },
  { id: 'planes', category: 'essay', title: 'Planes', dateSort: '2026-02-12', lengthScore: 4 },
  { id: 'mechanized', category: 'notes', title: 'Mechanized humans', dateSort: '2026-02-10', lengthScore: 3 },
  { id: 'experience', category: 'essay', title: 'Experience', dateSort: '0000-00-00', lengthScore: 9 },
  { id: 'books', category: 'log', title: 'Books 2026', dateSort: '2026-02-01', lengthScore: 17 },
  { id: 'cities', category: 'log', title: 'Cities', dateSort: '2026-02-05', lengthScore: 5 },
  { id: 'stocks', category: 'essay', title: 'CMSC320 students and the stock market', dateSort: '2025-05-16', lengthScore: 8 },
];

const CITY_RATINGS: RatedItem[] = [
  { name: 'New York', rating: 5 },
  { name: 'London', rating: 4.5 },
  { name: 'Copenhagen', rating: 4 },
  { name: 'Prague', rating: 4 },
  { name: 'Madrid', rating: 4 },
];

const BOOK_RATINGS: RatedItem[] = [
  { name: 'Tomorrow, and Tomorrow, and Tomorrow', rating: 4.8 },
  { name: 'Grapes of Wrath', rating: 4.6 },
  { name: 'Stories of Your Life and Others', rating: 4.6 },
  { name: 'Never let me go', rating: 4.4 },
  { name: 'The Sabbath', rating: 4.3 },
  { name: 'There Is No Antimemetics Division', rating: 4.2 },
  { name: 'Siddhartha', rating: 4.1 },
  { name: '1984', rating: 4.0 },
];

const starString = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? '½' : '';
  return `${'★'.repeat(full)}${half}`;
};

const Writing: NextPage<WritingPageProps> = () => {
  const [filter, setFilter] = useState<FilterKind>('all');
  const [sort, setSort] = useState<SortKind>('newest');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSortClick = (nextSort: SortKind) => {
    if (sort === nextSort) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
      return;
    }
    setSort(nextSort);
    setSortDirection(nextSort === 'az' ? 'asc' : 'desc');
  };

  const visibleCards = useMemo(() => {
    const filtered = filter === 'all' ? CARD_META : CARD_META.filter((card) => card.category === filter);
    return [...filtered].sort((a, b) => {
      let value = 0;
      if (sort === 'az') value = a.title.localeCompare(b.title);
      else if (sort === 'longest') value = a.lengthScore - b.lengthScore;
      else value = a.dateSort.localeCompare(b.dateSort);
      return sortDirection === 'asc' ? value : -value;
    });
  }, [filter, sort, sortDirection]);

  return (
    <Layout title="&Goliath | Writing">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="reading-room"
      >
        <div className="page">
          <div className="head">
            <div>
              <h1>Writing</h1>
            </div>
            <div className="filters">
              <div className="pill-row">
                <button type="button" className={`pill ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>
                  All <span className="count">{CARD_META.length}</span>
                </button>
                <button type="button" className={`pill ${filter === 'essay' ? 'on' : ''}`} onClick={() => setFilter('essay')}>Essays</button>
                <button type="button" className={`pill ${filter === 'notes' ? 'on' : ''}`} onClick={() => setFilter('notes')}>Notes</button>
                <button type="button" className={`pill ${filter === 'log' ? 'on' : ''}`} onClick={() => setFilter('log')}>Logs</button>
              </div>
              <div className="pill-row">
                <button type="button" className={`pill ${sort === 'newest' ? 'on' : ''}`} onClick={() => handleSortClick('newest')}>
                  {sort === 'newest' ? (sortDirection === 'desc' ? '↓ ' : '↑ ') : ''}Newest
                </button>
                <button type="button" className={`pill ${sort === 'longest' ? 'on' : ''}`} onClick={() => handleSortClick('longest')}>
                  {sort === 'longest' ? (sortDirection === 'desc' ? '↓ ' : '↑ ') : ''}Longest
                </button>
                <button type="button" className={`pill ${sort === 'az' ? 'on' : ''}`} onClick={() => handleSortClick('az')}>
                  {sort === 'az' ? (sortDirection === 'desc' ? '↓ ' : '↑ ') : ''}A–Z
                </button>
              </div>
            </div>
          </div>

          <div className="stack">
            {visibleCards.map((card) => {
              if (card.id === 'goliath') return (
                <Link key={card.id} className="card c-half polemic tilt-r" href="/writing/InDefenseOfGoliath">
              <div className="corner" />
              <div className="meta"><span>Polemic · 6 min</span><span className="len">Feb 10 · 2026</span></div>
              <h2>In defense of <em>Goliath</em>.</h2>
              <p className="dek">Someone&apos;s gotta stand up for the big guy.</p>
              <p className="pull">Why do we give a shit about the underdog? It&apos;s a perversion of excellence and leads to so. much. bullshit.</p>
              <div className="foot">
                <div className="tag-row"><span className="tag">essays</span></div>
                <span className="read">Read →</span>
              </div>
              <div className="watermark">&amp;</div>
            </Link>
              );
              if (card.id === 'planes') return (
                <Link key={card.id} className="card c-third" href="/writing/Planes">
              <div className="corner" />
              <div className="meta"><span>Essay · 4 min</span><span className="len">Feb 12 · 2026</span></div>
              <h2><em>Planes!</em></h2>
              <p className="dek">On miracles.</p>
              <img
                className="plane-photo"
                src="/images/wright-flyer.png"
                alt="Historic airplane in flight"
              />
              <div className="foot">
                <div className="tag-row"><span className="tag">essays</span></div>
                <span className="read">Read →</span>
              </div>
            </Link>
              );
              if (card.id === 'mechanized') return (
                <Link key={card.id} className="card c-third notes" href="/writing/MechanizedHumans">
              <div className="corner" />
              <div className="meta"><span>Notes · ongoing</span><span className="len">Feb 10 · 2026</span></div>
              <h2>Mechanized <em>humans</em>.</h2>
              <p className="dek">An incomplete list.</p>
              <div className="mono">
                <div><span className="dash">—</span> I try to learn similar to RL</div>
                <div><span className="dash">—</span> Tight feedback loops, everywhere</div>
                <div><span className="dash">—</span> <em>email me</em> with more notes</div>
              </div>
              <div className="foot">
                <div className="tag-row"><span className="tag">notes</span></div>
                <span className="read">Read →</span>
              </div>
            </Link>
              );
              if (card.id === 'experience') return (
                <Link key={card.id} className="card c-third" href="/writing/Experience">
              <div className="corner" />
              <div className="meta"><span>Essay · 9 min</span><span className="len">Outdated</span></div>
              <h2>Experience.</h2>
              <p className="dek">How I exist.</p>
              <p className="pull">Maybe &quot;enjoyment&quot; isn&apos;t the right word. Then again, maybe it is — to be <em>in joy</em>?</p>
              <div className="foot">
                <div className="tag-row"><span className="tag">essays</span></div>
                <span className="read">Read →</span>
              </div>
            </Link>
              );
              if (card.id === 'books') return (
                <Link key={card.id} className="card c-sixth log tilt-l fill-card" href="/writing/Books2026">
              <div className="meta"><span>Running log · 2026</span><span className="len">17 titles</span></div>
              <h2>Books, <em>2026</em>.</h2>
              <ul className="list">
                {BOOK_RATINGS.map((book) => (
                  <li key={book.name}>
                    <span><span className="mark">✓</span> {book.name}</span>
                    <span>{book.rating.toFixed(1)}</span>
                  </li>
                ))}
                <li><span><span className="mark">→</span> Bible (NRSV) — ongoing</span><span>now</span></li>
              </ul>
              <div className="foot">
                <div className="tag-row"><span className="tag">logs</span></div>
                <span className="read">Full list →</span>
              </div>
            </Link>
              );
              if (card.id === 'cities') return (
                <Link key={card.id} className="card c-sixth cities-card fill-card" href="/writing/Cities">
              <div className="corner" />
              <div className="meta"><span>Log · ongoing</span><span className="len">Feb 05 · 2026</span></div>
              <h2><em>Cities</em>.</h2>
              <p className="dek">On places.</p>
              <div className="cities-body">
                <ol className="cities-manifest">
                  {CITY_RATINGS.map((city, idx) => (
                    <li key={city.name}>
                      <span className="rank">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="city-name">{city.name}</span>
                      <span className="stars">{starString(city.rating)}</span>
                    </li>
                  ))}
                  <li className="more"><span className="rank">—</span><span className="city-name">+ 14 more</span><span className="stars" /></li>
                </ol>
              </div>
              <div className="foot">
                <div className="tag-row"><span className="tag">logs</span></div>
                <span className="read">Read →</span>
              </div>
            </Link>
              );
              if (card.id === 'stocks') return (
                <Link key={card.id} className="card c-half" href="/writing/Stocks">
              <div className="corner" />
              <div className="meta"><span>Essay · 8 min</span><span className="len">May 16 · 2025</span></div>
              <h2>CMSC320 students <em>&amp;</em> the stock market.</h2>
              <p className="pull">&quot;If you torture the data long enough, it will confess to anything.&quot; — Ronald Coase</p>
              <div className="foot">
                <div className="tag-row"><span className="tag">essays</span></div>
                <span className="read">Read →</span>
              </div>
            </Link>
              );
              return null;
            })}
          </div>
        </div>

        <style jsx global>{`
          .reading-room {
            --bg: #0f111d;
            --surface: #1a1d2e;
            --surface-2: #141625;
            --fg: #f8f8f2;
            --fg-dim: #d6d6ce;
            --muted: #6272a4;
            --line: #2a2f47;
            --primary: #b39dff;
            --primary-2: #9580ff;
            --pink: #ff79c6;
            --cyan: #8be9fd;
            --green: #50fa7b;
            --orange: #ffb86c;
            --yellow: #f1fa8c;
            --red: #ff5555;
            --font-sans: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-serif: "Merriweather", "IBM Plex Serif", Georgia, serif;
            --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
            color: var(--fg);
            font-family: var(--font-sans);
          }
          .reading-room .page { max-width: min(1240px, 100%); margin: 0 auto; padding: clamp(28px, 5vw, 48px) clamp(16px, 4vw, 32px) clamp(64px, 12vw, 120px); }
          .reading-room .head { display: grid; grid-template-columns: 1fr auto; gap: clamp(20px, 3vw, 32px); align-items: end; margin-bottom: clamp(32px, 5vw, 48px); }
          .reading-room h1 { font-family: var(--font-serif); font-weight: 300; font-size: clamp(56px, 8vw, 96px); letter-spacing: -0.02em; line-height: .95; margin: 0 0 16px; color: var(--primary); }
          .reading-room .filters { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
          .reading-room .pill-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; max-width: 360px; }
          .reading-room .pill { padding: 7px 12px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg-dim); background: transparent; cursor: pointer; font: inherit; letter-spacing: inherit; text-transform: inherit; }
          .reading-room .pill.on { color: var(--bg); background: var(--primary); border-color: var(--primary); }
          .reading-room .stack {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: clamp(16px, 2.5vw, 28px);
            align-items: stretch;
          }
          .reading-room .card {
            background: var(--surface);
            border: 1px solid var(--line);
            padding: clamp(20px, 3vw, 28px);
            position: relative;
            transition: transform 220ms cubic-bezier(.2,.8,.2,1), border-color 180ms;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: min(42vh, 380px);
            box-shadow: 0 1px 0 rgba(255,255,255,.03) inset, 0 12px 30px rgba(0,0,0,.35);
            text-decoration: none;
            color: inherit;
          }
          .reading-room .fill-card { min-height: min(58vh, 520px); }
          .reading-room .fill-card .list,
          .reading-room .fill-card .cities-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
          .reading-room .fill-card .list { overflow-y: auto; -webkit-overflow-scrolling: touch; }
          .reading-room .fill-card .cities-manifest { flex: 1 1 auto; overflow-y: auto; -webkit-overflow-scrolling: touch; }
          .reading-room .card:hover { transform: translateY(-4px) rotate(0) !important; border-color: var(--primary); z-index: 3; }
          .reading-room .corner { position: absolute; top: 0; right: 0; width: 24px; height: 24px; background: linear-gradient(225deg, var(--bg) 50%, transparent 50%), linear-gradient(225deg, var(--line) 50%, transparent 50%); }
          .reading-room .meta { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }
          .reading-room .meta .len { color: var(--pink); }
          .reading-room .card h2 { font-family: var(--font-serif); font-weight: 400; font-size: 32px; line-height: 1.05; margin: 0; color: var(--fg); }
          .reading-room .card h2 em { color: var(--primary); font-style: italic; }
          .reading-room .dek { font-family: var(--font-serif); font-style: italic; font-size: 15px; color: var(--muted); line-height: 1.45; margin: -4px 0 0; }
          .reading-room .pull { font-family: var(--font-serif); font-size: 16px; line-height: 1.6; color: var(--fg-dim); border-left: 2px solid var(--primary); padding-left: 16px; margin: 8px 0 0; }
          .reading-room .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); padding-top: 14px; border-top: 1px dashed var(--line); }
          .reading-room .tag-row { display: flex; gap: 6px; }
          .reading-room .tag { padding: 3px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg-dim); letter-spacing: .14em; font-size: 9px; }
          .reading-room .read { color: var(--primary); }
          .reading-room .c-feature { grid-column: span 7; min-height: 460px; }
          .reading-room .c-half { grid-column: span 5; }
          .reading-room .c-third { grid-column: span 4; }
          .reading-room .c-sixth { grid-column: span 6; }
          .reading-room .card.tilt-l { transform: rotate(-.6deg); }
          .reading-room .card.tilt-r { transform: rotate(.4deg); }
          .reading-room .c-feature h2 { font-size: 52px; line-height: 1; }
          .reading-room .c-feature .pull { font-size: 18px; max-width: 44ch; }
          .reading-room .c-feature .art { position: absolute; top: -1px; right: -1px; bottom: -1px; width: 42%; background: radial-gradient(circle at center, rgba(179,157,255,.35), transparent 48%), repeating-linear-gradient(0deg, transparent 0 21px, rgba(42,47,71,.6) 21px 22px), #141625; border-left: 1px solid var(--line); }
          .reading-room .c-feature .body { max-width: 54%; position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12px; flex: 1; }
          .reading-room .card.polemic { background: linear-gradient(135deg, #1e1a38, var(--surface)); border-color: rgba(179,157,255,.25); }
          .reading-room .card.polemic .watermark { position: absolute; right: 16px; bottom: -22px; font-family: var(--font-serif); font-style: italic; font-size: 160px; color: rgba(179,157,255,.07); }
          .reading-room .plane-photo {
            margin: 10px 0 12px;
            width: 100%;
            height: clamp(140px, 22vw, 200px);
            object-fit: cover;
            border: 1px solid var(--line);
            border-radius: 6px;
            filter: sepia(0.38) hue-rotate(205deg) saturate(1.55) brightness(0.68) contrast(1.06);
          }
          .reading-room .card.notes { background: var(--surface-2); }
          .reading-room .card.notes .mono { font-family: var(--font-mono); font-size: 12px; line-height: 1.7; color: var(--fg-dim); }
          .reading-room .card.notes .dash { color: var(--pink); margin-right: 6px; }
          .reading-room .card.log { background: repeating-linear-gradient(transparent 0 26px, rgba(98,114,164,.12) 26px 27px), var(--surface); }
          .reading-room .card.log h2 { color: var(--primary); }
          .reading-room .card.log .list { font-family: var(--font-mono); font-size: 12px; line-height: 2.16; color: var(--fg-dim); padding-left: 0; list-style: none; margin: 0; }
          .reading-room .card.log .list li { display: flex; justify-content: space-between; gap: 12px; }
          .reading-room .card.log .mark { color: var(--green); width: 18px; display: inline-block; }
          .reading-room .card.log .list li span:last-child { color: var(--yellow); }
          .reading-room .cities-body { display: block; }
          .reading-room .cities-manifest { list-style: none; margin: 2px 0 0; padding: 0; font-family: var(--font-mono); font-size: 11px; line-height: 1.9; border-top: 1px solid var(--line); }
          .reading-room .cities-manifest li { display: grid; grid-template-columns: 22px 1fr auto; gap: 8px; padding: 5px 0; border-bottom: 1px solid rgba(42,47,71,.55); }
          .reading-room .cities-manifest li:last-child { border-bottom: 0; }
          .reading-room .cities-manifest .city-name { font-family: var(--font-serif); font-style: italic; font-size: 14px; color: var(--fg); }
          .reading-room .cities-manifest .stars { color: var(--accent); font-size: 10px; letter-spacing: .06em; }
          @media (min-width: 961px) and (max-width: 1180px) {
            .reading-room .c-half { grid-column: span 6; }
            .reading-room .c-third { grid-column: span 6; }
            .reading-room .c-sixth { grid-column: span 6; }
          }
          @media (max-width: 960px) {
            .reading-room .stack { grid-template-columns: 1fr; }
            .reading-room .c-feature, .reading-room .c-half, .reading-room .c-third, .reading-room .c-sixth { grid-column: span 1; }
            .reading-room .c-feature .art { display: none; }
            .reading-room .c-feature .body { max-width: 100%; }
            .reading-room .card.tilt-l, .reading-room .card.tilt-r { transform: none; }
            .reading-room .head { grid-template-columns: 1fr; }
            .reading-room .filters { align-items: flex-start; }
            .reading-room .pill-row { justify-content: flex-start; max-width: none; }
            .reading-room .cities-body { grid-template-columns: 1fr; }
            .reading-room .card { min-height: auto; }
            .reading-room .fill-card { min-height: min(70vh, 560px); }
          }
        `}</style>
      </motion.div>
    </Layout>
  );
};

export async function getStaticProps() {
  let articles = await getAllArticles();
  articles = articles
    .map(article => ({
      ...article,
      subtitle: article.subtitle === undefined ? null : article.subtitle,
      createdAt: article.createdAt || null,
      updatedAt: article.updatedAt || null,
    }))
    .sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || '';
      const dateB = b.updatedAt || b.createdAt || '';
      return dateB.localeCompare(dateA);
    });
  return {
    props: {
      articles,
    },
  };
}

export default Writing;
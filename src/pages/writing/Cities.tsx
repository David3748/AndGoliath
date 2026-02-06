import { useState } from 'react';
import type { NextPage } from 'next';
import Layout from '../../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import {
  GiCapitol,
  GiRaven,
  GiSailboat,
  GiWindmill,
  GiMountains,
  GiBridge,
  GiCastle,
  GiMusicalNotes,
  GiGuitar,
  GiTowerBridge,
  GiPizzaSlice,
  GiFlowerPot,
  GiColiseum,
  GiChurch,
  GiWineGlass,
} from 'react-icons/gi';
import {
  FaUniversity,
  FaHome,
  FaLandmark,
  FaBuilding,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

interface CityData {
  name: string;
  icon: IconType;
  color: string;
  review: string;
}

const cities: CityData[] = [
  {
    name: 'Ellicott City',
    icon: FaHome,
    color: '#50FA7B',
    review: "Does it feel like the default because it's my home or because it's such a typical suburb,",
  },
  {
    name: 'College Park',
    icon: FaUniversity,
    color: '#FF5555',
    review: "Most things you'd want in a college town and many you wouldn't. Stunningly unexeptional in many ways.",
  },
  {
    name: 'Washington DC',
    icon: GiCapitol,
    color: '#F8F8F2',
    review: "Good metro, great museums and politics. So much politics.",
  },
  {
    name: 'Baltimore',
    icon: GiRaven,
    color: '#B39DFF',
    review: "An underrated city purely because it's rated so badly.",
  },
  {
    name: 'NYC',
    icon: FaBuilding,
    color: '#8BE9FD',
    review: "Great and terrible. A city of extremes. The only thing I love more than New York City is the idea of New York City",
  },
  {
    name: 'Boston',
    icon: GiSailboat,
    color: '#FF79C6',
    review: "In some ways the most European of American cities. ",
  },
  {
    name: 'SF',
    icon: GiBridge,
    color: '#FFB86C',
    review: "We discovered heaven on earth and we put Silicon Valley there. It feels ironic that the part of the country that encompasses the most great nature in the smallest area has the people least dedicated to the natural.",
  },
  {
    name: 'Chicago',
    icon: GiPizzaSlice,
    color: '#8BE9FD',
    review: "Excellent in the summer. Bike by the lake if you can. I have not heard good things about the winter.",
  },
  {
    name: 'Copenhagen',
    icon: GiWindmill,
    color: '#FF5555',
    review: "An almost perfectly designed city. The best cafes I've ever been to. Ruinously expensive. Makes you appreciate the Sun.",
  },
  {
    name: 'Bergen',
    icon: GiMountains,
    color: '#50FA7B',
    review: "Miraculously its own weather event. Sadly that weather is fog. Fjords are incredible.",
  },
  {
    name: 'Budapest',
    icon: FaLandmark,
    color: '#F1FA8C',
    review: "Extremely touristy, does it fine. Prague is better in most important ways at many of the same things.",
  },
  {
    name: 'Vienna',
    icon: GiMusicalNotes,
    color: '#B39DFF',
    review: "I had Paris syndrome here. Good city, not great. Overly touristy music. ",
  },
  {
    name: 'Prague',
    icon: GiCastle,
    color: '#FFB86C',
    review: "My favorite city in central Europe. It's how I imagine a European city should be.",
  },
  {
    name: 'Madrid',
    icon: GiGuitar,
    color: '#FF5555',
    review: "One of the world's greatest places to do nothing. This is a compliment.",
  },
  {
    name: 'London',
    icon: GiTowerBridge,
    color: '#F8F8F2',
    review: "There's so much going on. I love it so much. Easily the European city I could see myself in long-term.",
  },
  {
    name: 'Florence',
    icon: GiFlowerPot,
    color: '#FF79C6',
    review: "It's a tourist trap and I don't even care, the trap was so good.",
  },
  {
    name: 'Rome',
    icon: GiColiseum,
    color: '#FFB86C',
    review: "A series of monuments that used to mean something and now mean a fall from grace. Bonus: the Vatican is quite bad at running a musuem.",
  },
  {
    name: 'Milan',
    icon: GiChurch,
    color: '#F8F8F2',
    review: "Pretty good city. If you can go on the roof of the cathedral, do so.",
  },
  {
    name: 'Orvieto',
    icon: GiWineGlass,
    color: '#FF5555',
    review: "Perfect little italian town.",
  },
];

const StickyNote: React.FC<{ city: CityData; onClose: () => void }> = ({ city, onClose }) => {
  const Icon = city.icon;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60" />
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ scale: 0.8, rotate: -2, opacity: 0 }}
        animate={{ scale: 1, rotate: 1, opacity: 1 }}
        exit={{ scale: 0.8, rotate: 2, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky note */}
        <div
          className="rounded-sm shadow-2xl p-6 pb-8"
          style={{
            background: '#2A2D3E',
            borderTop: `4px solid ${city.color}`,
            boxShadow: '4px 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top tape effect */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm opacity-30"
            style={{ background: city.color }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-comment hover:text-foreground transition-colors text-lg"
          >
            &times;
          </button>

          {/* City icon and name */}
          <div className="flex items-center gap-3 mb-4">
            <Icon className="text-3xl" style={{ color: city.color }} />
            <h2 className="text-xl font-serif text-foreground">{city.name}</h2>
          </div>

          {/* Review content */}
          <div className="font-serif text-gray-300 leading-relaxed min-h-[80px]">
            {city.review ? (
              <p>{city.review}</p>
            ) : (
              <p className="text-comment italic">Review coming soon...</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CitiesPage: NextPage = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  return (
    <Layout title="&Goliath | Writing - City Reviews">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link href="/writing" className="text-primary hover:text-secondary transition-colors">
            <FaArrowLeft className="inline-block mr-2" /> Back to Writing
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif mb-2 text-foreground border-b border-current-line pb-2 mt-8">
          City Reviews
        </h1>
        <p className="text-gray-400 mb-8">Places I&apos;ve been, briefly reviewed</p>

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
          {cities.map((city, index) => {
            const Icon = city.icon;
            return (
              <motion.button
                key={city.name}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-current-line border border-current-line hover:border-comment transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCity(city)}
              >
                <Icon
                  className="text-3xl md:text-4xl transition-colors"
                  style={{ color: city.color }}
                />
                <span className="text-xs md:text-sm text-gray-400 group-hover:text-foreground transition-colors text-center leading-tight">
                  {city.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedCity && (
            <StickyNote city={selectedCity} onClose={() => setSelectedCity(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default CitiesPage;

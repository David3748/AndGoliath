import type { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { FaTimes, FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
import { galleryPhotos } from '../data/galleryPhotos';

interface Photo {
  id: string;
  blur: string;
  thumb: string;
  full: string;
  location: string;
}

const photos: Photo[] = galleryPhotos.map((photo, index) => ({
  id: String(index + 1),
  blur: `/gallery/blur/${photo.filename}`,
  thumb: `/gallery/thumb/${photo.filename}`,
  full: `/gallery/full/${photo.filename}`,
  location: photo.location,
}));

// Grid thumbnail - shows blur then sharpens
const GridImage: React.FC<{
  blur: string;
  src: string;
  alt: string;
  className?: string;
}> = ({ blur, src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder - scales to fill */}
      <img
        src={blur}
        alt=""
        className={`${className} absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(8px)', transform: 'scale(1.1)' }}
      />
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

// Lightbox image - shows spinner then image
const LightboxImage: React.FC<{
  src: string;
  alt: string;
}> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Loading spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      {/* Full image */}
      <img
        src={src}
        alt={alt}
        className={`max-w-full max-h-[85vh] object-contain rounded-lg transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const Gallery: NextPage = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const navigatePhoto = useCallback((direction: number) => {
    const newIndex = (selectedIndex + direction + photos.length) % photos.length;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedPhoto) return;
    if (e.key === 'Escape') setSelectedPhoto(null);
    else if (e.key === 'ArrowRight') navigatePhoto(1);
    else if (e.key === 'ArrowLeft') navigatePhoto(-1);
  }, [selectedPhoto, navigatePhoto]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Layout title="&Goliath | Gallery">
      <div className="min-h-screen">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif text-primary text-center mb-12"
        >
          Gallery
        </motion.h1>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
              onClick={() => {
                setSelectedPhoto(photo);
                setSelectedIndex(index);
              }}
            >
              <GridImage
                blur={photo.blur}
                src={photo.thumb}
                alt={photo.location}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 text-white">
                  <FaMapMarkerAlt className="text-primary" size={14} />
                  <span className="font-medium">{photo.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={() => setSelectedPhoto(null)}
            >
              <button
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
                onClick={() => setSelectedPhoto(null)}
              >
                <FaTimes size={28} />
              </button>

              <button
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full"
                onClick={(e) => { e.stopPropagation(); navigatePhoto(-1); }}
              >
                <FaChevronLeft size={32} />
              </button>
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full"
                onClick={(e) => { e.stopPropagation(); navigatePhoto(1); }}
              >
                <FaChevronRight size={32} />
              </button>

              <motion.div
                key={selectedPhoto.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-[90vw] max-h-[85vh] relative"
                onClick={(e) => e.stopPropagation()}
              >
                <LightboxImage
                  src={selectedPhoto.full}
                  alt={selectedPhoto.location}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="text-white text-xl font-medium">{selectedPhoto.location}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedIndex + 1} / {photos.length}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Gallery;

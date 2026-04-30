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

// Grid image - keeps the photo sharp over a blurred version of itself.
const GridImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="gallery-image relative overflow-hidden">
      <img
        src={src}
        alt=""
        className="gallery-image-bg"
        loading="lazy"
        aria-hidden="true"
      />
      <img
        src={src}
        alt={alt}
        className={`${className} gallery-image-main transition-opacity duration-300 ${
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
  const filmStripPhotos = [...photos, ...photos];

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

  useEffect(() => {
    const className = 'gallery-themed';
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, []);

  return (
    <Layout title="&Goliath | Gallery">
      <div className="gallery-atmosphere" aria-hidden="true">
        <div className="gallery-wash" />
        <div className="gallery-grain" />
        <div className="film-strip film-strip-left">
          <div className="film-track">
            {filmStripPhotos.map((photo, index) => (
              <span key={`left-${photo.id}-${index}`} className="film-frame">
                <img src={photo.thumb} alt="" />
              </span>
            ))}
          </div>
        </div>
        <div className="film-strip film-strip-right">
          <div className="film-track reverse">
            {filmStripPhotos.slice().reverse().map((photo, index) => (
              <span key={`right-${photo.id}-${index}`} className="film-frame">
                <img src={photo.thumb} alt="" />
              </span>
            ))}
          </div>
        </div>
        <div className="exposure-mark exposure-mark-one" />
        <div className="exposure-mark exposure-mark-two" />
      </div>

      <div className="gallery-page min-h-screen relative z-[1]">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gallery-title text-4xl md:text-5xl font-serif text-primary text-center mb-12"
        >
          Gallery
        </motion.h1>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="gallery-grid columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="gallery-card break-inside-avoid group relative overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedPhoto(photo);
                setSelectedIndex(index);
              }}
            >
              <GridImage
                src={photo.full}
                alt={photo.location}
                className="w-full transition-transform duration-500 group-hover:scale-[1.025]"
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
              className="gallery-lightbox fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => setSelectedPhoto(null)}
            >
              <div
                className="gallery-lightbox-photo"
                style={{ backgroundImage: `url(${selectedPhoto.full})` }}
              />
              <div className="gallery-lightbox-filter" />

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
      <style jsx global>{`
        html:has(body.gallery-themed) {
          background: #120f16 !important;
        }
        body.gallery-themed {
          background:
            linear-gradient(115deg, rgba(90, 48, 48, 0.36), transparent 36%),
            linear-gradient(245deg, rgba(34, 70, 72, 0.24), transparent 42%),
            linear-gradient(180deg, #171019 0%, #0f1116 45%, #14100d 100%) !important;
          background-attachment: fixed !important;
          min-height: 100vh;
        }
        body.gallery-themed .site-shell,
        body.gallery-themed .site-main {
          background: transparent !important;
          position: relative;
        }
        body.gallery-themed .site-main {
          z-index: 1;
        }
        body.gallery-themed .site-header {
          background: rgba(16, 14, 18, 0.56) !important;
          border-bottom: 1px solid rgba(244, 214, 167, 0.16) !important;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
        }
        body.gallery-themed .site-header h1 .text-primary,
        body.gallery-themed .site-header .text-primary,
        body.gallery-themed .site-header nav a:hover,
        body.gallery-themed .site-header nav a.text-primary {
          color: #f0bd8b !important;
        }
        body.gallery-themed .site-footer {
          border-top-color: rgba(244, 214, 167, 0.16) !important;
          position: relative;
          z-index: 1;
        }
        .gallery-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .gallery-wash {
          position: absolute;
          inset: -10%;
          background:
            conic-gradient(from 18deg at 12% 28%, rgba(249, 177, 109, 0.2), transparent 22%, rgba(112, 188, 182, 0.14), transparent 48%, rgba(210, 84, 102, 0.14), transparent 70%),
            linear-gradient(90deg, rgba(255, 240, 205, 0.06), transparent 26%, transparent 74%, rgba(255, 190, 118, 0.08));
          filter: blur(18px);
          opacity: 0.88;
        }
        .gallery-grain {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.026) 0 1px, transparent 1px 4px),
            repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.11) 0 1px, transparent 1px 7px);
          mix-blend-mode: soft-light;
          opacity: 0.38;
        }
        .film-strip {
          position: absolute;
          top: -18vh;
          bottom: -18vh;
          width: clamp(88px, 11vw, 148px);
          opacity: 0.26;
          filter: saturate(0.78) contrast(1.18) brightness(0.74);
          transform: rotate(var(--film-tilt));
        }
        .film-strip-left {
          --film-tilt: -7deg;
          left: max(-38px, -3vw);
        }
        .film-strip-right {
          --film-tilt: 6deg;
          right: max(-42px, -3vw);
        }
        .film-strip::before,
        .film-strip::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 14%;
          background:
            repeating-linear-gradient(180deg, rgba(255, 237, 199, 0.45) 0 9px, transparent 9px 22px),
            rgba(8, 8, 9, 0.82);
          z-index: 2;
        }
        .film-strip::before { left: 0; }
        .film-strip::after { right: 0; }
        .film-track {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 200%;
          animation: galleryFilmDrift 46s linear infinite;
        }
        .film-track.reverse {
          animation-name: galleryFilmDriftReverse;
          animation-duration: 52s;
        }
        .film-frame {
          display: block;
          aspect-ratio: 3 / 4;
          margin: 0 16%;
          border: 1px solid rgba(255, 238, 197, 0.26);
          background: #09090a;
          box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.72);
          overflow: hidden;
        }
        .film-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .exposure-mark {
          position: absolute;
          border: 1px solid rgba(255, 224, 176, 0.16);
          opacity: 0.34;
          mix-blend-mode: screen;
        }
        .exposure-mark-one {
          width: clamp(180px, 26vw, 380px);
          height: clamp(64px, 8vw, 110px);
          top: 12vh;
          left: 20vw;
          transform: rotate(-8deg);
          background: linear-gradient(90deg, rgba(255, 210, 150, 0.16), transparent);
        }
        .exposure-mark-two {
          width: clamp(140px, 18vw, 280px);
          height: clamp(140px, 18vw, 280px);
          right: 12vw;
          bottom: 10vh;
          border-radius: 50%;
          background: conic-gradient(from 140deg, transparent, rgba(108, 204, 187, 0.12), transparent 58%);
        }
        .gallery-page {
          padding-bottom: clamp(48px, 8vw, 96px);
        }
        .gallery-title {
          color: #f0bd8b !important;
          text-shadow: 0 10px 34px rgba(0, 0, 0, 0.42);
        }
        .gallery-card {
          border-radius: 7px;
          border: 1px solid rgba(255, 231, 188, 0.2);
          box-shadow:
            0 18px 44px rgba(0, 0, 0, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          background: rgba(14, 12, 13, 0.62);
          padding: 5px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .gallery-card::before {
          content: "";
          position: absolute;
          inset: 5px;
          z-index: 1;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.08);
          mix-blend-mode: screen;
        }
        .gallery-card > div {
          border-radius: 4px;
        }
        .gallery-image {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(8, 7, 8, 0.8);
        }
        .gallery-image-bg {
          position: absolute;
          inset: -18px;
          width: calc(100% + 36px);
          height: calc(100% + 36px);
          object-fit: cover;
          filter: blur(18px) saturate(1.15) brightness(0.62);
          transform: scale(1.06);
          opacity: 0.78;
        }
        .gallery-image-main {
          position: relative;
          z-index: 1;
          height: auto;
          object-fit: contain;
          filter: none;
        }
        .gallery-lightbox {
          background: #050506;
          isolation: isolate;
          overflow: hidden;
        }
        .gallery-lightbox-photo {
          position: absolute;
          inset: -8%;
          z-index: -2;
          background-size: cover;
          background-position: center;
          filter: blur(42px) saturate(1.22) contrast(1.04) brightness(0.64);
          transform: scale(1.08);
          opacity: 0.96;
        }
        .gallery-lightbox-filter {
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            radial-gradient(ellipse at center, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.26) 54%, rgba(0, 0, 0, 0.76) 100%),
            repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 4px),
            rgba(2, 2, 3, 0.2);
          box-shadow: inset 0 0 180px rgba(0, 0, 0, 0.68);
          mix-blend-mode: normal;
        }
        @keyframes galleryFilmDrift {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(0, -50%, 0); }
        }
        @keyframes galleryFilmDriftReverse {
          from { transform: translate3d(0, -50%, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        @media (max-width: 760px) {
          .film-strip {
            opacity: 0.16;
            width: 82px;
          }
          .gallery-card {
            padding: 4px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .film-track,
          .film-track.reverse {
            animation: none;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Gallery;

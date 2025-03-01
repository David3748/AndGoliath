import type { NextPage } from 'next';
import { motion } from 'framer-motion';
import SimpleLayout from '../components/SimpleLayout';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const backgroundTextPhrase = "We're here because ";
const wordsPerLine = 10;
const lines = 30; // Reduced lines for performance

const Because: NextPage = () => {
  const backgroundTextRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [wordPositions, setWordPositions] = useState< { x: number, y: number, index: number }[] >([]);
  const [mousePosition, setMousePosition] = useState< { x: number, y: number } | null >(null);

  useEffect(() => {
    const generateBackgroundText = () => {
      if (!backgroundTextRef.current) return;
      let text = "";
      for (let i = 0; i < lines; i++) {
        text += backgroundTextPhrase.repeat(wordsPerLine) + "\n";
      }
      // Create spans for each word for individual styling
      const words = text.split(/\s+/); // Split by spaces and newlines
      backgroundTextRef.current.innerHTML = words.map((word, index) => `<span key=${index} data-index=${index} style="opacity: 0; display: inline-block; margin-right: 5px; margin-bottom: 3px;">${word}</span>`).join(" ");

      // Calculate initial word positions after rendering
      setTimeout(() => { // Wait for rendering
        if (!backgroundTextRef.current) return;
        const spans = Array.from(backgroundTextRef.current.querySelectorAll('span'));
        const positions = spans.map((span, index) => {
          const rect = span.getBoundingClientRect();
          const sectionRect = sectionRef.current?.getBoundingClientRect();
          return {
            x: rect.left - (sectionRect?.left || 0) + rect.width / 2, // Center of word relative to section
            y: rect.top - (sectionRect?.top || 0) + rect.height / 2,  // Center of word relative to section
            index: parseInt(span.dataset.index || String(index), 10)
          };
        });
        setWordPositions(positions);
      }, 100); // Short delay to allow rendering
    };

    generateBackgroundText();
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;
    const sectionRect = sectionElement.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - sectionRect.left, // Mouse X relative to section
      y: event.clientY - sectionRect.top   // Mouse Y relative to section
    });
  };

  useEffect(() => {
    if (!backgroundTextRef.current || !mousePosition) return;
    const spans = backgroundTextRef.current.querySelectorAll('span');
    spans.forEach((span, index) => {
      const wordPos = wordPositions.find(pos => pos.index === index);
      if (!wordPos) return;

      const distance = Math.sqrt(
        (mousePosition.x - wordPos.x) ** 2 + (mousePosition.y - wordPos.y) ** 2
      );

      const maxDistance = 150; // Radius of visibility
      let opacity = 0;
      if (distance < maxDistance) {
        opacity = 1 - (distance / maxDistance); // Closer is more opaque
      }

      span.style.opacity = String(opacity);
    });
  }, [mousePosition, wordPositions]);


  const handleMouseLeave = () => {
    setMousePosition(null); // Reset mouse position to hide all
    if (backgroundTextRef.current) {
      const spans = backgroundTextRef.current.querySelectorAll('span');
      spans.forEach(span => {
        span.style.opacity = '0'; // Hide all words on mouse leave
      });
    }
  };


  return (
    <SimpleLayout title="&Goliath | Because">
      <section
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        ref={sectionRef}
        onMouseMove={handleMouseMove} // Track mouse move
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={backgroundTextRef}
          className="absolute inset-0 text-gray-600 font-serif text-center pointer-events-none"
          style={{ lineHeight: '1.2', whiteSpace: 'pre-line', fontSize: '1.5rem' }}
        >
          {/* Text will be dynamically generated here */}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="prose prose-lg max-w-none text-center relative"
        >
          <h1 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8 text-gray-100">
            We're here <Link href="/" className="text-primary hover:underline">because</Link>
          </h1>
        </motion.div>
      </section>
    </SimpleLayout>
  );
};

export default Because;
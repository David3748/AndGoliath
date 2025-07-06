import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement;
      const clickableSelector = 'a[href], button, input, textarea, select, label, [role="button"], [role="link"], [contenteditable], .clickable, [data-clickable]';
      const clickableElement = target.closest(clickableSelector);
      const computedPointer = window.getComputedStyle(target).cursor === 'pointer';
      const isClickable = Boolean(clickableElement) || computedPointer;
      
      setIsPointer(isClickable);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Hide default cursor with CSS and only show on mobile/touch devices
  useEffect(() => {
    document.body.classList.add('custom-cursor');
    
    return () => {
      document.body.classList.remove('custom-cursor');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer cursor circle */}
      <div
        className="custom-cursor-hexagon"
        style={{
          transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`,
          opacity: isVisible ? 1 : 0,
          width: isPointer ? '100px' : '32px',
          height: isPointer ? '100px' : '32px',
        }}
      />
      
      {/* Inner cursor dot */}
      {isPointer && (
        <div
          className={`custom-cursor-dot ${isClicking ? 'clicking' : ''}`}
          style={{
            transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`,
            opacity: isVisible ? 1 : 0,
          }}
        />
      )}
    </>
  );
};

export default CustomCursor; 
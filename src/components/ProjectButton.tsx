import React from 'react';

interface ProjectButtonProps {
  title: string;
  onClick: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  keyNumber?: number;
  isPressed?: boolean;
}

// Audio file management for Cherry MX Blue sounds
let pressAudio: HTMLAudioElement | null = null;
let releaseAudio: HTMLAudioElement | null = null;

const initializeAudio = () => {
  if (typeof window === 'undefined') return;
  
  // Load press sound (key down)
  if (!pressAudio) {
    pressAudio = new Audio('/sounds/SpacePress.mp3');
    pressAudio.preload = 'auto';
    pressAudio.volume = 0.3;
  }
  
  // Load release sound (key up)  
  if (!releaseAudio) {
    releaseAudio = new Audio('/sounds/SpaceRelease.mp3');
    releaseAudio.preload = 'auto';
    releaseAudio.volume = 0.3;
  }
};

const playPressSound = () => {
  initializeAudio();
  if (pressAudio) {
    pressAudio.currentTime = 0; // Reset to start
    pressAudio.play().catch(() => {
      // Fallback to synthetic sound if file doesn't exist
      console.log('Press sound file not found, using synthetic fallback');
    });
  }
};

const playReleaseSound = () => {
  initializeAudio();
  if (releaseAudio) {
    releaseAudio.currentTime = 0; // Reset to start
    releaseAudio.play().catch(() => {
      // Fallback to synthetic sound if file doesn't exist
      console.log('Release sound file not found, using synthetic fallback');
    });
  }
};

const ProjectButton: React.FC<ProjectButtonProps> = ({ 
  title, 
  onClick, 
  color = '#3b82f6', // Default blue color
  size = 'medium',
  keyNumber,
  isPressed = false
}) => {
  const sizeClasses = {
    small: 'w-24 h-24 text-xs',
    medium: 'w-32 h-32 text-sm',
    large: 'w-40 h-40 text-base'
  };

  const handleClick = () => {
    playPressSound();
    // Simulate quick press/release for mouse clicks
    setTimeout(() => {
      playReleaseSound();
    }, 50);
    onClick();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Button */}
      <div 
        className={`project-button relative cursor-pointer select-none ${sizeClasses[size]} ${isPressed ? 'pressed' : ''}`}
        style={{
          '--hover-travel': '2px',
          '--press-travel': '8px',
          '--color': color,
          '--brightness': '0.7', // Reduced brightness for matte effect
          '--blend-mode': 'multiply', // Changed blend mode for more matte appearance
          '--transition-duration': '0.4s',
          '--transition-easing': 'linear(0, 0.008 1.1%, 0.031 2.2%, 0.129 4.8%, 0.257 7.2%, 0.671 14.2%, 0.789 16.5%, 0.881 18.6%, 0.957 20.7%, 1.019 22.9%, 1.063 25.1%, 1.094 27.4%, 1.114 30.7%, 1.112 34.5%, 1.018 49.9%, 0.99 59.1%, 1)'
        } as React.CSSProperties}
        onClick={handleClick}
      >
        {/* Base */}
        <img 
          className="w-full h-full" 
          src="/button-assets/base.svg" 
          alt="button base" 
          draggable={false}
        />
        
        {/* Button */}
        <img 
          className="project-button-layer absolute top-0 left-0 w-full h-full"
          style={{
            filter: 'brightness(var(--brightness))',
            transition: 'all var(--transition-duration) var(--transition-easing)'
          }}
          src="/button-assets/button.svg" 
          alt="button" 
          draggable={false}
        />
        
        {/* Recolor Overlay */}
        <svg 
          className="project-button-layer absolute top-0 left-0 w-full h-full"
          style={{
            color: color,
            mixBlendMode: 'color' as any,
            transition: 'all var(--transition-duration) var(--transition-easing)'
          }}
          viewBox="0 0 400 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M165.675 45.467C175.026 44.5675 185.116 47.156 197.282 51.1232C232.426 62.5832 267.932 74.4187 307.642 86.6369C312.212 88.0431 315.403 89.8794 317.44 92.1486C318.511 93.341 319.241 94.6327 319.691 96.0011C319.738 96.0238 319.777 96.0473 319.808 96.0734C323.933 99.6423 327.485 108.542 328.746 112.546C333.559 127.417 343.667 158.667 345.593 164.707C347.829 171.722 351.843 177.846 347.437 185.285C347.318 185.578 347.187 185.873 347.042 186.169L346.987 186.005C346.768 186.338 346.534 186.675 346.28 187.013C340.092 195.249 293.679 246.724 273.395 270.745C253.112 294.767 245.626 307.362 209.871 297.41C174.117 287.459 88.3902 254.694 68.1503 244.665C49.7396 235.543 50.9605 229.908 53.7108 219.613C55.9113 211.377 69.9838 160.36 76.745 135.881C76.8387 135.864 76.9324 135.846 77.0263 135.828C77.2577 135.071 77.5382 134.315 77.8554 133.559C78.637 130.76 80.1703 127.902 81.913 124.901C87.4843 115.306 101.154 100.903 107.267 94.9152L112.901 88.7316C117.228 83.8274 124.233 75.8678 138.572 60.5568C147.707 50.8031 156.252 46.3734 165.675 45.467Z" 
            fill="currentColor"
          />
        </svg>
        
        {/* Cover */}
        <img 
          className="absolute top-0 left-0 w-full h-full pointer-events-none" 
          src="/button-assets/cover.svg" 
          alt="button cover" 
          draggable={false}
        />
        
        {/* Engraved Number */}
        {keyNumber && (
          <div 
            className="project-button-layer absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
            style={{
              transition: 'all var(--transition-duration) var(--transition-easing)'
            }}
          >
            <span 
              className="key-number text-xl font-bold select-none"
              style={{
                transform: 'rotateY(0deg) rotateX(52.3deg) rotateZ(29deg) translateY(-100%) translateX(-100%)',
                textShadow: `
                  0 1px 0 rgba(255,255,255,0.2),
                  0 -1px 0 rgba(0,0,0,0.8),
                  1px 0 0 rgba(0,0,0,0.6),
                  -1px 0 0 rgba(255,255,255,0.1),
                  0 2px 3px rgba(0,0,0,0.4)
                `,
                color: '#d1d5db',
                fontFamily: 'monospace',
                fontWeight: '900'
              }}
            >
              {keyNumber}
            </span>
          </div>
        )}
      </div>
      
      {/* Button Label Below */}
      <p className="mt-3 text-center text-foreground/90 font-medium text-sm">
        {title}
      </p>
    </div>
  );
};

// Export sound functions for use in other components
export { playPressSound, playReleaseSound };

export default ProjectButton; 
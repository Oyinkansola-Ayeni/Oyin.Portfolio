/**
 * LoadingScreen Component
 * 
 * A minimal loading animation displayed while 3D assets initialize.
 * Features a progress bar with smooth animation.
 * 
 * Exit animation: Fades out and slides up when loading completes.
 */

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000; // 2 seconds total load time
    const interval = 16; // ~60fps
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment + Math.random() * 2;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Small delay before exit animation
      const exitTimer = setTimeout(() => {
        // GSAP exit animation
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              onLoadComplete?.();
            },
          });
        }
      }, 300);

      return () => clearTimeout(exitTimer);
    }
  }, [progress, onLoadComplete]);

  return (
    <div
      ref={containerRef}
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-dark-bg
        transition-opacity duration-300
      `}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-surface via-dark-bg to-dark-bg" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo/Brand */}
        <div className="text-4xl md:text-6xl font-bold tracking-tighter">
          <span className="gradient-text">OYIN.</span>
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm tracking-widest uppercase">
            Loading Experience
          </span>
          <span className="text-neon-cyan text-sm font-mono">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Decorative elements */}
        <div className="flex gap-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-cyan/50"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-white/10" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/10" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10" />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;

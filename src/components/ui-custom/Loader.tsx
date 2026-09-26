/**
 * Custom Loader Component
 * 
 * Inspired by AVA SRG's loader animation.
 * Features:
 * - Split brand animation: OYIN | .dev with VERTICAL progress bar between them
 * - Animated percentage counter (0% → 100%)
 * - Year/copyright info at bottom
 * - Smooth exit animation
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoaderProps {
  onLoadComplete?: () => void;
}

export function Loader({ onLoadComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.random() * 12, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        onLoadComplete?.();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoadComplete]);

  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-bg"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Main content container */}
          <div className="relative flex flex-col items-center">
            {/* OYIN and .dev with VERTICAL progress bar between them */}
            <div className="flex items-center gap-8 md:gap-12">
              {/* OYIN - left side */}
              <motion.div
                className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span className="text-primary-500">OYIN</span>
              </motion.div>

              {/* VERTICAL PROGRESS BAR between OYIN and .dev */}
              <div className="h-24 md:h-32 w-px bg-gray-800 relative overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-primary-500"
                  initial={{ height: '0%' }}
                  animate={{ height: `${progress}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </div>

              {/* .dev - right side */}
              <motion.div
                className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              >
                <span className="text-white">.dev</span>
              </motion.div>
            </div>

            {/* Percentage counter below */}
            <motion.div
              className="text-3xl md:text-4xl font-mono text-gray-500 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {Math.floor(progress)}%
            </motion.div>

            {/* Bottom info */}
            <motion.div
              className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 text-center text-gray-600 text-xs tracking-wider whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex gap-6">
                <span>{window.innerWidth} × {window.innerHeight} W</span>
                <span>© {currentYear}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Loader;
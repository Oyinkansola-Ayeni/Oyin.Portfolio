/**
 * Circular Scroll Progress Indicator
 * 
 * Shows scroll percentage in a circular progress ring
 * Positioned at bottom right corner
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  let hideTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const percent = (scrollTop / maxScroll) * 100;
      setScrollPercent(Math.min(100, Math.max(0, percent)));
      
      // Show indicator when scrolling
      setIsVisible(true);
      
      // Hide after 2 seconds of no scrolling
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimeout);
    };
  }, []);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 cursor-pointer group"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl group-hover:bg-primary-500/30 transition-all duration-300" />
          
          {/* Main Circular Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-800"
              />
              {/* Progress Circle with gradient */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className="transition-all duration-200 drop-shadow-lg"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono font-medium text-white">
                {Math.floor(scrollPercent)}%
              </span>
            </div>
          </div>
          
          {/* Tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-y-1 group-hover:translate-y-0">
            <div className="bg-dark-card border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-400 whitespace-nowrap shadow-lg backdrop-blur-sm">
              Scroll to top ↑
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScrollProgress;
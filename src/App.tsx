/**
 * OYIN.VISION Portfolio - Main App Component
 * 
 * This is the root component that orchestrates the entire portfolio:
 * - Custom loader with OYIN/.dev brand animation (vertical progress between text)
 * - Smooth scroll with Lenis
 * - Custom cursor (desktop only)
 * - Floating orbs in hero section (visible movement)
 * - Architectural 3D grid between About and Projects (structured like a city skyline)
 * - Circular scroll progress indicator (bottom right, auto-hides)
 * - All sections with GSAP scroll animations
 * 
 * Architecture:
 * 1. Loader - Custom branded loader with vertical progress between OYIN and .dev
 * 2. Navigation - Fixed glassmorphism nav (hides on scroll, shows after 3 seconds)
 * 3. Hero with floating orbs 3D background (visible movement)
 * 4. About section
 * 5. ArchitecturalShowcase - Structured 3D grid between About and Projects
 * 6. Projects section
 * 7. Services section
 * 8. Testimonials section
 * 9. Contact section
 * 10. Footer - CTA and links
 * 11. CustomCursor - Replaces default cursor on desktop
 * 12. ScrollProgress - Circular scroll indicator at bottom right (auto-hides after 2 seconds)
 */

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import { Loader } from '@/components/ui-custom/Loader';
import { Navigation } from '@/components/ui-custom/Navigation';
import { CustomCursor } from '@/components/ui-custom/CustomCursor';
import { ScrollProgress } from '@/components/ui-custom/ScrollProgress';

// Sections
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { ArchitecturalShowcase } from '@/sections/ArchitecturalShowcase';
import { Projects } from '@/sections/Projects';
import { Services } from '@/sections/Services';
import { Testimonials } from '@/sections/Testimonials';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';

// Hooks
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useTheme } from '@/hooks/useTheme';

// Utils
import { cleanUrlHash, scrollToTop } from '@/utils/helpers';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { mounted } = useTheme();

  // Initialize smooth scroll
  useSmoothScroll();

  // Handle loading complete
  const handleLoadComplete = () => {
    setIsLoading(false);
    
    // Ensure page is at top after loader
    scrollToTop();
    
    // Refresh ScrollTrigger after loading
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  // Clean up URL hash on initial load
  useEffect(() => {
    cleanUrlHash();
  }, []);

  // Setup GSAP defaults
  useEffect(() => {
    // Set default GSAP easing
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8,
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Don't render until theme is mounted (light mode disabled, dark mode only)
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Custom Loader - OYIN | .dev with VERTICAL progress bar between them */}
      <Loader onLoadComplete={handleLoadComplete} />

      {/* Main content */}
      <div 
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        {/* Custom Cursor - Desktop only */}
        <CustomCursor />

        {/* Navigation - Sticky header that hides on scroll, shows after 3 seconds */}
        <Navigation />

        {/* Circular Scroll Progress Indicator - Bottom right, auto-hides after scrolling stops */}
        <ScrollProgress />

        {/* Noise texture overlay (subtle grain effect) */}
        <div className="fixed inset-0 pointer-events-none z-30 opacity-5 mix-blend-overlay">
          <div className="noise-overlay w-full h-full" />
        </div>

        {/* Main content */}
        <main className="relative">
          <Hero />
          <About />
          {/* Architectural 3D Grid - Structured like a city skyline */}
          <ArchitecturalShowcase />
          <Projects />
          <Services />
          <Testimonials />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

// Add default export at the end
export default App;
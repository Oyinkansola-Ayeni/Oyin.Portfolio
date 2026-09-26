/**
 * Navigation Component
 * 
 * Features:
 * - Hides when scrolling down, shows after 3 seconds of no scrolling
 * - Glass blur background
 * - Smooth scroll to sections
 * - Mobile menu
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { scrollToElement } from '@/utils/helpers';

const navItems = [
  { label: 'Home', href: 'hero' },
  { label: 'About', href: 'about' },
  { label: 'Projects', href: 'projects' },
  { label: 'Services', href: 'services' },
  { label: 'Contact', href: 'contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add background when scrolled
      setIsScrolled(currentScrollY > 50);
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsVisible(false);
        
        // Clear any existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show header immediately
        setIsVisible(true);
        
        // Clear any existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else {
        // Not scrolling - after 3 seconds, hide if we're past the hero section
        if (!hideTimeoutRef.current && currentScrollY > 100) {
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            hideTimeoutRef.current = null;
          }, 3000);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Show header on mouse move near top
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setIsVisible(true);
        
        // Reset timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleNavClick = (href: string) => {
    scrollToElement(href, 80);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -120 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <nav
          className={`
            mx-4 mt-4 px-6 py-4 rounded-2xl
            transition-all duration-300
            ${isScrolled 
              ? 'bg-dark-card/90 backdrop-blur-xl border border-gray-800 shadow-lg' 
              : 'bg-dark-card/60 backdrop-blur-md border border-gray-800/50'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <a 
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('hero');
              }}
              className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
            >
              <span className="text-primary-500">OYIN.</span>
              <span className="text-white">dev</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="relative text-sm text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <Menu size={20} className="text-white" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.nav
              className="absolute top-24 left-4 right-4 bg-dark-card/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={`#${item.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="text-lg text-gray-300 hover:text-primary-500 transition-colors duration-300 py-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
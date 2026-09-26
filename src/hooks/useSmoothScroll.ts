import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    // Just ensure CSS smooth scroll is enabled
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
}
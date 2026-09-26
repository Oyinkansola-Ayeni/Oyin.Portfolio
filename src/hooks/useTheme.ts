/**
 * useTheme Hook
 * 
 * Manages dark/light theme state with localStorage persistence.
 * Automatically applies theme class to document and saves preference.
 * 
 * Usage:
 * const { theme, toggleTheme, setTheme } = useTheme();
 */

import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return {
      theme: 'dark' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
      mounted: false,
    };
  }

  return {
    theme,
    toggleTheme,
    setTheme,
    mounted: true,
  };
}

export default useTheme;

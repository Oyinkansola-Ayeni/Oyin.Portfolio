/**
 * Helper Utilities
 * 
 * Collection of utility functions for the portfolio.
 */

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight - offset) &&
    rect.bottom >= offset
  );
}

/**
 * Get scroll progress of element (0 to 1)
 */
export function getScrollProgress(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementTop = rect.top;
  const elementHeight = rect.height;
  
  const progress = (windowHeight - elementTop) / (windowHeight + elementHeight);
  return clamp(progress, 0, 1);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate random number in range
 */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random integer in range
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Easing functions
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

/**
 * Split text into characters for animation
 */
export function splitText(text: string): string[] {
  return text.split('');
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Smooth scroll to element with offset
 */
export function scrollToElement(elementId: string, offset: number = 80): void {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Scroll to top instantly or smoothly
 */
export function scrollToTop(smooth: boolean = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

/**
 * Clean URL hash to prevent auto-scrolling on load
 * Also handles restoring hash after initial render if needed
 */
export function cleanUrlHash(restoreAfterDelay: number = 500): void {
  if (window.location.hash) {
    // Store hash temporarily
    const hash = window.location.hash;
    // Remove hash without triggering scroll
    window.history.pushState(null, '', window.location.pathname);
    // If there was a hash, scroll to it after initial load
    if (hash && hash !== '#') {
      setTimeout(() => {
        const elementId = hash.replace('#', '');
        scrollToElement(elementId, 80);
      }, restoreAfterDelay);
    }
  }
}

/**
 * Get current scroll percentage of the page (0 to 100)
 */
export function getScrollPercentage(): number {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const maxScroll = documentHeight - windowHeight;
  
  if (maxScroll <= 0) return 0;
  return (scrollTop / maxScroll) * 100;
}

/**
 * Check if page is at the top
 */
export function isAtTop(): boolean {
  return window.scrollY === 0;
}

/**
 * Check if page is at the bottom
 */
export function isAtBottom(threshold: number = 50): boolean {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  
  return scrollTop + windowHeight >= documentHeight - threshold;
}

/**
 * Get element's position relative to viewport
 */
export function getElementPosition(elementId: string): { top: number; bottom: number; left: number; right: number } | null {
  const element = document.getElementById(elementId);
  if (!element) return null;
  
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
  };
}

/**
 * Wait for element to exist in DOM
 */
export function waitForElement(elementId: string, timeout: number = 5000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      const element = document.getElementById(elementId);
      if (element) {
        clearInterval(checkInterval);
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error(`Element "${elementId}" not found within ${timeout}ms`));
      }
    }, 50);
  });
}
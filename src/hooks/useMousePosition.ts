/**
 * useMousePosition Hook
 * 
 * Tracks mouse position for parallax effects and 3D interactions.
 * Returns normalized coordinates (-1 to 1) and pixel coordinates.
 * 
 * Usage:
 * const { x, y, normalizedX, normalizedY } = useMousePosition();
 * 
 * // Use in 3D:
 * meshRef.current.rotation.x = normalizedY * 0.5;
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const rafId = useRef<number | null>(null);
  const lastUpdate = useRef<number>(0);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = performance.now();
    
    // Throttle to ~60fps
    if (now - lastUpdate.current < 16) return;
    lastUpdate.current = now;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      setMousePosition({
        x: clientX,
        y: clientY,
        normalizedX: (clientX / innerWidth) * 2 - 1,
        normalizedY: -(clientY / innerHeight) * 2 + 1,
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove]);

  return mousePosition;
}

/**
 * useRelativeMousePosition Hook
 * Tracks mouse position relative to a specific element
 */
export function useRelativeMousePosition(elementRef: React.RefObject<HTMLElement | null>) {
  const [relativePosition, setRelativePosition] = useState({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isInside: false,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const isInside = 
        x >= 0 && 
        x <= rect.width && 
        y >= 0 && 
        y <= rect.height;

      setRelativePosition({
        x,
        y,
        normalizedX: (x / rect.width) * 2 - 1,
        normalizedY: -(y / rect.height) * 2 + 1,
        isInside,
      });
    };

    const handleMouseLeave = () => {
      setRelativePosition(prev => ({ ...prev, isInside: false }));
    };

    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);

  return relativePosition;
}

export default useMousePosition;

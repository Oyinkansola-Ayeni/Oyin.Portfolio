/**
 * useDeviceCapabilities Hook
 * 
 * Detects device capabilities for performance optimization.
 * Reduces 3D complexity on mobile/low-power devices.
 * 
 * Usage:
 * const { isMobile, isLowPower, reduceMotion } = useDeviceCapabilities();
 * 
 * // Conditionally render complex effects
 * { !isMobile && <Complex3DEffect /> }
 */

import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  reduceMotion: boolean;
  supportsWebGL: boolean;
  pixelRatio: number;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    isLowPower: false,
    reduceMotion: false,
    supportsWebGL: true,
    pixelRatio: 1,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      // Device type detection
      const isMobile = /iphone|ipod|android.*mobile|windows phone/.test(userAgent) || width < 768;
      const isTablet = /ipad|android(?!.*mobile)|tablet/.test(userAgent) || (width >= 768 && width < 1024);
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check for reduced motion preference
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for low power mode (battery API)
      const checkBattery = async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const battery = await (navigator as any).getBattery?.();
          if (battery) {
            return battery.charging === false && battery.level < 0.2;
          }
        } catch (e) {
          // Battery API not supported
        }
        return false;
      };

      // WebGL support check
      let supportsWebGL = false;
      try {
        const canvas = document.createElement('canvas');
        supportsWebGL = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        supportsWebGL = false;
      }

      // Determine if low power device
      const isLowPower = isMobile || reduceMotion || !supportsWebGL;

      setCapabilities({
        isMobile,
        isTablet,
        isTouch,
        isLowPower,
        reduceMotion,
        supportsWebGL,
        pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2),
      });

      // Check battery status asynchronously
      checkBattery().then(isLowBattery => {
        if (isLowBattery) {
          setCapabilities(prev => ({ ...prev, isLowPower: true }));
        }
      });
    };

    checkCapabilities();

    // Re-check on resize
    window.addEventListener('resize', checkCapabilities);
    
    // Listen for reduced motion changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', checkCapabilities);

    return () => {
      window.removeEventListener('resize', checkCapabilities);
      motionQuery.removeEventListener('change', checkCapabilities);
    };
  }, []);

  return capabilities;
}

export default useDeviceCapabilities;

/**
 * CustomCursor Component
 * 
 * A minimal custom cursor that replaces the default system cursor.
 * Features:
 * - Small circle that follows mouse with smooth lerp
 * - Expands on hover over interactive elements
 * - Blend mode difference for visibility
 * - Hidden on touch devices
 */

import { useEffect, useRef, useState } from 'react';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const { isTouch } = useDeviceCapabilities();

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (isTouch) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Mouse position
    const mousePos = { x: 0, y: 0 };
    
    // Cursor position (for smooth following)
    const cursorPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    // Animation loop for smooth cursor following
    const animate = () => {
      // Lerp for smooth following (0.15 = smooth, 0.5 = responsive)
      cursorPos.x += (mousePos.x - cursorPos.x) * 0.15;
      cursorPos.y += (mousePos.y - cursorPos.y) * 0.15;

      // Apply transform
      cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    };

    // Start animation
    const animationId = requestAnimationFrame(animate);

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle hover states for interactive elements
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsHovering(true);
      
      // Check for custom cursor text
      const cursorData = target.getAttribute('data-cursor');
      if (cursorData) {
        setCursorText(cursorData);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorText('');
    };

    // Add listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isTouch]);

  // Re-attach listeners when DOM changes
  useEffect(() => {
    if (isTouch) return;

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsHovering(true);
      const cursorData = target.getAttribute('data-cursor');
      if (cursorData) setCursorText(cursorData);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorText('');
    };

    const observer = new MutationObserver(() => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor]');
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isTouch]);

  // Don't render on touch devices
  if (isTouch) return null;

  return (
    <>
      {/* Main cursor circle */}
      <div
        ref={cursorRef}
        className={`
          fixed top-0 left-0 pointer-events-none z-[9999]
          mix-blend-difference
          transition-[width,height] duration-200 ease-out
          flex items-center justify-center
        `}
        style={{
          width: isHovering ? (cursorText ? 80 : 50) : 20,
          height: isHovering ? (cursorText ? 80 : 50) : 20,
        }}
      >
        <div 
          className={`
            w-full h-full rounded-full border-2 border-white
            transition-all duration-200
            ${isHovering ? 'bg-white/20' : 'bg-transparent'}
          `}
        />
        
        {/* Cursor text */}
        {cursorText && (
          <span className="absolute text-white text-xs font-medium mix-blend-difference">
            {cursorText}
          </span>
        )}
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className={`
          fixed top-0 left-0 pointer-events-none z-[9999]
          w-1 h-1 rounded-full bg-white
          mix-blend-difference
          transition-opacity duration-200
          ${isHovering ? 'opacity-0' : 'opacity-100'}
        `}
      />

      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}

export default CustomCursor;

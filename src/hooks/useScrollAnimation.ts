/**
 * useScrollAnimation Hook
 * 
 * Provides GSAP ScrollTrigger animations for sections and elements.
 * Handles fade-in, slide-up, and stagger animations triggered by scroll.
 * 
 * Usage:
 * const sectionRef = useScrollAnimation({
 *   animation: 'fadeInUp',
 *   delay: 0.2
 * });
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  delay?: number;
  duration?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  stagger?: number;
  ease?: string;
  y?: number;
  x?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    animation = 'fadeInUp',
    delay = 0,
    duration = 1,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    stagger = 0.1,
    ease = 'power3.out',
    y = 60,
    x = 0,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state based on animation type
    let fromVars: gsap.TweenVars = { opacity: 0 };
    let toVars: gsap.TweenVars = { 
      opacity: 1, 
      duration, 
      delay, 
      ease,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        markers,
        toggleActions: 'play none none reverse',
      }
    };

    switch (animation) {
      case 'fadeInUp':
        fromVars = { ...fromVars, y };
        toVars = { ...toVars, y: 0 };
        break;
      case 'fadeInDown':
        fromVars = { ...fromVars, y: -y };
        toVars = { ...toVars, y: 0 };
        break;
      case 'slideInLeft':
        fromVars = { ...fromVars, x: -x || 100 };
        toVars = { ...toVars, x: 0 };
        break;
      case 'slideInRight':
        fromVars = { ...fromVars, x: x || 100 };
        toVars = { ...toVars, x: 0 };
        break;
      case 'scaleIn':
        fromVars = { ...fromVars, scale: 0.8 };
        toVars = { ...toVars, scale: 1 };
        break;
      case 'fadeIn':
      default:
        break;
    }

    // Check if element has children for stagger effect
    const children = element.querySelectorAll('.animate-child');
    
    if (children.length > 0) {
      gsap.fromTo(children, fromVars, {
        ...toVars,
        stagger,
      });
    } else {
      gsap.fromTo(element, fromVars, toVars);
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [animation, delay, duration, start, end, scrub, markers, stagger, ease, y, x]);

  return elementRef;
}

/**
 * useParallax Hook
 * Creates a parallax scrolling effect for elements
 */
export function useParallax(speed: number = 0.5) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [speed]);

  return elementRef;
}

/**
 * useCountUp Hook
 * Animates a number counting up when it enters viewport
 */
export function useCountUp(end: number, duration: number = 2) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const obj = { value: 0 };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        
        gsap.to(obj, {
          value: end,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = Math.round(obj.value).toString();
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [end, duration]);

  return elementRef;
}

export default useScrollAnimation;

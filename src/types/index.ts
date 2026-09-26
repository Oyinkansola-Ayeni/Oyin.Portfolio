/**
 * Type Definitions
 * 
 * Shared TypeScript types for the portfolio.
 */

import type * as THREE from 'three';

// Project type
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

// Service type
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

// Testimonial type
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

// Skill type
export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | '3d' | 'tools' | 'design';
}

// Social link type
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Theme type
export type Theme = 'dark' | 'light';

// Animation config
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

// Mouse position
export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

// Device capabilities
export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  reduceMotion: boolean;
  supportsWebGL: boolean;
  pixelRatio: number;
}

// Three.js mesh ref
export interface MeshRef {
  current: THREE.Mesh | null;
}

// Navigation item
export interface NavItem {
  label: string;
  href: string;
}

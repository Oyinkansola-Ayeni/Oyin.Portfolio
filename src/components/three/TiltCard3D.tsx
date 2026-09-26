/**
 * TiltCard3D Component
 * 
 * A project card with 3D tilt effect on hover using CSS transforms.
 * Features floating particles and glow effects for premium feel.
 * 
 * Features:
 * - 3D tilt based on mouse position
 * - Glowing border effect
 * - Floating particle decoration
 * - Smooth transitions
 */

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types';

interface TiltCard3DProps {
  project: Project;
  index: number;
}

export function TiltCard3D({ project, index }: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to card center (-1 to 1)
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    // Apply tilt (max 15 degrees)
    const rotateY = mouseX * 15;
    const rotateX = -mouseY * 15;

    setTransform({ rotateX, rotateY });
    
    // Update glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="relative group perspective-1000"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `
          perspective(1000px)
          rotateX(${transform.rotateX}deg)
          rotateY(${transform.rotateY}deg)
          scale(${isHovered ? 1.02 : 1})
        `,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* Glow effect behind card */}
      <div 
        className={`
          absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink
          blur-xl
        `}
      />

      {/* Main card */}
      <div className="relative bg-dark-card border border-white/10 rounded-xl overflow-hidden h-full">
        {/* Glare effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
          }}
        />

        {/* Image container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
          
          {/* Floating particles decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-neon-cyan"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 30}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-20">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-colors duration-300"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-colors duration-300"
              >
                <Github size={14} />
                Code
              </a>
            )}
          </div>
        </div>

        {/* Border glow on hover */}
        <div 
          className={`
            absolute inset-0 rounded-xl pointer-events-none
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            boxShadow: 'inset 0 0 20px rgba(0, 240, 255, 0.2), 0 0 30px rgba(0, 240, 255, 0.1)',
          }}
        />
      </div>
    </motion.div>
  );
}

export default TiltCard3D;

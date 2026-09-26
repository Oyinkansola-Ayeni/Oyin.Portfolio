import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ParticleWave() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    mountRef.current.appendChild(renderer.domElement);

    // Create particle system - REDUCED COUNT (5000 instead of 8000)
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    // Create a wave grid - reduced density
    const gridSize = 70;
    const spacing = 0.35;
    
    let particleIndex = 0;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (particleIndex >= particlesCount) break;
        
        const x = (i - gridSize/2) * spacing;
        const z = (j - gridSize/2) * spacing;
        const y = 0;
        
        positions[particleIndex * 3] = x;
        positions[particleIndex * 3 + 1] = y;
        positions[particleIndex * 3 + 2] = z;
        
        // Use primary blue only - no bright colors
        const color = new THREE.Color(0x0ea5e9);
        colors[particleIndex * 3] = color.r;
        colors[particleIndex * 3 + 1] = color.g;
        colors[particleIndex * 3 + 2] = color.b;
        
        particleIndex++;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Main particle material - SUBTLE, no additive blending
    const material = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x0ea5e9,      // Solid primary blue
      vertexColors: true,
      transparent: true,
      opacity: 0.35,        // Much more subtle
      blending: THREE.NormalBlending, // Removed additive blending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Ambient floating particles - REDUCED COUNT
    const ambientParticlesCount = 1200; // Was 2000
    const ambientPositions = new Float32Array(ambientParticlesCount * 3);
    for (let i = 0; i < ambientParticlesCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 25;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 8;
    }
    const ambientGeometry = new THREE.BufferGeometry();
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    const ambientMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.2,
      blending: THREE.NormalBlending,
    });
    const ambientParticles = new THREE.Points(ambientGeometry, ambientMaterial);
    scene.add(ambientParticles);
    
    // Animation - SLOWER SPEED
    let time = 0;
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.004; // Slower animation speed (was 0.008)
      
      // Wave animation - REDUCED INTENSITY
      const positionsAttr = geometry.attributes.position;
      const posArray = positionsAttr.array;
      
      for (let i = 0; i < particleIndex; i++) {
        const x = posArray[i * 3];
        const z = posArray[i * 3 + 2];
        // Softer wave intensity (0.5 instead of 0.8)
        const y = Math.sin(x * 1.2 + time * 0.6) * Math.cos(z * 1.0 + time * 0.4) * 0.5;
        posArray[i * 3 + 1] = y;
      }
      positionsAttr.needsUpdate = true;
      
      // Slower rotation
      ambientParticles.rotation.y = time * 0.05;
      ambientParticles.rotation.x = Math.sin(time * 0.1) * 0.1;
      particles.rotation.y = Math.sin(time * 0.05) * 0.05;
      particles.rotation.x = Math.sin(time * 0.08) * 0.03;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Mouse interaction - SUBTLE
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      // Reduced camera movement intensity
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
    };
  }, []);
  
  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

export default ParticleWave;
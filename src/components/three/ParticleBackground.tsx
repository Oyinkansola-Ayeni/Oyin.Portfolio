/**
 * ParticleBackground Component
 * 
 * A subtle 3D particle background that follows cursor movement.
 * Designed for low performance impact with automatic quality reduction
 * on mobile and low-power devices.
 * 
 * Features:
 * - Particles connect with lines when close
 * - Cursor repulsion/attraction effect
 * - Gentle floating animation
 * - Color transitions based on theme
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

interface ParticleFieldProps {
  count: number;
  mousePosition: { x: number; y: number };
}

/**
 * Particle Field Component
 * Renders the main particle system with connections
 */
function ParticleField({ count, mousePosition }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));
  
  // Initialize particle positions and velocities
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      // Random positions spread across the viewport
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Random velocities for floating motion
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return positions;
  }, [count]);

  // Line positions for connections
  const linePositions = useMemo(() => {
    // Max connections per particle * 2 points * 3 coordinates
    return new Float32Array(count * 3 * 2 * 3);
  }, [count]);

  const lineColors = useMemo(() => {
    return new Float32Array(count * 3 * 2 * 3);
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const time = state.clock.elapsedTime;
    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;

    // Convert mouse screen position to world space (approximate)
    const mouseX = mousePosition.x * 10;
    const mouseY = mousePosition.y * 10;

    // Update particle positions
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      // Apply floating velocity
      positionsArray[idx] += velocities[idx];
      positionsArray[idx + 1] += velocities[idx + 1];
      positionsArray[idx + 2] += velocities[idx + 2];

      // Gentle sine wave motion
      positionsArray[idx] += Math.sin(time * 0.5 + i) * 0.002;
      positionsArray[idx + 1] += Math.cos(time * 0.3 + i) * 0.002;

      // Mouse interaction - gentle repulsion
      const dx = positionsArray[idx] - mouseX;
      const dy = positionsArray[idx + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3 && dist > 0.1) {
        const force = (3 - dist) * 0.001;
        positionsArray[idx] += (dx / dist) * force;
        positionsArray[idx + 1] += (dy / dist) * force;
      }

      // Boundary wrapping
      if (positionsArray[idx] > 10) positionsArray[idx] = -10;
      if (positionsArray[idx] < -10) positionsArray[idx] = 10;
      if (positionsArray[idx + 1] > 10) positionsArray[idx + 1] = -10;
      if (positionsArray[idx + 1] < -10) positionsArray[idx + 1] = 10;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update connections
    let lineIndex = 0;
    const maxConnections = 3; // Max connections per particle
    const connectionDistance = 2.5;

    for (let i = 0; i < count; i++) {
      let connections = 0;
      
      for (let j = i + 1; j < count; j++) {
        if (connections >= maxConnections) break;

        const dx = positionsArray[i * 3] - positionsArray[j * 3];
        const dy = positionsArray[i * 3 + 1] - positionsArray[j * 3 + 1];
        const dz = positionsArray[i * 3 + 2] - positionsArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectionDistance) {
          const opacity = 1 - dist / connectionDistance;
          
          // Line start point
          linePositions[lineIndex * 6] = positionsArray[i * 3];
          linePositions[lineIndex * 6 + 1] = positionsArray[i * 3 + 1];
          linePositions[lineIndex * 6 + 2] = positionsArray[i * 3 + 2];
          
          // Line end point
          linePositions[lineIndex * 6 + 3] = positionsArray[j * 3];
          linePositions[lineIndex * 6 + 4] = positionsArray[j * 3 + 1];
          linePositions[lineIndex * 6 + 5] = positionsArray[j * 3 + 2];

          // Line color (cyan with opacity)
          for (let k = 0; k < 2; k++) {
            lineColors[(lineIndex * 2 + k) * 3] = 0;
            lineColors[(lineIndex * 2 + k) * 3 + 1] = 0.94 * opacity;
            lineColors[(lineIndex * 2 + k) * 3 + 2] = 1 * opacity;
          }

          lineIndex++;
          connections++;
        }
      }
    }

    // Update line geometry
    const lineGeo = linesRef.current.geometry;
    lineGeo.setDrawRange(0, lineIndex * 2);
    (lineGeo.attributes.position.array as Float32Array).set(linePositions);
    (lineGeo.attributes.color.array as Float32Array).set(lineColors);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
  });

  return (
    <>
      {/* Particle points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#00f0ff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

/**
 * Main ParticleBackground Component
 */
export function ParticleBackground() {
  const { normalizedX, normalizedY } = useMousePosition();
  const { isMobile, isLowPower, supportsWebGL } = useDeviceCapabilities();

  // Don't render on unsupported devices
  if (!supportsWebGL) return null;

  // Adjust particle count based on device capabilities
  const particleCount = isLowPower ? 15 : isMobile ? 25 : 50;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={isLowPower ? 0.5 : 1}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
      >
        <ParticleField 
          count={particleCount} 
          mousePosition={{ x: normalizedX, y: normalizedY }}
        />
      </Canvas>
    </div>
  );
}

export default ParticleBackground;

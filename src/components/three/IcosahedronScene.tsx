/**
 * IcosahedronScene Component
 * 
 * A 3D hero scene featuring an interactive icosahedron that:
 * - Reacts to mouse movement with smooth parallax
 * - Changes color based on scroll position
 * - Has wireframe + solid material blend
 * - Rotates continuously with scroll-linked speed
 * 
 * Three.js Implementation Notes:
 * - Uses React Three Fiber for declarative Three.js
 * - Drei helpers for lighting and controls
 * - Custom shader material for color transitions
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Color palette for scroll-based transitions
const COLORS = {
  start: new THREE.Color('#00f0ff'), // Cyan
  middle: new THREE.Color('#a855f7'), // Purple
  end: new THREE.Color('#ff0080'), // Pink
};

interface IcosahedronMeshProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * Main Icosahedron Mesh Component
 * Handles the core 3D object with all interactive behaviors
 */
function IcosahedronMesh({ scrollProgress }: IcosahedronMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { normalizedX, normalizedY } = useMousePosition();
  const { isMobile, isLowPower } = useDeviceCapabilities();
  
  // Target rotation values for smooth interpolation
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Custom shader material for color transition
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: COLORS.start },
        uColorMiddle: { value: COLORS.middle },
        uColorEnd: { value: COLORS.end },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDistortion;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Subtle vertex displacement based on mouse
          vec3 pos = position;
          float distortion = sin(pos.x * 2.0 + uTime) * 0.02;
          distortion += sin(pos.y * 2.0 + uTime * 0.8) * 0.02;
          pos += normal * distortion;
          
          vDistortion = distortion;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uColorStart;
        uniform vec3 uColorMiddle;
        uniform vec3 uColorEnd;
        uniform vec2 uMouse;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDistortion;
        
        void main() {
          // Fresnel effect for edge glow
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          // Color mixing based on scroll progress
          vec3 color;
          if (uProgress < 0.5) {
            float t = uProgress * 2.0;
            color = mix(uColorStart, uColorMiddle, t);
          } else {
            float t = (uProgress - 0.5) * 2.0;
            color = mix(uColorMiddle, uColorEnd, t);
          }
          
          // Add fresnel glow
          color += vec3(1.0) * fresnel * 0.3;
          
          // Add subtle distortion color variation
          color += vec3(0.1) * vDistortion * 5.0;
          
          gl_FragColor = vec4(color, 0.9);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Mouse parallax effect
  if (!isMobile) {
    // Map mouse position to rotation targets
    targetRotation.current.y = normalizedX * 0.5; // Left/right rotation
    targetRotation.current.x = normalizedY * 0.3; // Up/down rotation
  }

  // Animation frame updates
  useFrame((state) => {
    if (!meshRef.current || !wireframeRef.current) return;

    const time = state.clock.elapsedTime;
    const progress = scrollProgress.current;

    // Smooth interpolation for mouse-based rotation
    const lerpFactor = isMobile ? 0.05 : 0.08;
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;

    // Apply rotations
    // Base rotation + mouse parallax + scroll-linked rotation
    meshRef.current.rotation.x = currentRotation.current.x + time * 0.1;
    meshRef.current.rotation.y = currentRotation.current.y + time * 0.15 + progress * Math.PI;
    meshRef.current.rotation.z = time * 0.05;

    // Sync wireframe rotation
    wireframeRef.current.rotation.copy(meshRef.current.rotation);

    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uProgress.value = progress;
      materialRef.current.uniforms.uMouse.value.set(normalizedX, normalizedY);
    }

    // Scale based on scroll progress
    const scale = 1 + progress * 0.2;
    meshRef.current.scale.setScalar(scale);
    wireframeRef.current.scale.setScalar(scale * 1.02);
  });

  // Reduce complexity on mobile/low-power devices
  const detail = isLowPower ? 0 : 1;

  return (
    <>
      {/* Main solid icosahedron with custom shader */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, detail]} />
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[2, detail]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner glow sphere */}
      {!isLowPower && (
        <mesh scale={0.5}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </>
  );
}

/**
 * Floating particles around the icosahedron
 */
function FloatingParticles({ count = 20 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const { isLowPower } = useDeviceCapabilities();
  
  // Reduce particle count on low-power devices
  const particleCount = isLowPower ? 10 : count;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere around the icosahedron
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random colors from our palette
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.94;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.66;
        colors[i * 3 + 1] = 0.33;
        colors[i * 3 + 2] = 0.97;
      } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.5;
      }
    }

    return [positions, colors];
  }, [particleCount]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    particlesRef.current.rotation.y = time * 0.05;
    particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Scene lighting setup
 */
function SceneLighting() {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#00f0ff"
      />
      
      {/* Rim light for edge definition */}
      <pointLight
        position={[-5, 3, -5]}
        intensity={0.5}
        color="#a855f7"
      />
      
      {/* Fill light */}
      <pointLight
        position={[0, -5, 3]}
        intensity={0.3}
        color="#ff0080"
      />
    </>
  );
}

/**
 * Main IcosahedronScene Component
 */
export function IcosahedronScene() {
  const scrollProgress = useRef(0);
  const { isLowPower } = useDeviceCapabilities();

  // Setup scroll trigger
  useMemo(() => {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === '#hero') st.kill();
      });
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={isLowPower ? 1 : [1, 2]}
        gl={{
          antialias: !isLowPower,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <SceneLighting />
        
        <Float
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <IcosahedronMesh scrollProgress={scrollProgress} />
        </Float>
        
        {!isLowPower && <FloatingParticles count={30} />}
        
        {/* Environment for reflections */}
        {!isLowPower && <Environment preset="city" />}
      </Canvas>
    </div>
  );
}

export default IcosahedronScene;

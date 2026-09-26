import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function FloatingOrbs() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = null;

    // ── Camera ────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // ── Orbs ──────────────────────────────────────────────────────────────────
    const colors = [0x0ea5e9, 0x3b82f6, 0x60a5fa, 0x38bdf8, 0x0284c7];
    const orbs: THREE.Mesh[] = [];
    const startPositions: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.SphereGeometry(0.6, 24, 24);
      const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.35,
        metalness: 0.6,
        roughness: 0.2,
      });

      const orb = new THREE.Mesh(geometry, material);
      const angle = (i / 5) * Math.PI * 2;
      const radius = 2.5;
      const startX = Math.cos(angle) * radius;
      const startY = Math.sin(angle) * 1.2;
      const startZ = Math.sin(angle) * 0.8;

      orb.position.set(startX, startY, startZ);
      startPositions.push({ x: startX, y: startY, z: startZ });
      scene.add(orb);
      orbs.push(orb);
    }

    // ── Particles ─────────────────────────────────────────────────────────────
    const particleCount = 800;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3]     = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0x0ea5e9, size: 0.05, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x404060));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0x0ea5e9, 0.8);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

    // ── Animation — no IntersectionObserver, runs unconditionally ─────────────
    let time = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      time += 0.015;

      orbs.forEach((orb, i) => {
        const speed = 0.6 + i * 0.15;
        const offset = (i / 5) * Math.PI * 2;

        orb.position.x = startPositions[i].x + Math.sin(time * speed + offset) * 2.5;
        orb.position.y = startPositions[i].y + Math.cos(time * speed * 1.2 + offset) * 2.0;
        orb.position.z = startPositions[i].z + Math.sin(time * speed * 0.8 + offset) * 1.5;

        orb.rotation.y = Math.sin(time * 0.3 + offset) * 0.5;
        orb.rotation.x = Math.cos(time * 0.2 + offset) * 0.3;

        const scale = 0.95 + Math.sin(time * 1.5 + i) * 0.05;
        orb.scale.set(scale, scale, scale);
      });

      particles.rotation.y = time * 0.05;
      particles.rotation.x = Math.sin(time * 0.08) * 0.1;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      orbs.forEach(orb => {
        orb.geometry.dispose();
        (orb.material as THREE.Material).dispose();
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

export default FloatingOrbs;
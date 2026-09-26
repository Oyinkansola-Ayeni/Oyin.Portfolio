import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ArchitecturalGrid() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ─── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: false,          // OFF — this is a background, not a hero showcase
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // cap at 1.5x
    renderer.shadowMap.enabled = false;                              // OFF — was killing perf
    mountRef.current.appendChild(renderer.domElement);

    // ─── Scene / Camera ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.008);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 5, 12);
    camera.lookAt(0, 2, 0);

    // ─── Towers (key fix: share ONE geometry per height bucket, not 196 unique ones) ─
    const group = new THREE.Group();
    const gridSize = 14;
    const spacing = 0.55;
    const colors = [0x0ea5e9, 0x3b82f6, 0x06b6d4, 0x2dd4bf, 0x6366f1];

    // Pre-build shared geometries for bucketed heights (avoids 196 unique BoxGeometry objects)
    const heightBuckets = 8;
    const sharedGeos: THREE.BoxGeometry[] = Array.from(
      { length: heightBuckets },
      (_, b) => new THREE.BoxGeometry(0.48, 0.4 + (b / heightBuckets) * 2.2, 0.48)
    );

    // tower data stored for animation (position only, no material mutation)
    const towerData: { mesh: THREE.Mesh; baseY: number; phase: number }[] = [];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const xNorm = (i - gridSize / 2) / gridSize;
        const zNorm = (j - gridSize / 2) / gridSize;
        const distance = Math.sqrt(xNorm * xNorm + zNorm * zNorm);

        let height = 0.4;
        if (distance < 0.35) {
          height = 2.2 + Math.sin(i * 0.5) * 0.3 + Math.cos(j * 0.5) * 0.3;
        } else if (distance < 0.6) {
          height = 1.4 + Math.sin(i * 0.8) * 0.2;
        } else {
          height = 0.6 + Math.sin(i * 1.2) * 0.15 + Math.cos(j * 1.2) * 0.15;
        }
        const angle = Math.atan2(j - gridSize / 2, i - gridSize / 2);
        height += Math.sin(angle * 3) * 0.15;

        // Pick nearest bucket to reuse geometry
        const bucketIdx = Math.min(heightBuckets - 1, Math.round(((height - 0.4) / 2.2) * (heightBuckets - 1)));
        const geo = sharedGeos[bucketIdx];

        const colorIndex = Math.floor(Math.abs(xNorm * zNorm * colors.length)) % colors.length;
        const material = new THREE.MeshStandardMaterial({
          color: colors[colorIndex],
          emissive: colors[colorIndex],
          emissiveIntensity: 0.14,    // FIXED value — no per-frame mutation
          metalness: 0.85,
          roughness: 0.15,
          transparent: true,
          opacity: 0.92,
        });

        const tower = new THREE.Mesh(geo, material);
        tower.position.set(
          (i - gridSize / 2) * spacing,
          height / 2,
          (j - gridSize / 2) * spacing
        );
        tower.castShadow = false;
        tower.receiveShadow = false;
        group.add(tower);

        towerData.push({
          mesh: tower,
          baseY: height / 2,
          phase: i * 0.02 + j * 0.03, // unique phase per tower, pre-computed
        });

        // Glowing top cap for tall towers (sphere — small, cheap)
        if (height > 1.2) {
          const topGeo = new THREE.SphereGeometry(0.12, 8, 8); // 8 segments, not 16
          const topMat = new THREE.MeshStandardMaterial({
            color: 0x0ea5e9,
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.6,
            metalness: 0.9,
          });
          const top = new THREE.Mesh(topGeo, topMat);
          top.position.set(tower.position.x, height - 0.08, tower.position.z);
          group.add(top);
        }
      }
    }
    scene.add(group);

    // ─── Particles (reduced counts) ──────────────────────────────────────────
    // Ring: 400 instead of 800
    const ringCount = 400;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * Math.PI * 2;
      const r = 5.2;
      ringPos[i * 3]     = Math.cos(a) * r;
      ringPos[i * 3 + 1] = Math.sin(a) * 0.5 + 1.5;
      ringPos[i * 3 + 2] = Math.sin(a) * r;
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    const ring = new THREE.Points(ringGeo, new THREE.PointsMaterial({ color: 0x0ea5e9, size: 0.05, transparent: true, opacity: 0.6 }));
    scene.add(ring);

    // Floating: 800 instead of 2000
    const pCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = Math.random() * 5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.035, transparent: true, opacity: 0.35 }));
    scene.add(particles);

    // ─── Lights ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a1a2e));
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = false; // OFF
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0x0ea5e9, 0.5);
    fillLight.position.set(2, 3, 3);
    scene.add(fillLight);
    
    // Back light - FIXED
    const backLight = new THREE.PointLight(0x6366f1, 0.4);
    backLight.position.set(-3, 2, -5);
    scene.add(backLight);
    
    // Color light - FIXED
    const colorLight = new THREE.PointLight(0x2dd4bf, 0.3);
    colorLight.position.set(1, 1.5, 2);
    scene.add(colorLight);

    // ─── Animation loop — paused when out of view ─────────────────────────────
    let time = 0;
    let animationFrameId: number;
    let isVisible = false;

    // Only animate towers every OTHER frame (halves JS cost)
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return; // no GPU work when scrolled away

      time += 0.008;
      frameCount++;

      // Tower float: update position.y only (no material writes)
      // Skip every other frame — imperceptible at 60fps, halves cost
      if (frameCount % 2 === 0) {
        for (let k = 0; k < towerData.length; k++) {
          const td = towerData[k];
          td.mesh.position.y = td.baseY + Math.sin(time * 1.2 + td.phase) * 0.008;
        }
      }

      ring.rotation.y = time * 0.15;
      ring.rotation.x = Math.sin(time * 0.2) * 0.1;
      particles.rotation.y = time * 0.03;
      particles.rotation.x = Math.sin(time * 0.08) * 0.05;

      camera.position.x = Math.sin(time * 0.08) * 0.6;
      camera.position.z = 11 + Math.cos(time * 0.05) * 0.3;
      camera.lookAt(0, 1.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    // ─── IntersectionObserver — pause when not on screen ─────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(mountRef.current);

    // ─── Resize ──────────────────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();

      // Dispose geometries & materials to prevent memory leaks
      sharedGeos.forEach(g => g.dispose());
      ringGeo.dispose();
      pGeo.dispose();
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          (obj.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

export default ArchitecturalGrid;
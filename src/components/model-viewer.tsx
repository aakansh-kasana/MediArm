'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type ModelViewerProps = {
  modelDataUri: string;
};

export function ModelViewer({ modelDataUri }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('hsl(var(--background))');

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load Model
    const loader = new GLTFLoader();
    
    // Use a fallback cube if the data URI is a placeholder
    if (modelDataUri.endsWith('...')) {
        const geometry = new THREE.BoxGeometry(1.5, 3, 1.5);
        const material = new THREE.MeshStandardMaterial({ color: 'hsl(var(--primary))' });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        const box = new THREE.Box3().setFromObject(cube);
        const center = box.getCenter(new THREE.Vector3());
        controls.target.copy(center);
    } else {
        loader.load(
          modelDataUri,
          (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center); // Center the model
            scene.add(model);
            controls.target.copy(new THREE.Vector3(0,0,0));
          },
          undefined,
          (error) => {
            console.error('An error happened during model loading:', error);
          }
        );
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [modelDataUri]);

  return <div ref={mountRef} className="w-full h-[500px] rounded-lg border bg-card" />;
}

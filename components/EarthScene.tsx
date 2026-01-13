
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TEXTURES } from '../constants';

interface EarthSceneProps {
  onLocationClick: (name: string) => void;
}

const EarthScene: React.FC<EarthSceneProps> = ({ onLocationClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 250;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 120;
    controls.maxDistance = 600;
    controlsRef.current = controls;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // --- Starfield Background ---
    const starGeometry = new THREE.SphereGeometry(800, 64, 64);
    const starTexture = new THREE.TextureLoader().load(TEXTURES.starfield);
    const starMaterial = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.6
    });
    const starfield = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starfield);

    // --- Earth ---
    const loader = new THREE.TextureLoader();
    const earthGeometry = new THREE.SphereGeometry(100, 128, 128);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: loader.load(TEXTURES.earth_map),
      bumpMap: loader.load(TEXTURES.earth_bump),
      bumpScale: 1.5,
      specularMap: loader.load(TEXTURES.earth_specular),
      metalness: 0.2,
      roughness: 0.8,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthRef.current = earth;
    scene.add(earth);

    // --- Clouds ---
    const cloudGeometry = new THREE.SphereGeometry(100.8, 128, 128);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: loader.load(TEXTURES.earth_clouds),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudsRef.current = clouds;
    scene.add(clouds);

    // --- Atmosphere Glow (Fresnel Shader) ---
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        vNormal = normalize( normalMatrix * normal );
        vPositionNormal = normalize( ( modelViewMatrix * vec4(position, 1.0) ).xyz );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        float intensity = pow( 0.7 - dot( vNormal, vPositionNormal ), 4.0 );
        gl_FragColor = vec4( 0.3, 0.6, 1.0, 1.0 ) * intensity;
      }
    `;

    const atmosphereGeometry = new THREE.SphereGeometry(115, 128, 128);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);

      if (earthRef.current) earthRef.current.rotation.y += 0.0008;
      if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0012;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- Interaction ---
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(earth);

      if (intersects.length > 0) {
        // Simple logic to detect region based on UVs (mapping back to approximate continent names)
        const uv = intersects[0].uv;
        if (uv) {
          onLocationClick(`Coordinate (${uv.x.toFixed(2)}, ${uv.y.toFixed(2)})`);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      // Clean up geometries and materials
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
    };
  }, [onLocationClick]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default EarthScene;

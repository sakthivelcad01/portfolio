import { useEffect, useRef } from "react";
import * as THREE from "three";

const colors = {
  light: {
    bg: 0xf6f1e8,
    line: 0x1d7d51,
    point: 0x113a28,
  },
  dark: {
    bg: 0x050706,
    line: 0x48e28d,
    point: 0xcdfbdd,
  },
};

function SceneCanvas({ theme = "dark" }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 80);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const group = new THREE.Group();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    camera.position.set(0, 0, 11);
    scene.add(group);

    const gridGeometry = new THREE.BufferGeometry();
    const gridPoints = [];
    for (let i = -7; i <= 7; i += 1) {
      gridPoints.push(-7, i, 0, 7, i, 0);
      gridPoints.push(i, -7, 0, i, 7, 0);
    }
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPoints, 3));
    const gridMaterial = new THREE.LineBasicMaterial({ color: colors.dark.line, transparent: true, opacity: 0.12 });
    const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
    grid.rotation.x = -0.78;
    grid.position.set(2.8, -2.1, -2);
    group.add(grid);

    const particleGeometry = new THREE.BufferGeometry();
    const particles = [];
    for (let i = 0; i < 180; i += 1) {
      particles.push((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 5);
    }
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particles, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: colors.dark.point, size: 0.025, transparent: true, opacity: 0.24 });
    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particleField);

    let frameId = 0;
    const render = () => {
      const palette = colors[themeRef.current] || colors.dark;
      gridMaterial.color.setHex(palette.line);
      particleMaterial.color.setHex(palette.point);
      group.rotation.z += 0.0008;
      particleField.rotation.y += 0.001;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resize);
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      gridGeometry.dispose();
      gridMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />;
}

export default SceneCanvas;

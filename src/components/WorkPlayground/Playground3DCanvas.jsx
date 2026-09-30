import { useEffect, useRef } from "react";
import * as THREE from "three";

const palette = {
    line: 0x10b981,   // Emerald neon
    point: 0x38bdf8,  // Cyan neon
    bg: 0x070a12,
};

export default function Playground3DCanvas({ theme = "dark" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 80);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        const group = new THREE.Group();

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        camera.position.set(0, 0, 11);
        scene.add(group);

        // 1. Tilted 3D Wireframe Grid Matrix
        const gridGeometry = new THREE.BufferGeometry();
        const gridPoints = [];
        for (let i = -8; i <= 8; i += 1) {
            gridPoints.push(-8, i, 0, 8, i, 0);
            gridPoints.push(i, -8, 0, i, 8, 0);
        }
        gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPoints, 3));
        const gridMaterial = new THREE.LineBasicMaterial({
            color: palette.line,
            transparent: true,
            opacity: 0.15,
        });
        const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
        grid.rotation.x = -0.78;
        grid.position.set(0, -1.5, -2);
        group.add(grid);

        // 2. Depth Floating Particle Field
        const particleGeometry = new THREE.BufferGeometry();
        const particles = [];
        for (let i = 0; i < 200; i += 1) {
            particles.push(
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 6
            );
        }
        particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particles, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: palette.point,
            size: 0.03,
            transparent: true,
            opacity: 0.35,
        });
        const particleField = new THREE.Points(particleGeometry, particleMaterial);
        group.add(particleField);

        // Mouse parallax tracking
        let targetX = 0;
        let targetY = 0;

        const onPointerMove = (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
            targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
        };

        window.addEventListener("pointermove", onPointerMove);

        // Render loop
        let frameId = 0;
        const render = () => {
            group.rotation.y += (targetX - group.rotation.y) * 0.05;
            group.rotation.x += (targetY - group.rotation.x) * 0.05;
            grid.rotation.z += 0.0006;
            particleField.rotation.y += 0.0008;

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(render);
        };

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", onResize);
        render();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("resize", onResize);
            gridGeometry.dispose();
            gridMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="playground-3d-canvas"
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 0,
            }}
            aria-hidden="true"
        />
    );
}

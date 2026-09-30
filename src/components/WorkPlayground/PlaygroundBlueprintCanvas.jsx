import { useEffect, useRef } from "react";

export default function PlaygroundBlueprintCanvas({ containerRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef?.current || document.body;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const mouse = { x: -1, y: -1 };

        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || window.innerHeight;

        const resize = () => {
            width = container.clientWidth || window.innerWidth;
            height = container.clientHeight || window.innerHeight;
            const ratio = Math.min(window.devicePixelRatio, 2);
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Architectural Column Guide Lines
            ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
            ctx.lineWidth = 1;
            for (let col = 1; col < 12; col += 1) {
                const x = (width * col) / 12;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // 2. Draw Dynamic Blueprint Bounding Boxes for [data-blueprint] elements
            const containerBounds = container.getBoundingClientRect();
            const blueprintElements = container.querySelectorAll("[data-blueprint]");

            blueprintElements.forEach((element) => {
                const box = element.getBoundingClientRect();
                const x = box.left - containerBounds.left;
                const y = box.top - containerBounds.top;
                const w = box.width;
                const h = box.height;

                ctx.strokeStyle = "rgba(56, 189, 248, 0.35)"; // Cyan neon outline
                ctx.lineWidth = 1;

                // Draw Corner Reticles
                const cornerSize = 12;
                // Top-Left
                ctx.beginPath(); ctx.moveTo(x, y + cornerSize); ctx.lineTo(x, y); ctx.lineTo(x + cornerSize, y); ctx.stroke();
                // Top-Right
                ctx.beginPath(); ctx.moveTo(x + w - cornerSize, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cornerSize); ctx.stroke();
                // Bottom-Left
                ctx.beginPath(); ctx.moveTo(x, y + h - cornerSize); ctx.lineTo(x, y + h); ctx.lineTo(x + cornerSize, y + h); ctx.stroke();
                // Bottom-Right
                ctx.beginPath(); ctx.moveTo(x + w - cornerSize, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - cornerSize); ctx.stroke();
            });

            // 3. Draw Interactive Mouse Crosshair & Telemetry Tracker
            if (mouse.x >= 0 && mouse.y >= 0) {
                ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
                ctx.fillStyle = "#34d399";
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 5]);

                // Crosshair Lines
                ctx.beginPath(); ctx.moveTo(mouse.x, 0); ctx.lineTo(mouse.x, height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, mouse.y); ctx.lineTo(width, mouse.y); ctx.stroke();

                ctx.setLineDash([]); // Reset line dash

                // Coordinate HUD Box
                ctx.font = "10px 'JetBrains Mono', monospace";
                const label = `X: ${Math.round(mouse.x)} / Y: ${Math.round(mouse.y)}`;
                ctx.fillText(label, Math.min(mouse.x + 12, width - 110), Math.max(20, mouse.y - 10));
            }
        };

        const onPointerMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            draw();
        };

        const onPointerLeave = () => {
            mouse.x = -1;
            mouse.y = -1;
            draw();
        };

        const observer = new ResizeObserver(() => {
            resize();
            draw();
        });

        observer.observe(container);
        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerleave", onPointerLeave);
        resize();
        draw();

        return () => {
            observer.disconnect();
            container.removeEventListener("pointermove", onPointerMove);
            container.removeEventListener("pointerleave", onPointerLeave);
        };
    }, [containerRef]);

    return (
        <canvas
            ref={canvasRef}
            className="playground-blueprint-canvas"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
            }}
            aria-hidden="true"
        />
    );
}

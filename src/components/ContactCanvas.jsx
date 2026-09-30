import { useEffect, useRef } from "react";

export default function ContactCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let raf = 0;
    let scrollProgress = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const updateScrollProgress = () => {
      const rect = canvas.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      scrollProgress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
    };

    const drawRoute = (y, phase, alpha) => {
      const wave = Math.sin(frame * 0.012 + scrollProgress * Math.PI * 2 + phase) * height * 0.045;
      const mid = y + wave;
      const progress = (scrollProgress * 1.25 + phase * 0.18) % 1;
      const head = width * progress;
      context.globalAlpha = alpha;
      context.beginPath();
      context.moveTo(0, mid);
      context.bezierCurveTo(width * 0.24, mid - height * 0.12, width * 0.38, mid + height * 0.13, width * 0.5, height * 0.5);
      context.bezierCurveTo(width * 0.62, mid - height * 0.13, width * 0.78, mid + height * 0.12, width, mid);
      context.stroke();

      context.globalAlpha = alpha * 1.7;
      context.beginPath();
      context.arc(head, mid + Math.sin(progress * Math.PI * 2 + phase) * 16, 3.2, 0, Math.PI * 2);
      context.fill();
    };

    const draw = () => {
      frame += 1;
      updateScrollProgress();
      context.clearRect(0, 0, width, height);
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--accent").trim() || "#147a4f";
      const muted = styles.getPropertyValue("--muted").trim() || "#6e766c";

      context.lineWidth = 1;
      context.strokeStyle = muted;
      context.globalAlpha = 0.18;
      const gridOffset = scrollProgress * 46;
      for (let x = 0; x < width; x += 46) {
        context.beginPath();
        context.moveTo(x + gridOffset, 0);
        context.lineTo(x + gridOffset, height);
        context.stroke();
      }

      context.strokeStyle = accent;
      context.fillStyle = accent;
      context.setLineDash([8, 16]);
      drawRoute(height * 0.28, 0, 0.34);
      drawRoute(height * 0.5, 1.8, 0.28);
      drawRoute(height * 0.72, 3.2, 0.24);
      context.setLineDash([]);

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas className="contact-canvas" ref={canvasRef} aria-hidden="true" />;
}

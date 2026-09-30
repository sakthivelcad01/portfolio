import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./InterfaceScene.css";

gsap.registerPlugin(ScrollTrigger);

export default function InterfaceScene({ projects, initialIndex = 1, scrollManaged = false }) {
  const [index, setIndex] = useState(initialIndex);
  const [mode, setMode] = useState("artist");
  const root = useRef(null);
  const project = projects[index];

  useLayoutEffect(() => {
    const section = root.current;
    const surface = section.querySelector(".interface-surface");
    const canvas = section.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const state = { progress: 1, x: -1, y: -1 };
    const imageEase = gsap.parseEase("power2.inOut");
    let width = 0;
    let height = 0;
    const draw = () => {
      if (scrollManaged) {
        // Match the original image mask's timing within the canvas construction pass.
        const imageProgress = imageEase(Math.max(0, Math.min(1, (state.progress - .32) / .47)));
        section.style.setProperty("--project-image-mask", `${(1 - imageProgress) * 100}%`);
        const copyProgress = Math.max(0, Math.min(1, (state.progress - .14) / .32));
        section.style.setProperty("--project-copy-opacity", copyProgress);
        section.style.setProperty("--project-copy-offset", `${18 * (1 - copyProgress)}px`);
      }
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const colors = getComputedStyle(section);
      ctx.strokeStyle = colors.getPropertyValue("--accent").trim();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1;
      const p = state.progress;
      ctx.globalAlpha = .12 + .35 * (1 - p);
      const line = (x, y, tx, ty) => {
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x + (tx - x) * Math.min(1, p * 3), y + (ty - y) * Math.min(1, p * 3)); ctx.stroke();
      };
      for (let col = 1; col < 12; col++) line(width * col / 12, 0, width * col / 12, height);
      [100, height * .45, height - 72].forEach(y => line(0, y, width, y));
      const bounds = surface.getBoundingClientRect();
      section.querySelectorAll("[data-blueprint]").forEach(element => {
        const box = element.getBoundingClientRect();
        const x = box.left - bounds.left, y = box.top - bounds.top;
        ctx.globalAlpha = Math.max(0, 1 - p * 1.15);
        line(x, y, x + box.width, y); line(x, y, x, y + box.height);
        line(x + box.width, y + box.height, x, y + box.height);
      });
      if (state.x >= 0) {
        ctx.globalAlpha = .45;
        ctx.setLineDash([3, 5]);
        line(state.x, 0, state.x, height); line(0, state.y, width, state.y);
        ctx.setLineDash([]);
        ctx.font = "10px monospace";
        ctx.fillText(`${Math.round(state.x)} / ${Math.round(state.y)}`, Math.min(state.x + 12, width - 95), Math.max(20, state.y - 12));
      }
      ctx.globalAlpha = 1;
    };
    const resize = () => {
      width = surface.clientWidth; height = surface.clientHeight;
      const ratio = Math.min(devicePixelRatio, 2);
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
    };
    const move = event => {
      if (event.pointerType === "touch") return;
      const rect = surface.getBoundingClientRect();
      state.x = event.clientX - rect.left; state.y = event.clientY - rect.top; draw();
    };
    const leave = () => { state.x = -1; draw(); };
    const updateGuides = event => {
      const detail = typeof event.detail === "number" ? { progress: event.detail } : event.detail;
      state.progress = Math.max(0, Math.min(1, detail.progress ?? state.progress));
      draw();
    };
    section.addEventListener("project-guide-progress", updateGuides);
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", leave);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (scrollManaged) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "+=145%", pin: surface, scrub: .25, invalidateOnRefresh: true, refreshPriority: -10 },
      });
      timeline.fromTo(surface, { opacity: 0 }, { opacity: 1, duration: .5, ease: "none" }, 0)
        .fromTo(state, { progress: 0 }, { progress: 1, duration: 1.4, ease: "none", onUpdate: draw }, .5)
        .fromTo(".interface-copy", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .45 }, .7)
        .fromTo(".interface-preview", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .65, ease: "power2.inOut" }, .95)
        .fromTo(".interface-controls", { opacity: 0 }, { opacity: 1, duration: .3 }, 1.45)
        .to({}, { duration: .55 });
      const focus = () => timeline.progress(1);
      surface.addEventListener("focusin", focus);
      return () => {
        surface.removeEventListener("focusin", focus);
      };
    }, section);
    resize();
    return () => {
      media.revert(); observer.disconnect(); themeObserver.disconnect();
      section.removeEventListener("project-guide-progress", updateGuides);
      ["--project-image-mask", "--project-copy-opacity", "--project-copy-offset"].forEach(property => section.style.removeProperty(property));
      surface.removeEventListener("pointermove", move); surface.removeEventListener("pointerleave", leave);
    };
  }, [scrollManaged]);

  const change = direction => setIndex(value => (value + direction + projects.length) % projects.length);
  return <section ref={root} className="interface-scene" id={`work-overview-${projects[initialIndex].id}`} aria-label={`${projects[initialIndex].title} overview`}>
    <div className="interface-surface">
      <canvas aria-hidden="true" />
      <header className="interface-mast"><span>SAKTHIVEL S / SELECTED WORK</span><span>FORM + FUNCTION</span></header>
      <div className="interface-composition">
        <div className="interface-copy" data-blueprint>
          <span className="interface-number">{project.id} / 04</span>
          <p className="interface-label">{project.label}</p>
          <h2>{project.title}</h2>
          <p className="interface-description">{mode === "artist" ? project.body : project.engineering}</p>
          <a href={`/work/${project.id}`}>Inside the project <ArrowUpRight size={20} /></a>
        </div>
        <div className="interface-preview" data-blueprint>
          {project.image ? <img key={project.image} src={project.image} alt={`${project.title} interface`} /> : <div className="interface-code"><span>Cal.com / contribution</span><code>input.trim()</code><p>URL validation. Focused test coverage.</p></div>}
          {mode === "engineer" && <div className="interface-annotation">{project.engineering}</div>}
        </div>
      </div>
      <footer className="interface-controls">
        <div className="interface-modes" aria-label="Project perspective"><button aria-pressed={mode === "artist"} onClick={() => setMode("artist")}>Artist</button><button aria-pressed={mode === "engineer"} onClick={() => setMode("engineer")}>Engineer</button></div>
        <a href="/#project-overview">All work <ArrowUpRight size={16}/></a>
        <div className="interface-pagination"><button onClick={() => change(-1)} aria-label="Previous project"><ArrowLeft size={20}/></button><span aria-live="polite">{project.id} / 04</span><button onClick={() => change(1)} aria-label="Next project"><ArrowRight size={20}/></button></div>
      </footer>
    </div>
  </section>;
}

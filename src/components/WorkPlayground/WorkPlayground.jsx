import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import "./WorkPlayground.css";

const cases = [
  {
    id: "01",
    title: "Cal.com Monorepo Contribution",
    image: "/assets/project_calcom.png",
    label: "Open-source scheduling",
    accent: "#58d68d",
    idea: "A scheduling URL should never become a security liability.",
    problem: "User supplied URLs and parameters can look harmless while carrying malformed whitespace, unexpected values, or unsafe edge cases into booking logic.",
    hazard: "If validation trusts the shape too late, routing can become inconsistent, tests miss the real path, and a small URL edge case becomes product-wide uncertainty.",
    intervention: "Trim and sanitize before validation, then pin the behavior with focused tests in the scheduling engine instead of hiding it in UI cleanup.",
    proof: "Parameter validation was covered with Vitest, the URL flow became deterministic, and the fix stayed small enough for a monorepo contribution.",
    artifacts: ["Next.js 15", "TypeScript", "Zod validation", "Vitest", "Turborepo"],
  },
  {
    id: "02",
    title: "Rupiece Platform",
    image: "/assets/rupiece-nse-bse-concept.png",
    label: "Indian proprietary trading",
    accent: "#2ce6a7",
    idea: "A trading desk should make discipline louder than noise.",
    problem: "Market dashboards often show everything at once: price, positions, orders, margin, watchlists, and emotional pressure all compete for attention.",
    hazard: "When risk is visually buried, a trader can act faster than they can reason. For a prop firm, that means bad sizing, hidden exposure, and avoidable drawdown.",
    intervention: "Design the cockpit around risk-first visibility: margin, open exposure, breadth, watchlist movement, and execution context stay readable before action.",
    proof: "The NSE/BSE-only concept frames the product around Indian-market workflows, with demo data separated from financial advice and real execution.",
    artifacts: ["React", "NSE/BSE context", "Risk panels", "Market breadth", "Execution UI"],
  },
  {
    id: "03",
    title: "Formbricks Engine",
    image: "/assets/project_formbricks_generated.png",
    label: "Survey infrastructure",
    accent: "#7dd3fc",
    idea: "A feedback engine should feel calm while handling messy human answers.",
    problem: "Surveys are simple on the surface, but branching answers, validation, product data, and delivery states can easily drift apart.",
    hazard: "Bad validation creates silent data corruption: teams believe the survey result, but the product has already stored an unreliable signal.",
    intervention: "Treat validation and data shape as the product experience, not backend housekeeping. Make the flow predictable before polishing the form.",
    proof: "The work centers on reliable validation behavior, product data handling, and infrastructure choices that keep feedback usable after submission.",
    artifacts: ["Next.js", "TypeScript", "Validation", "Product data", "Survey logic"],
  },
  {
    id: "04",
    title: "Trading Automation",
    image: "/assets/project_trading_automation.png",
    label: "Execution telemetry",
    accent: "#f9d56e",
    idea: "Automation should explain itself while it works.",
    problem: "Automated workflows can complete actions without making the decision path visible to the operator.",
    hazard: "A silent automation loop is dangerous: failed assumptions, stale context, or hidden browser states can produce confident but wrong execution.",
    intervention: "Expose the loop through telemetry, status states, browser-path evidence, and human-readable logs so the operator can trust or interrupt it.",
    proof: "The system story connects FastAPI, Playwright, AI workflow support, and telemetry into an observable execution pipeline.",
    artifacts: ["Python", "FastAPI", "Playwright", "Gemini AI", "Telemetry"],
  },
];

const architectureModules = [
  {
    key: "idea",
    x: 10,
    y: 68,
    w: 156,
    h: 58,
    title: "IDEA",
    meta: "USER.NEED",
    heading: "The reason it exists",
    body: "Every project starts with a sharp user problem, not a screen. This layer defines the real job: what must become easier, safer, faster, or clearer.",
    bullets: ["User intent", "Workflow pressure", "Success signal"],
  },
  {
    key: "client",
    x: 25,
    y: 46,
    w: 176,
    h: 62,
    title: "CLIENT",
    meta: "REACT.VIEW",
    heading: "The interface layer",
    body: "The UI turns the decision into an usable flow: readable state, predictable interaction, responsive layout, and enough motion to guide without distracting.",
    bullets: ["React views", "Interaction states", "Motion timing"],
  },
  {
    key: "api",
    x: 43,
    y: 30,
    w: 180,
    h: 64,
    title: "API EDGE",
    meta: "VALIDATE.INPUT",
    heading: "API edge and validation",
    body: "This is where unsafe input gets cleaned before it can affect the system. Routes, query params, payloads, and edge cases are normalized, validated, and tested.",
    bullets: ["Input sanitizing", "Schema validation", "Deterministic errors"],
  },
  {
    key: "service",
    x: 62,
    y: 44,
    w: 184,
    h: 64,
    title: "SERVICE",
    meta: "BUSINESS.LOGIC",
    heading: "The decision engine",
    body: "The service layer holds the actual rules: risk-first trading logic, scheduling behavior, survey state, workflow sequencing, and the boundaries between them.",
    bullets: ["Domain rules", "Failure paths", "Composable logic"],
  },
  {
    key: "storage",
    x: 78,
    y: 28,
    w: 164,
    h: 60,
    title: "STORAGE",
    meta: "PERSIST.STATE",
    heading: "Reliable state",
    body: "Data needs to survive the UI. This layer is about clean shapes, readable models, predictable writes, and making stored information worth trusting later.",
    bullets: ["SQL/data models", "State shape", "Traceable records"],
  },
  {
    key: "proof",
    x: 72,
    y: 70,
    w: 180,
    h: 64,
    title: "PROOF",
    meta: "TESTS.GREEN",
    heading: "Proof before polish",
    body: "The work is not finished when it looks good. Tests, telemetry, reproduction paths, and clear evidence make the project believable.",
    bullets: ["Unit tests", "Playwright checks", "Observable behavior"],
  },
];

export default function WorkPlayground({ theme = "dark", toggleTheme }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeCase, setActiveCase] = useState(0);
  const [hoveredModule, setHoveredModule] = useState("api");
  const current = cases[activeCase];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".lab-topbar", {
        y: 26,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    let width = 0;
    let height = 0;
    let time = 0;
    const pointer = { x: 0.64, y: 0.42, tx: 0.64, ty: 0.42 };
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || cases[activeCase].accent;
    const themeText = styles.getPropertyValue("--text").trim() || (theme === "light" ? "#111411" : "#f4f0e7");
    const themeBg = styles.getPropertyValue("--bg").trim() || (theme === "light" ? "#f3ecdf" : "#050706");
    const themePanel = styles.getPropertyValue("--panel-strong").trim() || styles.getPropertyValue("--panel").trim() || themeBg;
    const isLight = theme === "light";
    const toRgb = (value, fallback) => {
      const normalized = value.trim();
      if (normalized.startsWith("#")) {
        const hex = normalized.replace("#", "");
        const full = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
        return {
          r: parseInt(full.slice(0, 2), 16),
          g: parseInt(full.slice(2, 4), 16),
          b: parseInt(full.slice(4, 6), 16),
        };
      }
      const match = normalized.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const [r, g, b] = match[1].split(",").map((part) => parseFloat(part));
        return { r, g, b };
      }
      return fallback;
    };
    const color = toRgb(accent, { r: 73, g: 223, b: 139 });
    const textColor = toRgb(themeText, isLight ? { r: 17, g: 20, b: 17 } : { r: 244, g: 240, b: 231 });
    const bgColor = toRgb(themeBg, isLight ? { r: 243, g: 236, b: 223 } : { r: 5, g: 7, b: 6 });
    const panelColor = toRgb(themePanel, bgColor);

    const pipeline = architectureModules.map((module) => ({ ...module, x: module.x / 100, y: module.y / 100 }));
    const paths = [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 1]];
    const codeLines = [
      "type Project = Idea & Problem & Proof;",
      "const input = sanitize(userIntent);",
      "const model = validate(input).orThrow();",
      "if (risk.hidden) exposeRiskFirst();",
      "await tests.run(edgeCases);",
      "ship({ ux, api, telemetry, proof });",
      "trace.request('/work/case-file') -> 200",
      "merge when checks.green === true",
    ];
    const tinyNodes = Array.from({ length: 120 }, (_, index) => ({
      seed: index * 41.71,
      lane: index % paths.length,
      offset: (index % 17) / 17,
      speed: 0.052 + (index % 9) * 0.008,
    }));
    const fragments = Array.from({ length: 34 }, (_, index) => ({
      text: codeLines[index % codeLines.length],
      x: (Math.sin(index * 12.31) * 0.5 + 0.5),
      y: (Math.cos(index * 4.87) * 0.5 + 0.5),
      size: 9 + (index % 4),
      delay: index * 0.08,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const movePointer = (event) => {
      pointer.tx = event.clientX / Math.max(width, 1);
      pointer.ty = event.clientY / Math.max(height, 1);
    };

    const easeOut = (value) => 1 - Math.pow(1 - value, 3);

    const moduleCenter = (module) => ({
      x: module.x * width + (pointer.x - 0.5) * 34,
      y: module.y * height + (pointer.y - 0.5) * 24,
    });

    const drawModule = (module, index, compile) => {
      const center = moduleCenter(module);
      const pulse = Math.sin(time * 2.8 + index) * 0.5 + 0.5;
      const x = center.x - module.w / 2;
      const y = center.y - module.h / 2;
      const appear = Math.max(0, Math.min(1, compile * 1.5 - index * 0.12));
      if (appear <= 0) return;

      context.save();
      context.globalAlpha = appear;
      context.fillStyle = `rgba(${panelColor.r}, ${panelColor.g}, ${panelColor.b}, ${isLight ? 0.62 + pulse * 0.12 : 0.34 + pulse * 0.12})`;
      context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 + pulse * 0.35})`;
      context.lineWidth = 1;
      context.beginPath();
      context.roundRect(x, y, module.w, module.h, 11);
      context.fill();
      context.stroke();

      context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.16 + pulse * 0.16})`;
      context.strokeRect(x + 7, y + 7, module.w - 14, module.h - 14);

      context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.88)`;
      context.font = "800 11px JetBrains Mono, monospace";
      context.fillText(module.title, x + 14, y + 24);
      context.fillStyle = `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${isLight ? 0.56 : 0.46})`;
      context.font = "700 9px JetBrains Mono, monospace";
      context.fillText(module.meta, x + 14, y + 43);
      context.restore();
    };

    const drawPath = (from, to, index, compile) => {
      const a = moduleCenter(pipeline[from]);
      const b = moduleCenter(pipeline[to]);
      const midX = (a.x + b.x) / 2 + Math.sin(time * 0.8 + index) * 42;
      const midY = (a.y + b.y) / 2 + Math.cos(time * 0.74 + index) * 52;
      const appear = Math.max(0, Math.min(1, compile * 1.35 - index * 0.08));
      context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.2 * appear})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.quadraticCurveTo(midX, midY, b.x, b.y);
      context.stroke();

      return { a, b, midX, midY };
    };

    const pointOnCurve = (curve, t) => {
      const x = (1 - t) * (1 - t) * curve.a.x + 2 * (1 - t) * t * curve.midX + t * t * curve.b.x;
      const y = (1 - t) * (1 - t) * curve.a.y + 2 * (1 - t) * t * curve.midY + t * t * curve.b.y;
      return { x, y };
    };

    const drawCodeStream = () => {
      const left = 34;
      const streamHeight = codeLines.length * 34 + height * 0.45;
      const drift = (time * 42) % streamHeight;
      context.font = "800 12px JetBrains Mono, monospace";
      for (let pass = 0; pass < 3; pass += 1) {
        codeLines.forEach((line, index) => {
          const y = height + pass * (codeLines.length * 34) + index * 34 - drift;
          if (y < -30 || y > height + 40) return;
          context.fillStyle = index % 2 === activeCase % 2
            ? `rgba(${color.r}, ${color.g}, ${color.b}, 0.34)`
            : `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${isLight ? 0.2 : 0.17})`;
          context.fillText(line, left + Math.sin(time + index) * 18, y);
        });
      }
    };

    const drawCompileRail = (compile) => {
      const railX = width - 280;
      const railY = 92;
      const labels = ["PARSE", "TYPECHECK", "TEST", "DEPLOY"];
      context.font = "900 10px JetBrains Mono, monospace";
      labels.forEach((label, index) => {
        const y = railY + index * 30;
        const complete = Math.min(1, Math.max(0, compile * 1.8 - index * 0.28));
        context.fillStyle = `rgba(${panelColor.r}, ${panelColor.g}, ${panelColor.b}, ${isLight ? 0.66 : 0.52})`;
        context.fillRect(railX, y, 198, 22);
        context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.22)`;
        context.strokeRect(railX, y, 198, 22);
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.24 + complete * 0.48})`;
        context.fillRect(railX, y, 198 * complete, 22);
        context.fillStyle = complete > 0.86 ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.95)` : `rgba(${color.r}, ${color.g}, ${color.b}, 0.78)`;
        context.fillText(`${label}.${complete > 0.86 ? "OK" : "RUN"}`, railX + 12, y + 15);
        context.fillStyle = `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${isLight ? 0.3 : 0.24})`;
        context.fillText(`${32 + index * 7}MS`, railX + 144, y + 15);
      });
    };

    const drawFragments = (compile) => {
      context.font = "800 11px JetBrains Mono, monospace";
      fragments.forEach((fragment, index) => {
        const local = Math.max(0, Math.min(1, compile * 1.8 - fragment.delay));
        const target = pipeline[index % pipeline.length];
        const targetCenter = moduleCenter(target);
        const sourceX = fragment.x * width;
        const sourceY = height + ((fragment.y * height + time * 64) % (height + 180));
        const eased = easeOut(local);
        const x = sourceX + (targetCenter.x - sourceX) * eased;
        const y = sourceY + (targetCenter.y - sourceY) * eased;
        const alpha = local < 1 ? 0.08 + local * 0.34 : 0.08;
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        context.fillText(fragment.text, x, y);
      });
    };

    const drawHoverPulse = (compile) => {
      const index = architectureModules.findIndex((module) => module.key === hoveredModule);
      if (index < 0) return;
      const node = moduleCenter(pipeline[index]);
      for (let ring = 0; ring < 4; ring += 1) {
        const radius = 54 + ((time * 108 + ring * 52) % 220);
        const alpha = Math.max(0, 0.32 - radius / 700) * compile;
        context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        context.lineWidth = 1.35;
        context.beginPath();
        context.arc(node.x, node.y, radius, 0, Math.PI * 2);
        context.stroke();
      }
    };

    const render = () => {
      time += 0.012;
      pointer.x += (pointer.tx - pointer.x) * 0.055;
      pointer.y += (pointer.ty - pointer.y) * 0.055;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";

      const glow = context.createRadialGradient(
        pointer.x * width,
        pointer.y * height,
        0,
        pointer.x * width,
        pointer.y * height,
        Math.max(width, height) * 0.58
      );
      glow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.18)`);
      glow.addColorStop(0.42, `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${isLight ? 0.04 : 0.035})`);
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const compile = easeOut((Math.sin(time * 0.5) * 0.5 + 0.5) * 0.58 + 0.42);

      context.globalCompositeOperation = "screen";
      drawCodeStream();
      drawFragments(compile);
      drawCompileRail(compile);

      const curves = paths.map((path, index) => drawPath(path[0], path[1], index, compile));

      tinyNodes.forEach((node) => {
        const curve = curves[node.lane];
        const t = (node.offset + time * node.speed) % 1;
        const point = pointOnCurve(curve, t);
        const pulse = Math.sin((t + time) * Math.PI * 4) * 0.5 + 0.5;
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(0.28 + pulse * 0.42) * compile})`;
        context.beginPath();
        context.arc(point.x, point.y, 2.2 + pulse * 1.6, 0, Math.PI * 2);
        context.fill();
      });

      pipeline.forEach((module, index) => drawModule(module, index, compile));
      drawHoverPulse(compile);

      const ringX = width * (0.18 + activeCase * 0.18);
      const ringY = height * 0.72;
      for (let ring = 0; ring < 3; ring += 1) {
        const radius = 90 + ((time * 80 + ring * 92) % 270);
        const alpha = Math.max(0, 0.16 - radius / 1900);
        context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(ringX, ringY, radius, 0, Math.PI * 2);
        context.stroke();
      }

      context.globalCompositeOperation = "source-over";
      if (!prefersReducedMotion) frameId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
    };
  }, [activeCase, hoveredModule, theme]);

  return (
    <div className="work-lab" ref={rootRef}>
      <canvas className="lab-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="lab-grid" aria-hidden="true" />
      <div className="lab-orbit lab-orbit-one" aria-hidden="true" />
      <div className="lab-orbit lab-orbit-two" aria-hidden="true" />
      <header className="lab-topbar">
        <a href="/" className="lab-brand">SAKTHIVEL / CASE FILES</a>
        <span>Work as evidence</span>
        <div className="lab-actions">
          <a href="mailto:sakthivels05062@gmail.com"><Mail size={16} /> Contact</a>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>
    </div>
  );
}

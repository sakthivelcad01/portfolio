import { ArrowUpRight, Github, Linkedin, Mail, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "./hooks/useTheme.js";
import SkillMixer from "./components/SkillMixer";
import ProjectGallery from "./components/ProjectGallery";
import WorkPage from "./components/WorkPage";
import ContactCanvas from "./components/ContactCanvas";
import ContactSignature from "./components/ContactSignature";

gsap.registerPlugin(ScrollTrigger);

const roles = ["Develop", "Build", "Deploy"];

const projects = [
  {
    id: "01",
    title: "Cal.com Monorepo Contribution",
    image: "/assets/project_calcom.png",
    label: "Open-source enhancement",
    art: "clean scheduling flow",
    engineering: "TypeScript / Next.js 15 / Vitest / Turborepo",
    body: "URL whitespace trimming and security parameter validation across scheduling engines, backed by focused test coverage.",
  },
  {
    id: "02",
    title: "Rupiece Platform",
    image: "/assets/rupiece-nse-bse-concept.png",
    label: "Indian proprietary trading",
    art: "high-signal interface",
    engineering: "React / Analytics / Risk workflows",
    body: "Rupiece is an Indian proprietary trading firm focused exclusively on NSE and BSE markets. Dashboard concept shown with illustrative demo data.",
  },
  {
    id: "03",
    title: "Formbricks Engine",
    image: "/assets/project_formbricks_generated.png",
    label: "Survey infrastructure",
    art: "calm form behavior",
    engineering: "Next.js / TypeScript / Validation testing",
    body: "Open-source survey infrastructure work focused on reliable validation behavior and product data handling.",
  },
  {
    id: "04",
    title: "Trading Automation",
    image: "/assets/project_trading_automation.png",
    label: "Execution system",
    art: "operational clarity",
    engineering: "React / Automation / Telemetry",
    body: "Automation-oriented product work for execution flows, analytics visibility, and measurable user-path improvements.",
  },
];

function splitText(text) {
  return text.split("").map((char, index) => (
    <span className="char-mask" key={`${char}-${index}`}>
      <span className="char">{char === " " ? "\u00A0" : char}</span>
    </span>
  ));
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [heroSide, setHeroSide] = useState("center");
  const rootRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const move = (event) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let cleanupContactReveal = null;
    let startEntrance;
    const context = gsap.context(() => {
      if (reduceMotion) {
        return;
      }

      const entrance = gsap.timeline({ paused: true })
        .from(".char", { yPercent: 115, rotate: 5, opacity: 0, duration: 0.8, stagger: 0.012, ease: "expo.out" })
        .from(".hero-enter", { y: 36, opacity: 0, duration: 0.85, stagger: 0.08, ease: "expo.out" }, "-=0.4");
      startEntrance = () => entrance.play();
      window.addEventListener("portfolio:entrance", startEntrance, { once: true });
      if (!document.querySelector(".site-loader")) startEntrance();

      gsap.set(".role-word", { yPercent: 110, opacity: 0 });
      const roleLoop = gsap.timeline({ repeat: -1 });
      gsap.utils.toArray(".role-word").forEach((word) => {
        roleLoop
          .to(word, { yPercent: 0, opacity: 1, duration: 0.55, ease: "expo.out" })
          .to(word, { yPercent: 0, opacity: 1, duration: 1.05 })
          .to(word, { yPercent: -110, opacity: 0, duration: 0.45, ease: "expo.in" });
      });

      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: ".handoff",
          start: "top top",
          end: () => `+=${window.innerHeight * 3.4}`,
          scrub: 0.35,
        },
      })
        .to(".hero", { opacity: 0, filter: "blur(14px)", scale: 0.992, ease: "none" }, 0.04)
        .fromTo(".workbench", { opacity: 0 }, { opacity: 1, ease: "none" }, 0.06)
        .fromTo(".workbench-spine", { scaleY: 0.12, opacity: 0.3 }, { scaleY: 1, opacity: 1, ease: "none" }, 0.1)
        .fromTo(".workbench-artist", { xPercent: -8, y: 12, opacity: 0.2 }, { xPercent: 0, y: 0, opacity: 1, ease: "none" }, 0.14)
        .fromTo(".workbench-engineer", { xPercent: 8, y: 12, opacity: 0.2 }, { xPercent: 0, y: 0, opacity: 1, ease: "none" }, 0.14)
        .fromTo(".workbench-statement", { y: 14, scale: 0.98, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: "none" }, 0.2)
        .fromTo(".workbench-item", { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, ease: "none" }, 0.32)
        .fromTo(".art-frame, .cursor-trail, .terminal-tick, .canvas-function", { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.025, ease: "none" }, 0.38)
        .fromTo(".workbench-cue", { y: 10, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.52)
        .to(".workbench", { opacity: 1, filter: "blur(0px)", scale: 1, ease: "none", duration: 0.12 }, 0.64)
        .to(".workbench", { opacity: 0, filter: "blur(14px)", scale: 0.992, ease: "none", duration: 0.1 }, 0.74)
        .set(".workbench", { visibility: "hidden" }, 0.79)
        .set(".workbench", { visibility: "visible" }, 0.06);

      gsap.utils.toArray(".project-panel").forEach((panel, index) => {
        gsap.from(panel, {
          y: 110,
          rotate: index % 2 ? 4 : -4,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top 92%", end: "top 48%", scrub: true },
        });
      });

      gsap.utils.toArray(".reveal-line").filter((line) => !line.closest(".contact")).forEach((line) => {
        gsap.from(line, {
          yPercent: 115,
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            end: "top 58%",
            scrub: 0.45,
            toggleActions: "play reverse play reverse",
          },
        });
      });

      const updateContactReveal = () => {
        const section = document.querySelector(".contact-section");
        const contact = document.querySelector(".contact");
        if (!section || !contact) return;

        const rect = section.getBoundingClientRect();
        const shouldReveal = rect.top < window.innerHeight * 0.42 && rect.bottom > window.innerHeight * 0.18;
        contact.classList.toggle("is-revealed", shouldReveal);
      };

      updateContactReveal();
      window.addEventListener("scroll", updateContactReveal, { passive: true });
      window.addEventListener("resize", updateContactReveal);
      cleanupContactReveal = () => {
        window.removeEventListener("scroll", updateContactReveal);
        window.removeEventListener("resize", updateContactReveal);
      };

      gsap.utils.toArray(".magnetic").forEach((item) => {
        const onMove = (event) => {
          const rect = item.getBoundingClientRect();
          gsap.to(item, {
            x: (event.clientX - rect.left - rect.width / 2) * 0.16,
            y: (event.clientY - rect.top - rect.height / 2) * 0.16,
            duration: 0.35,
            ease: "power3.out",
          });
        };
        const onLeave = () => gsap.to(item, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.35)" });
        item.addEventListener("pointermove", onMove);
        item.addEventListener("pointerleave", onLeave);
      });
    }, rootRef.current);

    return () => {
      cleanupContactReveal?.();
      window.removeEventListener("portfolio:entrance", startEntrance);
      context.revert();
    };
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const timeout = window.setTimeout(refresh, 600);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
    };
  }, []);

  const navigateTo = (event, selector) => {
    event.preventDefault();
    if (selector === "#skills") {
      const handoffTrigger = ScrollTrigger.getAll().find((st) => st.trigger?.classList?.contains("handoff"));
      if (handoffTrigger) {
        const offset = handoffTrigger.start + (handoffTrigger.end - handoffTrigger.start) * 0.84;
        window.scrollTo({ top: offset, behavior: "smooth" });
        return;
      }
    }

    const target = document.querySelector(selector);
    if (!target) return;

    const triggers = ScrollTrigger.getAll();
    const match = triggers.find((st) => st.trigger === target || st.pin === target);

    if (match) {
      window.scrollTo({ top: match.start, behavior: "smooth" });
    } else {
      const y = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="page" ref={rootRef}>
      <div className="cursor" ref={cursorRef} aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="handoff-cover" aria-hidden="true" />
      <div className="split-bg" aria-hidden="true">
        <span className="artist-field" />
        <span className="engineer-field" />
        <i />
      </div>

      <header className="nav hero-enter">
        <a className="magnetic" href="#top" onClick={(e) => navigateTo(e, "#top")}>Sakthivel S</a>
        <nav aria-label="Primary navigation">
          <a className="magnetic" href="#duality" onClick={(e) => navigateTo(e, "#duality")}>Duality</a>
          <a className="magnetic" href="/work">Work</a>
          <a className="magnetic" href="#contact" onClick={(e) => navigateTo(e, "#contact")}>Contact</a>
        </nav>
        <button className="magnetic" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main id="top">
        <div className="handoff" id="duality">
          <div className="intro-screen">
            <section className={`hero reveal-${heroSide}`} onMouseLeave={() => setHeroSide("center")}>
              <div className="hero-image-stage" aria-hidden="true">
                <img src="/assets/sakthivel-artist-engineer-hero.png" alt="" />
                <div className="image-half image-artist" />
                <div className="image-half image-engineer" />
                <div className="hero-center-line" />
              </div>
              <button
                className="hero-hit hero-hit-left"
                type="button"
                aria-label="Reveal artist side"
                onMouseEnter={() => setHeroSide("artist")}
                onFocus={() => setHeroSide("artist")}
              />
              <button
                className="hero-hit hero-hit-right"
                type="button"
                aria-label="Reveal engineer side"
                onMouseEnter={() => setHeroSide("engineer")}
                onFocus={() => setHeroSide("engineer")}
              />
              <div className="hero-meta hero-enter">
                <span>Artist side: form, feeling, clarity</span>
                <span>Engineer side: systems, proof, scale</span>
              </div>

              <h1 className="hero-title" aria-label="Developer who Develop Build Deploy">
                <span>{splitText("Developer who")}</span>
                <span className="brace-row" aria-hidden="true">
                  <b>{"{"}</b>
                  <i>
                    {roles.map((role) => <em className="role-word" key={role}>{role}</em>)}
                  </i>
                  <b>{"}"}</b>
                </span>
              </h1>

              <aside className="side-caption artist-caption hero-enter">
                <span>Artist</span>
                <p>If website development is art, Sakthivel is the artist.</p>
              </aside>

              <aside className="side-caption engineer-caption hero-enter">
                <p><span>mode</span> Full-stack architect & AI engineer</p>
                <p><span>stack</span> C# .NET 9 / React 19 / Gemini AI</p>
                <p><span>place</span> Tirunelveli, Tamil Nadu</p>
              </aside>
            </section>

            <section className="workbench" aria-label="Artist and engineer workbench">
              <div className="workbench-spine" aria-hidden="true" />
              <div className="workbench-layer workbench-artist" aria-hidden="true">
                <span className="paint-mark paint-mark-a" />
                <span className="paint-mark paint-mark-b" />
                <span className="art-frame art-frame-a" />
                <span className="art-frame art-frame-b" />
                <span className="cursor-trail cursor-trail-a" />
                <span className="cursor-trail cursor-trail-b" />
                <pre className="canvas-function artist-function function-a">{`composeHero({
  rhythm: "cinematic",
  contrast: "human",
  motion: "intentional"
})`}</pre>
                <pre className="canvas-function artist-function function-b">{`paintInteraction()
  .withFeeling()
  .thenRefine()`}</pre>
                <span className="ui-fragment fragment-a">type scale</span>
                <span className="ui-fragment fragment-b">motion pass</span>
                <span className="ui-fragment fragment-c">visual rhythm</span>
              </div>
              <div className="workbench-layer workbench-engineer" aria-hidden="true">
                <span className="code-route route-one" />
                <span className="code-route route-two" />
                <span className="code-node code-node-a">API</span>
                <span className="code-node code-node-b">TEST</span>
                <span className="code-node code-node-c">SHIP</span>
                <span className="terminal-tick tick-a">deploy.preview.ok</span>
                <span className="terminal-tick tick-b">latency 42ms</span>
                <span className="terminal-tick tick-c">motion.safe</span>
                <pre className="canvas-function dotnet-function function-c">{`public async Task<Result> ShipAsync()
{
    await ValidateAsync();
    return Deploy.Preview();
}`}</pre>
                <pre className="canvas-function dotnet-function function-d">{`builder.Services
  .AddPortfolio()
  .AddGeminiAI()
  .AddTelemetry();`}</pre>
              </div>
              <div className="workbench-statement">
                <span>Split canvas becomes workbench</span>
                <h2>
                  <span className="mask"><span className="reveal-line">Every interface has two truths:</span></span>
                  <span className="mask"><span className="reveal-line">what it feels like,</span></span>
                  <span className="mask"><span className="reveal-line">and how it works.</span></span>
                </h2>
                <div className="workbench-grid">
                  <p className="workbench-item">Artist layer turns attention into rhythm, contrast, spacing, and emotion.</p>
                  <p className="workbench-item">Engineer layer turns that feeling into components, APIs, tests, and systems that survive production.</p>
                </div>
              </div>
              <a className="workbench-cue magnetic" href="#skills" onClick={(e) => navigateTo(e, "#skills")}>Explore the stack</a>
            </section>
          </div>
        </div>

        <SkillMixer projects={projects} />
        <ProjectGallery projects={projects} />

        <section className="contact-section" id="contact">
          <ContactCanvas />
          <div className="contact">
            <span>Final merge</span>
            <h2><span className="mask"><span className="reveal-line">Bring the idea. I’ll bring both sides.</span></span></h2>
            <p>Visual taste for the first impression. Engineering judgment for the production system underneath.</p>
            <div>
              <a className="magnetic" href="mailto:sakthivels05062@gmail.com"><Mail size={18} /> Email</a>
              <a className="magnetic" href="https://github.com/sakthivelcad01" target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
              <a className="magnetic" href="https://linkedin.com/in/sakthivel-s" target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a>
              <a className="magnetic" href="#top">Back up <ArrowUpRight size={18} /></a>
            </div>
          </div>
          <ContactSignature />
        </section>
      </main>
    </div>
  );
}

export default function PortfolioRouter() {
  return window.location.pathname.startsWith("/work") ? <WorkPage projects={projects} /> : <App />;
}

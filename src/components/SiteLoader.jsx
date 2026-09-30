import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./SiteLoader.css";

export default function SiteLoader() {
  const overlay = useRef(null);
  const [finished, setFinished] = useState(false);

  useLayoutEffect(() => {
    if (!overlay.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFinished(true);
      return;
    }

    const root = document.getElementById("root");
    const wasInert = root.inert;
    root.inert = true;
    let disposed = false;
    let timeline;
    const preventScroll = event => event.preventDefault();
    const release = () => {
      root.inert = wasInert;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", onKey);
    };
    const complete = () => {
      if (disposed) return;
      release();
      window.dispatchEvent(new Event("portfolio:entrance"));
      setFinished(true);
    };
    const onKey = event => {
      if (event.key === "Escape") {
        timeline?.kill();
        complete();
      } else if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", onKey);

    // Animate only the overlay: never transform a parent of the pinned scenes.
    const context = gsap.context(() => {
      const badge = overlay.current.querySelector(".site-loader__badge");
      const mark = overlay.current.querySelector(".site-loader__mark");
      const letters = overlay.current.querySelectorAll(".site-loader__letter");
      const hole = overlay.current.querySelector(".site-loader__hole");
      const name = overlay.current.querySelector(".site-loader__name");
      const width = Math.min(name.getBoundingClientRect().width + 78, window.innerWidth - 48);
      gsap.set(letters, { yPercent: 120 });
      gsap.set(mark, { yPercent: 110, rotation: 70 });
      timeline = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.inOut" }, onComplete: complete });
      timeline.fromTo(badge, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.65 })
        .to(mark, { yPercent: 0, rotation: 0, duration: 0.65 }, "<")
        .to(badge, { width, duration: 0.7 }, "+=0.12")
        .to(letters, { yPercent: 0, stagger: 0.025, duration: 0.6 }, "<0.05")
        .to(mark, { opacity: 0, x: -20, duration: 0.25 }, "+=0.12")
        .to(badge, { paddingLeft: 18, width: width - 38, duration: 0.3 }, "<")
        .add(() => {
          window.dispatchEvent(new Event("portfolio:entrance"));
          const bounds = badge.getBoundingClientRect();
          gsap.set(hole, { attr: {
            x: bounds.left / window.innerWidth * 1000,
            y: bounds.top / window.innerHeight * 1000,
            width: bounds.width / window.innerWidth * 1000,
            height: bounds.height / window.innerHeight * 1000,
          } });
        })
        .to(badge, { opacity: 0, duration: 0.35 })
        .to(hole, { attr: { x: -10, y: -10, width: 1020, height: 1020, rx: 0 }, duration: 1.05 }, "<");
    }, overlay);
    const fallback = window.setTimeout(complete, 5000);
    return () => {
      disposed = true;
      clearTimeout(fallback);
      context.revert();
      release();
    };
  }, []);

  if (finished) return null;
  return <div className="site-loader" ref={overlay} aria-hidden="true">
    <svg className="site-loader__curtain" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <defs><mask id="portfolio-loading-mask">
        <rect width="1000" height="1000" fill="white" />
        <rect className="site-loader__hole" x="500" y="500" width="0" height="0" rx="8" fill="black" />
      </mask></defs>
      <rect width="1000" height="1000" fill="var(--bg)" mask="url(#portfolio-loading-mask)" />
    </svg>
    <div className="site-loader__badge">
      <span className="site-loader__mark">S</span>
      <span className="site-loader__name">{Array.from("SAKTHIVEL S").map((letter, index) =>
        <span className="site-loader__letter" key={index}>{letter === " " ? "\u00a0" : letter}</span>
      )}</span>
    </div>
  </div>;
}

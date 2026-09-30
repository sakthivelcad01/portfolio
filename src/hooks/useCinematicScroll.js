import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCinematicScroll(theme) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      gsap.from(".hero-copy > *, .terminal", {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
      });

      gsap.utils.toArray(".reveal-card").forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
          },
        });
      });

      gsap.to(".scene-canvas", {
        opacity: theme === "dark" ? 0.9 : 0.62,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(".project-track", {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-section",
          start: "top top",
          end: "+=1400",
          pin: true,
          scrub: 1,
        },
      });
    });

    return () => context.revert();
  }, [theme]);
}

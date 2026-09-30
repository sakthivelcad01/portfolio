import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InterfaceScene from "./InterfaceScene";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGallery({ projects }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    const section = root.current;
    const matte = section.querySelector(".project-gallery-matte");
    const viewport = section.querySelector(".project-gallery-viewport");
    const track = section.querySelector(".project-gallery-track");
    const scenes = [...track.children];
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      section.classList.add("is-horizontal");
      gsap.set(matte, { autoAlpha: 0 });
      gsap.set(viewport, { autoAlpha: 1 });
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: .35,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      })
        .fromTo(viewport, { filter: "blur(12px)", scale: 0.992 }, { filter: "blur(0px)", scale: 1, duration: .5 }, .28)
        .fromTo(matte, { opacity: 0, visibility: "visible" }, { opacity: .58, duration: .2 }, 0)
        .to(matte, { opacity: 0, duration: .45 }, .38)
        .set(matte, { visibility: "hidden" }, .84);
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: () => `+=${window.innerHeight * Math.max(3.2, scenes.length * 1.08)}`, pin: viewport, scrub: .35, invalidateOnRefresh: true, refreshPriority: -10 },
        defaults: { ease: "none" },
      });
      timeline.set(viewport, { autoAlpha: 1 }, 0);
      scenes.forEach((_, index) => {
        const holdDuration = index === 0 ? 1.05 : 1.35;
        timeline.addLabel(`scene-${index}`)
          .to({}, { duration: holdDuration });
        if (index < scenes.length - 1) {
          timeline.to(track, { x: () => -viewport.clientWidth * (index + 1), duration: 1 });
        }
      });
      const guideStates = scenes.map(() => ({ progress: 0 }));
      const sendGuide = (scene, state) => scene.dispatchEvent(new CustomEvent("project-guide-progress", { detail: state }));
      scenes.forEach((scene, index) => {
        const update = () => sendGuide(scene, guideStates[index]);
        update();
        timeline.fromTo(guideStates[index], { progress: 0 }, {
          progress: 1, duration: index === 0 ? .52 : 1.05, ease: "none", onUpdate: update,
        }, (timeline.labels[`scene-${index}`] ?? 0) + (index === 0 ? .03 : .16));
      });
      // Keyboard focus brings its project into view instead of leaving it off-screen.
      const focus = event => {
        const index = scenes.findIndex(scene => scene.contains(event.target));
        if (index < 0) return;
        const progress = index === scenes.length - 1 ? 1 : (timeline.labels[`scene-${index}`] ?? 0) / timeline.duration();
        const trigger = timeline.scrollTrigger;
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "instant" });
        timeline.progress(progress);
      };
      viewport.addEventListener("focusin", focus);
      return () => {
        scenes.forEach(scene => sendGuide(scene, { progress: 1 }));
        gsap.set([matte, viewport], { clearProps: "opacity,visibility" });
        viewport.removeEventListener("focusin", focus); section.classList.remove("is-horizontal");
      };
    }, section);
    return () => media.revert();
  }, []);
  return <div ref={root} className="project-gallery" id="project-overview"><div className="project-gallery-matte" aria-hidden="true" /><div className="project-gallery-viewport"><div className="project-gallery-track">
    {projects.map((project, index) => <InterfaceScene key={project.id} projects={projects} initialIndex={index} scrollManaged />)}
  </div></div></div>;
}

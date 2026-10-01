import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import "./SkillMixer.css";
import WorkStory from "./WorkStory";
import "./WorkPage.css";
import WorkIndex from "./WorkIndex";
import ArchitectureStory from "./ArchitectureStory";

export default function WorkPage({ projects }) {
  useTheme();
  const cursorRef = useRef(null);
  const id = window.location.pathname.split("/").filter(Boolean)[1];
  const project = projects.find((item) => item.id === id);

  useEffect(() => {
    const moveCursor = (event) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    return () => window.removeEventListener("pointermove", moveCursor);
  }, []);

  return (
    <main className="work-detail-container" style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <div className="cursor" ref={cursorRef} aria-hidden="true" />


      {project?.id === "01" && /\/story\/?$/.test(window.location.pathname) ? <WorkStory /> : project && ["02", "03", "04"].includes(project.id) && /\/story\/?$/.test(window.location.pathname) ? <ArchitectureStory project={project} /> : project ? (
        <article className="case-detail">
          <a className="case-back" href="/work">All work <ArrowUpRight size={16} /></a>
          <span className="case-eyebrow">
            SELECTED CASE STUDY / {project.id} / {project.label}
          </span>
          <h1>{project.title}</h1>
          <p className="case-summary">{project.body}</p>
          {project.image && <img className="case-image" src={project.image} alt={`${project.title} project artwork`} />}
          <hr />
          <div className="case-facts">
            <section>
              <h2>Experience & Design</h2>
              <p>{project.art}</p>
            </section>
            <section>
              <h2>Engineering & Stack</h2>
              <p>{project.engineering}</p>
            </section>
          </div>
          <a className="case-contact" href="mailto:sakthivels05062@gmail.com">
            Discuss this project <ArrowUpRight size={18} />
          </a>
        </article>
      ) : (
        <WorkIndex projects={projects} />
      )}
    </main>
  );
}

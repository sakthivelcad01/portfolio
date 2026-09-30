import { createElement, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Plus, X, RotateCcw, Layers, Code2, Database, Wrench } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SkillMixer.css";

gsap.registerPlugin(ScrollTrigger);

const groups = [
  { name: "Languages", icon: Code2, items: ["C# (.NET Core)", "JavaScript", "Python", "Java", "HTML5 & CSS3"] },
  { name: "Frameworks", icon: Layers, items: ["ASP.NET MVC / WebAPI", "React", "Next.js", "Tailwind CSS", "Bootstrap", "FastAPI"] },
  { name: "Database & Cloud", icon: Database, items: ["SQL Server", "MySQL", "Firebase", "RESTful API Design", "Vercel & CI/CD"] },
  { name: "Tools & Workflow", icon: Wrench, items: ["Git & GitHub", "VS Code / Visual Studio", "Cursor & Copilot", "Playwright & Selenium"] },
];
const allSkills = groups.flatMap(group => group.items);
// Only match technologies explicitly documented in the current project records.
function matchProjects(projects, selected) {
  return projects.map(project => ({ ...project, matched: selected.filter(skill =>
    project.engineering.split(" / ").some(technology => technology === skill || technology.startsWith(`${skill} `))
  ) })).filter(project => project.matched.length).sort((a, b) => b.matched.length - a.matched.length);
}

export default function SkillMixer({ projects }) {
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [over, setOver] = useState(false);
  const sectionRef = useRef(null);
  const resultRef = useRef(null);
  const matches = matchProjects(projects, selected);
  const [resultIndex, setResultIndex] = useState(0);
  const project = matches[resultIndex];
  const add = skill => {
    if (!allSkills.includes(skill)) return;
    setSelected(previous => previous.includes(skill) ? previous : [...previous, skill]);
    setRevealed(false);
    setResultIndex(0);
  };
  const remove = skill => { setSelected(previous => previous.filter(item => item !== skill)); setRevealed(false); setResultIndex(0); };
  useLayoutEffect(() => {
    const wrapper = sectionRef.current;
    if (!wrapper || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const section = wrapper.querySelector(".skill-mixer");
      const matte = wrapper.querySelector(".mix-matte");
      const panels = gsap.utils.toArray(".mix-source, .mix-builder");
      const command = wrapper.querySelector(".mix-command-line");
      const heading = wrapper.querySelector(".mix-heading");

      gsap.timeline({
        scrollTrigger: {
          trigger: ".handoff",
          start: "top top",
          end: () => `+=${window.innerHeight * 3.4}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const active = self.progress > 0.74 && self.progress < 0.995;
            section.classList.toggle("is-live", self.progress > 0.8 && self.progress < 0.985);
            document.documentElement.classList.toggle("skill-window-active", active);
          },
          onLeave: () => {
            section.classList.remove("is-live");
            document.documentElement.classList.remove("skill-window-active");
          },
          onLeaveBack: () => {
            section.classList.remove("is-live");
            document.documentElement.classList.remove("skill-window-active");
          },
        },
        defaults: { ease: "none" },
      })
        .set(matte, { autoAlpha: 0 }, 0)
        .set(section, { autoAlpha: 0 }, 0)
        .to(matte, { autoAlpha: 1, duration: 0.035 }, 0.74)
        .fromTo(section, { autoAlpha: 0, filter: "blur(18px)", scale: 0.985 }, { autoAlpha: 1, filter: "blur(0px)", scale: 1, duration: 0.055 }, 0.78)
        .fromTo(heading, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.795)
        .fromTo(command, { autoAlpha: 0, y: 16, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.04 }, 0.805)
        .fromTo(panels, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, stagger: 0.006, duration: 0.065 }, 0.815)
        .to(panels, { autoAlpha: 0, y: -28, stagger: 0.006, duration: 0.035 }, 0.975)
        .to(".mix-signals", { autoAlpha: 0, duration: 0.025 }, 0.98)
        .to(command, { scale: 0.94, autoAlpha: 0, filter: "blur(8px)", duration: 0.025 }, 0.982)
        .to(heading, { autoAlpha: 0, y: -18, filter: "blur(10px)", duration: 0.025 }, 0.985)
        .to(section, { autoAlpha: 0, filter: "blur(14px)", scale: 0.99, duration: 0.025 }, 0.99)
        .to(matte, { autoAlpha: 0, duration: 0.02 }, 0.995);
    }, wrapper);

    return () => context.revert();
  }, []);
  useLayoutEffect(() => {
    if (!revealed || !resultRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(resultRef.current, { clipPath: "inset(0 0 100% 0)", opacity: 0 }, { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: .7, ease: "power3.out" });
      gsap.from(".mix-result > *", { y: 16, opacity: 0, stagger: .07, duration: .5 });
    }, resultRef);
    return () => context.revert();
  }, [revealed, resultIndex]);
  return <div className="mix-transition" ref={sectionRef}><div className="mix-matte" aria-hidden="true" /><section className="skill-mixer" id="skills" aria-labelledby="mix-heading">
    <header className="mix-heading"><span className="mix-eyebrow">THE INGREDIENTS / YOUR COMBINATION</span><h2 id="mix-heading">You pick the stack.<br /><em>I bring the proof.</em></h2><span className="mix-index" aria-hidden="true">04 + 01</span></header>
    <div className="mix-stage">
      <div className="mix-command-row" aria-hidden="true">
        <div className="mix-command-line"><span>sakthivel.skills.build()</span><i /></div>
      </div>
      <div className="mix-layout">
      <div className="mix-signals" aria-hidden="true"><i className="mix-signal" /><i className="mix-signal" /><i className="mix-signal" /><i className="mix-signal" /></div>
      <div className="mix-sources">{groups.map(({ name, icon: Icon, items }, index) => <article className="mix-source" key={name}>
        <header>{createElement(Icon, { size: 19 })}<h3>{name}</h3><span>0{index + 1}</span></header>
        <div className="mix-skills">{items.map(skill => <button type="button" key={skill} draggable={!selected.includes(skill)} aria-pressed={selected.includes(skill)} onClick={() => selected.includes(skill) ? remove(skill) : add(skill)} onDragStart={event => { event.dataTransfer.setData("text/plain", skill); event.dataTransfer.effectAllowed = "copy"; }} className={selected.includes(skill) ? "is-picked" : ""}>{skill}<Plus size={13} aria-hidden="true" /></button>)}</div>
      </article>)}</div>
      <div className={`mix-builder ${over ? "is-over" : ""}`} onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; setOver(true); }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOver(false); }} onDrop={event => { event.preventDefault(); setOver(false); add(event.dataTransfer.getData("text/plain")); }}>
        <header><span className="mix-live" /><h3>Your build</h3><span>{String(selected.length).padStart(2, "0")} selected</span><button type="button" aria-label="Reset selected skills" disabled={!selected.length} onClick={() => { setSelected([]); setRevealed(false); setResultIndex(0); }}><RotateCcw size={16} /></button></header>
        <div className="mix-selection">{selected.length ? selected.map(skill => <button key={skill} type="button" onClick={() => remove(skill)} aria-label={`Remove ${skill}`}>{skill}<X size={14} /></button>) : <div className="mix-empty"><span aria-hidden="true">{"{ + }"}</span><p>Your next combination</p></div>}</div>
        <button className="mix-submit" type="button" disabled={!selected.length} onClick={() => { setResultIndex(0); setRevealed(true); }}>What did I build with this?<ArrowRight size={19} /></button>
        <div className="mix-output" aria-live="polite" aria-atomic="true">{revealed && <div className="mix-result" ref={resultRef}>{project ? <>
          <span className="mix-eyebrow">{project.matched.length === selected.length ? "EXACT STACK MATCH" : `${project.matched.length} OF ${selected.length} SELECTED SKILLS MATCH`} / {project.id}</span>
          {project.image && <img className="mix-project-image" src={project.image} alt={`${project.title} project artwork`} />}
          <h3>{project.title}</h3><p>{project.body}</p><div className="mix-matches">{project.matched.map(skill => <span key={skill}>{skill}</span>)}</div>
          <a href={`/work/${project.id}`}>Explore project<ArrowUpRight size={18} /></a>
          {matches.length > 1 && <button className="mix-next" type="button" onClick={() => setResultIndex(index => (index + 1) % matches.length)}>Another match ({resultIndex + 1}/{matches.length})<ArrowRight size={16} /></button>}
        </> : <><span className="mix-eyebrow">NO DOCUMENTED MATCH</span><h3>This combination is still open.</h3><p>The current project records do not list these technologies together.</p><button type="button" className="mix-next" onClick={() => { setSelected(["React"]); setResultIndex(0); }}>Try React<ArrowRight size={16} /></button></>}</div>}</div>
      </div>
    </div>
    </div>
  </section></div>;
}

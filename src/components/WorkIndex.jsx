import { ArrowLeft, ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import WorkConnections from "./WorkConnections";
import "./WorkStory.css";
import "./WorkIndex.css";

export default function WorkIndex({ projects }) {
  const { theme, toggleTheme } = useTheme();
  return <div className="story work-index">
    <WorkConnections />
    <header className="story-nav">
      <a href="/"><ArrowLeft size={17} /> SAKTHIVEL S</a>
      <span>SELECTED WORK / 04</span>
      <button onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Change theme">{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button>
    </header>
    <div className="work-index-heading"><div><span>IDEAS / DECISIONS / IMPLEMENTATION</span><h1>Selected work.</h1></div><p>Four projects.<br />The thinking behind the build.</p></div>
    <div className="work-index-grid">
      {projects.map(project => <a className="work-index-project" key={project.id} href={`/work/${project.id}/story`}>
        <div className="work-index-image"><img src={project.image} alt={`${project.title} interface concept`} /><span>{project.id}</span></div>
        <div className="work-index-label"><span>{project.label}</span><ArrowUpRight size={20} /></div>
        <h2>{project.title}</h2><p>{project.body}</p>
        <span className="work-index-open">Explore the interactive story <ArrowUpRight size={15} /></span>
      </a>)}
    </div>
  </div>;
}

const projects = [
  {
    index: "001",
    title: "Rupiece Trading System",
    meta: "FastAPI / React / WebSockets",
    body: "Real-time prop-trading monitoring, simulated execution, and risk logic for drawdown accuracy.",
  },
  {
    index: "002",
    title: "Formbricks Contribution",
    meta: "Next.js / TypeScript / Vitest",
    body: "Open-source validation improvements with focused automated tests across survey input behavior.",
  },
  {
    index: "003",
    title: "Architecture Portfolio",
    meta: "Next.js / CMS / Performance",
    body: "A visual project showcase with image pipelines, inquiry flows, and Lighthouse-focused delivery.",
  },
  {
    index: "004",
    title: "Forex Rate Monitor",
    meta: "ASP.NET MVC / SQL Server",
    body: "Server-rendered trading utility with caching, rate visibility, and operational dashboard patterns.",
  },
];

function ProjectReel() {
  return (
    <section className="projects-section" id="projects">
      <div className="project-intro">
        <p className="kicker">Selected Work</p>
        <h2>Scroll through the reel.</h2>
      </div>
      <div className="project-viewport">
        <div className="project-track">
          {projects.map((project) => (
            <article className="project-card reveal-card" key={project.index}>
              <p>{project.index}</p>
              <h3>{project.title}</h3>
              <span>{project.meta}</span>
              <small>{project.body}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectReel;

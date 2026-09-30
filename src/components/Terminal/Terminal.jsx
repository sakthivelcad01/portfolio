import { useEffect, useRef, useState } from "react";

const bootOutput = [
  "INITIALIZING...",
  "",
  "SYSTEM INITIALIZING...",
  "",
  "Identity ............ loaded",
  "Skills .............. loaded",
  "Experience .......... loaded",
  "Projects ............ loaded",
  "",
  "Welcome, visitor.",
];

const responses = {
  help: ["help, whoami, about, skills, experience, projects, education, resume, contact, clear"],
  whoami: ["visitor"],
  about: ["Sakthivel S - full-stack developer shaping reliable systems and cinematic web interfaces."],
  skills: ["React, Next.js, ASP.NET Core, FastAPI, Three.js, GSAP, SQL, Playwright, automation."],
  experience: ["Placeholder: add role history, impact metrics, internships, and freelance work here."],
  projects: ["Placeholder: Rupiece, Formbricks contribution, architecture portfolio, data pipelines, trading tools."],
  education: ["Placeholder: B.E. Electronics and Communication Engineering, 2023."],
  resume: ["Placeholder: wire your latest PDF resume path here."],
  contact: ["Email: sakthivels05062@gmail.com", "GitHub: github.com/sakthivelcad01", "LinkedIn: linkedin.com/in/sakthivel05062"],
};

function Terminal({ active = true, compact = false }) {
  const [history, setHistory] = useState([]);
  const [command, setCommand] = useState("");
  const [booted, setBooted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!active || booted) return undefined;

    setHistory([]);
    setBooted(true);
    let index = 0;
    const timer = window.setInterval(() => {
      setHistory((items) => [...items, { type: "boot", text: bootOutput[index] }]);
      index += 1;
      if (index >= bootOutput.length) {
        window.clearInterval(timer);
      }
    }, compact ? 150 : 120);

    return () => window.clearInterval(timer);
  }, [active, booted, compact]);

  const runCommand = (event) => {
    event.preventDefault();
    const raw = command.trim();
    if (!raw || !booted) return;

    if (raw.toLowerCase() === "clear") {
      setHistory([]);
      setCommand("");
      return;
    }

    const output = responses[raw.toLowerCase()] || [`Command not found: ${raw}`, 'Type "help" to see available commands.'];
    setHistory((items) => [
      ...items,
      { type: "command", text: `visitor@portfolio:~$ ${raw}` },
      ...output.map((text) => ({ type: "response", text })),
    ]);
    setCommand("");
  };

  return (
    <section className={compact ? "terminal terminal-compact" : "terminal"} aria-label="Interactive portfolio terminal" onClick={() => inputRef.current?.focus()}>
      {!compact && (
        <div className="terminal-toolbar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
      <div className="terminal-screen" role="log" aria-live="polite">
        {history.map((entry, index) => (
          <div className={`terminal-line terminal-${entry.type}`} key={`${entry.text}-${index}`}>
            {entry.text}
          </div>
        ))}
      </div>
      <form className="terminal-input-row" onSubmit={runCommand}>
        <label className="sr-only" htmlFor="terminal-command">
          Portfolio terminal command
        </label>
        <span className="terminal-prompt">visitor@portfolio:~$</span>
        <input
          ref={inputRef}
          id="terminal-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          aria-label="Enter terminal command"
          autoComplete="off"
          disabled={!booted}
          spellCheck="false"
        />
        <span className="terminal-caret" aria-hidden="true">
          _
        </span>
      </form>
    </section>
  );
}

export default Terminal;

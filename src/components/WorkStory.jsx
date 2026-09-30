import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Moon, Sun, Play, Pause, RotateCcw, X, Code2 } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import "./WorkStory.css";
import WorkConnections from "./WorkConnections";

const chapters = [
  { name: "The input", title: "One invisible character.", body: "A copied scheduling link can carry whitespace. The URL looks familiar, but the string reaching the application is different." },
  { name: "The boundary", title: "Small input. Real friction.", body: "This illustrative strict validator rejects surrounding whitespace. A valid-looking link stops before it reaches the scheduling flow." },
  { name: "The change", title: "Normalize. Then validate.", body: "Trim the surrounding whitespace before validation. Keep validation in place: cleaning an input is not the same as trusting it." },
  { name: "The outcome", title: "Same intention. Clearer path.", body: "The cleaned link passes this demonstration's checks. Malformed URLs and unsupported protocols still stop at validation." },
];

export default function WorkStory() {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [mode, setMode] = useState("before");
  const [input, setInput] = useState("  https://cal.com/your-name  ");
  const [inspect, setInspect] = useState(false);
  const fixed = mode === "after";
  const normalized = fixed ? input.trim() : input;
  let valid = false;
  try { const url = new URL(normalized); valid = normalized === normalized.trim() && ["https:", "http:"].includes(url.protocol); } catch { /* Invalid input stays rejected. */ }

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step === 3) setPlaying(false);
      else { setStep(step + 1); if (step + 1 === 2) setMode("after"); }
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [step, playing]);

  const replay = (nextMode = "before") => { setMode(nextMode); setStep(nextMode === "after" ? 2 : 0); setPlaying(true); setInspect(false); };
  const select = (index) => { setStep(index); setMode(index >= 2 ? "after" : "before"); setPlaying(false); };

  return <div className="story" data-step={step} data-fixed={fixed}>
    <WorkConnections />
    <header className="story-nav"><a href="/work"><ArrowLeft size={17} /> ALL WORK</a><span>WORK / 01</span><button onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Change theme">{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button></header>
    <div className="story-heading"><span>CAL.COM / OPEN-SOURCE CONTRIBUTION</span><h1>Invisible input.<br /><em>Visible impact.</em></h1><p>URL whitespace handling & validation</p></div>
    <div className="story-stage">
      <div className="story-caption" key={step}><span>0{step + 1} / {chapters[step].name}</span><h2>{chapters[step].title}</h2><p>{chapters[step].body}</p><button className="story-inspect" onClick={() => setInspect(!inspect)} aria-expanded={inspect}><Code2 size={17} />{inspect ? "Close implementation" : "Inspect implementation"}</button></div>
      <div className="story-machine">
        <div className="story-machine-top"><span><i /> INPUT TRACE</span><div className="story-modes" aria-label="Implementation version">{["before", "after"].map(value => <button key={value} aria-pressed={mode === value} onClick={() => replay(value)}>{value === "before" ? "Before" : "After"}</button>)}</div></div>
        <label className="story-input">Scheduling URL<input aria-label="Scheduling URL" value={input} onChange={e => { setInput(e.target.value); setPlaying(false); }} spellCheck={false} /></label>
        <div className="story-trace" aria-label="Input processing stages">
          <button onClick={() => select(0)} className={step === 0 ? "active" : ""}><span>01</span>Receive<code>{input.replace(/ /g, "\u00b7") || "(empty)"}</code></button><ArrowRight className="story-arrow" />
          <button onClick={() => select(2)} className={step === 2 ? "active" : ""}><span>02</span>{fixed ? "Trim + validate" : "Validate"}<code>{fixed ? "input.trim()" : "input"}</code></button><ArrowRight className="story-arrow" />
          <button onClick={() => select(3)} className={`story-result ${step > 0 ? "arrived" : ""}`}><span>03</span>{step > 0 ? (valid ? <Check /> : <X />) : "..."}<code>{step > 0 ? (valid ? "Accepted" : "Rejected") : "Awaiting input"}</code></button>
        </div>
        <div className="story-terminal" aria-live="polite"><span>{fixed ? "+ NORMALIZED" : "- RAW INPUT"}</span><code>{JSON.stringify(normalized)}</code><small>{fixed ? "Validation remains required." : `${input.length - input.trim().length} surrounding whitespace characters`}</small></div>
        {inspect && <div className="story-code"><strong>Illustrative implementation</strong><pre>{`const candidate = input.trim();\nconst url = new URL(candidate);\nif (!["https:", "http:"].includes(url.protocol)) {\n  throw new Error("Unsupported protocol");\n}`}</pre><p>Concept demonstration, not the original Cal.com patch. Production security checks depend on the destination and use case.</p></div>}
      </div>
    </div>
    <footer className="story-footer"><div className="story-playback"><button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause story" : "Play story"} title={playing ? "Pause" : "Play"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button><button onClick={() => replay()} aria-label="Replay story" title="Replay"><RotateCcw size={18} /></button></div><nav aria-label="Story chapters">{chapters.map((chapter, index) => <button key={chapter.name} onClick={() => select(index)} aria-current={step === index ? "step" : undefined}><span>0{index + 1}</span>{chapter.name}<i /></button>)}</nav><a href="/work/01">Project overview <ArrowRight size={17} /></a></footer>
    <div className="story-note">INTERACTIVE EXPLANATION / Illustrative input trace based on the portfolio contribution summary.</div>
  </div>;
}

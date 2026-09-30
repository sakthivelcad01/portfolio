import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Moon, Sun, Pause, Play, RotateCcw } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import WorkConnections from "./WorkConnections";
import "./WorkStory.css";
import "./ArchitectureStory.css";

const stories = {
  "02": {
    title: "One tick.", titleAccent: "Thousands of destinations.", label: "RUPIECE / NSE + BSE REAL-TIME DELIVERY",
    nodes: ["NSE / BSE feed", "Conflate + delta", "Topic broker", "Gateway 01", "Gateway 02", "Gateway 03", "Subscribers", "Slow consumers", "Reconnecting clients"],
    chapters: [
      { title: "A single update becomes a crowd.", body: "A price tick must reach many subscribers. Sequential fan-out in the application can hold up other work, while long-lived connections consume memory and file descriptors.", before: "Fan-out concentrated in one process", after: "Dedicated gateways share subscriber delivery", detail: "Publish once per topic. Each gateway delivers to its local subscribers; latency and capacity still require measurement.", focus: [2, 3, 4, 5], metric: "100,000 clients / supplied load scenario" },
      { title: "The payload multiplies, too.", body: "In the supplied example, a 2 KB payload at 20 updates per second across 100,000 clients implies 4 GB/s of payload traffic, before protocol overhead.", before: "Full payload for every update", after: "Conflated snapshots + compact deltas", detail: "Send initial state, then changed fields. Conflate replaceable market ticks; do not discard order or execution events.", focus: [0, 1, 2], metric: "2 KB × 20/s × 100k = 4 GB/s (decimal units)" },
      { title: "The slowest client cannot own the server.", body: "When a connection drains more slowly than updates arrive, its pending messages accumulate. Unbounded per-client queues can exhaust memory.", before: "Pending tick buffers keep growing", after: "Bounded queues + latest-state delivery", detail: "Set a write-buffer ceiling. Replace stale price ticks, or disconnect overloaded consumers. On reconnect, use retained history or a fresh snapshot; pub/sub alone is not replay storage.", focus: [4, 7], metric: "64 KB pending buffer / proposed example limit" },
      { title: "Recovery needs breathing room.", body: "A shared interruption can make thousands of clients reconnect together, creating a sudden authentication and database load spike.", before: "Clients retry together", after: "Backoff + jitter + sequence recovery", detail: "Spread retries over time and resume from a sequence when retained history is available. Fall back to a snapshot if the recovery window has expired.", focus: [5, 8], metric: "20,000 reconnects / supplied failure scenario" },
    ],
  },
  "03": {
    title: "One source.", titleAccent: "Every survey language.", label: "FORMBRICKS / SURVEY INTERNATIONALIZATION",
    subtitle: "Package workflow / supplied documentation",
    solutionLabel: "Documented workflow",
    note: "PACKAGE WALKTHROUGH / Based on supplied documentation; this does not establish an individual contribution or a verified test run.",
    tabs: ["Source keys", "Generation", "Registration", "Verification"],
    nodes: ["locales/en.json", "Lingo.dev", "Locale files", "i18next config", "i18n provider", "Survey + tests"],
    positions: [[15, 155], [185, 155], [355, 155], [525, 155], [695, 155], [865, 155]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
    chapters: [
      { title: "New copy must travel beyond English.", body: "Adding a survey label introduces a key that target languages and components need to share. Changing English alone does not finish the translation workflow.", before: "New source key; target files need updating", after: "English source feeds translation generation", detail: "Add the key to packages/surveys/locales/en.json, then run pnpm i18n:generate. Components consume translation keys through useTranslation rather than maintaining separate text for every language.", focus: [0, 1, 2], metric: "en.json / source language" },
      { title: "Generation and corrections are different steps.", body: "The documented workflow supports more than ten languages. Source changes trigger generation, while a correction to an existing target translation is edited in its own locale file.", before: "Source changes have not reached target locales", after: "Configured target files receive translations", detail: "Lingo.dev uses i18n.json to identify source and target locales. A developer configures its API key privately in the package environment. Target-only corrections do not require regeneration; verify them in the survey instead.", focus: [1, 2], metric: "10+ languages / described in package documentation" },
      { title: "A generated file is not a registered language.", body: "A locale can exist on disk without being available to the renderer. Adding a language requires both generation configuration and runtime registration.", before: "Locale file exists; runtime registration incomplete", after: "Resources + supportedLngs + provider connected", detail: "Add the target to i18n.json. Import its translations in i18n.config.ts and include it in supportedLngs and resources. The i18n provider connects that configuration to survey components.", focus: [2, 3, 4], metric: "i18n.json + i18n.config.ts / two configuration steps" },
      { title: "Check the language where it is used.", body: "Translation generation is one part of delivery. Labels, navigation buttons, and question components still need verification across supported languages.", before: "Generated text has not been verified in the UI", after: "Survey rendering + test workflow", detail: "Use the package's Vitest scripts and inspect survey rendering across languages. TypeScript supports the implementation, while Preact supports the lightweight renderer. No test pass counts or bundle measurements were supplied.", focus: [3, 4, 5], metric: "pnpm test / pnpm test:coverage / documented scripts" },
    ],
  },
  "04": {
    title: "Keep the request path", titleAccent: "moving.", label: "TRADING AUTOMATION / REQUEST ARCHITECTURE",
    nodes: ["10k-user scenario", "CDN edge", "Load balancer", "App node 01", "App node 02", "App node 03", "Redis cache", "Pooler → Postgres", "Queue → workers"],
    chapters: [
      { title: "Every request cannot hit the origin.", body: "The supplied scenario starts with a 10k-user audience. Repeated static and cacheable requests add avoidable work if every request reaches the application.", before: "All scenario requests reach origin", after: "8,000 cached / 2,000 dynamic requests", detail: "Serve eligible static or cached content at the edge. Authenticated trading data requires explicit cache rules and isolation. These request counts have no specified time window.", focus: [0, 1, 2], metric: "8,000 edge hits + 2,000 dynamic / scenario only" },
      { title: "Spread work without blocking the loop.", body: "Dynamic requests still need admission control and distribution. Blocking operations can prevent an application process from serving other requests.", before: "Work concentrated on one app node", after: "Balanced nodes + asynchronous I/O", detail: "Use the load balancer for distribution and rate limits, with bounded connection reuse. Async I/O helps waiting workloads; CPU-heavy work needs separate capacity.", focus: [2, 3, 4, 5], metric: "3 application nodes / proposed topology" },
      { title: "Protect the database boundary.", body: "Repeated reads and excessive database connections compete for a finite resource. Adding application nodes alone can increase that pressure.", before: "Repeated reads + direct connection pressure", after: "Read cache + bounded DB pool", detail: "Redis handles eligible reads. pgBouncer bounds database connections; primary and replicas serve the appropriate workloads. Cache invalidation, replica lag, and transaction consistency remain constraints.", focus: [3, 6, 7], metric: "90% read-cache hit rate / scenario assumption" },
      { title: "Let background work leave the request.", body: "Jobs that do not need to finish before the HTTP response can lengthen the request path and consume application capacity.", before: "Background tasks block completion", after: "Queue work; process asynchronously", detail: "Kafka or RabbitMQ separates accepted work from worker processing. A queued job is not a completed trade; execution paths need explicit acknowledgements, retry handling, and duplicate protection.", focus: [5, 8], metric: "Queue → workers / proposed asynchronous path" },
    ],
  },
};

const positions = [[55, 155], [255, 155], [455, 155], [655, 55], [655, 155], [655, 255], [855, 55], [855, 155], [855, 255]];
const edges = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [3, 6], [4, 7], [5, 8]];
const failureLabels = {
  "02": ["FAN-OUT BLOCKED", "BANDWIDTH SATURATED", "BUFFER OVERFLOW", "RETRY STORM"],
  "03": ["MISSING TRANSLATIONS", "STALE LOCALE FILES", "LOCALE NOT REGISTERED", "UNVERIFIED RENDERING"],
  "04": ["ORIGIN OVERLOADED", "APP NODE BLOCKED", "CONNECTION PRESSURE", "REQUEST WAITING"],
};

export default function ArchitectureStory({ project }) {
  const story = stories[project.id];
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(0);
  const [fixed, setFixed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const chapter = story.chapters[step];
  const nodePositions = story.positions || positions;
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (!fixed) setFixed(true);
      else if (step < story.chapters.length - 1) { setStep(step + 1); setFixed(false); }
      else setPlaying(false);
    }, 3800);
    return () => clearTimeout(timer);
  }, [playing, fixed, step, story]);
  const select = index => { setStep(index); setFixed(false); setPlaying(false); };
  const replay = () => { setStep(0); setFixed(false); setPlaying(true); };

  return <div className="story architecture-story" data-resolved={fixed}>
    <WorkConnections />
    <header className="story-nav"><a href="/work"><ArrowLeft size={17} /> ALL WORK</a><span>WORK / {project.id}</span><button onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Change theme">{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button></header>
    <div className="architecture-heading"><span>{story.label}</span><h1>{story.title} <em>{story.titleAccent}</em></h1><p>{story.subtitle || "Proposed architecture / supplied scenarios"}</p></div>
    <div className="architecture-toolbar"><span>{chapter.metric}</span><div className="story-modes"><button aria-pressed={!fixed} onClick={() => { setFixed(false); setPlaying(false); }}>Problem</button><button aria-pressed={fixed} onClick={() => { setFixed(true); setPlaying(false); }}>{story.solutionLabel || "Proposed solution"}</button></div></div>
    <div className="architecture-map">
      <svg viewBox="0 0 1040 340" role="img" aria-label={`${project.title}: ${fixed ? `${chapter.after}. Routed through processing stages.` : `${chapter.before}. Direct connection fails midway: ${failureLabels[project.id][step]}.`}`}>
        {!fixed ? <g className="architecture-failure" key={step}>
          <path className="architecture-direct" d="M195 175 H493 M547 175 H855" />
          <path className="architecture-break" d="M493 175 l9 -10 l9 20 l9 -20 l9 20 l9 -10 H547" />
          {[0, 1, 2, 3].map(index => <rect key={index} className="architecture-failed-packet" x="197" y="171" width="10" height="8" rx="2" style={{ animationDelay: `${index * -.7}s` }} />)}
          <g className="architecture-node" transform="translate(55,155)"><rect width="140" height="48" rx="4" /><text x="70" y="28" textAnchor="middle">{story.nodes[0]}</text></g>
          <g className="architecture-node architecture-waiting" transform="translate(855,155)"><rect width="140" height="48" rx="4" /><text x="70" y="28" textAnchor="middle">{project.id === "02" ? "Connected clients" : project.id === "03" ? "Survey renderer" : "Request completion"}</text></g>
          <g className="architecture-hazard"><path d="M520 97 l18 30 h-36 Z" /><text x="520" y="121" textAnchor="middle">!</text></g>
          <text className="architecture-failure-label" x="520" y="75" textAnchor="middle">{failureLabels[project.id][step]}</text>
          <text className="architecture-failure-caption" x="520" y="270" textAnchor="middle">{project.id === "03" ? "Incomplete input never reaches a verified rendering state" : "Packets stall at the bottleneck; delivery is interrupted"}</text>
          <text className="architecture-failure-caption" x="925" y="228" textAnchor="middle">WAITING</text>
        </g> : <g className="architecture-solution">
        {(story.edges || edges).map(([from, to], index) => {
          const [x, y] = nodePositions[from], [tx, ty] = nodePositions[to];
          const path = `M${x + 140} ${y + 20} C${x + 175} ${y + 20},${tx - 35} ${ty + 20},${tx} ${ty + 20}`;
          const active = chapter.focus.includes(from) || chapter.focus.includes(to);
          return <g key={index} className={active ? "architecture-edge focused" : "architecture-edge"}><path d={path} /><path className="architecture-packet" pathLength="100" d={path} style={{ animationDelay: `${index * -.33}s` }} /></g>;
        })}
        {story.nodes.map((name, index) => <g key={name} className={`architecture-node ${chapter.focus.includes(index) ? "focused" : ""}`} transform={`translate(${nodePositions[index][0]},${nodePositions[index][1]})`}><rect width="140" height="48" rx="4" /><text x="10" y="-10">0{index + 1}</text><text x="70" y="28" textAnchor="middle">{name}</text></g>)}
        </g>}
      </svg>
      <div className="architecture-status" role="status" key={`${step}-${fixed}`}><span>{fixed ? (story.solutionLabel || "PROPOSED RESPONSE") : "PRESSURE POINT"}</span><strong>{fixed ? chapter.after : chapter.before}</strong></div>
    </div>
    <div className="architecture-explanation" key={step}><h2>{chapter.title}</h2><p>{chapter.body}</p><p><strong>Design decision</strong>{chapter.detail}</p></div>
    <footer className="story-footer"><div className="story-playback"><button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause story" : "Play story"} title={playing ? "Pause story" : "Play story"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button><button onClick={replay} aria-label="Replay story" title="Replay story"><RotateCcw size={18} /></button></div><nav aria-label="Story chapters">{story.chapters.map((item, index) => <button key={item.title} onClick={() => select(index)} aria-current={step === index ? "step" : undefined}><span>0{index + 1}</span>{(story.tabs || (project.id === "02" ? ["Fan-out", "Bandwidth", "Slow clients", "Recovery"] : ["Edge cache", "App capacity", "Database", "Background jobs"]))[index]}<i /></button>)}</nav><a href={`/work/${project.id}`}>Project overview <ArrowRight size={17} /></a></footer>
    <div className="story-note">{story.note || "ARCHITECTURE EXPLANATION / Scenario figures are not measured production results. Packet motion illustrates routing, not real throughput."}</div>
  </div>;
}

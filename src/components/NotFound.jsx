import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import "./NotFound.css";

export default function NotFound() {
  useTheme();
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "404 | Sakthivel S";
    return () => { document.title = previousTitle; };
  }, []);
  return <main className="not-found">
    <a className="not-found__brand" href="/">SAKTHIVEL S</a>
    <section>
      <span className="not-found__code" aria-hidden="true"><span>4</span><span>0</span><span>4</span></span>
      <h1><span>You’re</span> <span>searching</span> <span>outside my brain.</span></h1>
      <p>This idea hasn’t been wired into the portfolio yet.</p>
      <nav aria-label="Page recovery" className="not-found__actions">
        <a href="/"><ArrowLeft size={18} /> Back home</a>
        <a href="/work">Explore my work <ArrowUpRight size={18} /></a>
      </nav>
    </section>
  </main>;
}

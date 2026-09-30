import { useLayoutEffect, useRef, useState } from "react";

const NAME = "SAKTHIVEL S";
const SYMBOLS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%<>";

export default function ContactSignature() {
  const root = useRef(null);
  const text = useRef(null);
  const timer = useRef(null);
  const [letters, setLetters] = useState(NAME);
  const [slots, setSlots] = useState([]);
  const [box, setBox] = useState("0 25 1200 130");

  useLayoutEffect(() => {
    let active = true;
    const card = root.current.parentElement.querySelector(".contact");
    const measure = () => {
      if (!active) return;
      const style = getComputedStyle(text.current);
      const context = document.createElement("canvas").getContext("2d");
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const metrics = context.measureText(NAME);
      setSlots([...NAME].map((char, index) => ({ x: context.measureText(NAME.slice(0, index)).width, width: context.measureText(char).width })));
      const width = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      setBox(`${-metrics.actualBoundingBoxLeft} ${-metrics.actualBoundingBoxAscent} ${width} ${height}`);
      root.current.style.setProperty("--signature-ratio", `${width} / ${height}`);
      const naturalHeight = (root.current.clientWidth - 32) * height / width;
      const availableHeight = (root.current.parentElement.clientHeight - card.offsetHeight) / 2;
      const fittedHeight = Math.max(0, Math.min(naturalHeight, availableHeight - 12)) * 0.85;
      root.current.style.setProperty("--signature-height", `${fittedHeight}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    observer.observe(root.current.parentElement);
    document.fonts.ready.then(measure);
    measure();
    return () => { active = false; observer.disconnect(); clearInterval(timer.current); };
  }, []);

  const scramble = (event) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(timer.current);
    let frame = 0;
    timer.current = setInterval(() => {
      frame += 1;
      setLetters([...NAME].map((char, index) => char === " " || frame >= 5 + index * 2 ? char : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]).join(""));
      if (frame >= 5 + NAME.length * 2) { clearInterval(timer.current); setLetters(NAME); }
    }, 45);
  };
  const leave = () => {
    clearInterval(timer.current);
    setLetters(NAME);
  };
  const renderLetters = () => slots.length ? [...letters].map((char, index) => <tspan key={index} x={slots[index].x} y="0" textLength={char !== NAME[index] ? slots[index].width : undefined} lengthAdjust="spacingAndGlyphs">{char}</tspan>) : NAME;

  return <div className="portfolio-signature" ref={root}>
    <svg viewBox={box} preserveAspectRatio="xMidYMax meet" role="img" aria-label="Sakthivel S" onPointerEnter={scramble} onPointerLeave={leave} onPointerCancel={leave}>
      <text ref={text} x="0" y="0">{renderLetters()}</text>
    </svg>
  </div>;
}

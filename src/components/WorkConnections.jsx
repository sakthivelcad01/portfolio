const routes = [
  "M-50 240 H240 Q280 240 280 280 V400 Q280 450 330 450 H1100 Q1150 450 1150 500 V730 H1490",
  "M1490 160 H1020 Q980 160 980 200 V570 Q980 610 940 610 H-50",
  "M700 950 V750 Q700 710 660 710 H560 Q520 710 520 670 V130 Q520 90 560 90 H820 V-50",
];

export default function WorkConnections() {
  return <svg className="story-wiring" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
    {routes.map((route, index) => <g key={route}>
      <path className="story-wire" d={route} />
      <path className={`story-signal story-signal-${index}`} d={route} pathLength="1960" />
    </g>)}
    {[240, 440, 850, 1150].map(x => <path key={x} className="story-guide" d={`M${x} 0 V900`} />)}
  </svg>;
}

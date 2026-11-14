'use client';

import { useEffect, useRef } from 'react';

const SCREWS: [number, number][] = [[30, 26], [290, 26], [290, 144], [30, 144]];
const RAM_CHIPS = [120, 136, 152, 168, 184];

/** Decorative laptop; the scene playlist lives in lib/hero-scenes. */
export function HeroDevice({ labels }: { labels: { code: string; design: string; hardware: string; group: string } }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    import('@/lib/hero-scenes').then(({ startHeroScenes }) => {
      if (!cancelled && ref.current) stop = startHeroScenes(ref.current);
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return (
    <div className="device" ref={ref}>
      <div className="laptop" aria-hidden="true">
        <div className="lid">
          <div className="screen">
            <div className="ed-tabs" data-tabs><span>routes/api.php</span><span>Attendance.php</span></div>
            <div className="screen-body">
              <div className="scene on" data-scene="code">
                <div className="ed-code"><span className="ln" data-lines /><code data-code /></div>
              </div>
              <div className="scene" data-scene="design"><DesignCanvas /></div>
              <div className="scene" data-scene="hardware"><HardwareBench /></div>
            </div>
            <div className="ed-status"><span data-status>PHP · Laravel</span><span>UTF-8</span></div>
          </div>
        </div>
        <div className="base" />
      </div>
      <div className="result" data-result aria-hidden="true" />
      <div className="scene-switch" role="group" aria-label={labels.group}>
        <button type="button" data-goto="code">{labels.code}</button>
        <button type="button" data-goto="design">{labels.design}</button>
        <button type="button" data-goto="hardware">{labels.hardware}</button>
      </div>
    </div>
  );
}

function DesignCanvas() {
  return (
    <svg className="ai" viewBox="0 0 320 170">
      <rect className="canvas" width="320" height="170" />
      <rect className="panel" width="24" height="170" />
      <rect className="tool-hl" x="3" y="5" width="18" height="18" rx="3" />
      <path className="tool" d="M9 8.5v11l3-2.6 2.2 4.3 1.8-.9-2.2-4.3h4z" />
      <rect className="tool" x="7" y="31" width="10" height="10" rx="1" />
      <circle className="tool" cx="12" cy="58" r="5.5" />
      <path className="tool" d="M12 75l5.5 10h-11z" />
      <rect className="board" x="36" y="10" width="208" height="150" rx="2" />
      <path className="board-grid" d="M36 40h208M36 70h208M36 100h208M36 130h208M77 10v150M118 10v150M159 10v150M200 10v150" />
      <rect className="shp s-rect" x="78" y="46" width="78" height="72" rx="6" />
      <circle className="shp s-circle" cx="152" cy="52" r="28" />
      <path className="shp s-tri" d="M70 136 104 92 138 136z" />
      <text className="shp s-text" x="88" y="104">AM</text>
      <g className="anchors">
        <rect className="anchor" x="67" y="133" width="6" height="6" />
        <rect className="anchor" x="101" y="89" width="6" height="6" />
        <rect className="anchor" x="135" y="133" width="6" height="6" />
      </g>
      <g className="sel">
        <rect x="64" y="20" width="126" height="122" strokeDasharray="3 2" />
        <rect className="h" x="61" y="17" width="6" height="6" /><rect className="h" x="187" y="17" width="6" height="6" />
        <rect className="h" x="61" y="139" width="6" height="6" /><rect className="h" x="187" y="139" width="6" height="6" />
      </g>
      <rect className="panel" x="252" width="68" height="170" />
      <text className="lyr-title" x="260" y="17">LAYERS</text>
      <g className="lyr"><rect x="260" y="28" width="9" height="9" rx="1" fill="#2A2923" /><rect className="bar" x="274" y="31" width="36" height="3" rx="1.5" /></g>
      <g className="lyr"><circle cx="264.5" cy="49.5" r="4.5" fill="#F0855E" /><rect className="bar" x="274" y="48" width="30" height="3" rx="1.5" /></g>
      <g className="lyr"><path d="M260 70l4.5-9 4.5 9z" fill="#D9C27A" /><rect className="bar" x="274" y="65" width="33" height="3" rx="1.5" /></g>
      <g className="lyr"><text x="259" y="87" fill="#ECE8DC" fontSize="9" fontWeight="800">T</text><rect className="bar" x="274" y="82" width="24" height="3" rx="1.5" /></g>
      <g className="cursor"><path d="M0 0v13l3.4-3 2.4 5 2-1-2.4-5h4.6z" /></g>
    </svg>
  );
}

function HardwareBench() {
  const chips = (y: number) => RAM_CHIPS.map((x) => `M${x} ${y}h10v6h-10z`).join('');
  return (
    <svg className="hw" viewBox="0 0 320 170">
      <rect className="bg" width="320" height="170" />
      <rect className="board" x="16" y="12" width="288" height="146" rx="8" />
      <path className="trace" d="M86 62h20v-20M86 70h30v38h8M64 84v22M200 70h4M150 140h60v-26" />
      <rect className="chip" x="42" y="40" width="44" height="44" rx="3" />
      <rect className="die" x="52" y="50" width="24" height="24" rx="2" />
      <circle className="paste" cx="64" cy="62" r="11" />
      <rect className="battery" x="36" y="104" width="64" height="42" rx="4" />
      <rect className="slot" x="112" y="30" width="92" height="12" rx="1" />
      <rect className="slot" x="112" y="50" width="92" height="12" rx="1" />
      <g><rect className="ram" x="114" y="29" width="88" height="12" rx="1" /><path className="ram-chip" d={chips(32)} /></g>
      <g className="ram-new"><rect className="ram" x="114" y="49" width="88" height="12" rx="1" /><path className="ram-chip" d={chips(52)} /></g>
      <rect className="slot" x="112" y="112" width="10" height="16" rx="1" />
      <g className="ssd"><rect className="ssd" x="122" y="113" width="80" height="14" rx="2" /><rect className="ssd-label" x="160" y="116" width="26" height="8" rx="1" /></g>
      <circle className="fan-ring" cx="250" cy="70" r="36" />
      <g className="fan">
        <path d="M250 70c-4-12 2-26 12-28-2 10-6 20-12 28zm0 0c12-4 26 2 28 12-10-2-20-6-28-12zm0 0c4 12-2 26-12 28 2-10 6-20 12-28zm0 0c-12 4-26-2-28-12 10 2 20 6 28 12z" />
        <circle className="hub" cx="250" cy="70" r="7" />
      </g>
      <text className="temp-label" x="226" y="128">CPU</text>
      <text className="temp" x="226" y="141" data-temp>92°C</text>
      <g className="cover">
        <rect className="cover" x="16" y="12" width="288" height="146" rx="8" />
        <path className="vent" d="M200 40h80M200 50h80M200 60h80M200 70h80M200 80h80M200 90h80" />
        {SCREWS.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} className="screw">
            <circle cx={cx} cy={cy} r="5" />
            <path d={`M${cx - 3} ${cy}h6M${cx} ${cy - 3}v6`} />
          </g>
        ))}
      </g>
      <g className="driver"><path className="driver-shaft" d="M0 0v-30" /><rect className="driver-handle" x="-5" y="-58" width="10" height="28" rx="4" /></g>
    </svg>
  );
}

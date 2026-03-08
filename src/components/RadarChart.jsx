import React, { useMemo } from 'react';
import BlipDot from './BlipDot';
import { getQuadrantColor, QUADRANT_COLORS } from '../utils/colors';
import {
  RING_ORDER, RING_RADII, SIZE, CX, CY, MAX_R,
  QUAD_ANGLES, computeBlipPositions,
} from '../utils/geometry';

const GAP = 28;
const PAD = 50;
const SQ = MAX_R + PAD;
const BG_GRAY = '#e8e8e8';
const DIV_C = '#bbb';
const DIV_W = 1.8;

const VBX = CX - SQ;
const VBY = CY - SQ;
const VBW = SQ * 2;
const VBH = SQ * 2;

/* Divider band inner edges — arcs terminate here */
const DL = CX - GAP / 2;   // divider left inner edge
const DR = CX + GAP / 2;   // divider right inner edge
const DT = CY - GAP / 2;   // divider top inner edge
const DB = CY + GAP / 2;   // divider bottom inner edge

/*
  Clip rects — each quadrant is bounded by the
  inner face of the divider lines (flush with bold stroke).
    Q0 (top-left)      Q1 (top-right)
    Q3 (bottom-left)   Q2 (bottom-right)
*/
const CLIP_RECTS = [
  { x: VBX, y: VBY, w: DL - VBX, h: DT - VBY },                       // Q0
  { x: DR,  y: VBY, w: VBX + VBW - DR, h: DT - VBY },                  // Q1
  { x: DR,  y: DB,  w: VBX + VBW - DR, h: VBY + VBH - DB },            // Q2
  { x: VBX, y: DB,  w: DL - VBX, h: VBY + VBH - DB },                  // Q3
];

export default function RadarChart({ data, quadrants, hoveredIdx, setHoveredIdx, searchQuery }) {
  const blips = useMemo(() => computeBlipPositions(data, quadrants), [data, quadrants]);

  const matchesSearch = (name) => {
    if (!searchQuery) return true;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const wrapLabel = (text, maxChars = 14) => {
    if (text.length <= maxChars) return [text];
    const words = text.split(/\s+/);
    const lines = [];
    let cur = '';
    words.forEach((w) => {
      if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; }
      else { cur = cur ? cur + ' ' + w : w; }
    });
    if (cur) lines.push(cur);
    return lines;
  };

  const M = 10;
  const cornerPos = [
    { x: VBX + M,       y: VBY + M,       anc: 'start', vA: 'hanging' },
    { x: VBX + VBW - M, y: VBY + M,       anc: 'end',   vA: 'hanging' },
    { x: VBX + VBW - M, y: VBY + VBH - M, anc: 'end',   vA: 'auto' },
    { x: VBX + M,       y: VBY + VBH - M, anc: 'start', vA: 'auto' },
  ];

  const blipEls = data.map((d, i) => {
    if (!blips[i]) return null;
    const inSearch = matchesSearch(d.name);
    const qIdx = quadrants.indexOf(d.quadrant);
    return (
      <BlipDot
        key={`blip-${i}`}
        x={blips[i].x} y={blips[i].y}
        color={getQuadrantColor(qIdx)}
        status={d.status}
        isHovered={hoveredIdx === i}
        anyHovered={hoveredIdx !== null || (searchQuery && !inSearch)}
        onMouseEnter={() => setHoveredIdx(i)}
        onMouseLeave={() => setHoveredIdx(null)}
      />
    );
  });

  let tooltip = null;
  if (hoveredIdx !== null && blips[hoveredIdx]) {
    const d = data[hoveredIdx];
    const { x, y } = blips[hoveredIdx];
    const tipW = Math.max(d.name.length * 8.5 + 28, 90);
    const tipH = 34;
    const tipX = x - tipW / 2;
    const tipY = y - 38;
    tooltip = (
      <g style={{ pointerEvents: 'none' }}>
        <rect x={tipX} y={tipY} width={tipW} height={tipH} rx={6} fill="#1a1a2e" opacity={0.96} />
        <polygon points={`${x - 6},${tipY + tipH} ${x + 6},${tipY + tipH} ${x},${tipY + tipH + 8}`} fill="#1a1a2e" opacity={0.96} />
        <text x={x} y={tipY + tipH / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize="13" fontWeight="600"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{d.name}</text>
      </g>
    );
  }

  return (
    <svg
      id="radar-svg-main"
      viewBox={`${VBX} ${VBY} ${VBW} ${VBH}`}
      style={{ width: '100%', maxWidth: 800, display: 'block', margin: '0 auto' }}
      shapeRendering="geometricPrecision"
    >
      {/* ── Clip paths: bounded by divider inner edges ───── */}
      <defs>
        {CLIP_RECTS.map((cr, i) => (
          <clipPath key={i} id={`cq${i}`}>
            <rect x={cr.x} y={cr.y} width={cr.w} height={cr.h} />
          </clipPath>
        ))}
      </defs>

      {/* ── 1. Square gray background ────────────────────── */}
      <rect x={VBX} y={VBY} width={VBW} height={VBH} fill={BG_GRAY} rx={4} />

      {/* ── 2. Per-quadrant clipped arcs ─────────────────── */}
      {[0, 1, 2, 3].map((qi) => (
        <g key={`quad-${qi}`} clipPath={`url(#cq${qi})`}>
          {/* White background for quadrant */}
          <circle cx={CX} cy={CY} r={MAX_R} fill="#fff" />

          {/* Ring band fills — outer to inner, progressively darker */}
          {[...RING_RADII].reverse().map((r, ri) => {
            const opacities = [0.03, 0.06, 0.09, 0.13];
            return (
              <circle key={`bf-${ri}`} cx={CX} cy={CY} r={r * MAX_R}
                fill={`rgba(0,0,0,${opacities[ri]})`} />
            );
          })}

          {/* Ring arc outlines — clipped to quarter arcs flush with divider */}
          {RING_RADII.map((r, ri) => (
            <circle key={`ro-${ri}`} cx={CX} cy={CY} r={r * MAX_R}
              fill="none" stroke="#c0c0c0" strokeWidth={1.2} />
          ))}

          {/* Outer boundary ring — visible against gray corners */}
          <circle cx={CX} cy={CY} r={MAX_R}
            fill="none" stroke="#c5c5c5" strokeWidth={1} />
        </g>
      ))}

      {/* ── 3. White cross divider bands ─────────────────── */}
      <rect x={VBX} y={DT} width={VBW} height={GAP} fill="#fff" />
      <rect x={DL} y={VBY} width={GAP} height={VBH} fill="#fff" />

      {/* ── 4. Bold divider boundary lines ───────────────── */}
      {/* Horizontal top line */}
      <line x1={VBX} y1={DT} x2={VBX + VBW} y2={DT} stroke={DIV_C} strokeWidth={DIV_W} />
      {/* Horizontal bottom line */}
      <line x1={VBX} y1={DB} x2={VBX + VBW} y2={DB} stroke={DIV_C} strokeWidth={DIV_W} />
      {/* Vertical left line */}
      <line x1={DL} y1={VBY} x2={DL} y2={VBY + VBH} stroke={DIV_C} strokeWidth={DIV_W} />
      {/* Vertical right line */}
      <line x1={DR} y1={VBY} x2={DR} y2={VBY + VBH} stroke={DIV_C} strokeWidth={DIV_W} />

      {/* ── 5. Ring labels — horizontal band only ────────── */}
      {RING_ORDER.map((label, i) => {
        const innerR = i === 0 ? 0 : RING_RADII[i - 1] * MAX_R;
        const outerR = RING_RADII[i] * MAX_R;
        const midR = (innerR + outerR) / 2;

        return (
          <g key={`rl-${i}`}>
            <text x={CX - midR} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
              fontWeight="700" fontSize="11" fill="#333"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{label}</text>
            <text x={CX + midR} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
              fontWeight="700" fontSize="11" fill="#333"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{label}</text>
            <line x1={CX - outerR} y1={DT} x2={CX - outerR} y2={DB} stroke="#ccc" strokeWidth={0.8} />
            <line x1={CX + outerR} y1={DT} x2={CX + outerR} y2={DB} stroke="#ccc" strokeWidth={0.8} />
          </g>
        );
      })}

      {/* ── 6. Corner quadrant labels ────────────────────── */}
      {quadrants.map((q, qi) => {
        const cp = cornerPos[qi];
        const lines = wrapLabel(q, 14);
        const lh = 22;
        const isBot = cp.vA === 'auto';
        const baseY = isBot ? cp.y - (lines.length - 1) * lh : cp.y;

        return (
          <g key={`ql-${qi}`} style={{ cursor: 'pointer' }}>
            {lines.map((ln, li) => (
              <text key={li} x={cp.x} y={baseY + li * lh}
                textAnchor={cp.anc} dominantBaseline={cp.vA}
                fill="#1a1a1a" fontWeight="700" fontSize="18"
                style={{ fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.3px' }}
              >{ln}</text>
            ))}
            <text
              x={cp.anc === 'start' ? cp.x + Math.max(...lines.map(l => l.length)) * 10.5 + 8 : cp.x - Math.max(...lines.map(l => l.length)) * 10.5 - 8}
              y={baseY + (lines.length - 1) * lh}
              textAnchor="middle" dominantBaseline={cp.vA}
              fill="#888" fontSize="20" fontWeight="700"
            >›</text>
          </g>
        );
      })}

      {/* ── 7. Blips ─────────────────────────────────────── */}
      {blipEls}

      {/* ── 8. Tooltip ───────────────────────────────────── */}
      {tooltip}
    </svg>
  );
}

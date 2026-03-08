/**
 * AITechPulse Geometry — polar coordinate math & blip layout
 */

import config from './config';

export const RING_ORDER = config.radar.rings;
export const RING_RADII = [0.22, 0.44, 0.68, 1.0];
export const SIZE = 700;
export const CX = SIZE / 2;
export const CY = SIZE / 2;
export const MAX_R = 310;

/* Quadrant angle ranges in SVG coordinate space */
export const QUAD_ANGLES = [
  { start: Math.PI, end: Math.PI * 1.5 },        // top-left
  { start: -Math.PI * 0.5, end: 0 },              // top-right
  { start: 0, end: Math.PI * 0.5 },               // bottom-right
  { start: Math.PI * 0.5, end: Math.PI },          // bottom-left
];

/** Convert polar coordinates to cartesian */
export function polarToCart(cx, cy, angle, radius) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

/** Deterministic hash for consistent blip placement */
export function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Calculate blip positions for all data items.
 * Returns an array of { x, y } matching the data array indices.
 */
export function computeBlipPositions(data, quadrants) {
  const groups = {};
  data.forEach((d, i) => {
    const key = `${d.quadrant}|${d.ring}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(i);
  });

  const positions = new Array(data.length);

  Object.entries(groups).forEach(([key, indices]) => {
    const [qName, rName] = key.split('|');
    const qIdx = quadrants.indexOf(qName);
    const rIdx = RING_ORDER.indexOf(rName);
    if (qIdx < 0 || rIdx < 0) return;

    const qa = QUAD_ANGLES[qIdx];
    const innerR = rIdx === 0 ? 0.06 : RING_RADII[rIdx - 1] + 0.02;
    const outerR = RING_RADII[rIdx] - 0.02;
    const angleSpan = qa.end - qa.start;
    const padding = 0.08;

    indices.forEach((dataIdx, posInGroup) => {
      const h = hashStr(data[dataIdx].name + 'salt');
      const angleSlot = (posInGroup + 0.5) / indices.length;
      const angle = qa.start + padding + angleSlot * (angleSpan - 2 * padding);
      const rFrac = 0.3 + ((h % 500) / 1000) * 0.5;
      const radius = (innerR + rFrac * (outerR - innerR)) * MAX_R;
      positions[dataIdx] = polarToCart(CX, CY, angle, radius);
    });
  });

  return positions;
}

/** Generate an SVG arc path for a quadrant wedge */
export function wedgePath(cx, cy, r, startAngle, endAngle) {
  const p1 = polarToCart(cx, cy, startAngle, r);
  const p2 = polarToCart(cx, cy, endAngle, r);
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
}

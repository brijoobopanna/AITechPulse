import React from 'react';
import { getStatusType } from '../utils/colors';

/**
 * BlipDot — renders a single technology blip on the radar.
 *
 * Inner circle: quadrant color
 * Outer ring: depends on status
 *   - "new"          → full outer ring
 *   - "Moved in/out" → half outer ring
 *   - "No change"    → no outer ring
 */
export default function BlipDot({ x, y, color, status, isHovered, anyHovered, onMouseEnter, onMouseLeave }) {
  const innerR = 7;
  const outerR = 12;
  const circumference = 2 * Math.PI * outerR;
  const statusType = getStatusType(status);

  let outerEl = null;
  if (statusType === 'full') {
    outerEl = (
      <circle r={outerR} fill="none" stroke={color} strokeWidth={2.5} opacity={0.85} />
    );
  } else if (statusType === 'half') {
    outerEl = (
      <circle
        r={outerR}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={`${circumference / 2} ${circumference / 2}`}
        opacity={0.7}
      />
    );
  }

  const opacity = anyHovered ? (isHovered ? 1 : 0.1) : 0.9;
  const scale = isHovered ? 1.35 : 1;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{
        opacity,
        transition: 'opacity 0.25s ease, transform 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <g transform={`scale(${scale})`} style={{ transition: 'transform 0.2s ease' }}>
        {outerEl}
        <circle r={innerR} fill={color} />
        {isHovered && (
          <circle r={innerR + 1} fill="none" stroke="#fff" strokeWidth={2} />
        )}
      </g>
    </g>
  );
}

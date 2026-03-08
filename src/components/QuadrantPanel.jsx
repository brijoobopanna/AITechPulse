import React from 'react';
import { QUADRANT_COLORS, COLORS } from '../utils/colors';
import { RING_ORDER } from '../utils/geometry';

export default function QuadrantPanel({ data, quadrants }) {
  return (
    <div style={{
      marginTop: 28,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
    }}>
      {quadrants.map((q, qi) => (
        <div
          key={q}
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 18,
            borderTop: `3px solid ${QUADRANT_COLORS[qi]}`,
          }}
        >
          <h3 style={{
            margin: '0 0 12px',
            fontSize: 15,
            fontWeight: 700,
            color: QUADRANT_COLORS[qi],
            letterSpacing: '0.5px',
          }}>
            {q}
          </h3>

          {RING_ORDER.map((ring) => {
            const items = data.filter(d => d.quadrant === q && d.ring === ring);
            if (items.length === 0) return null;
            return (
              <div key={ring} style={{ marginBottom: 10 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: 4,
                }}>
                  {ring}
                </div>
                {items.map((it, idx) => (
                  <div key={idx} style={{
                    fontSize: 13,
                    color: '#ccc',
                    padding: '2px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: QUADRANT_COLORS[qi],
                      flexShrink: 0,
                    }} />
                    {it.name}
                    {it.status === 'new' && (
                      <span style={{
                        fontSize: 10,
                        color: COLORS.primary,
                        fontWeight: 700,
                        marginLeft: 'auto',
                      }}>
                        NEW
                      </span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

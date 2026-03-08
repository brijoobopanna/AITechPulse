import React from 'react';
import { QUADRANT_COLORS } from '../utils/colors';

export default function StatusLegend({ quadrants }) {
  const statusItems = [
    { label: 'New', type: 'full' },
    { label: 'Moved in/out', type: 'half' },
    { label: 'No change', type: 'none' },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      {/* Status legend */}
      <div style={{
        display: 'flex',
        gap: 28,
        justifyContent: 'center',
        flexWrap: 'wrap',
        fontSize: 13,
        color: '#555',
      }}>
        {statusItems.map(({ label, type }) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              {type === 'full' && (
                <>
                  <circle cx="14" cy="14" r="10" fill="none" stroke="#666" strokeWidth="2" />
                  <circle cx="14" cy="14" r="6" fill="#666" />
                </>
              )}
              {type === 'half' && (
                <>
                  <circle cx="14" cy="14" r="10" fill="none" stroke="#666" strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 10 / 2} ${2 * Math.PI * 10 / 2}`}
                  />
                  <circle cx="14" cy="14" r="6" fill="#666" />
                </>
              )}
              {type === 'none' && <circle cx="14" cy="14" r="6" fill="#666" />}
            </svg>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Quadrant color legend */}
      <div style={{
        display: 'flex',
        gap: 20,
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
        fontSize: 13,
      }}>
        {quadrants.map((q, i) => (
          <div key={q} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: QUADRANT_COLORS[i],
            }} />
            <span style={{ color: '#444', fontWeight: 600 }}>{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

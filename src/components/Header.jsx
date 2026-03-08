import React, { useRef } from 'react';
import config from '../utils/config';
import { COLORS } from '../utils/colors';

export default function Header({ dataSource, loading, onUpload, onPrint, onSearch, searchQuery }) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  };

  return (
    <header style={{
      background: COLORS.dark,
      borderBottom: `3px solid ${COLORS.primary}`,
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      {/* Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: `conic-gradient(${COLORS.primary} 0deg, #1abbad 90deg, #f38a3e 180deg, #b32068 270deg, ${COLORS.primary} 360deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: COLORS.dark,
          }} />
        </div>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '0.5px',
            lineHeight: 1.2,
          }}>
            {config.app.title.toUpperCase()}
          </h1>
          <p style={{
            margin: 0,
            fontSize: 11,
            color: COLORS.primary,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            {config.app.teamName || config.app.subtitle}
            {dataSource && dataSource !== 'Sample Data' && (
              <span style={{ color: '#666', marginLeft: 8 }}>
                · {dataSource}
              </span>
            )}
            {loading && (
              <span style={{ color: '#f38a3e', marginLeft: 8 }}>Loading…</span>
            )}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        {config.features.enableSearch && (
          <input
            type="text"
            placeholder="Search technologies…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: 6,
              fontSize: 13,
              width: 180,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.primary}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          />
        )}

        {/* Upload */}
        {config.features.enableUpload && (
          <label style={{
            background: 'transparent',
            border: `1.5px solid ${COLORS.primary}`,
            color: COLORS.primary,
            padding: '8px 18px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.5px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.primary; }}
          >
            Upload Excel
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        )}

        {/* Print */}
        {config.features.enablePrint && (
          <button
            onClick={onPrint}
            style={{
              background: COLORS.primary,
              border: 'none',
              color: '#fff',
              padding: '9px 20px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.5px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => e.target.style.background = '#00cc99'}
            onMouseLeave={(e) => e.target.style.background = COLORS.primary}
          >
            Print Radar
          </button>
        )}
      </div>
    </header>
  );
}

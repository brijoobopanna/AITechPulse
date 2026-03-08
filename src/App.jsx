import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import RadarChart from './components/RadarChart';
import StatusLegend from './components/StatusLegend';
import QuadrantPanel from './components/QuadrantPanel';
import { triggerPrint } from './components/PrintView';
import useRadarData from './hooks/useRadarData';
import config from './utils/config';
import { COLORS } from './utils/colors';

export default function App() {
  const {
    data, quadrants, dataSource,
    loading, error, handleUpload,
  } = useRadarData();

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const onPrint = useCallback(
    () => triggerPrint(data, quadrants, dataSource),
    [data, quadrants, dataSource]
  );

  const onFileUpload = useCallback(
    (file) => {
      handleUpload(file);
      setHoveredIdx(null);
      setSearchQuery('');
    },
    [handleUpload]
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header
        dataSource={dataSource}
        loading={loading}
        onUpload={onFileUpload}
        onPrint={onPrint}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <main style={{
        maxWidth: 920,
        margin: '0 auto',
        padding: '30px 20px 40px',
      }}>
        {/* Error banner */}
        {error && (
          <div style={{
            background: 'rgba(255,70,70,0.12)',
            border: '1px solid rgba(255,70,70,0.3)',
            color: '#ff6b6b',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 16,
          }}>
            ⚠ {error} — Showing sample data as fallback.
          </div>
        )}

        {/* Radar container */}
        <div style={{
          background: COLORS.white,
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          padding: '28px 20px 24px',
        }}>
          <RadarChart
            data={data}
            quadrants={quadrants}
            hoveredIdx={hoveredIdx}
            setHoveredIdx={setHoveredIdx}
            searchQuery={searchQuery}
          />
          <StatusLegend quadrants={quadrants} />
        </div>

        {/* Quadrant panels below */}
        {config.features.showQuadrantPanels && (
          <QuadrantPanel data={data} quadrants={quadrants} />
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 28,
          paddingTop: 18,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 12,
          color: '#555',
        }}>
          Upload an Excel file with columns: <strong>name</strong>, <strong>quadrant</strong>, <strong>ring</strong>, <strong>status</strong>
          <br />
          <span style={{ color: '#444', marginTop: 4, display: 'inline-block' }}>
            {config.app.title} v{config.app.version} — {config.app.subtitle}
          </span>
        </div>
      </main>
    </div>
  );
}

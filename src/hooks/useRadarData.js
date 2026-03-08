/**
 * useRadarData — loads and manages radar data from Excel sources
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import config from '../utils/config';

/* ── Sample fallback data ─────────────────────────────────────── */
const SAMPLE_DATA = [
  { name: 'Micro Frontends', quadrant: 'Techniques', ring: 'Adopt', status: 'No change' },
  { name: 'Event Sourcing', quadrant: 'Techniques', ring: 'Adopt', status: 'new' },
  { name: 'Design Tokens', quadrant: 'Techniques', ring: 'Trial', status: 'new' },
  { name: 'Server-Driven UI', quadrant: 'Techniques', ring: 'Trial', status: 'Moved in/out' },
  { name: 'CQRS', quadrant: 'Techniques', ring: 'Assess', status: 'No change' },
  { name: 'Edge Computing', quadrant: 'Techniques', ring: 'Assess', status: 'new' },
  { name: 'Spec Driven Dev', quadrant: 'Techniques', ring: 'Assess', status: 'Moved in/out' },
  { name: 'Long-lived Branches', quadrant: 'Techniques', ring: 'Hold', status: 'No change' },
  { name: 'Gitflow', quadrant: 'Techniques', ring: 'Hold', status: 'Moved in/out' },
  { name: 'Big Bang Rewrites', quadrant: 'Techniques', ring: 'Hold', status: 'No change' },

  { name: 'Kubernetes', quadrant: 'Platforms', ring: 'Adopt', status: 'No change' },
  { name: 'AWS Lambda', quadrant: 'Platforms', ring: 'Adopt', status: 'No change' },
  { name: 'Cloudflare Workers', quadrant: 'Platforms', ring: 'Trial', status: 'new' },
  { name: 'Fly.io', quadrant: 'Platforms', ring: 'Trial', status: 'new' },
  { name: 'Vercel', quadrant: 'Platforms', ring: 'Trial', status: 'Moved in/out' },
  { name: 'Deno Deploy', quadrant: 'Platforms', ring: 'Assess', status: 'new' },
  { name: 'Railway', quadrant: 'Platforms', ring: 'Assess', status: 'new' },
  { name: 'Heroku', quadrant: 'Platforms', ring: 'Hold', status: 'No change' },
  { name: 'OpenShift', quadrant: 'Platforms', ring: 'Hold', status: 'Moved in/out' },
  { name: 'Cloud Foundry', quadrant: 'Platforms', ring: 'Hold', status: 'No change' },

  { name: 'GitHub Actions', quadrant: 'Tools', ring: 'Adopt', status: 'No change' },
  { name: 'Terraform', quadrant: 'Tools', ring: 'Adopt', status: 'No change' },
  { name: 'Pulumi', quadrant: 'Tools', ring: 'Trial', status: 'new' },
  { name: 'Backstage', quadrant: 'Tools', ring: 'Trial', status: 'Moved in/out' },
  { name: 'Renovate', quadrant: 'Tools', ring: 'Trial', status: 'No change' },
  { name: 'Pkl', quadrant: 'Tools', ring: 'Assess', status: 'new' },
  { name: 'Winglang', quadrant: 'Tools', ring: 'Assess', status: 'new' },
  { name: 'Jenkins', quadrant: 'Tools', ring: 'Hold', status: 'No change' },
  { name: 'Chef', quadrant: 'Tools', ring: 'Hold', status: 'Moved in/out' },
  { name: 'Puppet', quadrant: 'Tools', ring: 'Hold', status: 'No change' },

  { name: 'TypeScript', quadrant: 'Languages & Frameworks', ring: 'Adopt', status: 'No change' },
  { name: 'React', quadrant: 'Languages & Frameworks', ring: 'Adopt', status: 'No change' },
  { name: 'Rust', quadrant: 'Languages & Frameworks', ring: 'Trial', status: 'new' },
  { name: 'Svelte', quadrant: 'Languages & Frameworks', ring: 'Trial', status: 'new' },
  { name: 'HTMX', quadrant: 'Languages & Frameworks', ring: 'Assess', status: 'new' },
  { name: 'Zig', quadrant: 'Languages & Frameworks', ring: 'Assess', status: 'new' },
  { name: 'Mojo', quadrant: 'Languages & Frameworks', ring: 'Assess', status: 'Moved in/out' },
  { name: 'jQuery', quadrant: 'Languages & Frameworks', ring: 'Hold', status: 'No change' },
  { name: 'AngularJS', quadrant: 'Languages & Frameworks', ring: 'Hold', status: 'Moved in/out' },
  { name: 'CoffeeScript', quadrant: 'Languages & Frameworks', ring: 'Hold', status: 'No change' },
];

/**
 * Parse an Excel ArrayBuffer into radar data rows
 */
function parseExcel(buffer, sheetName) {
  const wb = XLSX.read(buffer, { type: 'array' });
  const wsName = sheetName && wb.SheetNames.includes(sheetName)
    ? sheetName
    : wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  const json = XLSX.utils.sheet_to_json(ws);

  const cols = config.dataSource.columns;

  if (!json.length || !json[0][cols.name] || !json[0][cols.quadrant] || !json[0][cols.ring]) {
    throw new Error(
      `Excel must have columns: ${cols.name}, ${cols.quadrant}, ${cols.ring}, ${cols.status}`
    );
  }

  return json.map((row) => ({
    name: String(row[cols.name] || ''),
    quadrant: String(row[cols.quadrant] || ''),
    ring: String(row[cols.ring] || ''),
    status: String(row[cols.status] || 'No change'),
  }));
}

/**
 * Custom hook for radar data management
 */
export default function useRadarData() {
  const [data, setData] = useState(SAMPLE_DATA);
  const [dataSource, setDataSource] = useState('Sample Data');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const intervalRef = useRef(null);

  /* Fetch data from a URL */
  const fetchFromUrl = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const buffer = await response.arrayBuffer();
      const parsed = parseExcel(buffer, config.dataSource.sheetName);
      setData(parsed);
      setDataSource(url.split('/').pop() || 'Remote File');
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
      console.warn('[AITechPulse] URL fetch failed, using fallback:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Handle local file upload */
  const handleUpload = useCallback((file) => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = parseExcel(evt.target.result, config.dataSource.sheetName);
        setData(parsed);
        setDataSource(file.name);
        setLastRefresh(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  /* Auto-load from configured URL on mount */
  useEffect(() => {
    if (config.dataSource.type === 'url' && config.dataSource.url) {
      fetchFromUrl(config.dataSource.url);
    }
  }, [fetchFromUrl]);

  /* Auto-refresh interval */
  useEffect(() => {
    const minutes = config.dataSource.refreshIntervalMinutes;
    if (
      config.features.enableAutoRefresh &&
      config.dataSource.type === 'url' &&
      config.dataSource.url &&
      minutes > 0
    ) {
      intervalRef.current = setInterval(
        () => fetchFromUrl(config.dataSource.url),
        minutes * 60 * 1000
      );
      return () => clearInterval(intervalRef.current);
    }
  }, [fetchFromUrl]);

  /* Derive unique quadrants from data */
  const quadrants = (() => {
    const seen = [];
    data.forEach((d) => {
      if (!seen.includes(d.quadrant)) seen.push(d.quadrant);
    });
    while (seen.length < 4) seen.push(`Quadrant ${seen.length + 1}`);
    return seen.slice(0, 4);
  })();

  return {
    data,
    quadrants,
    dataSource,
    loading,
    error,
    lastRefresh,
    handleUpload,
    refreshFromUrl: () => {
      if (config.dataSource.url) fetchFromUrl(config.dataSource.url);
    },
  };
}

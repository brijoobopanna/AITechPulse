/**
 * AITechPulse Configuration Loader
 * 
 * Loads from config/aitechpulse.config.json with environment variable overrides.
 */

import configFile from '@config/aitechpulse.config.json';

function getEnv(key, fallback) {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  return fallback;
}

const config = {
  app: {
    title: getEnv('VITE_APP_TITLE', configFile.app?.title || 'AITechPulse'),
    subtitle: configFile.app?.subtitle || 'Intelligent Technology Landscape',
    teamName: getEnv('VITE_TEAM_NAME', configFile.app?.teamName || ''),
    version: configFile.app?.version || '1.0.0',
  },

  dataSource: {
    type: configFile.dataSource?.type || 'upload',
    url: getEnv('VITE_DATA_URL', configFile.dataSource?.url || ''),
    fallback: configFile.dataSource?.fallback || 'upload',
    sheetName: configFile.dataSource?.sheetName || 'Sheet1',
    refreshIntervalMinutes: parseInt(
      getEnv('VITE_REFRESH_INTERVAL', configFile.dataSource?.refreshIntervalMinutes || 0),
      10
    ),
    columns: {
      name: configFile.dataSource?.columns?.name || 'name',
      quadrant: configFile.dataSource?.columns?.quadrant || 'quadrant',
      ring: configFile.dataSource?.columns?.ring || 'ring',
      status: configFile.dataSource?.columns?.status || 'status',
    },
  },

  radar: {
    rings: configFile.radar?.rings || ['Adopt', 'Trial', 'Assess', 'Hold'],
    quadrantColors: configFile.radar?.quadrantColors || ['#1abbad', '#f38a3e', '#86b782', '#b32068'],
    statusRules: configFile.radar?.statusRules || {
      'new': 'full',
      'Moved in/out': 'half',
      'No change': 'none',
    },
  },

  theme: {
    primaryColor: configFile.theme?.primaryColor || '#00b386',
    darkBackground: configFile.theme?.darkBackground || '#1a1a2e',
    fontFamily: configFile.theme?.fontFamily || "Source Sans 3, system-ui, sans-serif",
  },

  features: {
    enablePrint: configFile.features?.enablePrint !== false,
    enableUpload: configFile.features?.enableUpload !== false,
    enableSearch: configFile.features?.enableSearch !== false,
    enableAutoRefresh: configFile.features?.enableAutoRefresh !== false,
    showQuadrantPanels: configFile.features?.showQuadrantPanels !== false,
  },
};

export default config;

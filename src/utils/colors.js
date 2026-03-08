/**
 * AITechPulse Color Palette & Theme
 */

import config from './config';

export const COLORS = {
  primary: config.theme.primaryColor,
  dark: config.theme.darkBackground,
  darkDeep: '#0d0d1a',
  white: '#ffffff',
  surface: '#f4f4f4',
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
};

export const QUADRANT_COLORS = config.radar.quadrantColors;

export function getQuadrantColor(quadrantIndex) {
  return QUADRANT_COLORS[quadrantIndex % QUADRANT_COLORS.length];
}

export function getStatusType(status) {
  const rules = config.radar.statusRules;
  return rules[status] || 'none';
}

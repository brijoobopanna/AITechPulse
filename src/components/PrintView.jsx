import { QUADRANT_COLORS, COLORS } from '../utils/colors';
import { RING_ORDER } from '../utils/geometry';
import config from '../utils/config';

/**
 * Opens a print-ready window with the radar summary.
 */
export function triggerPrint(data, quadrants, dataSource) {
  const printWin = window.open('', '_blank');
  if (!printWin) {
    alert('Popup blocked. Please allow popups for this site to use Print Radar.');
    return;
  }

  /* Group data by quadrant → ring */
  const grouped = {};
  quadrants.forEach((q) => {
    grouped[q] = {};
    RING_ORDER.forEach((r) => (grouped[q][r] = []));
  });
  data.forEach((d) => {
    if (grouped[d.quadrant] && grouped[d.quadrant][d.ring]) {
      grouped[d.quadrant][d.ring].push(d);
    }
  });

  /* Serialize the radar SVG */
  const svgEl = document.getElementById('radar-svg-main');
  let svgImg = '';
  if (svgEl) {
    const svgData = new XMLSerializer().serializeToString(svgEl);
    svgImg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }

  /* Build HTML */
  let html = `<!DOCTYPE html><html><head>
    <meta charset="UTF-8" />
    <title>${config.app.title} — Radar Summary</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');
      * { margin:0; padding:0; box-sizing:border-box; }
      body {
        font-family: 'Source Sans 3', system-ui, sans-serif;
        color: #333; padding: 40px; background: #fff;
      }
      .header { display:flex; align-items:center; gap:16px; margin-bottom:6px; }
      .logo {
        width:36px; height:36px; border-radius:50%;
        background: conic-gradient(${COLORS.primary} 0deg, #1abbad 90deg, #f38a3e 180deg, #b32068 270deg, ${COLORS.primary} 360deg);
        display:flex; align-items:center; justify-content:center;
      }
      .logo-inner { width:16px; height:16px; border-radius:50%; background:#1a1a2e; }
      h1 { color:${COLORS.primary}; font-size:28px; font-weight:900; letter-spacing:0.5px; }
      .subtitle { color:#666; font-size:13px; margin-bottom:28px; }
      .radar-img { display:block; margin:0 auto 32px; max-width:500px; width:100%; }
      .quadrant-section { margin-bottom:24px; page-break-inside:avoid; }
      .quad-title {
        font-size:18px; font-weight:700; padding:8px 14px;
        color:#fff; border-radius:6px; margin-bottom:10px;
      }
      .ring-group { margin-left:16px; margin-bottom:8px; }
      .ring-label { font-weight:700; font-size:14px; color:#333; margin-bottom:3px; }
      .tech-item {
        display:inline-block; background:#f0f0f0; border-radius:20px;
        padding:3px 14px; margin:2px 4px; font-size:13px;
      }
      .status-badge { font-size:10px; margin-left:4px; opacity:0.6; }
      .legend {
        margin-top:24px; padding-top:14px; border-top:1px solid #ddd;
        font-size:12px; color:#888;
      }
      .legend span { margin-right:20px; }
      .footer { margin-top:32px; text-align:center; font-size:11px; color:#aaa; }
      @media print {
        body { padding:20px; }
        .no-print { display:none; }
      }
    </style>
  </head><body>
    <div class="header">
      <div class="logo"><div class="logo-inner"></div></div>
      <h1>${config.app.title}</h1>
    </div>
    <div class="subtitle">
      ${config.app.teamName ? config.app.teamName + ' · ' : ''}${dataSource} — Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>`;

  if (svgImg) {
    html += `<img class="radar-img" src="${svgImg}" alt="Technology Landscape" />`;
  }

  /* Quadrant sections */
  quadrants.forEach((q, qi) => {
    html += `<div class="quadrant-section">
      <div class="quad-title" style="background:${QUADRANT_COLORS[qi]}">${q}</div>`;

    RING_ORDER.forEach((r) => {
      const items = grouped[q][r];
      if (!items.length) return;
      html += `<div class="ring-group"><div class="ring-label">${r}</div>`;
      items.forEach((it) => {
        const badge = it.status === 'new'
          ? '★ New'
          : it.status === 'Moved in/out'
            ? '↕ Moved'
            : '';
        html += `<span class="tech-item">${it.name}${badge ? `<span class="status-badge">${badge}</span>` : ''}</span>`;
      });
      html += `</div>`;
    });

    html += `</div>`;
  });

  /* Legend + footer */
  html += `
    <div class="legend">
      <span>◉ Full outer ring = New</span>
      <span>◗ Half outer ring = Moved in/out</span>
      <span>● No outer ring = No change</span>
    </div>
    <div class="footer">
      ${config.app.title} — ${config.app.subtitle}<br/>
      See your stack. Shape your future.
    </div>
  </body></html>`;

  printWin.document.write(html);
  printWin.document.close();
  setTimeout(() => printWin.print(), 500);
}

# 🔭 AITechPulse — Your Team's Intelligent Technology Heartbeat

<p align="center">
  <img src="docs/banner.svg" alt="AITechPulse Banner" width="600" />
</p>

**AITechPulse** is an AI-driven, interactive technology landscape visualization tool built for modern engineering teams. It empowers teams to track, assess, and communicate technology adoption decisions through an intuitive radar interface — giving leadership and developers a shared, living view of their technology stack.

> Deploy once, share across your entire team. Everyone with the link sees the same live view, driven by a single Excel file your tech leads maintain.

---

## 🌊 Why AITechPulse?

The AI industry is going through a once-in-a-generation transformation. New LLMs, frameworks, platforms, and developer tools are emerging at a pace never seen before — what was cutting-edge last quarter may already be superseded. For engineering teams, this creates a real problem:

**You can't adopt what you can't track.**

Most teams struggle with the same questions:

- Which new technologies should we be evaluating right now?
- What have we already tried, and what was the outcome?
- Which tools are we actively adopting, and which should we phase out?
- How do we communicate these decisions across 50–100 engineers consistently?

Spreadsheets get buried. Confluence pages go stale. Slack threads disappear. Meanwhile, the technology landscape keeps moving.

**AITechPulse solves this** by giving your team a single, always-current, visual map of your technology stack — organized by category, rated by adoption stage, and updated from one shared Excel file that your tech leads already maintain. Every engineer on the team sees the same view. Every decision is visible. Every quarter's progress is trackable.

It turns the question *"What should we be using?"* into a 10-second glance instead of a 30-minute meeting.

---

## 🎯 How It Works: Blips & Rings

Each insight we share is represented by a **blip**. Blips may be new to the latest radar volume, or they can move rings as our recommendation has changed.

The rings are:

- **Adopt.** Blips that we think you should seriously consider using.
- **Trial.** Things we think are ready for use, but not as completely proven as those in the Adopt ring.
- **Assess.** Things to look at closely, but not necessarily trial yet — unless you think they would be a particularly good fit for you.
- **Hold.** Proceed with caution.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Interactive Radar** | 4-quadrant, 4-ring radar with smooth hover interactions |
| **Excel-Driven** | Reads from a shared Excel file (Teams / SharePoint / network path) |
| **Config-Based** | All settings in a single `config/aitechpulse.config.json` file |
| **Hover Insights** | Hover a blip to see its name — the rest blur for focus |
| **Status Indicators** | Inner ring = quadrant color; outer ring = movement status |
| **Print to PDF** | One-click summary export with radar graphic + grouped listing |
| **Team-Ready** | Built for 50–100 member teams with shared access |
| **Docker Support** | Production Dockerfile + docker-compose included |
| **Customizable** | Quadrant names, ring names, colors — all configurable |
| **Auto-Refresh** | Periodically re-fetches data so the view stays current |
| **Search** | Instantly filter technologies from the header search bar |

---

## 🗂️ Project Structure

```
aitechpulse/
├── config/
│   └── aitechpulse.config.json  # ← Main configuration file
├── docker/
│   ├── Dockerfile               # Production multi-stage build
│   ├── docker-compose.yml       # One-command deployment
│   └── nginx.conf               # Production Nginx config
├── docs/
│   ├── banner.svg               # Project banner
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── EXCEL_FORMAT.md          # Excel file format spec
│   └── sample-data.xlsx         # Ready-to-use template
├── public/
│   ├── index.html               # Entry HTML
│   └── favicon.svg              # App favicon
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Root application component
│   ├── index.css                # Global styles
│   ├── components/
│   │   ├── RadarChart.jsx       # Main radar SVG visualization
│   │   ├── BlipDot.jsx          # Individual technology blip
│   │   ├── Header.jsx           # App header with controls
│   │   ├── QuadrantPanel.jsx    # Sidebar quadrant listing
│   │   ├── StatusLegend.jsx     # Legend for statuses
│   │   └── PrintView.jsx        # Print / PDF generation
│   ├── hooks/
│   │   └── useRadarData.js      # Data loading & parsing hook
│   └── utils/
│       ├── config.js            # Config loader
│       ├── geometry.js          # Polar math & layout engine
│       └── colors.js            # Color palette & theming
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json
├── vite.config.js
└── README.md                    # ← You are here
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or yarn / pnpm)

### 1. Clone & Install

```bash
git clone https://your-repo-url/aitechpulse.git
cd aitechpulse
npm install
```

### 2. Configure

Edit `config/aitechpulse.config.json`:

```json
{
  "dataSource": {
    "type": "url",
    "url": "https://your-company.sharepoint.com/sites/team/Shared%20Documents/tech-landscape.xlsx"
  }
}
```

> See [Excel Format Guide](docs/EXCEL_FORMAT.md) for column specifications.

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` — share this URL with your team on the same network.

### 4. Build & Deploy

```bash
npm run build        # → outputs to dist/
npm run preview      # → preview production build locally
```

---

## 🐳 Docker Deployment (Recommended for Teams)

The fastest way to deploy for your whole team:

```bash
cd docker
docker-compose up -d --build
```

This serves AITechPulse on **port 8080**. Share `http://your-server:8080` with the team.

See [Deployment Guide](docs/DEPLOYMENT.md) for advanced options including Azure App Service, AWS ECS, internal VMs, and CI/CD integration.

---

## 📊 Excel File Format

Your Excel file must have these columns:

| Column | Required | Values | Description |
|--------|----------|--------|-------------|
| `name` | ✅ | Free text | Technology name (shown on hover) |
| `quadrant` | ✅ | Any 4 unique values | Category grouping |
| `ring` | ✅ | `Adopt`, `Trial`, `Assess`, `Hold` | Recommendation level |
| `status` | ✅ | `new`, `Moved in/out`, `No change` | Movement indicator |

> Full spec with examples: [EXCEL_FORMAT.md](docs/EXCEL_FORMAT.md)

---

## ⚙️ Configuration Reference

`config/aitechpulse.config.json`:

```json
{
  "app": {
    "title": "AITechPulse",
    "subtitle": "Intelligent Technology Landscape",
    "teamName": "Platform Engineering"
  },
  "dataSource": {
    "type": "url",
    "url": "https://your-teams-link/tech-landscape.xlsx",
    "refreshIntervalMinutes": 30,
    "sheetName": "Sheet1"
  },
  "radar": {
    "rings": ["Adopt", "Trial", "Assess", "Hold"],
    "quadrantColors": ["#1abbad", "#f38a3e", "#86b782", "#b32068"]
  },
  "features": {
    "enablePrint": true,
    "enableUpload": true,
    "enableSearch": true
  }
}
```

---

## 🖥️ Blip Visual Language

Each technology is drawn as concentric circles:

- **Inner circle** — solid fill, color-coded by **quadrant**
- **Outer ring** — based on **status**:
  - `new` → full outer ring
  - `Moved in/out` → half outer ring
  - `No change` → no outer ring (inner dot only)

**Hover:** Only the `name` column is shown. The hovered blip highlights; all others blur. Blips remain static.

---

## 🔒 Access & Security

AITechPulse is a static web application. The Excel file is fetched client-side:

- For SharePoint / Teams URLs: users must be authenticated in their browser
- For internal URLs: network-level access control applies
- No data is stored server-side
- CORS configuration guide included in [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🛠️ Tech Stack

- **Vite** — build tool
- **React 18** — UI framework
- **SheetJS** — Excel file parsing
- **Pure SVG** — zero charting library dependencies

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>AITechPulse</strong> — See your stack. Shape your future.
</p>

# Excel File Format Specification

## Required Columns

Your Excel file (`.xlsx`) must contain these four columns on the first sheet:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | Text | Yes | Technology name — this is the ONLY field shown on hover |
| `quadrant` | Text | Yes | Category grouping (exactly 4 unique values) |
| `ring` | Text | Yes | Recommendation level |
| `status` | Text | Yes | Movement indicator since last review |

## Column Details

### `name`
- Free-form text
- Must be unique within the dataset
- This is the only value displayed on mouse hover
- Examples: `Kubernetes`, `React`, `Terraform`, `Event Sourcing`

### `quadrant`
- Must contain exactly 4 unique values across the entire dataset
- Common choices: `Techniques`, `Platforms`, `Tools`, `Languages & Frameworks`
- You can use any names meaningful to your team
- Examples: `Frontend`, `Backend`, `DevOps`, `Data & AI`

### `ring`
- Default values: `Adopt`, `Trial`, `Assess`, `Hold`
- These can be customized in `config/aitechpulse.config.json`
- Each ring represents a recommendation level:
  - **Adopt** — Use this. We have high confidence.
  - **Trial** — Worth pursuing. Try it on a suitable project.
  - **Assess** — Explore it. Understand what it can do for you.
  - **Hold** — Proceed with caution. Do not start new work with this.

### `status`
- Exactly 3 possible values:
  - `new` — Technology is new to this edition of the radar
  - `Moved in/out` — Technology has changed rings since the last edition
  - `No change` — Technology remains in the same ring

## Visual Mapping

| Status | Outer Ring |
|--------|-----------|
| `new` | Full circle around the blip |
| `Moved in/out` | Half circle around the blip |
| `No change` | No outer ring — just the inner dot |

The inner dot color is determined by the `quadrant` value.

## Example Data

| name | quadrant | ring | status |
|------|----------|------|--------|
| Kubernetes | Platforms | Adopt | No change |
| Cloudflare Workers | Platforms | Trial | new |
| Fly.io | Platforms | Trial | new |
| Heroku | Platforms | Hold | No change |
| TypeScript | Languages & Frameworks | Adopt | No change |
| Rust | Languages & Frameworks | Trial | new |
| HTMX | Languages & Frameworks | Assess | new |
| jQuery | Languages & Frameworks | Hold | No change |
| GitHub Actions | Tools | Adopt | No change |
| Backstage | Tools | Trial | Moved in/out |
| Pkl | Tools | Assess | new |
| Jenkins | Tools | Hold | No change |
| Micro Frontends | Techniques | Adopt | No change |
| Design Tokens | Techniques | Trial | new |
| Edge Computing | Techniques | Assess | new |
| Gitflow | Techniques | Hold | Moved in/out |

## Tips

- Keep `name` values concise — they appear in tooltips and print summaries
- Aim for 8–15 technologies per quadrant for the best visual distribution
- Review and update the Excel file quarterly for maximum team value
- The column names are **case-sensitive** — use lowercase exactly as shown
- Additional columns are ignored — you can add `description`, `notes`, etc. for your own reference

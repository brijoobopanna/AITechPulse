# Deployment Guide

## Overview

AITechPulse is a static single-page application (SPA). Once built, it produces a `dist/` folder with HTML, JS, and CSS that can be served by any web server. Your team members simply visit the URL to see the radar.

---

## Option 1: Docker (Recommended)

The simplest path for internal teams.

### Prerequisites
- Docker & Docker Compose installed on a server accessible by your team

### Steps

```bash
# 1. Clone the repo to your server
git clone https://your-repo/aitechpulse.git
cd aitechpulse

# 2. Edit the config file with your Excel URL
vim config/aitechpulse.config.json

# 3. Build and start
cd docker
docker-compose up -d --build
```

AITechPulse is now running at `http://your-server:8080`.

### Updating

When the config or code changes:

```bash
cd docker
docker-compose up -d --build
```

---

## Option 2: Static File Hosting (Azure Blob / AWS S3)

### Build

```bash
npm install
npm run build
```

### Azure Blob Storage

1. Create a storage account with static website hosting enabled
2. Upload `dist/` contents to the `$web` container
3. Note the primary endpoint URL
4. Share the URL with your team

### AWS S3 + CloudFront

1. Create an S3 bucket with static hosting
2. Upload `dist/` contents
3. (Optional) Put CloudFront in front for HTTPS and caching
4. Share the CloudFront URL

---

## Option 3: Internal VM / Bare Metal

```bash
# Build
npm install && npm run build

# Serve with nginx (example config in docker/nginx.conf)
sudo cp -r dist/* /var/www/aitechpulse/
# Configure nginx virtual host pointing to /var/www/aitechpulse/
```

---

## Option 4: Azure App Service

```bash
# Build
npm install && npm run build

# Deploy using Azure CLI
az webapp up --name aitechpulse-yourteam --resource-group your-rg --plan your-plan --html
```

---

## Connecting to Microsoft Teams / SharePoint Excel Files

AITechPulse reads Excel files client-side. For SharePoint-hosted files:

### Getting the Direct Download URL

1. Navigate to your Excel file in Teams / SharePoint
2. Click the three dots (...) → "Copy link"
3. Modify the URL to be a direct download link:

**SharePoint format:**
```
https://your-tenant.sharepoint.com/sites/your-team/Shared%20Documents/General/tech-landscape.xlsx
```

**Direct download format:**
```
https://your-tenant.sharepoint.com/sites/your-team/_layouts/15/download.aspx?SourceUrl=/sites/your-team/Shared%20Documents/General/tech-landscape.xlsx
```

4. Put this URL in `config/aitechpulse.config.json` under `dataSource.url`

### CORS Considerations

If you encounter CORS issues when fetching the file from a different domain:

1. **Proxy approach**: Configure your web server (nginx) to proxy requests to SharePoint
2. **Same-origin**: Host AITechPulse on the same SharePoint domain
3. **Fallback**: Use the upload feature — team leads can simply upload the latest file manually

The nginx proxy configuration is included in `docker/nginx.conf`.

---

## Environment Variables

You can override config file values using environment variables prefixed with `VITE_`:

| Variable | Description |
|----------|-------------|
| `VITE_DATA_URL` | Excel file URL |
| `VITE_APP_TITLE` | App title |
| `VITE_TEAM_NAME` | Team name display |
| `VITE_REFRESH_INTERVAL` | Auto-refresh in minutes |

---

## Health Check

After deployment, verify:

1. Open the URL in a browser
2. The radar should render with sample data
3. Click "Upload Excel" to test with your real data
4. Click "Print Radar" to verify PDF generation
5. Share the URL with a colleague to confirm access

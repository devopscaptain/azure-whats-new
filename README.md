# Azure What's New

A fast, searchable feed of the latest **Microsoft Azure updates** — GA launches, public previews, features in development, and retirements — refreshed daily and hosted free on GitHub Pages.

Sister project of [aws-whats-new](https://github.com/devopscaptain/aws-whats-new), re-themed with Azure / Fluent 2 styling.

## Features

- **Status tabs** — Generally available · Preview · In development · Retirement
- **Product area filters** — Compute, Containers, AI + machine learning, Databases, …
- **Fuzzy search** across titles, descriptions, and product names (`⌘K` / `Ctrl+K`)
- **Azure light theme** — white background with the Azure light-blue ramp (`#EFF6FC` / `#DEECF9` / `#C7E0F4`) and Azure blue `#0078D4` accents
- **NEW badge** for anything updated in the last 7 days
- GA / preview availability month on each card, product tags, deep link to the official update

## How it works

```
GitHub Actions (daily 08:00 UTC)
  └─ scripts/fetch-updates.js
       ├─ Azure Updates JSON API  (primary: status, products, GA/preview dates)
       └─ Azure Updates RSS feed  (fallback)
  └─ commits public/data/whats-new.json
  └─ vite build → GitHub Pages
```

The fetcher keeps the most recent 500 updates and merges with existing data, so history is preserved if a source is temporarily unavailable.

| Source | URL |
| --- | --- |
| JSON API | `https://www.microsoft.com/releasecommunications/api/v2/azure` |
| RSS | `https://www.microsoft.com/releasecommunications/api/v2/azure/rss` |

## Local development

```bash
npm install
npm run fetch   # pull latest Azure updates into public/data/whats-new.json
npm run dev     # http://localhost:5173
```

## Deploy your own (free)

1. Push this repo to GitHub (e.g. `azure-whats-new`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Settings → Actions → General → Workflow permissions: Read and write**.
4. Run the **Fetch & Deploy** workflow once (Actions tab → Run workflow).

The site will be live at `https://<user>.github.io/azure-whats-new/`. The base path is taken from the repo name automatically.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Fuse.js · lucide-react

---

Community project, not affiliated with or endorsed by Microsoft. Azure is a trademark of Microsoft Corporation.

# Fervidex Systems React Website

React + Vite high-graphics website for Fervidex Systems, ForgeORM, ForgePDF, OnionForge and SliceForge.

## Included

- Dark/light theme
- AI animated hero
- Searchable Wiki documentation
- Comprehensive ForgeORM V1 to V4 feature documentation
- ForgePDF Wiki and live demo UI
- Interactive ORM playground
- Wiki sidebar navigation
- Syntax-highlighted code blocks
- SEO metadata and Open Graph tags
- Blog engine page
- API documentation page
- Benchmark chart section
- NuGet badges UI
- GitHub stars UI
- Azure Static Web Apps config

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

Output folder:

```text
dist
```

## Azure Static Web Apps settings

```text
App location: /
Api location: leave empty
Output location: dist
Build command: npm run build
```

`public/staticwebapp.config.json` is included for React navigation fallback.

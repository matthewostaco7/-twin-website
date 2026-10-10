# TWIN — website

Official website of TWIN, a visual branding studio: brand identity for founders and SMEs who don't want to look like everyone else.

This is a static site with no build step and no dependencies. It was extracted from the TWIN artifact published on claude.ai.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Any static file server works. Opening `index.html` directly also works.

## Structure

```
index.html                 Page markup: sidebar nav, home, services, work, story, project view, inquiry form
assets/
  css/styles.css           All styles (design tokens on :root, responsive rules, motion)
  js/data.js               Portfolio content (window.TWIN_DATA), loaded before app.js
  js/app.js                Hash router (#/work, #/story, #/inquire, #/services/<slug>, project pages), gallery, filters, inquiry form
  js/enhancements.js       Small extras: service carousel dots, swipe navigation, scroll snapping
  data/projects.json       Same content as data.js, as plain JSON
  fonts/                   Neue Montreal Regular + Medium (IBM Plex Mono loads from Google Fonts)
  images/projects/         Project covers and case-study images
  favicon.svg
tools/extract-artifact.py  Script used to split the single-file artifact into this layout
```

## Editing content

Projects live in `assets/js/data.js`. Each project has:

- `name`, `type` (`Brand`, `Rebrand`, `Debrand` or `Logo`), `date`, `reason`
- `r`: the tile's aspect ratio (width / height)
- `cover`: `{ src, caption, w, h }`
- `sections`: image lists by section key (for example `logo`, `colors`, `application`)

Put new images in `assets/images/projects/` and reference them by relative path.
If `projects` is empty, the Work page shows placeholder tiles.

The artifact version had owner-only editing tools that only work inside claude.ai. On a normal host they stay hidden, so you edit content in `data.js`.

## Deploy

Upload the repository root to any static host: GitHub Pages, Netlify, Vercel or Cloudflare Pages. No build command is needed, and the publish directory is `/`.

## Fonts

Neue Montreal is a commercial typeface from Pangram Pangram. Make sure you hold a web license before you deploy publicly.

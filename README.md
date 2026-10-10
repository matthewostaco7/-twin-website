# TWIN — website

Official website of TWIN, a visual branding studio: brand identity for founders and SMEs who don't want to look like everyone else.

Built with **Next.js 16** (App Router), **React 19** and **TypeScript**. Pages are exported as a static site, so it runs on any host.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site written to ./out
npm run start    # preview ./out locally
npm run lint     # type-check
```

## Pages

| URL | What it is |
|---|---|
| `/` | Hero, "What we do" services, work teaser |
| `/work` | Gallery with Brand / Rebrand / Debrand / Logo filters |
| `/work/[id]` | Project page: overview, chapters, image carousels, "More like this" |
| `/services/[slug]` | Branding, Debranding, Rebranding, Logo |
| `/story` | Story (coming soon) |
| `/contact` | Inquiry form; `/contact?need=Branding` preselects a service |

Old `#/work`-style links from the single-page version redirect to the new URLs.

## Project structure

```
app/                  Routes (one folder per page), layout, global styles
  globals.css         All styles: design tokens on :root, responsive rules, motion
components/           SiteShell (sidebar, footer, theme), WorkGallery, ProjectView,
                      ServiceView, InquiryForm, ServicesGrid, ProjectTile, icons
lib/
  site.ts             Email, social links, location, Work lock switch
  services.ts         Service page content
  projects.ts         Project types, chapters per service, helpers
content/projects.json Portfolio projects
public/images/        Project images
public/fonts/         Neue Montreal (IBM Plex Mono loads from Google Fonts)
```

## Editing content

- **Contact details and social links:** `lib/site.ts`
- **Show the Work gallery:** set `workLocked: false` in `lib/site.ts`. This removes the "Unlocking Soon" overlay.
- **Services:** `lib/services.ts`
- **Projects:** `content/projects.json`. Put images in `public/images/projects/` and reference them as `/images/projects/<file>`. Each project has:
  - `id`, `name`, `type` (`Brand`, `Rebrand`, `Debrand` or `Logo`), `date`, `reason`
  - `r`: the tile's aspect ratio (width / height)
  - `cover`: `{ "src", "caption", "w", "h" }`
  - `sections`: images per chapter. The chapter keys depend on the type and are listed in `SECTION_DEFS` in `lib/projects.ts`.

If `projects` is empty, the gallery shows placeholder tiles.

## Contact form

There is no backend. Submitting opens the visitor's email app with the inquiry pre-filled and addressed to the email in `lib/site.ts`.

## Deploy

- **Vercel:** import the repo. Framework and settings are detected automatically.
- **Netlify / Cloudflare Pages:** build command `npm run build`, publish directory `out`.
- **GitHub Pages:** publish the `out` folder. For a project page under `/<repo>/`, also set `basePath` in `next.config.ts`.

## Fonts

Neue Montreal is a commercial typeface from Pangram Pangram. Make sure you hold a web license before you deploy publicly.

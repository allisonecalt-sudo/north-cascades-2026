# North Cascades 2026 — Comparison Site

Mobile-first single-page site for the Aug 16-20, 2026 North Cascades trip (Allison + Erin).
Surfaces every open decision (flights, lodging, rental car, hikes) as side-by-side cards
Erin can compare and react to. Built around the May 15, 2026 WA-20 closure context.

**Live URL (when deployed):** https://allisonecalt-sudo.github.io/north-cascades-2026/

## Stack

- Vite + TypeScript (strict mode, no `any`)
- ESLint + Prettier
- Vanilla DOM (no UI framework — too small to justify one)
- Separate HTML / CSS / TS modules under `src/`
- CI workflow in `.github/workflows/ci.yml` (lint → typecheck → build)
- GitHub Pages deploy via `.github/workflows/deploy.yml`

## Develop

```bash
npm install
npm run dev          # vite dev server
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run build        # vite build → dist/
npm run preview      # serve dist/ locally
npm run check        # lint + typecheck + build
```

## Project layout

```
site/
  index.html
  vite.config.ts
  tsconfig.json
  eslint.config.js
  .prettierrc
  src/
    main.ts                # entrypoint — mounts sections in order
    dom.ts                 # tiny h()/section()/badge() helpers
    data/                  # all trip content as typed constants
      trip.ts
      closure.ts
      flights.ts
      rental.ts
      lodging.ts
      itinerary.ts
      hikes.ts
      viewpoints.ts
      restaurants.ts
      logistics.ts
      decisions.ts
    sections/              # one renderer per section
    styles/                # tokens.css → base.css → hero/components/sections
  .github/workflows/
    ci.yml
    deploy.yml
```

## Deploy

The `deploy.yml` workflow runs on every push to `main`/`master` and publishes
the `dist/` build to GitHub Pages. Vite's `base` is set to `/north-cascades-2026/`
to match the Pages path.

### One-time setup on a new repo

1. `gh repo create allisonecalt-sudo/north-cascades-2026 --public`
2. Push this site directory as the repo root.
3. In repo Settings → Pages → set Source = "GitHub Actions".
4. The deploy workflow runs automatically on push.

## Content sourcing

Content is hardcoded from `projects/north-cascades-2026/trip-plan.md`. The
markdown is the source of truth; the site is a snapshot at site-build time.
If trip-plan.md changes, update the corresponding `src/data/*.ts` module.

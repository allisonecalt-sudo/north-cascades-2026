# North Cascades 2026 — Digital Brochure

A high-end, one-page digital itinerary brochure for the Aug 16–20, 2026 North
Cascades trip (Allison + Erin). Scratch-rebuilt 2026-06-10 from the Austria
template — light-mode, editorial serif + Inter, evergreen / slate-blue palette,
guided top-to-bottom disclosure. Not a comparison dashboard, not a travel blog:
a glossy pamphlet you can open cold on a phone and understand in under a minute.

**Live URL:** https://allisonecalt-sudo.github.io/north-cascades-2026/

## What changed (2026-06-10 scratch rebuild)

The old multi-page comparison site (lodging/hikes/things-to-do/… `.html`) is
preserved on branch **`archive/pre-rebuild-2026-06-10`** — nothing deleted,
pullable any time. This rebuild collapses it to ONE page reconciled against
`../BOOKED.md`:

- **One west-side house, four nights** (no mid-trip move). The one open decision
  is which of three held Airbnbs to keep; the other two get cancelled before
  their free-cancel windows. Drive times re-based from the Sedro-Woolley /
  Arlington house (~1h15–1h30 to the Marblemount-area trailheads), not from
  Marblemount.
- **Five guided blocks:** Cover → Glance (three candidate houses) → Day by day
  (three full days, each with 2–3 fully-formed day shapes) → Where we sleep →
  Open decision + practical.
- **Privacy projection:** the public page shows flight numbers + times only
  (UA1330 / UA2017). No Airbnb confirmation codes, eTicket / seat numbers, fares,
  or the unconfirmed street address — those live only in `../BOOKED.md`.
- **Fail-loud WA-20 caveat:** east-side items (Maple Pass, Washington Pass, Rainy
  Lake) carry a dated re-check banner linking WSDOT. (Verified Jun 10: full
  reopen targeted Fri Jun 19, 2026; Diablo Lake + Ross Dam already reopened.)
- **Every place** carries 📍 Navigate + ↗ Website in one predictable spot, plus
  an On-trip kit with all of them in one list. The three held houses have no
  listing URL on file, so they show 📍 Navigate only (honest omission).

## Stack

- Vite + TypeScript (strict mode, no `any`, `verbatimModuleSyntax`)
- ESLint (flat config) + Prettier
- Vanilla DOM (no UI framework). All facts render from `src/trip.ts`.
- CI (`.github/workflows/ci.yml`): lint → privacy → link-resolve → build.
- GitHub Pages deploy (`.github/workflows/deploy.yml`).

## Develop

```bash
npm install
npm run dev               # vite dev server
npm run lint              # eslint + privacy check + link shape check
npm run check:links:net   # live photo-exists + dead-link resolve check
npm run build             # tsc --noEmit + vite build → dist/
npm run preview           # serve dist/ at :4173

# screenshots (build + preview first):
node scripts/screenshot.mjs http://localhost:4173/north-cascades-2026/
```

## Project layout

```
site/
  index.html              # shell only — zero hardcoded facts
  vite.config.ts          # single-page input + GH-Pages cache-bust plugin
  tsconfig.json
  eslint.config.js
  .prettierrc
  src/
    trip.ts               # THE single data module — every fact lives here
    main.ts               # the one renderer (cover → glance → days → sleep → practical)
    route.ts              # the candidate strip (3 houses, single-base variant)
    notes.ts              # floating 💬 → north_cascades_notes (tandem feedback)
    supabase.ts           # minimal REST client for the notes table
    brochure.css          # the whole visual system (~640 lines)
  public/img/             # local trip photos (served at /img/...)
  scripts/
    privacy-check.mjs     # bans conf codes / eTicket / seats / PIN / address
    link-check.mjs        # local photo existence + external URL resolve (--net)
    screenshot.mjs        # mobile / desktop / day-card captures
  .github/workflows/      # ci.yml + deploy.yml
```

## Content sourcing

All facts are mined from `../BOOKED.md` (canonical bookings), `../trip-plan.md`,
and the pre-rebuild `src/data/itinerary.ts` (the corrected, west-rebased day plan
with WTA hike stats). `src/trip.ts` is the single source of truth — if a fact
changes, change it there.

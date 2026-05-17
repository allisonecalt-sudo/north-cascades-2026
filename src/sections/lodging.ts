/**
 * Lodging — back-compat re-export shim.
 *
 * The body of this file used to be a 1,802-line god-object covering filter
 * state, shortlist plumbing, photo carousel, card render, chip-bar UI, drive
 * matrix, search guide, and the renderLodging entry. The code audit
 * (`CODE_AUDIT_2026-05-17.md` §2) flagged it as the top refactor candidate.
 *
 * Refactored 2026-05-17 (Lodging Refactor agent) into `sections/lodging/`:
 *   - `filter-state.ts` — FilterState + filters singleton + predicates + counts
 *   - `shortlist.ts`    — shortlist Set + togglePick + panel/container/fab UI
 *   - `card.ts`         — renderLodgingCard + amenityPills + carousel + drive matrix
 *   - `chip-bar.ts`     — buildChipDefs + renderChipBar + updateChipBar + sold-out banner
 *   - `search-guide.ts` — renderLodgingSearchGuide (collapsible reference section)
 *   - `index.ts`        — public entry: renderLodging + panel/body orchestrator
 *
 * Public API preserved: `pages/lodging.ts` continues to import from
 * `../sections/lodging` without changes.
 */

export { renderLodging, renderLodgingSearchGuide } from './lodging/index';

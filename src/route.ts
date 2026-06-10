// ===========================================================================
// route.ts — the CANDIDATE STRIP (DELTA 1, single-base variant).
//
// Austria had four bases + three moves, so its glance block drew a vertical
// route ribbon. North Cascades is ONE house for all four nights — there's no
// route to draw. The equivalent "see everything organized before I act" screen
// here is the three CANDIDATE houses laid out as a clean strip, ordered by
// drive-to-trailheads (the fact that actually differs between them), with the
// leaning pick accented in evergreen. Pure HTML/CSS, no map tiles, no network.
//
// Her rule (Jun 10): "don't put a map if the UX/UI is terrible… if not just
//   don't put it in." A clean static strip beats any janky single-pin embed.
// ===========================================================================

import type { Base } from './trip.js';

function esc(s: string): string {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/**
 * Render the three candidate houses as a strip into the given element. No
 * async, no fetch — it just draws from the bases array. The leaning pick gets
 * the `.cand--rec` class (evergreen accent).
 */
export function mountCandidates(elementId: string, bases: Base[]): void {
  const box = document.getElementById(elementId);
  if (!box) return;

  const ol = document.createElement('ol');
  ol.className = 'cands';

  bases.forEach((b, i) => {
    const rec = b.recommended === true;
    const node = document.createElement('li');
    node.className = `cand${rec ? ' cand--rec' : ''}`;
    node.innerHTML = `
      <span class="cand__dot">${i + 1}</span>
      <span class="cand__body">
        <span class="cand__place">${esc(b.name)}</span>
        <span class="cand__sub">${esc(b.town)} · ${esc(b.heldBy)}</span>
      </span>
      <span class="cand__drive">${esc(b.driveToTrailheads)}${rec ? ' · leaning ★' : ''}</span>
    `;
    ol.appendChild(node);
  });

  box.innerHTML = '';
  box.appendChild(ol);
}

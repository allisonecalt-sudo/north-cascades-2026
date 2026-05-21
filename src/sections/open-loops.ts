/**
 * open-loops.ts — "What's still open" + "Next action" strip for the home page.
 *
 * Added 2026-05-19 (site rework). Pairs with locked-decisions.ts above it.
 *
 * Each open loop shows: what's open · who's holding it · when we expect a
 * resolution. Avoids the "react to options" framing — these are tracked
 * commitments, not menu choices.
 *
 * Voice rule (CLAUDE.md): system ASKS or SUGGESTS, never TELLS. The "Next
 * action" rows below are SUGGESTIONS shaped as the natural next move per
 * holder. They're not prescriptions to Erin.
 *
 * Update this file when a loop closes (move row to locked-decisions.ts) or a
 * new loop opens.
 */

import { h, section } from '../dom';

interface OpenLoop {
  /** Short label — e.g. "Flights", "Lodging picks", "WA-20 status". */
  label: string;
  /** One-line current state — neutral, factual, doesn't push. */
  state: string;
  /** Who's currently holding the ball — "Erin" / "Allison" / "WSDOT". */
  holder: string;
  /** When we expect a resolution / re-check window. Be honest about uncertainty. */
  eta: string;
  /** Optional verbatim quote that established the holder/eta. */
  quote?: string;
  attribution?: string;
}

const OPEN: OpenLoop[] = [
  {
    label: 'Which booked house is primary',
    state: 'TWO Airbnbs are booked for the same dates (Aug 16–20): Arlington (host Brandi, 6 guests, conf HMKXHM8AW5) and Sedro-Woolley "Lakeside Cabin" (host Jackie, 4 guests, conf HMA4W2E22N). One is the keeper, one a backup — confirm primary, then cancel the other.',
    holder: 'Allison',
    eta: 'Decide + cancel the backup',
  },
  {
    label: 'Whole-house vs shared (Sedro-Woolley)',
    state: 'Unresolved whether the Sedro-Woolley Lakeside Cabin is the whole place or shared with other guests.',
    holder: 'Allison + Erin',
    eta: 'Confirm with host Jackie',
    quote: '"will the other people be there?" / "I thought it was the whole place."',
    attribution: 'Erin / Allison · WhatsApp, May 19',
  },
  {
    label: 'WA-20 reopen',
    state: 'WSDOT is the gate on whether the east-side stretch is reachable. Both booked houses are WEST of the corridor, so a west-side trip works regardless. Same 24/7 emergency contracts running since early May.',
    holder: 'WSDOT',
    eta: '3-day re-check window before the trip',
  },
];

interface NextActionRow {
  /** Who this action is for — "Allison" / "Erin". */
  holder: string;
  /** The concrete next move. Imperative, specific. */
  action: string;
}

const NEXT_ACTIONS: NextActionRow[] = [
  {
    holder: 'Allison',
    action: 'Confirm which booked house is primary (Arlington vs Sedro-Woolley Lakeside Cabin) and cancel the backup reservation — both are held for the same Aug 16–20 dates.',
  },
  {
    holder: 'Allison + Erin',
    action: 'Confirm with host Jackie whether the Sedro-Woolley Lakeside Cabin is the whole house or shared, before deciding which to keep.',
  },
];

function renderOpenRow(loop: OpenLoop): HTMLElement {
  return h(
    'li',
    { class: 'open-row' },
    h(
      'div',
      { class: 'open-row__head' },
      h('span', { class: 'open-row__badge' }, '⏳ Open'),
      h('span', { class: 'open-row__label' }, loop.label),
      h('span', { class: 'open-row__holder' }, `· holder: ${loop.holder}`)
    ),
    h('p', { class: 'open-row__state' }, loop.state),
    h(
      'p',
      { class: 'open-row__eta' },
      h('strong', {}, 'ETA: '),
      loop.eta
    ),
    loop.quote
      ? h(
          'blockquote',
          { class: 'open-row__quote' },
          loop.quote,
          loop.attribution
            ? h('cite', { class: 'open-row__attribution' }, ` — ${loop.attribution}`)
            : null
        )
      : null
  );
}

function renderNextActionRow(row: NextActionRow): HTMLElement {
  return h(
    'li',
    { class: 'next-row' },
    h('span', { class: 'next-row__holder' }, row.holder),
    h('span', { class: 'next-row__action' }, row.action)
  );
}

export function renderOpenLoops(): HTMLElement {
  return section(
    'open',
    "What's still open · next action",
    h(
      'p',
      { class: 'section__lede' },
      'Tracked commitments, not menu choices. Each loop shows who\'s holding it and when we expect to close it.'
    ),
    h(
      'ul',
      { class: 'open-list' },
      ...OPEN.map(renderOpenRow)
    ),
    h(
      'div',
      { class: 'next-actions' },
      h('h3', { class: 'next-actions__title' }, 'Next action'),
      h(
        'ul',
        { class: 'next-actions__list' },
        ...NEXT_ACTIONS.map(renderNextActionRow)
      )
    )
  );
}

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
    label: 'Flights',
    state: 'United EWR→SEA nonstop is the leading shape. Exact fare + refundable upgrade cost still to lock.',
    holder: 'Erin',
    eta: 'Researching tonight (may book by tomorrow)',
    quote: '"Yes we could do United. They fly into SEA. That\'s looking much cheaper."',
    attribution: 'Erin · May 18, 11:07pm',
  },
  {
    label: 'Lodging picks',
    state: 'Marblemount-cluster shortlist needs the actual refundable picks — names, dates, prices verified.',
    holder: 'Allison',
    eta: 'Researching today',
  },
  {
    label: 'WA-20 reopen',
    state: 'WSDOT is the gate between Path B (primary) and Path A (locked fallback). Same 24/7 emergency contracts running since early May.',
    holder: 'WSDOT',
    eta: '3-day re-check window before booking week',
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
    action: 'Research Marblemount-cluster refundable lodging today — narrow to 3-4 picks with verified Aug 16-20 availability + cancellation policies.',
  },
  {
    holder: 'Erin',
    action: 'Pick the United fare option tonight — confirm exact $ + refundable upgrade. Allison\'s travel credit applies, so price logged-in to united.com.',
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

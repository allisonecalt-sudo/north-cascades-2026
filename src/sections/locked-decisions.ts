/**
 * locked-decisions.ts — "What's locked" strip for the home page.
 *
 * Added 2026-05-19 (site rework). Sits ABOVE the path picker and the open-loops
 * strip. The May 18 WhatsApp thread shifted the planning posture from "react to
 * three options" to "execute on the decisions we made." This component is the
 * head-up display of those decisions.
 *
 * Voice rule (CLAUDE.md): every row carries a verbatim Erin or Allison quote
 * that established the decision, dated. The system ASKS or SUGGESTS — it never
 * TELLS. Locked rows do not propose; they record.
 *
 * Update this file when a NEW item moves from open → locked. Don't paraphrase.
 */

import { h, section } from '../dom';

interface LockedRow {
  /** Short label — e.g. "Dates", "Path", "Lodging area". */
  label: string;
  /** One-line current locked state. Declarative, factual. */
  state: string;
  /** Verbatim quote that established it. Don't sand off punctuation. */
  quote?: string;
  /** Who said the quote (Erin / Allison) + date the decision was logged. */
  attribution?: string;
}

const LOCKED: LockedRow[] = [
  {
    label: 'Dates',
    state: 'Sun Aug 16 → Thu Aug 20, 2026 (5 days, 4 nights)',
    attribution: 'Allison + Erin · early May 2026',
  },
  {
    label: 'Party',
    state: 'Allison + Erin — sharing a cabin, 2 beds always',
    quote: '"I\'m not gonna go on this trip if you\'re not gonna go."',
    attribution: 'Erin · WhatsApp, May 2026',
  },
  {
    label: 'Park',
    state: 'North Cascades National Park, WA',
    quote: '"Would you have any interest in North cascades national Park?"',
    attribution: 'Erin · WhatsApp May 7, 2026',
  },
  {
    label: 'Path',
    state: 'Path B (both sides) if WA-20 reopens · Path A (Marblemount only) as locked fallback',
    quote:
      '"I\'d be down to do Path B but only once we know the road is opened. Otherwise it\'s probably better to do Path A."',
    attribution: 'Erin · WhatsApp May 18, 4:57am',
  },
  {
    label: 'Lodging — BOOKED (3 held, same dates)',
    state:
      'Three Airbnbs reserved for Aug 16–20, all kept for now: Arlington (host Brandi, 6 guests, conf HMKXHM8AW5, Allison booked) · Sedro-Woolley "Lakeside Cabin w/ Dock, Boats & Stunning Views" (host Jackie, 4 guests, conf HMA4W2E22N, Allison booked) · Sedro-Woolley "Edwards House Retreat" ($493/4 nights, 4.99★, free cancellation, Erin booked). All west of the WA-20 corridor, ~40 min farther west than the Marblemount cluster. Erin shared "27024 Minkler Rd, Sedro-Woolley" as the address — unconfirmed which Sedro-Woolley listing it is. STILL OPEN: Allison + Erin pick one, cancel the other two before the free-cancellation windows close.',
    quote: '"Address to the house:  27024 Minkler Rd, Sedro-Woolley, WA 98284, USA"',
    attribution: 'Erin · WhatsApp May 19, 2026',
  },
  {
    label: 'Flights — BOOKED',
    state:
      'United Economy EWR⇄SEA, booked May 20, 2026. Out: UA1330 Sun Aug 16, EWR 7:59 AM → SEA 11:03 AM. Return: UA2017 Thu Aug 20, SEA 10:58 PM → EWR 7:10 AM Fri Aug 21 (redeye — Thursday is a full WA day, drive to SEA in the evening). Allison conf IXMH2Z (seats 37A / 31D); Erin booked matching seats separately.',
    quote: '"BOOKED IT"',
    attribution: 'Erin · WhatsApp May 20, 2026',
  },
  {
    label: 'Mt Baker / Park Butte',
    state: 'Added as a Day-2 alternative to Cascade Pass · west of WA-20 corridor, so accessible even if road stays closed',
    quote:
      '"I have something in the Google doc about Mt Baker, it sounds like it\'s worth checking out."',
    attribution: 'Erin · WhatsApp May 18, 8:42pm',
  },
];

function renderRow(row: LockedRow): HTMLElement {
  return h(
    'li',
    { class: 'locked-row' },
    h(
      'div',
      { class: 'locked-row__head' },
      h('span', { class: 'locked-row__badge' }, '✓ Locked'),
      h('span', { class: 'locked-row__label' }, row.label)
    ),
    h('p', { class: 'locked-row__state' }, row.state),
    row.quote
      ? h(
          'blockquote',
          { class: 'locked-row__quote' },
          row.quote,
          row.attribution
            ? h('cite', { class: 'locked-row__attribution' }, ` — ${row.attribution}`)
            : null
        )
      : row.attribution
        ? h('p', { class: 'locked-row__attribution-only' }, row.attribution)
        : null
  );
}

export function renderLockedDecisions(): HTMLElement {
  return section(
    'locked',
    "What's locked",
    h(
      'p',
      { class: 'section__lede' },
      'The decisions we already made — sourced from WhatsApp + Google Doc, quoted verbatim.'
    ),
    h(
      'ul',
      { class: 'locked-list' },
      ...LOCKED.map(renderRow)
    )
  );
}

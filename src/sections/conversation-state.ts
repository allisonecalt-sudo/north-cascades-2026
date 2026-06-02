/**
 * conversation-state.ts — "What's decided" strip for the home page.
 *
 * Added 2026-05-19 after Erin's WhatsApp May 18:
 *   *"I'd be down to do Path B (both sides) but only once we know the road
 *    is opened. Otherwise it's probably better to do Path A."*
 *
 * So the path decision is MADE — Path B is the plan, Path A is the locked
 * fallback gated on WA-20 reopen. The path-picker further down is the deep
 * dive; this strip is the live state.
 *
 * Why this exists: previously the site framed paths as "Erin needs to pick
 * one of three." After May 18 that framing is stale — the decision is made
 * and only the road gate is open. This component sits above the path
 * picker, dated, with the latest state per item.
 *
 * Items are simple "label / status / detail" rows. Each is dated to the
 * conversation moment it was decided. Update this file when the state
 * actually shifts; don't auto-render against a database.
 */

import { h, section } from '../dom';

interface DecisionRow {
  /** Short label — e.g. "Path", "Flights", "Lodging". */
  label: string;
  /** One-line current state. Strong, declarative. */
  state: string;
  /** Optional sub-line — caveat / next step / source date. */
  sub?: string;
  /** Tone — "decided" green, "in-progress" amber, "blocked" red, "info" neutral. */
  tone: 'decided' | 'in-progress' | 'blocked' | 'info';
  /** Who's currently holding the ball — "Erin" / "Allison" / "WSDOT" / null. */
  holder?: string;
}

// State derived from WhatsApp May 18 - 19, 2026. Edit this list when the
// conversation moves. Last sync line at the bottom is the metadata.
const DECISIONS: DecisionRow[] = [
  {
    label: 'Path',
    state: 'Path B if WA-20 opens · Path A fallback if not',
    sub: 'Erin May 18 4:57am — "down to do Path B but only once we know the road is opened. Otherwise it\'s probably better to do Path A."',
    tone: 'decided',
  },
  {
    label: 'Road gate',
    state: 'Waiting on WSDOT WA-20 reopen confirmation',
    sub: 'See road-status tile below. WSDOT target then a 3-day re-check window before locking the path.',
    tone: 'blocked',
    holder: 'WSDOT',
  },
  {
    label: 'Flights',
    state: 'BOOKED · United Economy EWR⇄SEA · out UA1330 Sun Aug 16 (7:59 AM → 11:03 AM) · return UA2017 Thu Aug 20 redeye (10:58 PM → lands EWR 7:10 AM Fri).',
    sub: 'Booked May 20, 2026. Erin — "BOOKED IT." Allison conf IXMH2Z (seats 37A / 31D); Erin booked matching seats separately.',
    tone: 'decided',
  },
  {
    label: 'Lodging',
    state: 'BOOKED · three west-side Airbnbs held for the same dates (Arlington + two in Sedro-Woolley: Lakeside Cabin + The Carriage House). All kept for now. Open: pick one, cancel the other two before the free-cancellation windows close.',
    sub: 'All west of WA-20 (work even if the road stays closed), ~40 min farther west than the Marblemount cluster. Erin shared 27024 Minkler Rd as the address (May 19) — unconfirmed which listing.',
    tone: 'in-progress',
    holder: 'Allison',
  },
  {
    label: 'Mt Baker',
    state: 'Added as a Path A swap-in / Path B side trip',
    sub: 'Erin May 18 8:42pm — "I have something in the Google doc about Mt Baker, it sounds like it\'s worth checking out." Park Butte trail ~1 hr west of Marblemount.',
    tone: 'info',
  },
];

const LAST_SYNC = 'May 21, 2026 — flights + lodging booked';

function renderRow(row: DecisionRow): HTMLElement {
  return h(
    'li',
    { class: `convstate__row convstate__row--${row.tone}` },
    h(
      'div',
      { class: 'convstate__head' },
      h('span', { class: `convstate__badge convstate__badge--${row.tone}` }, row.label),
      row.holder
        ? h('span', { class: 'convstate__holder' }, `· ${row.holder}`)
        : null
    ),
    h('p', { class: 'convstate__state' }, row.state),
    row.sub ? h('p', { class: 'convstate__sub' }, row.sub) : null
  );
}

export function renderConversationState(): HTMLElement {
  return section(
    'conversation-state',
    'What\'s decided · what\'s still open',
    h(
      'p',
      { class: 'section__lede' },
      'Live state from the actual back-and-forth — sourced from WhatsApp + the Google Doc. The path-picker further down is the deep dive; this is the snapshot.'
    ),
    h(
      'ul',
      { class: 'convstate__list' },
      ...DECISIONS.map(renderRow)
    ),
    h(
      'p',
      { class: 'convstate__sync' },
      `Last sync: ${LAST_SYNC}. Sourced from WhatsApp + the Google Doc.`
    )
  );
}

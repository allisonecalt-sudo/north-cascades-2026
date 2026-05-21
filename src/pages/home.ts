/**
 * home.ts — landing page. Card-grid dashboard rebuild 2026-05-21.
 *
 * Posture: the trip is BOOKED (flights + lodging). Allison asked for the home
 * page to feel like her favorite app — the budget dashboard: one page, one
 * scroll, a hero + a calm grid of bounded, emoji-titled cards. Each card is ONE
 * idea, scannable, with a few real facts pulled from the data files (no
 * fabrication), linking to its deep page where one exists.
 *
 * Replaces the stacked-prose stack (locked-decisions + open-loops + map +
 * itinerary rendered inline). Those long sections now live as compact cards
 * here, with links out to the deep pages for the full detail. The verbose
 * section renderers (renderLockedDecisions / renderOpenLoops / renderMap /
 * renderItinerary) are KEPT — they still render on their own deep pages — but
 * are too long for a calm card, so the cards below read the same underlying
 * facts in condensed form.
 *
 * Card grid (after the image hero + stat band):
 *   ✈️ Flights · 🏠 Stays · 🥾 Hikes · 🗺️ Map · 💵 Costs · ⚠️ WA-20 ·
 *   ✓ What's locked · 📍 Still open · 💬 For Erin
 *
 * Data sources (all real): data/flights.ts (BOOKED_FLIGHTS), data/lodging.ts
 * (BOOKED_STAYS), data/hikes.ts (HIKES), data/costs.ts (pathRange), data/
 * closure.ts (CLOSURE_ALERT). No comparison-era scaffolding.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderStatRow } from '../sections/stat-row';
import { BOOKED_FLIGHTS } from '../data/flights';
import { BOOKED_STAYS } from '../data/lodging';
import { HIKES, type Hike } from '../data/hikes';
import { PATH_COSTS, pathRange } from '../data/costs';
import { CLOSURE_ALERT } from '../data/closure';
import { h } from '../dom';

/** USD whole-dollar formatter for cost headlines. */
function usd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US');
}

/**
 * Build one dashboard card. emoji + title, then arbitrary body children, then
 * an optional footer link to the deep page.
 */
function card(
  emoji: string,
  title: string,
  body: Array<HTMLElement | string | null>,
  link?: { href: string; label: string }
): HTMLElement {
  return h(
    'article',
    { class: 'trip-card' },
    h(
      'h2',
      { class: 'trip-card__title' },
      h('span', { class: 'trip-card__emoji', 'aria-hidden': 'true' }, emoji),
      title
    ),
    h('div', { class: 'trip-card__body' }, ...body),
    link
      ? h('a', { class: 'trip-card__link', href: link.href }, link.label, ' →')
      : null
  );
}

/** A label · value row inside a card. */
function factRow(label: string, value: HTMLElement | string): HTMLElement {
  return h(
    'div',
    { class: 'trip-card__row' },
    h('span', { class: 'trip-card__row-label' }, label),
    h('span', { class: 'trip-card__row-value' }, value)
  );
}

/** A name + meta two-line item (used for stays, hikes, open loops). */
function lineItem(name: string, meta: string): HTMLElement {
  return h(
    'div',
    { class: 'trip-card__item' },
    h('span', { class: 'trip-card__item-name' }, name),
    h('span', { class: 'trip-card__item-meta' }, meta)
  );
}

function mono(text: string): HTMLElement {
  return h('span', { class: 'trip-card__mono' }, text);
}

// ─── ✈️ Flights ───
function flightsCard(): HTMLElement {
  const [out, ret] = BOOKED_FLIGHTS.legs;
  const body: Array<HTMLElement | string> = [
    h(
      'p',
      { class: 'trip-card__lede' },
      `Booked — ${BOOKED_FLIGHTS.carrier} ${BOOKED_FLIGHTS.cabin}, EWR ⇄ SEA.`
    ),
  ];
  if (out) {
    body.push(
      factRow('Out', h('span', {}, mono(out.flight), ` · ${out.date} · `, mono(out.times)))
    );
  }
  if (ret) {
    body.push(
      factRow(
        'Back',
        h('span', {}, mono(ret.flight), ` · ${ret.date} · `, mono(ret.times), ' (redeye)')
      )
    );
  }
  body.push(
    h(
      'p',
      { class: 'trip-card__note' },
      `Allison conf ${BOOKED_FLIGHTS.allisonConf} · Erin booked matching seats separately.`
    )
  );
  return card('✈️', 'Flights — booked', body, { href: 'travel.html', label: 'Flight details' });
}

// ─── 🏠 Stays ───
function staysCard(): HTMLElement {
  const body: Array<HTMLElement | string> = [
    h(
      'p',
      { class: 'trip-card__lede' },
      `${BOOKED_STAYS.length} Airbnbs held for the same dates — all west of WA-20.`
    ),
  ];
  for (const stay of BOOKED_STAYS) {
    const meta: string[] = [stay.place];
    if (stay.host) meta.push(`host ${stay.host}`);
    if (stay.price) meta.push(stay.price);
    if (stay.rating) meta.push(stay.rating);
    body.push(lineItem(stay.name, meta.join(' · ')));
  }
  body.push(
    h(
      'p',
      { class: 'trip-card__note' },
      'All held — pick one, cancel two before the free-cancellation windows close.'
    )
  );
  return card('🏠', `Stays — ${BOOKED_STAYS.length} booked`, body, {
    href: 'lodging.html',
    label: 'See the stays',
  });
}

// ─── 🥾 Hikes ───
function hikesCard(): HTMLElement {
  // Three signature picks the plan keeps pointing at: the marquee pass, the
  // most-loved loop, and an easy alpine lake (all real entries in data/hikes.ts).
  const wantIds = ['cascade-pass', 'maple-pass', 'blue-lake'];
  const picks = wantIds
    .map((id) => HIKES.find((hk) => hk.id === id))
    .filter((hk): hk is Hike => Boolean(hk));
  const list: Hike[] =
    picks.length > 0 ? picks : HIKES.filter((hk) => hk.level === 'moderate').slice(0, 3);
  const body: Array<HTMLElement | string> = [
    h('p', { class: 'trip-card__lede' }, 'Easy-to-moderate, big alpine views, balanced pace.'),
  ];
  for (const hk of list) {
    body.push(lineItem(hk.name, `${hk.mileage} · ${hk.difficulty}`));
  }
  return card('🥾', 'Hikes', body, { href: 'hikes.html', label: 'All hikes' });
}

// ─── 🗺️ Map ───
function mapCard(): HTMLElement {
  return card(
    '🗺️',
    'Map',
    [
      h(
        'p',
        { class: 'trip-card__lede' },
        'The booked houses, trailheads, viewpoints, and the WA-20 corridor — on one interactive map.'
      ),
    ],
    { href: 'map.html', label: 'Open the map' }
  );
}

// ─── 💵 Costs ───
function costsCard(): HTMLElement {
  // Headline range across both paths: lowest "Lean" → highest "Splurge" total.
  const ranges = PATH_COSTS.map(pathRange);
  const low = Math.min(...ranges.map((r) => r.low));
  const high = Math.max(...ranges.map((r) => r.high));
  return card(
    '💵',
    'Costs',
    [
      h(
        'p',
        { class: 'trip-card__lede' },
        'All-in trip total for the two of you (flights ×2 + car + house + food + fuel + 10% buffer).'
      ),
      h('p', { class: 'trip-card__big' }, mono(`${usd(low)} – ${usd(high)}`)),
      h('p', { class: 'trip-card__note' }, 'Lean → Splurge, across both routing options.'),
    ],
    { href: 'costs.html', label: 'Cost breakdown' }
  );
}

// ─── ⚠️ WA-20 ───
function wa20Card(): HTMLElement {
  return card('⚠️', 'WA-20 status', [
    h(
      'p',
      { class: 'trip-card__lede' },
      'The North Cascades Highway through the park is currently CLOSED.'
    ),
    factRow('Target reopen', mono('June 25, 2026')),
    h(
      'p',
      { class: 'trip-card__note' },
      'WSDOT target — "a goal, not a promise." All three booked houses are west of the closure, so the trip works either way.'
    ),
    h(
      'a',
      {
        class: 'trip-card__link',
        href: CLOSURE_ALERT.liveStatusUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'Live WSDOT status ↗'
    ),
  ]);
}

// ─── ✓ What's locked ───
function lockedCard(): HTMLElement {
  const rows: Array<[string, string]> = [
    ['Dates', 'Sun Aug 16 → Thu Aug 20 (5 days, 4 nights)'],
    ['Party', 'Allison + Erin — sharing a cabin, 2 beds always'],
    ['Park', 'North Cascades National Park, WA'],
    ['Path', 'Path B (both sides) if WA-20 reopens · Path A (west only) as fallback'],
  ];
  const body: Array<HTMLElement | string> = [
    h('p', { class: 'trip-card__lede' }, 'The decisions already made.'),
    ...rows.map(([label, value]) => factRow(label, value)),
  ];
  return card('✓', "What's locked", body, { href: 'for-erin.html', label: 'Open decisions' });
}

// ─── 📍 Still open ───
function openCard(): HTMLElement {
  const body: Array<HTMLElement | string> = [
    lineItem(
      'Which booked house to keep',
      'Allison + Erin — pick one of three, cancel the other two before the cancellation windows close.'
    ),
    lineItem(
      'WA-20 reopen',
      'WSDOT — 3-day re-check window before the trip. West-side trip works regardless.'
    ),
  ];
  return card('📍', 'Still open', body);
}

// ─── 💬 For Erin ───
function forErinCard(): HTMLElement {
  return card(
    '💬',
    'For Erin',
    [
      h(
        'p',
        { class: 'trip-card__lede' },
        'The open decisions to weigh in on, in one place — what to pick and what we still need from you.'
      ),
    ],
    { href: 'for-erin.html', label: 'For Erin' }
  );
}

function mount(): void {
  const main = mountPageShell({
    pageId: 'home',
    title: 'North Cascades · Aug 16-20, 2026 · Allison + Erin',
    lede:
      'The trip is booked — flights (United, EWR⇄SEA) and lodging (three west-side Airbnbs held for the same dates). What\'s left: pick one booked house and cancel the other two, and watch the WA-20 reopen.',
    showClosure: true,
    imageHero: {
      // Cascade Pass / Sahale Arm — Pelton Peak + Yawning Glacier + Magic
      // Mountain. CC BY 2.0 Daniel Hershman, 2007.
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Cascade_pass.jpg/1920px-Cascade_pass.jpg',
      alt: 'Pelton Peak, Yawning Glacier, and Magic Mountain seen from the Sahale Arm above Cascade Pass in North Cascades National Park',
      credit: 'Photo: Daniel Hershman / Wikimedia · CC BY 2.0',
      ctaLabel: 'See the trip at a glance',
      ctaHref: '#trip-grid',
    },
  });

  // Stat-band — quick orientation: 5 days · 4 nights · 3 stays booked · 2 travelers.
  const statBand = h(
    'div',
    { class: 'stat-band' },
    h('div', { class: 'stat-band__inner' }, renderStatRow())
  );

  // The calm card grid — one bounded idea per card.
  const grid = h(
    'section',
    { class: 'trip-grid', id: 'trip-grid', 'aria-label': 'The trip at a glance' },
    flightsCard(),
    staysCard(),
    hikesCard(),
    mapCard(),
    costsCard(),
    wa20Card(),
    lockedCard(),
    openCard(),
    forErinCard()
  );

  main.append(statBand, grid);
}

mount();

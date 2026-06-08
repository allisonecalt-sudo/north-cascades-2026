/**
 * home.ts — landing page. Declutter pass 2026-06-08 (DESIGN-RULES Landing
 * recipe: orient in 30s, ONE next step, facts not prose, launchpad not copy).
 *
 * Posture: the trip is BOOKED (flights + lodging). The home page is the budget-
 * dashboard feel — hero + stat band + a calm grid of bounded, emoji-titled
 * cards. Each card is ONE idea linking to its deep page; facts come straight
 * from the data files (no fabrication).
 *
 * Card grid (after the image hero + stat band):
 *   👉 Next (the one open decision) · ✈️ Flights · 🏠 Stays · 🥾 Hikes ·
 *   🗺️ Map · 💵 Costs
 *
 * Cut in the 2026-06-08 pass (said elsewhere on THIS page already):
 *   - ⚠️ WA-20 card — the closure banner already rides in the hero band
 *     (showClosure: true); the card repeated the same CLOSED + June 25 fact.
 *   - ✓ What's locked card — dates/party already live in the hero eyebrow +
 *     stat band; the path detail lives on For Erin.
 *   - 📍 Still open + 💬 For Erin cards — three cards pointed at one decision;
 *     collapsed into a single "Next" card (the page's one clear next step).
 *
 * Data sources (all real): data/flights.ts (BOOKED_FLIGHTS), data/lodging.ts
 * (BOOKED_STAYS), data/hikes.ts (HIKES), data/costs.ts (pathRange).
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderStatRow } from '../sections/stat-row';
import { BOOKED_FLIGHTS } from '../data/flights';
import { BOOKED_STAYS } from '../data/lodging';
import { HIKES, type Hike } from '../data/hikes';
import { PATH_COSTS, pathRange } from '../data/costs';
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

/** A name + meta two-line item (used for stays + hikes). */
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
        'Houses, trailheads, viewpoints, and the WA-20 corridor — one interactive map.'
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
      h('p', { class: 'trip-card__big' }, mono(`${usd(low)} – ${usd(high)}`)),
      h(
        'p',
        { class: 'trip-card__note' },
        'All-in for both — flights ×2, car, house, food, fuel, +10%. Lean → Splurge.'
      ),
    ],
    { href: 'costs.html', label: 'Cost breakdown' }
  );
}

// ─── 👉 Next — the one open decision (the page's single next step) ───
function nextCard(): HTMLElement {
  const body: Array<HTMLElement | string> = [
    h(
      'p',
      { class: 'trip-card__lede' },
      'Three houses are held for the same dates. Pick one together, cancel the other two before the free-cancellation windows close.'
    ),
  ];
  return card('👉', 'Next: pick the house', body, {
    href: 'for-erin.html',
    label: 'Decide with Erin',
  });
}

function mount(): void {
  const main = mountPageShell({
    pageId: 'home',
    title: 'North Cascades · Aug 16-20, 2026 · Allison + Erin',
    lede:
      'Booked — flights (United, EWR⇄SEA) and three west-side Airbnbs. One thing left: pick one house, cancel two.',
    showClosure: true,
    imageHero: {
      // Cascade Pass / Sahale Arm — Pelton Peak + Yawning Glacier + Magic
      // Mountain. CC BY 2.0 Daniel Hershman, 2007.
      src: 'img/cascade-pass.jpg',
      alt: 'Pelton Peak, Yawning Glacier, and Magic Mountain seen from the Sahale Arm above Cascade Pass in North Cascades National Park',
      credit: 'Photo: Daniel Hershman / Wikimedia · CC BY 2.0',
      ctaLabel: 'Pick the house',
      ctaHref: '#trip-grid',
    },
  });

  // Stat-band — quick orientation: 5 days · 4 nights · 3 stays booked · 2 travelers.
  const statBand = h(
    'div',
    { class: 'stat-band' },
    h('div', { class: 'stat-band__inner' }, renderStatRow())
  );

  // The calm card grid — one bounded idea per card. Next step leads; the rest
  // are quiet launchpads to the deep pages.
  const grid = h(
    'section',
    { class: 'trip-grid', id: 'trip-grid', 'aria-label': 'The trip at a glance' },
    nextCard(),
    flightsCard(),
    staysCard(),
    hikesCard(),
    mapCard(),
    costsCard()
  );

  main.append(statBand, grid);
}

mount();

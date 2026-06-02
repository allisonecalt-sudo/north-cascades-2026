/**
 * home-reference.ts — collapsed "See also" disclosure for the bottom of home.
 *
 * What this is: a single <details> block that lists the admin / reference
 * pages (Weather Plan C, Pre-trip checklist, Groceries, Details, For Erin
 * — restated for prominence even though it's in the nav). Keeps the home
 * page from sprouting a 19-item link grid while still making everything
 * reachable from cold-start.
 *
 * Why a disclosure and not a flat list: the nav covers these already. A flat
 * link grid on home duplicates the nav. A disclosure means "you're a new
 * visitor and didn't see those in the nav, here they are."
 *
 * Last in the home stack. Cheap to render — pure DOM, no fetches.
 */

import { h, section } from '../dom';

interface RefLink {
  label: string;
  href: string;
  desc: string;
}

// Curated, NOT auto-generated from nav. Some nav entries are deliberately
// surfaced earlier on home (Stay, Costs, For Erin) so don't re-link them.
const REF_LINKS: readonly RefLink[] = [
  {
    label: 'Pre-trip checklist',
    href: 'pre-trip.html',
    desc: 'Book-by dates, kosher phone-sweep, packing prep.',
  },
  {
    label: 'Weather Plan C',
    href: 'weather-plan-c.html',
    desc: 'Smoke / rain swaps per day. Wildfire season fallback.',
  },
  {
    label: 'Groceries',
    href: 'food.html',
    desc: 'Seattle Va\'ad stop, cook-from-cabin plan.',
  },
  {
    label: 'For Erin',
    href: 'for-erin.html',
    desc: 'Open decisions Allison wants Erin to weigh in on.',
  },
  {
    label: 'Bring list + decisions',
    href: 'pre-trip.html#bring',
    desc: 'Bring list, decisions log, anything else.',
  },
  {
    label: 'Notes feed',
    href: 'notes.html',
    desc: 'Every comment ever left, with status workflow.',
  },
  {
    label: 'WA-20 deep dive',
    href: 'wa20-status.html',
    desc: 'Sources, phone protocol, affected hikes.',
  },
  {
    label: 'How to do this trip',
    href: 'wa20-status.html#how-to',
    desc: 'The 6 realistic ways to organize the 5 days.',
  },
];

export function renderHomeReference(): HTMLElement {
  return section(
    'home-reference',
    'See also',
    h(
      'details',
      { class: 'home-reference__disclosure' },
      h(
        'summary',
        { class: 'home-reference__summary' },
        `Reference & admin pages (${REF_LINKS.length})`
      ),
      h(
        'ul',
        { class: 'home-reference__list' },
        ...REF_LINKS.map((r) =>
          h(
            'li',
            { class: 'home-reference__item' },
            h(
              'a',
              { class: 'home-reference__link', href: r.href },
              h('span', { class: 'home-reference__label' }, r.label),
              h('span', { class: 'home-reference__desc' }, r.desc)
            )
          )
        )
      )
    )
  );
}

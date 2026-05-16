/**
 * page-ctas.ts — "Where to next?" link strip at the bottom of every page.
 *
 * Lifted from Austria 2026 — every page ends with two or three CTAs to the
 * adjacent pages so the reader doesn't have to bounce up to the global nav.
 * Helps cross-navigation feel native, not appended.
 */

import { h, section } from '../dom';
import type { PageId } from '../page-shell';

interface Cta {
  href: string;
  label: string;
}

const NEXT: Record<PageId, Cta[]> = {
  home: [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'for-erin.html', label: 'For Erin →' },
  ],
  lodging: [
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'travel.html', label: 'Travel →' },
    { href: 'rental.html', label: 'Rental →' },
  ],
  hikes: [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'travel.html', label: 'Travel →' },
    { href: 'food.html', label: 'Food →' },
  ],
  travel: [
    { href: 'rental.html', label: 'Rental →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'seattle.html', label: 'Seattle →' },
  ],
  rental: [
    { href: 'travel.html', label: 'Travel →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'hikes.html', label: 'Hikes →' },
  ],
  food: [
    { href: 'details.html', label: 'Bring list →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'for-erin.html', label: 'For Erin →' },
  ],
  seattle: [
    { href: 'travel.html', label: 'Travel →' },
    { href: 'hikes.html', label: 'Hikes →' },
    { href: './', label: 'Home →' },
  ],
  'for-erin': [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'hikes.html', label: 'Hikes →' },
    { href: './', label: 'Home →' },
  ],
  details: [
    { href: './', label: 'Home →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'for-erin.html', label: 'For Erin →' },
  ],
  notes: [
    { href: './', label: 'Home →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'for-erin.html', label: 'For Erin →' },
  ],
  costs: [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'rental.html', label: 'Rental →' },
    { href: 'pre-trip.html', label: 'Pre-trip →' },
  ],
  'top-sunsets': [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'driving-cascades.html', label: 'Driving →' },
  ],
  'pre-trip': [
    { href: 'costs.html', label: 'Costs →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'details.html', label: 'Bring list →' },
  ],
  'driving-cascades': [
    { href: 'rental.html', label: 'Rental →' },
    { href: 'travel.html', label: 'Travel →' },
    { href: 'lodging.html', label: 'Lodging →' },
  ],
};

export function renderPageCtas(active: PageId): HTMLElement {
  const ctas = NEXT[active];
  return section(
    'next',
    'Where to next?',
    h(
      'div',
      { class: 'page-ctas' },
      ...ctas.map((c) =>
        h('a', { class: 'page-ctas__link', href: c.href }, c.label)
      )
    )
  );
}

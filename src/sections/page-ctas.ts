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
    { href: 'things-to-do.html', label: 'For Erin →' },
  ],
  lodging: [
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'travel.html', label: 'Travel →' },
    { href: 'rental.html', label: 'Rental →' },
  ],
  hikes: [
    { href: 'things-to-do.html#viewpoints', label: 'Viewpoints →' },
    { href: 'things-to-do.html#activities', label: 'Activities →' },
    { href: 'things-to-do.html#towns', label: 'Towns →' },
  ],
  'things-to-do': [
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'wa20-status.html#driving-cascades', label: 'Driving →' },
    { href: 'lodging.html', label: 'Lodging →' },
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
    { href: 'pre-trip.html#bring', label: 'Bring list →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'things-to-do.html', label: 'For Erin →' },
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
  notes: [
    { href: './', label: 'Home →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'things-to-do.html', label: 'For Erin →' },
  ],
  costs: [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'rental.html', label: 'Rental →' },
    { href: 'pre-trip.html', label: 'Pre-trip →' },
  ],
  'pre-trip': [
    { href: 'costs.html', label: 'Costs →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'pre-trip.html#bring', label: 'Bring list →' },
  ],
  'hidden-gems': [
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'wa20-status.html#driving-cascades', label: 'Driving →' },
  ],
  map: [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'wa20-status.html#driving-cascades', label: 'Driving →' },
  ],
  'weather-plan-c': [
    { href: 'pre-trip.html', label: 'Pre-trip →' },
    { href: 'wa20-status.html#driving-cascades', label: 'Driving →' },
    { href: 'hikes.html', label: 'Hikes →' },
  ],
  // Placeholder for search-overlay (parallel agent owns its mapping).
  search: [
    { href: './', label: 'Home →' },
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'hikes.html', label: 'Hikes →' },
  ],
  'wa20-status': [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'pre-trip.html', label: 'Pre-trip →' },
    { href: './', label: 'Home →' },
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

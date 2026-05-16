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
    { href: 'food.html', label: 'Food →' },
  ],
  hikes: [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'travel.html', label: 'Travel →' },
    { href: 'food.html', label: 'Food →' },
  ],
  travel: [
    { href: 'lodging.html', label: 'Lodging →' },
    { href: 'hikes.html', label: 'Hikes →' },
    { href: 'seattle.html', label: 'Seattle →' },
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

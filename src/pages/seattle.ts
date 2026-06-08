/**
 * seattle.ts — optional Seattle bookend.
 *
 * What to do with a few hours on either end. Not part of the core trip.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderSeattle } from '../sections/seattle';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'seattle',
    title: 'Seattle bookends',
    lede: 'Optional — what to do with a few hours before or after the park.',
    imageHero: {
      // Replaced 2026-05-17 — previous photo-1502175353174-a7a1d3f2c1f5 was 404 on Unsplash.
      src: 'img/unsplash-1503551723145-6c040742065b.jpg',
      alt: 'Seattle skyline with the Space Needle at dusk',
      credit: 'Photo: Unsplash',
      ctaLabel: 'See the stops',
      ctaHref: '#seattle',
    },
  });

  main.append(renderSeattle(), renderPageCtas('seattle'));
}

mount();

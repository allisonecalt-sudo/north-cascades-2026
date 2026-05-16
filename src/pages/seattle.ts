/**
 * seattle.ts — optional Seattle bookend.
 *
 * What to do with a few hours on either end. Not part of the core trip.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderSeattle } from '../sections/seattle';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'seattle',
    title: 'Seattle bookends',
    lede: 'Optional — what to do with a few hours before or after the park.',
    imageHero: {
      src: 'https://images.unsplash.com/photo-1502175353174-a7a1d3f2c1f5?auto=format&fit=crop&w=1920&q=70',
      alt: 'Seattle skyline with the Space Needle at dusk',
      credit: 'Photo: Stephen Plopper / Unsplash',
      ctaLabel: 'See the stops',
      ctaHref: '#seattle',
    },
  });

  main.append(renderSeattle(), renderPageCtas('seattle'));
  attachNotesToAllSections(main);
}

mount();

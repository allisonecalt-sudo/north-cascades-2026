/**
 * lodging.ts — full lodging deep-dive page.
 *
 * West + East tabs, all 2-bed cabins, splurge/not-fit/basic in disclosures.
 * Filters automatically to the active path if one is selected.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderLodging, renderLodgingSearchGuide } from '../sections/lodging';
import { renderCoolSleepingPlaces } from '../sections/cool-sleeping-places';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'lodging',
    title: 'Where we sleep',
    lede: 'Real cabin options for each base. 2 beds, 1-2 bedrooms, ~$200-300. Nature-immersed picks lead.',
    imageHero: {
      // Re-swapped May 17, 2026 (7:40 AM IDT) — Allison reported "no hero
      // image" on the live site. Prior URL returned 200 in curl but may have
      // hit Unsplash CDN issues. Switching to one of the verified-bulletproof
      // photo-fix-agent IDs (the carousel-deck replacement that's known good
      // across every other lodging card).
      src: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1920&q=70',
      alt: 'Wooden cabin deck in summer light, forest behind',
      credit: 'Photo: Unsplash',
      ctaLabel: 'See the cabins',
      ctaHref: '#lodging',
    },
  });

  main.append(
    renderLodgingSearchGuide(),
    renderLodging(),
    renderCoolSleepingPlaces(),
    renderPageCtas('lodging')
  );
  attachNotesToAllSections(main);
}

mount();

/**
 * lodging.ts — lodging page.
 *
 * Leads with the three BOOKED stays (all kept until Allison + Erin pick one).
 * The old West/East comparison + search guide sit below as a collapsed
 * reference layer.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderLodging, renderLodgingSearchGuide } from '../sections/lodging';
import { renderCoolSleepingPlaces } from '../sections/cool-sleeping-places';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'lodging',
    title: 'Where we\'re staying — booked',
    verifiedOn: '2026-05-21 (lodging booked — three reservations held)',
    lede:
      'Booked. Three Airbnbs are reserved for Aug 16 → 20, all on the west side: Arlington (Allison) plus two in Sedro-Woolley — the "Lakeside Cabin w/ Dock" (Allison) and "The Carriage House" (Erin). All held for now — pick one and cancel the rest before the free-cancellation windows close.',
    imageHero: {
      // Re-re-swapped May 17, 2026 (8:13 AM IDT) — prior URL loaded fine but
      // depicted a tropical beach resort, not PNW. Switching to the Diablo
      // Lake Wikimedia image already used by the costs page (verified
      // bulletproof + actually depicts North Cascades).
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Diablo_Lake_%28Washington_State%29.jpg/1920px-Diablo_Lake_%28Washington_State%29.jpg',
      alt: 'Diablo Lake turquoise water with surrounding North Cascades peaks',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the cabins',
      ctaHref: '#lodging',
    },
  });

  // Lodging Owner pass (2026-05-17): re-ordered cards-first. The search-guide
  // is a reference resource, not above-the-fold value. It loads collapsed by
  // default now (see renderLodgingSearchGuide).
  main.append(
    renderLodging(),
    renderCoolSleepingPlaces(),
    renderLodgingSearchGuide(),
    renderPageCtas('lodging')
  );
}

mount();

/**
 * rental.ts — dedicated page for the rental-car deep dive.
 *
 * Why split: rental section was 5,435px (~55% of the entire travel page on
 * mobile). Pulling it onto its own URL lets Travel breathe (flights + logistics
 * only) and gives the rental decision its own context — multiple cars, multiple
 * insurance shapes, the Cascade River Rd gravel disclosure, verified quotes.
 *
 * Lifted from Austria's nav-consolidation pattern (the Logistics hub page
 * approach) — instead of cramming heavy decision surfaces inside a parent
 * page, give them their own URL.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderRental } from '../sections/rental';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'rental',
    title: 'Rental car',
    verifiedOn: '2026-05-17 (Costco SEA Compact SUV top pick)',
    lede: 'Automatic, gas or hybrid, all-in pricing (CDW/LDW + SLI bundled). Top pick + decision matrix + sortable comparison + 10 best-practice obsessions + at-pickup checklist. Quotes verified May 16, 2026; research log refreshed May 17.',
    imageHero: {
      src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=70',
      alt: 'Compact SUV on an empty mountain highway',
      credit: 'Photo: Paul Gilmore / Unsplash',
      ctaLabel: 'See the cars',
      ctaHref: '#rental',
    },
  });

  main.append(renderRental(), renderPageCtas('rental'));
  attachNotesToAllSections(main);
}

mount();

/**
 * lodging.ts — lodging page.
 *
 * ONE job: compare the three BOOKED stays and pick one (all kept until Allison
 * + Erin decide). The booked-stay cards lead. Everything below them is a
 * reference layer, in decreasing relevance:
 *   1. renderLodging()            — the 3 booked stays (the decision) + the
 *                                   pre-booking comparison, already collapsed.
 *   2. renderCoolSleepingPlaces() — inspiration catalog (mostly not bookable
 *                                   for these dates). Browse-only, not a pick.
 *   3. renderLodgingSearchGuide() — "how to search" playbook. Reference only.
 * Cuts/links so each fact is said once; deadlines live on the cards, not the
 * lede.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderLodging, renderLodgingSearchGuide } from '../sections/lodging';
import { renderCoolSleepingPlaces } from '../sections/cool-sleeping-places';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'lodging',
    title: '3 booked stays — pick one',
    verifiedOn: '2026-05-21 (lodging booked — three reservations held)',
    // Lede states the page's ONE job; it does NOT repeat the cards. The
    // free-cancellation deadlines + "cancel the rest" detail already live in
    // the booked-stays warning banner and on each card — say it once there.
    lede: 'All three hold the same dates. Compare below, then keep one.',
    imageHero: {
      // Re-re-swapped May 17, 2026 (8:13 AM IDT) — prior URL loaded fine but
      // depicted a tropical beach resort, not PNW. Switching to the Diablo
      // Lake Wikimedia image already used by the costs page (verified
      // bulletproof + actually depicts North Cascades).
      src: 'img/diablo-lake-washington-state.jpg',
      alt: 'Diablo Lake turquoise water with surrounding North Cascades peaks',
      credit: 'Photo: Wikimedia · CC',
      // The page's single primary action: jump to the 3 booked-stay cards.
      ctaLabel: 'Compare the 3 stays',
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

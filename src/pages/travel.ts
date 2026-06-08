/**
 * travel.ts — flights + logistics.
 *
 * Rental moved to its own page (`rental.html`) to reduce the travel-page
 * height from ~9,967 px to a focused flight-decision surface. The split
 * mirrors Austria's "Logistics hub" pattern.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderFlights } from '../sections/flights';
import { renderLogistics } from '../sections/logistics';
import { renderPageCtas } from '../sections/page-ctas';
import { h, section } from '../dom';

function renderRentalPointer(): HTMLElement {
  // Tiny pointer so Travel readers know the rental deep-dive has its own page.
  // Keep it to one line + link — the specs (automatic, fuel, quotes, gravel
  // notes) live on rental.html; repeating them here is duplicate content.
  return section(
    'rental-pointer',
    'Rental car',
    h(
      'p',
      { class: 'section__lede' },
      'Car has its own page — quotes, fuel choice, and the Cascade River Rd gravel notes.'
    ),
    h(
      'a',
      { class: 'page-ctas__link', href: 'rental.html', style: 'max-width: 320px;' },
      'Open rental car →'
    )
  );
}

function mount(): void {
  const main = mountPageShell({
    pageId: 'travel',
    title: 'Flights and logistics',
    lede: 'Flights are booked: United, EWR ⇄ SEA. Travel-day logistics below; rental car has its own page.',
    imageHero: {
      // Unsplash — wing-over-clouds banner. Brand-neutral aviation aesthetic.
      src: 'img/unsplash-1436491865332-7a61a109cc05.jpg',
      alt: 'Airplane wing over a layer of clouds at altitude',
      credit: 'Photo: Ross Parmly / Unsplash',
      ctaLabel: 'See the booked flights',
      ctaHref: '#flights',
    },
  });

  main.append(
    renderFlights(),
    renderRentalPointer(),
    renderLogistics(),
    renderPageCtas('travel')
  );
}

mount();

/**
 * travel.ts — flights + logistics.
 *
 * Rental moved to its own page (`rental.html`) to reduce the travel-page
 * height from ~9,967 px to a focused flight-decision surface. The split
 * mirrors Austria's "Logistics hub" pattern.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderFlights } from '../sections/flights';
import { renderLogistics } from '../sections/logistics';
import { renderPageCtas } from '../sections/page-ctas';
import { h, section } from '../dom';

function renderRentalPointer(): HTMLElement {
  // Tiny pointer so Travel readers know the rental deep-dive moved.
  return section(
    'rental-pointer',
    'Rental car',
    h(
      'p',
      { class: 'section__lede' },
      'Moved to its own page — automatic, gas or hybrid, verified all-in quotes, Cascade River Rd gravel notes.'
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
    lede: 'Real flight options + travel-day logistics. Rental car lives on its own page.',
  });

  main.append(
    renderFlights(),
    renderRentalPointer(),
    renderLogistics(),
    renderPageCtas('travel')
  );
  attachNotesToAllSections(main);
}

mount();

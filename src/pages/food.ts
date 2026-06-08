/**
 * food.ts — kosher-decentered food strategy.
 *
 * Cook from cabin, pick groceries before you drive in, treat-meal options
 * that don't compromise the keep-it-kosher default.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderFood } from '../sections/food';
import { renderRestaurants } from '../sections/restaurants';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'food',
    title: 'Groceries + kosher notes',
    lede: 'Food is not a thing on this trip — both keep kosher, both cook. Grocery stop in Seattle, cook from the cabin, done. This page is just the reference.',
    imageHero: {
      // Unsplash — cabin kitchen with wood + warm light.
      src: 'img/unsplash-1556910103-1c02745aae4d.jpg',
      alt: 'Rustic kitchen counter with wood, ceramic, and warm window light',
      credit: 'Photo: Becca Tapert / Unsplash',
      ctaLabel: 'See the plan',
      ctaHref: '#food',
    },
  });

  // Consolidation (2026-06-02): the standalone "Details" page was retired; its
  // restaurants section (id="restaurants") now lives here alongside groceries.
  main.append(renderFood(), renderRestaurants(), renderPageCtas('food'));
}

mount();

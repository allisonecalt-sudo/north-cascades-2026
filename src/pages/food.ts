/**
 * food.ts — the canonical grocery + kosher reference for the trip.
 *
 * Composes: renderFood() (kosher explainer + shopping plan + costs) and
 * renderRestaurants() (kosher-only sit-down picks). The kosher explainer is
 * stated ONCE here and nowhere else on the site — this page owns it.
 *
 * Page type = Reference: lede + hero CTA front-load the plan (buy in Seattle,
 * cook from cabin) in scannable form; the section data carries the detail.
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
    lede: 'Big stock-up in Seattle Day 1 · cook from the cabin · mid-trip top-ups en route.',
    imageHero: {
      // Unsplash — cabin kitchen with wood + warm light.
      src: 'img/unsplash-1556910103-1c02745aae4d.jpg',
      alt: 'Rustic kitchen counter with wood, ceramic, and warm window light',
      credit: 'Photo: Becca Tapert / Unsplash',
      ctaLabel: 'Shopping plan + costs',
      ctaHref: '#food',
    },
  });

  // Consolidation (2026-06-02): the standalone "Details" page was retired; its
  // restaurants section (id="restaurants") now lives here alongside groceries.
  main.append(renderFood(), renderRestaurants(), renderPageCtas('food'));
}

mount();

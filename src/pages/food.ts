/**
 * food.ts — kosher-decentered food strategy.
 *
 * Cook from cabin, pick groceries before you drive in, treat-meal options
 * that don't compromise the keep-it-kosher default.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderFood } from '../sections/food';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'food',
    title: 'Food strategy',
    lede: 'Cook from the cabin. Groceries on the drive in. No non-kosher restaurants.',
    imageHero: {
      // Unsplash — cabin kitchen with wood + warm light.
      src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=70',
      alt: 'Rustic kitchen counter with wood, ceramic, and warm window light',
      credit: 'Photo: Becca Tapert / Unsplash',
      ctaLabel: 'See the plan',
      ctaHref: '#food',
    },
  });

  main.append(renderFood(), renderPageCtas('food'));
  attachNotesToAllSections(main);
}

mount();

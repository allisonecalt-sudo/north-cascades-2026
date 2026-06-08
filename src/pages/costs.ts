/**
 * costs.ts — budget page entrypoint.
 *
 * Per TRAVEL.md page inventory. Allison's May 16 ask: "also give range of
 * budget options" → 2 paths × 3 tiers (low/mid/high) all-in for 2 travelers.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderCosts } from '../sections/costs';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'costs',
    title: 'Budget — totals, splits, trims',
    verifiedOn: '2026-05-17',
    lede: 'Five-second read. Big totals, per-person shares, what is locked vs flexible, and concrete trim moves. USD, all-in, 2 travelers.',
    imageHero: {
      src: 'img/diablo-lake-washington-state.jpg',
      alt: 'Diablo Lake with turquoise glacier-flour water and surrounding peaks',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the numbers',
      ctaHref: '#costs',
    },
  });

  main.append(renderCosts(), renderPageCtas('costs'));
}

mount();

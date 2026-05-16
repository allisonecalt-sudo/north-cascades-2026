/**
 * costs.ts — budget page entrypoint.
 *
 * Per TRAVEL.md page inventory. Allison's May 16 ask: "also give range of
 * budget options" → 3 paths × 3 tiers (low/mid/high) all-in for 2 travelers.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderCosts } from '../sections/costs';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'costs',
    title: 'Budget — totals, splits, trims',
    lede: 'Five-second read. Big totals, per-person shares, what is locked vs flexible, and concrete trim moves. USD, all-in, 2 travelers.',
    imageHero: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Diablo_Lake_%28Washington_State%29.jpg/1920px-Diablo_Lake_%28Washington_State%29.jpg',
      alt: 'Diablo Lake with turquoise glacier-flour water and surrounding peaks',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the numbers',
      ctaHref: '#costs',
    },
  });

  main.append(renderCosts(), renderPageCtas('costs'));
  attachNotesToAllSections(main);
}

mount();

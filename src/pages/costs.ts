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
    title: 'Budget — three paths, three tiers',
    lede: 'Total trip cost for 2 travelers. Verified May 16 quotes (flights, rental, lodging). Pick a path above; the active path highlights here.',
  });

  main.append(renderCosts(), renderPageCtas('costs'));
  attachNotesToAllSections(main);
}

mount();

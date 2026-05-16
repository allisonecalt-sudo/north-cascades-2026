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
  });

  main.append(renderFood(), renderPageCtas('food'));
  attachNotesToAllSections(main);
}

mount();

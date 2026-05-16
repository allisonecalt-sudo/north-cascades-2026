/**
 * seattle.ts — optional Seattle bookend.
 *
 * What to do with a few hours on either end. Not part of the core trip.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderSeattle } from '../sections/seattle';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'seattle',
    title: 'Seattle bookends',
    lede: 'Optional — what to do with a few hours before or after the park.',
  });

  main.append(renderSeattle(), renderPageCtas('seattle'));
  attachNotesToAllSections(main);
}

mount();

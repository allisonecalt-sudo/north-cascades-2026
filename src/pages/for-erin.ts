/**
 * for-erin.ts — open decisions Erin should weigh in on.
 *
 * The decision surface — what's still in motion, what's locked, what's
 * waiting on her.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderForErin } from '../sections/for-erin';
import { renderTowns } from '../sections/towns';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'for-erin',
    title: 'For Erin',
    lede: 'Open decisions — what we still need to lock together. Leave 💬 notes anywhere.',
  });

  main.append(renderForErin(), renderTowns(), renderPageCtas('for-erin'));
  attachNotesToAllSections(main);
}

mount();

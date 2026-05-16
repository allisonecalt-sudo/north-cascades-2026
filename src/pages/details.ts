/**
 * details.ts — overflow page for everything else.
 *
 * Activities, restaurants, bring list, decisions log. Each is short on its
 * own; grouped here to keep the primary nav at 8 pages.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderActivities } from '../sections/activities';
import { renderRestaurants } from '../sections/restaurants';
import { renderBring } from '../sections/bring';
import { renderDecisions } from '../sections/decisions';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'details',
    title: 'Details',
    lede: 'Activities, restaurants, bring list, decisions log — the long tail.',
  });

  main.append(
    renderActivities(),
    renderRestaurants(),
    renderBring(),
    renderDecisions(),
    renderPageCtas('details')
  );
  attachNotesToAllSections(main);
}

mount();

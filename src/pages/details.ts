/**
 * details.ts — overflow page for everything else.
 *
 * Restaurants, bring list, decisions log. Each is short on its own; grouped
 * here to keep the primary nav at 8 pages. Activities lifted out to their own
 * top-level page on 2026-05-17 per Allison's live-site note ("Add activities
 * and also a lot of missing photos") — readers couldn't find them buried here.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderRestaurants } from '../sections/restaurants';
import { renderBring } from '../sections/bring';
import { renderDecisions } from '../sections/decisions';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'details',
    title: 'Details',
    lede: 'Restaurants, bring list, decisions log — the long tail. (Activities live on their own page now.)',
  });

  main.append(
    renderRestaurants(),
    renderBring(),
    renderDecisions(),
    renderPageCtas('details')
  );
}

mount();

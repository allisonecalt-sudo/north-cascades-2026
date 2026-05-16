/**
 * home.ts — landing page entry.
 *
 * The landing's job: 30-second comprehension. Path picker as the centerpiece,
 * map, overview, and CTAs to the deeper pages. Heavy detail (lodging cards,
 * hike grid) moves to dedicated pages.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderPaths } from '../sections/paths';
import { renderMap } from '../sections/map';
import { renderOverview } from '../sections/overview';
import { renderItinerary } from '../sections/itinerary';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'home',
    title: 'North Cascades · Aug 16-20',
    lede: 'Five days, two scenic bases, easy-to-moderate hikes. Pick a path below — the rest of the site filters to it.',
    showClosure: true,
  });

  main.append(
    renderPaths(),
    renderMap(),
    renderOverview(),
    renderItinerary(),
    renderPageCtas('home')
  );

  attachNotesToAllSections(main);
}

mount();

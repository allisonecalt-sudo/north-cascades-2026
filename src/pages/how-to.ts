/**
 * how-to.ts — "How to do this trip" decision-tree page entrypoint.
 *
 * Allison's exact ask (2026-05-17): *"this one should be giving possible
 * paths — how to do the trip."* Then: *"what do you think is best."*
 *
 * The master decision-tree surface. Given the trip's constraints (5 days, 2
 * travelers, kosher kitchen required, WA-20 mid-corridor under repair), walk
 * through the realistic ways to do it. Lives alongside the path picker on home
 * + the interactive map. Story-arc nav position: between Stay and Do.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderHowTo } from '../sections/how-to';
import { renderPageCtas } from '../sections/page-ctas';
import { HOW_TO_PAGE_META } from '../data/how-to';

function mount(): void {
  const main = mountPageShell({
    pageId: 'how-to',
    title: 'How to do this trip',
    lede: HOW_TO_PAGE_META.lede,
    imageHero: {
      // Diablo Lake from the WA-20 overlook — the spine viewpoint the trip is
      // built around. CC BY-SA via Wikimedia. HEAD-verified pattern matches
      // other site heroes (Wikimedia Special:FilePath pattern in use on
      // weather-plan-c).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_from_WA-20_overlook.jpg?width=1920',
      alt: 'Turquoise glacier-fed Diablo Lake seen from the WA-20 overlook in North Cascades National Park — the spine viewpoint of the trip.',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the paths',
      ctaHref: '#how-to',
    },
  });

  main.append(renderHowTo(), renderPageCtas('how-to'));
  attachNotesToAllSections(main);
}

mount();

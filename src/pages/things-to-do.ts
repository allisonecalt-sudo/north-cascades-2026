/**
 * things-to-do.ts — merged "Things to Do" page entrypoint.
 *
 * Consolidation (2026-06-02): the four standalone pages Activities, Lakes &
 * water, Top sunsets, and Viewpoints were retired and folded here as stacked
 * sections. Each kept its original renderer + section id, so every inbound
 * deep-link anchor (#activities, #lakes, #top-sunsets, #viewpoints) carries
 * over unchanged — only the page filename moved to things-to-do.html.
 *
 * Section ids on this page (anchor targets):
 *   #activities · #lakes · #top-sunsets · #viewpoints
 *
 * Note: hikes.ts keeps the COMPACT renderViewpoints() (WA-20 milepost strip) —
 * this page uses the rich renderViewpointsGallery() instead. Both read the same
 * data/viewpoints.ts file.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderActivities } from '../sections/activities';
import { renderLakes } from '../sections/lakes';
import { renderTopSunsets } from '../sections/top-sunsets';
import { renderViewpointsGallery } from '../sections/viewpoints';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'things-to-do',
    title: 'Things to Do',
    verifiedOn: '2026-05-17',
    lede: 'Activities, lakes & water, viewpoints, and sunsets — everything beyond the hikes, in one place. Pick by energy on the day.',
    imageHero: {
      // Diablo Lake — turquoise summer water, proven Wikimedia URL reused from
      // the retired activities/viewpoints pages.
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
      alt: 'Diablo Lake glowing turquoise in summer — the water draw of the corridor.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      ctaLabel: 'Browse activities',
      ctaHref: '#activities',
    },
  });

  main.append(
    renderActivities(),
    renderLakes(),
    renderTopSunsets(),
    renderViewpointsGallery(),
    renderPageCtas('things-to-do')
  );
}

mount();

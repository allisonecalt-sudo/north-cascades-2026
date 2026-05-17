/**
 * activities.ts — top-level page for non-hike things to do.
 *
 * Promoted from a buried Details sub-section on 2026-05-17 per Allison's
 * live-site note: *"Add activities and also a lot of missing photos."* —
 * readers couldn't find activities because the nav didn't surface them.
 *
 * Mirrors hikes.ts: editorial image hero (Diablo Lake turquoise summer
 * water — no snow), lede, then the renderActivities() body with carousels,
 * filter chips, and per-category groupings.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderActivities } from '../sections/activities';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'activities',
    title: 'Activities & water',
    verifiedOn: '2026-05-17',
    lede: 'Paddle, swim, bike, town walks, wildlife windows — what to do beyond the hikes. Pick by energy on the day.',
    imageHero: {
      // Diablo Lake — turquoise summer water, no snow on the lake itself.
      // Same Wikimedia file used on hikes / viewpoints / top-sunsets — proven URL.
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
      alt: 'Diablo Lake glowing turquoise in summer — the water draw of the corridor.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      ctaLabel: 'Browse activities',
      ctaHref: '#activities',
    },
  });

  main.append(renderActivities(), renderPageCtas('activities'));
  attachNotesToAllSections(main);
}

mount();

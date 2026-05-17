/**
 * viewpoints.ts — dedicated /viewpoints page bootstrap.
 *
 * Buildout May 17, 2026 per Allison brief: *"Could destinations use more
 * beefing up? Reference austria"*. Viewpoints are the drive-up postcard
 * spots — distinct from hikes which require walking. High value for Erin
 * because she's not a high-mileage hiker (see feedback_erin_travel_planning).
 *
 * Mirrors hikes.ts: editorial image hero, lede, then the
 * renderViewpointsGallery() body with carousels, filter chips, and per-
 * corridor groupings (WA-20 · Mt. Baker · Methow).
 *
 * The compact WA-20-milepost timeline that lives on the Hikes page is the
 * SAME data file (`data/viewpoints.ts`) but a different renderer
 * (`renderViewpoints()` — kept untouched). This page uses the rich
 * VIEWPOINT_DESTINATIONS array.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderViewpointsGallery } from '../sections/viewpoints';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'viewpoints',
    title: 'Viewpoints — drive-up postcards',
    lede: 'The places you can reach by car (or a sub-10-minute walk). Diablo Lake, Washington Pass, Picture Lake, Artist Point — the postcards.',
    imageHero: {
      // Diablo Lake — turquoise summer water, proven URL (already in use on
      // hikes / activities / driving-cascades pages).
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
      alt: 'Diablo Lake from the WA-20 overlook — turquoise glacier-flour water and forested peaks in summer.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      ctaLabel: 'Browse viewpoints',
      ctaHref: '#viewpoints',
    },
  });

  main.append(renderViewpointsGallery(), renderPageCtas('viewpoints'));
  attachNotesToAllSections(main);
}

mount();

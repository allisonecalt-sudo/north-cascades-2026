/**
 * hikes.ts — hikes + viewpoints + sky-watching, the "what to actually do".
 *
 * Path-aware: shows hikes that pair with the selected path's bases.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderHikes } from '../sections/hikes';
import { renderViewpoints } from '../sections/viewpoints';
import { renderSky } from '../sections/sky';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'hikes',
    title: 'Hikes, viewpoints, and sky',
    verifiedOn: '2026-05-17 (Wave 4 — destination research + WA-20 chip)',
    lede: 'Easy-to-moderate only — no scrambling, no big-mileage days. Trailhead facts, distance, elevation.',
    imageHero: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Maple_Pass_Loop%2C_North_Cascades.jpg/1920px-Maple_Pass_Loop%2C_North_Cascades.jpg',
      alt: 'Maple Pass Loop with alpine larches and ridgeline views in the North Cascades',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the hikes',
      ctaHref: '#hikes',
    },
  });

  main.append(renderHikes(), renderViewpoints(), renderSky(), renderPageCtas('hikes'));
}

mount();

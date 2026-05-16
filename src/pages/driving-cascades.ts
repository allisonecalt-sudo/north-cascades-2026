/**
 * driving-cascades.ts — Cascades driving primer page entrypoint.
 *
 * WA-20 closure status, Cascade River Rd gravel + rental contract gotcha,
 * Stevens Pass detour math, cell dead zones, wildlife, gas-station spacing,
 * fire/smoke contingency. US-trip carve-outs (no IDP, no vignette).
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderDrivingCascades } from '../sections/driving-cascades';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'driving-cascades',
    title: 'Driving in the Cascades',
    lede: 'WA-20 closure, Cascade River Rd gravel, Stevens Pass detour, cell dead zones, gas spacing, wildlife, fire/smoke.',
    imageHero: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Washington_Highway_20_North_Cascades.jpg',
      alt: 'Washington Highway 20 winding through the North Cascades',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the driving notes',
      ctaHref: '#driving-cascades',
    },
  });

  main.append(renderDrivingCascades(), renderPageCtas('driving-cascades'));
  attachNotesToAllSections(main);
}

mount();

/**
 * hikes.ts — hikes + viewpoints + sky-watching, the "what to actually do".
 *
 * Path-aware: shows hikes that pair with the selected path's bases.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderHikes } from '../sections/hikes';
import { renderViewpoints } from '../sections/viewpoints';
import { renderSky } from '../sections/sky';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'hikes',
    title: 'Hikes, viewpoints, and sky',
    lede: 'Easy-to-moderate only — no scrambling, no big-mileage days. Trailhead facts, distance, elevation.',
  });

  main.append(renderHikes(), renderViewpoints(), renderSky(), renderPageCtas('hikes'));
  attachNotesToAllSections(main);
}

mount();

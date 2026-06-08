/**
 * map.ts — dedicated full-page map entry.
 *
 * The map section also renders on the home page (in compact form). This page
 * gives the map the full height of the viewport so it can act as the trip's
 * spatial cockpit — preview each drive route, click any pin for
 * full-screen-friendly details.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderMap } from '../sections/map';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'map',
    title: 'Where everything is',
    lede: 'Every stay, trailhead, and viewpoint on one map.',
    imageHero: {
      // Diablo Lake — the corridor signature, turquoise glacier-flour.
      src: 'img/diablo-lake-washington-state.jpg',
      alt: 'Turquoise Diablo Lake in North Cascades National Park, ringed by steep forested ridges',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'Open the map',
      ctaHref: '#map',
    },
  });

  main.append(
    renderMap({
      tall: true,
      pageId: 'map',
      // One-line orientation only. The legend (bottom-right), layer toggles
      // (top-right), and the context-strip hint already explain pins, layers,
      // and route chips inside the map — so prose above it stays minimal. The
      // WA-20 closure is drawn on the map and lives in full on wa20-status.html;
      // don't repeat the June-25 detail here.
      gist: ['Tap a route chip to draw a drive. Click any pin for details. Legend + layer toggles are on the map.'],
    }),
    renderPageCtas('map')
  );
}

mount();

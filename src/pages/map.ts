/**
 * map.ts — dedicated full-page map entry.
 *
 * The map section also renders on the home page (in compact form). This page
 * gives the map the full height of the viewport so it can act as the trip's
 * spatial cockpit — pick a path, see the actual drive route, click any pin
 * for full-screen-friendly details.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderMap } from '../sections/map';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'map',
    title: 'Interactive map - paths, pins, drives',
    lede: 'Pick a path to see the actual drive route across the corridor. Click any pin for photos, drive times, and similar places.',
    imageHero: {
      // Diablo Lake — the corridor signature, turquoise glacier-flour.
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Diablo_Lake_-_North_Cascades_National_Park.jpg/1920px-Diablo_Lake_-_North_Cascades_National_Park.jpg',
      alt: 'Turquoise Diablo Lake in North Cascades National Park, ringed by steep forested ridges',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'Open the map',
      ctaHref: '#map',
    },
  });

  main.append(renderMap({ tall: true, pageId: 'map' }), renderPageCtas('map'));
  attachNotesToAllSections(main);
}

mount();

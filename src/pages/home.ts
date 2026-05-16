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
import { renderStatRow } from '../sections/stat-row';
import { renderPeakMoment } from '../sections/peak-moment';
import { h } from '../dom';

function mount(): void {
  const main = mountPageShell({
    pageId: 'home',
    title: 'Big alpine views, balanced pace, back to the cabin by sunset.',
    lede: 'Five days, two scenic bases, easy-to-moderate hikes. Pick a path below — the rest of the site filters to it.',
    showClosure: true,
    imageHero: {
      // Cascade Pass / Sahale Arm — Pelton Peak + Yawning Glacier + Magic
      // Mountain. CC BY 2.0 Daniel Hershman, 2007. Brand-fit: glacial palette.
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Cascade_pass.jpg/1920px-Cascade_pass.jpg',
      alt: 'Pelton Peak, Yawning Glacier, and Magic Mountain seen from the Sahale Arm above Cascade Pass in North Cascades National Park',
      credit: 'Photo: Daniel Hershman / Wikimedia · CC BY 2.0',
      ctaLabel: 'Choose a path',
      ctaHref: '#paths',
    },
  });

  // Stat-row sits in its own framed band so it visually bridges the hero
  // and the path picker without colliding with either.
  const statBand = h(
    'div',
    { class: 'stat-band' },
    h('div', { class: 'stat-band__inner' }, renderStatRow())
  );

  main.append(
    statBand,
    renderPaths(),
    renderPeakMoment(),
    renderMap(),
    renderOverview(),
    renderItinerary(),
    renderPageCtas('home')
  );

  attachNotesToAllSections(main);
}

mount();

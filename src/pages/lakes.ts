/**
 * lakes.ts — top-level page for the 6 lakes + water destinations.
 *
 * Built 2026-05-17 in response to Allison's *"Could destinations use more
 * beefing up? Reference austria"* note. Austria split its water content into
 * dedicated `lake-swimming.html` + `water-activities.html` pages. NC's version
 * collapses them into a single destination page because the corridor only has
 * ~6 lakes and they vary on the same axes (swim Y/N, rental availability,
 * side of the corridor) — one page, one filter chip bar, six carousel cards.
 *
 * Editorial image hero — Pearrygin Lake (warm-water swim story for August)
 * lands the lede right. NOT Diablo (Diablo is on Activities + Hikes + Sunsets
 * already — over-used).
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderLakes } from '../sections/lakes';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'lakes',
    title: 'Lakes & water',
    verifiedOn: '2026-05-17',
    lede: 'Pearrygin to swim, Diablo to look at, Ross by water taxi, Patterson by kayak. Six destinations with photos, rental phone numbers, and drive-times from every base.',
    imageHero: {
      // Pearrygin Lake — warm swim story, the August headline.
      // Wikimedia-verified URL also used in data/activities.ts and data/lakes.ts.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pearrygin_Lake_State_Park.jpg?width=1600',
      alt: 'Pearrygin Lake State Park — calm green water and Methow hills in summer.',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'Browse lakes',
      ctaHref: '#lakes',
    },
  });

  main.append(renderLakes(), renderPageCtas('lakes'));
  attachNotesToAllSections(main);
}

mount();

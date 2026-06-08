/**
 * hidden-gems.ts — top-level page for "beyond the marquee" destinations.
 *
 * Wave 3 #11 from `projects/north-cascades-2026/README.md`. Same "wow filter"
 * as Austria's stunning-hunt. Mirrors hikes.ts mount pattern: image hero
 * (Sahale Arm ridge, summer / no snow), lede, then the renderHiddenGems()
 * body with carousels + chip filters + per-card source links.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderHiddenGems } from '../sections/hidden-gems';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'hidden-gems',
    title: 'Hidden gems — beyond the marquee',
    verifiedOn: '2026-05-17',
    lede:
      'Lesser-known wow per drive-minute. Each card shows the catch (road · permit · status) and the drive from each base.',
    imageHero: {
      // Sahale Glacier Camp sunrise — wow / summer / no snow on the ridge.
      // Used to set the tone: this page is the "stunning hunt" tier.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mountain%20view%20from%20Sahale%20Glacier%20Camp%20%283c95838731d24c2b91cedafcf3e0c6f3%29.JPG?width=1600',
      alt: 'Sunrise from Sahale Glacier Camp — the wow tier this page is aimed at.',
      credit: 'Photo: NPS · public domain (Wikimedia)',
      ctaLabel: 'Browse hidden gems',
      ctaHref: '#hidden-gems',
    },
  });

  main.append(renderHiddenGems(), renderPageCtas('hidden-gems'));
}

mount();

/**
 * towns.ts (page) — corridor town profiles.
 *
 * Promoted to top-level page May 17, 2026 per Allison live-note:
 *   *"Could destinations use more beefing up? Reference austria"*
 * Erin profile: *"happy to visit towns if interesting."*
 *
 * Mirrors hikes.ts / activities.ts: editorial image hero (Winthrop Old-West
 * boardwalk — the most visually-distinct corridor town, summer light),
 * lede, then renderTowns() body with 5 rich carousel cards.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderTowns } from '../sections/towns';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'towns',
    title: 'Towns along the corridor',
    verifiedOn: '2026-05-17',
    lede:
      'Five WA-20 corridor stops — character, walkable streets, shops, NPS visitor centers. Not a restaurant page (kosher self-cater is the food plan). These are vibe stops between hikes.',
    imageHero: {
      // Winthrop boardwalk — most visually-distinct town on the route, proven URL
      // (HEAD-verified May 17, 2026: 200, image/jpeg, 358 KB).
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Winthrop%2C_USA_%2819801491829%29.jpg/1280px-Winthrop%2C_USA_%2819801491829%29.jpg',
      alt: 'Winthrop main street — Old-West wooden boardwalks, false-front buildings, mountain backdrop in summer.',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'Browse towns',
      ctaHref: '#towns',
    },
  });

  main.append(renderTowns(), renderPageCtas('towns'));
}

mount();

/**
 * pre-trip.ts — pre-trip milestone-checklist page entrypoint.
 *
 * Rebuilt 2026-05-17 PM: this is now the booking-week / pre-departure trigger
 * page Allison opens. 10 date-anchored milestones (flights Jun 1, lodging
 * Jun 15, WSDOT Jun 25, recheck Jun 28, lodging-firm Jul 1, rental Jul 15,
 * kosher + park-pass + kitchen Aug 2, WSDOT-final Aug 14, pack Aug 14-15,
 * day-of Aug 16) grouped into 5 phases, each with concrete subtasks and
 * per-subtask localStorage state. Milestone facts live in data/pre-trip.ts.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderPreTrip } from '../sections/pre-trip';
import { renderBring } from '../sections/bring';
import { renderDecisions } from '../sections/decisions';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'pre-trip',
    title: 'Pre-trip checklist',
    lede: 'First due: flights, Jun 1. Last: departure, Aug 16.',
    imageHero: {
      src: 'img/unsplash-1452421822248-d4c2b47f0c81.jpg',
      alt: 'Hiking gear, boots, and a packed backpack laid out on a wooden floor',
      credit: 'Photo: Holly Mandarich / Unsplash',
      ctaLabel: 'Jump to milestones',
      ctaHref: '#pre-trip',
    },
  });

  // Consolidation (2026-06-02): the standalone "Details" page was retired; its
  // bring list (id="bring") + decisions log (id="decisions") now live here.
  // Inbound details.html#bring links point to pre-trip.html#bring.
  main.append(
    renderPreTrip(),
    renderBring(),
    renderDecisions(),
    renderPageCtas('pre-trip')
  );
}

mount();

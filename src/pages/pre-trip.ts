/**
 * pre-trip.ts — pre-trip milestone-checklist page entrypoint.
 *
 * Rebuilt 2026-05-17 PM: this is now the booking-week / pre-departure trigger
 * page Allison opens. 10 date-anchored milestones (lodging Jun 15, WSDOT
 * Jun 25, flights Jul 10, rental Jul 15, kosher Aug 2, kitchen Aug 2, final
 * WSDOT Aug 14, pack Aug 14-15, day-of Aug 16) grouped into 5 phases, each
 * with concrete subtasks and per-subtask localStorage state.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderPreTrip } from '../sections/pre-trip';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'pre-trip',
    title: 'Pre-trip checklist',
    lede: '10 milestones, 5 phases — from lodging book-by (Jun 15) through day-of departure (Aug 16). Tick subtasks off as you go; state is saved to your device.',
    imageHero: {
      src: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1920&q=70',
      alt: 'Hiking gear, boots, and a packed backpack laid out on a wooden floor',
      credit: 'Photo: Holly Mandarich / Unsplash',
      ctaLabel: 'Jump to milestones',
      ctaHref: '#pre-trip',
    },
  });

  main.append(renderPreTrip(), renderPageCtas('pre-trip'));
  attachNotesToAllSections(main);
}

mount();

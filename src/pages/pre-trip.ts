/**
 * pre-trip.ts — countdown checklist page entrypoint.
 *
 * localStorage-backed checkbox state. 7 groups, ~27 tasks. Banner countdown
 * to Aug 16, 2026 + windows-open-now / overdue / future tagging per task.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderPreTrip } from '../sections/pre-trip';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'pre-trip',
    title: 'Pre-trip checklist',
    lede: 'Countdown + checkbox state saved to your device. Re-open any time; what you checked stays checked.',
    imageHero: {
      src: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1920&q=70',
      alt: 'Hiking gear, boots, and a packed backpack laid out on a wooden floor',
      credit: 'Photo: Holly Mandarich / Unsplash',
      ctaLabel: 'Start the checklist',
      ctaHref: '#pre-trip',
    },
  });

  main.append(renderPreTrip(), renderPageCtas('pre-trip'));
  attachNotesToAllSections(main);
}

mount();

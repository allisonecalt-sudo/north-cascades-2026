/**
 * top-sunsets.ts — ranked sunsets page entrypoint.
 *
 * Erin sleeps earlier; sunset is Allison's solo wind-down. 7 spots ranked
 * with access-from-base, view-direction, allison-fit framing, source links.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderTopSunsets } from '../sections/top-sunsets';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'top-sunsets',
    title: 'Top sunsets — ranked',
    lede: "Erin goes to bed earlier than you. Sunset is your window. 7 spots ranked — porch picks lead.",
  });

  main.append(renderTopSunsets(), renderPageCtas('top-sunsets'));
  attachNotesToAllSections(main);
}

mount();

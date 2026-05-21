/**
 * top-sunsets.ts — ranked sunsets page entrypoint.
 *
 * Erin sleeps earlier; sunset is Allison's solo wind-down. 7 spots ranked
 * with access-from-base, view-direction, allison-fit framing, source links.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderTopSunsets } from '../sections/top-sunsets';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'top-sunsets',
    title: 'Sunsets — bonus, not centerpiece',
    lede: "Not a sunset-focused trip. But Erin's in bed by ~8 PM and Allison's solo wind-down can land on a porch with a view. Sunset-having lodgings are flagged on the Lodging page — this page is the deeper list for the curious.",
  });

  main.append(renderTopSunsets(), renderPageCtas('top-sunsets'));
}

mount();

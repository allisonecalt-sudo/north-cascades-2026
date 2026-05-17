/**
 * search.ts — standalone /search.html page.
 *
 * Most users will hit search via Cmd/Ctrl + / on any page (the overlay mounts
 * itself via `page-shell.ts`). But if someone lands on /search.html directly —
 * shared link, bookmark, opened in a new tab — they should see a usable search
 * interface, not an empty shell.
 *
 * This page mounts the standard shell, then renders the same search modal
 * INLINE inside the main column (not as a floating overlay). Cmd+/ still works
 * everywhere; on this specific page the overlay is suppressed via
 * `document.body.dataset.searchSkip = 'true'` inside `mountInlineSearch()`.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { mountInlineSearch, indexedCount } from '../sections/search-overlay';
import { renderPageCtas } from '../sections/page-ctas';
import { h, section } from '../dom';

function buildIntro(): HTMLElement {
  return section(
    'search-intro',
    'Search the whole trip',
    h(
      'p',
      { class: 'search-intro__lede' },
      'Type a place, lodging, hike, or town. Results group by kind and link straight to the right page. Tip: press ',
      h('kbd', {}, 'Cmd'),
      ' / ',
      h('kbd', {}, 'Ctrl'),
      ' + ',
      h('kbd', {}, '/'),
      ' on any page to pop this open as a modal.'
    ),
    h(
      'p',
      { class: 'search-intro__meta' },
      `Indexing ${indexedCount()} entries — every lodging, hike, viewpoint, lake, town, hidden gem, activity, sunset spot, Seattle stop, kosher restaurant, and top-level page.`
    )
  );
}

function mount(): void {
  const main = mountPageShell({
    pageId: 'search',
    title: 'Search',
    lede: 'One box, everything on the site.',
  });

  // Intro first so the inline modal has context.
  main.append(buildIntro());

  // Inline-mount the search panel. Suppresses the floating overlay on this
  // page (the page-shell still tries to init it — the overlay module
  // self-skips because mountInlineSearch sets `data-search-skip`).
  const host = h('section', { class: 'section', id: 'search-inline-host' });
  main.append(host);
  mountInlineSearch(host);

  main.append(renderPageCtas('search'));
}

mount();

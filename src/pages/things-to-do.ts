/**
 * things-to-do.ts — merged "Things to Do" page entrypoint.
 *
 * Consolidation (2026-06-02): the four standalone pages Activities, Lakes &
 * water, Top sunsets, and Viewpoints were retired and folded here as stacked
 * sections. Each kept its original renderer + section id, so every inbound
 * deep-link anchor (#activities, #lakes, #top-sunsets, #viewpoints) carries
 * over unchanged — only the page filename moved to things-to-do.html.
 *
 * Section ids on this page (anchor targets):
 *   #activities · #lakes · #top-sunsets · #viewpoints
 *
 * Note: hikes.ts keeps the COMPACT renderViewpoints() (WA-20 milepost strip) —
 * this page uses the rich renderViewpointsGallery() instead. Both read the same
 * data/viewpoints.ts file.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { h } from '../dom';
import { renderActivities } from '../sections/activities';
import { renderLakes } from '../sections/lakes';
import { renderTopSunsets } from '../sections/top-sunsets';
import { renderViewpointsGallery } from '../sections/viewpoints';
import { renderPageCtas } from '../sections/page-ctas';

/** Wrap a merged section in a collapsible group so the page isn't a long wall.
 *  The section keeps its own id/anchors inside; openHashTarget() expands the
 *  right group when a deep link (#activities, #lakes, #sunset-2, …) is followed. */
function group(label: string, el: HTMLElement, open = false): HTMLElement {
  const attrs: Record<string, string> = { class: 'ttd-group' };
  if (open) attrs.open = '';
  return h('details', attrs, h('summary', { class: 'ttd-group__summary' }, label), el);
}

/** Open whichever collapsible group contains the current hash target. */
function openHashTarget(): void {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  const det = target?.closest('details');
  if (det instanceof HTMLDetailsElement) det.open = true;
  target?.scrollIntoView();
}

function mount(): void {
  const main = mountPageShell({
    pageId: 'things-to-do',
    title: 'Things to Do',
    verifiedOn: '2026-05-17',
    lede: 'Activities, lakes & water, viewpoints, and sunsets — everything beyond the hikes, in one place. Tap a group to open it; pick by energy on the day.',
    imageHero: {
      // Diablo Lake — turquoise summer water, proven Wikimedia URL reused from
      // the retired activities/viewpoints pages.
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
      alt: 'Diablo Lake glowing turquoise in summer — the water draw of the corridor.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      ctaLabel: 'Browse activities',
      ctaHref: '#activities',
    },
  });

  main.append(
    group('Activities', renderActivities(), true),
    group('Lakes & water', renderLakes()),
    group('Top sunsets', renderTopSunsets()),
    group('Viewpoints', renderViewpointsGallery()),
    renderPageCtas('things-to-do')
  );

  // Deep links / in-page anchors must reveal a collapsed group before scrolling.
  window.addEventListener('hashchange', openHashTarget);
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
    if (!(a instanceof HTMLAnchorElement)) return;
    const id = decodeURIComponent(a.getAttribute('href')?.slice(1) ?? '');
    const det = id ? document.getElementById(id)?.closest('details') : null;
    if (det instanceof HTMLDetailsElement) det.open = true;
  });
  openHashTarget();
}

mount();

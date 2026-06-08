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
import { renderTowns } from '../sections/towns';
import { renderPageCtas } from '../sections/page-ctas';
import { ACTIVITIES } from '../data/activities';
import { LAKES } from '../data/lakes';
import { TOP_SUNSETS } from '../data/top-sunsets';
import { VIEWPOINT_DESTINATIONS } from '../data/viewpoints';
import { TOWNS } from '../data/towns';

/** Wrap a merged section in a collapsible group so the page isn't a long wall.
 *  The summary is a tap-to-open menu row: label + live count + one-line scope,
 *  so she can pick a category without expanding all four. Count is read from the
 *  data at runtime — never hardcoded, never stale.
 *  The section keeps its own id/anchors inside; openHashTarget() expands the
 *  right group when a deep link (#activities, #lakes, #sunset-2, …) is followed. */
function group(label: string, count: number, hint: string, el: HTMLElement): HTMLElement {
  // Inline styling keeps the summary legible without a shared-CSS edit; the
  // .ttd-group__{label,count,hint} classes are also emitted so the styles can be
  // lifted into sections.css later (see returned note).
  return h(
    'details',
    { class: 'ttd-group' },
    h(
      'summary',
      { class: 'ttd-group__summary' },
      h('span', { class: 'ttd-group__label' }, label),
      h(
        'span',
        {
          class: 'ttd-group__count',
          style:
            'margin-left: 0.55rem; font-weight: 600; font-size: 0.82rem; padding: 0.05rem 0.5rem; border-radius: 999px; background: rgba(31,59,42,0.08); color: var(--c-ink-500, #4a5650);',
        },
        String(count)
      ),
      h(
        'span',
        {
          class: 'ttd-group__hint',
          style:
            'margin-left: 0.7rem; font-weight: 400; font-size: 0.86rem; color: var(--c-ink-500, #6a7570); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
        },
        hint
      )
    ),
    el
  );
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
    lede: 'Everything beyond the hikes. Tap a group to open it — pick by energy on the day.',
    imageHero: {
      // Diablo Lake — turquoise summer water, proven Wikimedia URL reused from
      // the retired activities/viewpoints pages.
      src: 'img/diablo-lake-from-overlook-03.jpg',
      alt: 'Diablo Lake glowing turquoise in summer — the water draw of the corridor.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      ctaLabel: 'Browse activities',
      ctaHref: '#activities',
    },
  });

  main.append(
    group('Activities', ACTIVITIES.length, 'Paddle · swim · bike', renderActivities()),
    group('Lakes & water', LAKES.length, 'Swim · rentals · drives', renderLakes()),
    group('Top sunsets', TOP_SUNSETS.length, 'Ranked + timing', renderTopSunsets()),
    group('Viewpoints', VIEWPOINT_DESTINATIONS.length, 'Drive-up overlooks', renderViewpointsGallery()),
    group('Towns', TOWNS.length, 'Stops + groceries', renderTowns()),
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

/**
 * page-shell.ts — shared multi-page chrome.
 *
 * Lifted from Austria 2026's pattern: every page mounts the same sticky nav,
 * the same compact hero strip, and the same footer. The single-page mega-scroll
 * was the digestibility crisis (38k px, ~6k words, 18 sections in one route).
 * Multi-page splits the same content across focused routes so each landing has
 * one job.
 *
 * What it does:
 *   - mountPageShell({ pageId, title }) — finds <body>, prepends a global nav,
 *     a compact page header, mounts a #page-main container, and a footer.
 *   - All pages share the SAME nav so the path-filter state (URL hash +
 *     localStorage) survives navigation untouched.
 *   - Closure banner only renders on the landing page (it's load-bearing on the
 *     decision surface, distraction elsewhere).
 *
 * NEW MOUNTING PATTERN:
 *   const main = mountPageShell({ pageId: 'lodging', title: 'Where we sleep' });
 *   main.append(renderLodging());
 */

import { TRIP } from './data/trip';
import { CLOSURE_ALERT } from './data/closure';
import { h } from './dom';
import { initNotesModal, attachNotesButton, refreshBadges } from './sections/notes-button';
import { attachBackToTop } from './sections/back-to-top';
import { getSelectedPath, setSelectedPath, subscribeSelectedPath } from './state/path';
import { TRIP_PATHS } from './data/paths';

export type PageId =
  | 'home'
  | 'lodging'
  | 'hikes'
  | 'travel'
  | 'food'
  | 'seattle'
  | 'for-erin'
  | 'details';

interface NavEntry {
  id: PageId;
  href: string;
  label: string;
}

// One nav, eight pages. Order matches the canonical decision flow:
// Home → who/what/where → Lodging → Hikes → Travel → Food → Seattle → For Erin → Details.
const NAV: readonly NavEntry[] = [
  { id: 'home', href: './', label: 'Home' },
  { id: 'lodging', href: 'lodging.html', label: 'Lodging' },
  { id: 'hikes', href: 'hikes.html', label: 'Hikes' },
  { id: 'travel', href: 'travel.html', label: 'Travel' },
  { id: 'food', href: 'food.html', label: 'Food' },
  { id: 'seattle', href: 'seattle.html', label: 'Seattle' },
  { id: 'for-erin', href: 'for-erin.html', label: 'For Erin' },
  { id: 'details', href: 'details.html', label: 'Details' },
];

interface ShellOptions {
  pageId: PageId;
  /** Page-specific title (rendered as <h1> in the page header). */
  title: string;
  /** Optional subtitle / one-line lede shown under the title. */
  lede?: string;
  /** Show the WA-20 closure banner in the page header (true only on Home). */
  showClosure?: boolean;
  /** Hide the page header entirely (e.g. the home page uses a full hero). */
  hidePageHeader?: boolean;
}

function buildNav(activeId: PageId): HTMLElement {
  return h(
    'nav',
    { class: 'site-nav', 'aria-label': 'Site sections' },
    h(
      'div',
      { class: 'site-nav__inner' },
      h(
        'a',
        { class: 'site-nav__brand', href: NAV[0]?.href ?? './' },
        h('span', { class: 'site-nav__brand-name' }, 'North Cascades'),
        h('span', { class: 'site-nav__brand-dates' }, 'Aug 16-20')
      ),
      h(
        'ul',
        { class: 'site-nav__list' },
        ...NAV.map((entry) =>
          h(
            'li',
            { class: 'site-nav__item' },
            h(
              'a',
              {
                class: `site-nav__link${entry.id === activeId ? ' site-nav__link--active' : ''}`,
                href: entry.href,
                'aria-current': entry.id === activeId ? 'page' : undefined,
              },
              entry.label
            )
          )
        )
      )
    )
  );
}

function buildClosureBanner(): HTMLElement {
  return h(
    'details',
    {
      class: 'closure-banner closure-banner--inline',
      role: 'group',
      'aria-label': 'WA-20 road status',
    },
    h(
      'summary',
      { class: 'closure-banner__summary' },
      h('span', { class: 'closure-banner__icon', 'aria-hidden': 'true' }, '⚠'),
      h(
        'span',
        { class: 'closure-banner__summary-text' },
        h('strong', {}, 'WA-20 currently CLOSED through the park.'),
        ' WSDOT target reopen: ',
        h('strong', {}, 'July 4, 2026'),
        '. The 3 paths assume worst case.'
      )
    ),
    h(
      'div',
      { class: 'closure-banner__body' },
      h('p', { class: 'closure-banner__detail' }, CLOSURE_ALERT.detail),
      h('p', { class: 'closure-banner__target' }, CLOSURE_ALERT.target),
      h(
        'a',
        {
          class: 'closure-banner__link',
          href: CLOSURE_ALERT.liveStatusUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Live WSDOT status →'
      )
    )
  );
}

function buildPageHeader(opts: ShellOptions): HTMLElement | null {
  if (opts.hidePageHeader) return null;
  return h(
    'header',
    { class: 'page-header' },
    h(
      'div',
      { class: 'page-header__inner' },
      h('p', { class: 'page-header__eyebrow' }, `${TRIP.travelers} · ${TRIP.dates}`),
      h('h1', { class: 'page-header__title' }, opts.title),
      opts.lede ? h('p', { class: 'page-header__lede' }, opts.lede) : null,
      buildPathIndicator(),
      opts.showClosure ? buildClosureBanner() : null
    )
  );
}

/**
 * Path indicator — shows the active path on every page so users always know
 * what they're filtered to. Tiny pill with the path letter + name, plus a
 * "Clear" link that drops back to compare-all.
 */
function buildPathIndicator(): HTMLElement {
  const wrap = h('div', { class: 'page-header__path-indicator', hidden: true });
  const refresh = (): void => {
    const current = getSelectedPath();
    if (!current) {
      wrap.hidden = true;
      return;
    }
    const path = TRIP_PATHS.find((p) => p.id === current);
    const label = path ? path.name.replace(`Path ${current} · `, '') : current;
    wrap.hidden = false;
    wrap.replaceChildren(
      h('span', { class: 'page-header__path-pill' }, `Path ${current} · ${label}`),
      h(
        'button',
        {
          type: 'button',
          class: 'page-header__path-clear',
          'data-action': 'clear-path',
        },
        'Show all'
      )
    );
  };
  refresh();
  subscribeSelectedPath(refresh);
  wrap.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset['action'] !== 'clear-path') return;
    setSelectedPath(null);
  });
  return wrap;
}

function buildFooter(): HTMLElement {
  return h(
    'footer',
    { class: 'site-footer' },
    h(
      'div',
      { class: 'site-footer__inner' },
      h(
        'p',
        {},
        `Researched ${TRIP.researchedOn}. Re-verify road status, prices, and trail conditions closer to booking.`
      ),
      h('p', { class: 'site-footer__meta' }, 'v5 · multi-page digestibility pass · May 16, 2026'),
      h('a', { href: './', class: 'site-footer__back' }, '← Back to home')
    )
  );
}

/**
 * Mount the shell into <body>, return the <main> element to fill with the
 * page's actual content.
 *
 * Order: nav → page-header (or hero) → main → footer.
 * Also mounts the global notes modal + back-to-top button.
 */
export function mountPageShell(opts: ShellOptions): HTMLElement {
  const body = document.body;
  // Skip-link is in index.html already, leave it alone.
  const main = h('main', { class: 'page-main', id: 'page-main' });
  const header = buildPageHeader(opts);
  const fragments: (HTMLElement | null)[] = [buildNav(opts.pageId), header, main, buildFooter()];
  for (const el of fragments) {
    if (el) body.appendChild(el);
  }

  initNotesModal();
  void refreshBadges();
  attachBackToTop();

  return main;
}

/**
 * After all sections are appended to <main>, call this to wire each section
 * with its 💬 notes button. Skips meta sections like the bottom CTA strip.
 */
const NO_NOTES_SECTIONS = new Set(['next']);

export function attachNotesToAllSections(main: HTMLElement): void {
  const sections = main.querySelectorAll<HTMLElement>('section[id]');
  sections.forEach((sec) => {
    if (NO_NOTES_SECTIONS.has(sec.id)) return;
    attachNotesButton(sec);
  });
  void refreshBadges();
}

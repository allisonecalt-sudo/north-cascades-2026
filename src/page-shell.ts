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
import { initGlobalFab } from './sections/global-fab';
import { attachBackToTop } from './sections/back-to-top';
import { showWelcomePopup } from './sections/welcome-popup';
import { getSelectedPath, setSelectedPath, subscribeSelectedPath } from './state/path';
import { TRIP_PATHS } from './data/paths';

export type PageId =
  | 'home'
  | 'lodging'
  | 'hikes'
  | 'viewpoints'
  | 'activities'
  | 'lakes'
  | 'towns'
  | 'travel'
  | 'rental'
  | 'food'
  | 'seattle'
  | 'for-erin'
  | 'details'
  | 'notes'
  | 'costs'
  | 'top-sunsets'
  | 'pre-trip'
  | 'driving-cascades'
  | 'hidden-gems';

interface NavEntry {
  id: PageId;
  href: string;
  label: string;
}

// One nav, 14 pages. Order matches the canonical decision flow:
// Home → Lodging → Hikes → Travel → Rental → Driving → Costs → Pre-trip
// → Seattle → For Erin → Details → Groceries → Notes.
// Sunsets demoted from main nav May 17, 2026 — Allison: *"not a big sunset trip…
// sleeping where there is nature and amazing sunset could be really good idea
// because erin doesnt stay out as late."* Sunset = lodging perk, not trip spine.
// Page still builds (sunset-having lodging links there) but isn't a nav peer.
// Food demoted + renamed to "Groceries" 2026-05-17 — Allison: *"AGAIN FOOD not
// so importnat we easily buy and maek food not so hard."* Both kosher, both
// cook, full-kitchen lodging = food is solved by grocery+cook. Page stays for
// reference but moved near the end of nav. See [[feedback_food_not_central_to_trips]].
const NAV: readonly NavEntry[] = [
  { id: 'home', href: './', label: 'Home' },
  { id: 'lodging', href: 'lodging.html', label: 'Lodging' },
  { id: 'hikes', href: 'hikes.html', label: 'Hikes' },
  { id: 'viewpoints', href: 'viewpoints.html', label: 'Viewpoints' },
  { id: 'activities', href: 'activities.html', label: 'Activities' },
  { id: 'lakes', href: 'lakes.html', label: 'Lakes' },
  { id: 'towns', href: 'towns.html', label: 'Towns' },
  { id: 'travel', href: 'travel.html', label: 'Travel' },
  { id: 'rental', href: 'rental.html', label: 'Rental' },
  { id: 'driving-cascades', href: 'driving-cascades.html', label: 'Driving' },
  { id: 'costs', href: 'costs.html', label: 'Costs' },
  { id: 'pre-trip', href: 'pre-trip.html', label: 'Pre-trip' },
  { id: 'seattle', href: 'seattle.html', label: 'Seattle' },
  { id: 'for-erin', href: 'for-erin.html', label: 'For Erin' },
  { id: 'details', href: 'details.html', label: 'Details' },
  // Hidden Gems lives near the bottom — exploratory tier, not the locked trip
  // spine. Wave 3 #11 from `projects/north-cascades-2026/README.md`.
  { id: 'hidden-gems', href: 'hidden-gems.html', label: 'Hidden gems' },
  { id: 'food', href: 'food.html', label: 'Groceries' },
  { id: 'notes', href: 'notes.html', label: 'Notes' },
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
  /**
   * If set, replaces the gradient page-header with an editorial image hero —
   * Wikimedia photo, dark overlay, eyebrow + title + lede + closure banner +
   * an inline CTA pill. Lifted from Austria's landing pattern. Used on home.
   */
  imageHero?: {
    src: string;
    /** Description for screen readers + alt fallback. */
    alt: string;
    /** Photo credit line shown bottom-right (small, low contrast). */
    credit: string;
    /** Optional CTA shown under the lede (anchor link). */
    ctaLabel?: string;
    ctaHref?: string;
  };
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
        'div',
        { class: 'site-nav__list-wrap' },
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
      ),
      h(
        'p',
        {
          class: 'closure-banner__detail',
          style: 'font-size: 0.78rem; margin-top: 0.6rem; padding: 0.5rem 0.6rem; background: #fdecec; border: 1px solid #c4393a; color: #6d1a1b; border-radius: 6px;',
        },
        h('strong', {}, 'Conflict — verify before booking week: '),
        'NPS road-conditions page (May 6, 2026 update) lists "Expected reopening: April or early May (weather-dependent)" while WSDOT target above says July 4. Both sources are stale in different directions. Confirm by phone — WSDOT 1-800-695-7623 — before locking the week.'
      ),
      h(
        'p',
        {
          class: 'closure-banner__detail',
          style: 'font-size: 0.72rem; opacity: 0.82; margin-top: 0.6rem; font-style: italic;',
        },
        'Source: WSDOT North Cascades Highway live status · verified May 15, 2026. Re-check before Aug 1.'
      )
    )
  );
}

function buildPageHeader(opts: ShellOptions): HTMLElement | null {
  if (opts.hidePageHeader) return null;
  if (opts.imageHero) return buildImageHero(opts);
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
 * buildImageHero — Austria-lifted editorial image hero.
 * Wikimedia photo full-bleed, dark gradient overlay, content stacked at the
 * bottom (dates pill → headline → lede → CTA). The closure banner sits below
 * the hero in a tinted band so it doesn't fight the photo for attention.
 */
function buildImageHero(opts: ShellOptions): HTMLElement {
  const hero = opts.imageHero;
  if (!hero) {
    // Type guard — caller passed imageHero, but TS narrows. Should not reach.
    return h('header', { class: 'page-header' });
  }
  return h(
    'div',
    { class: 'image-hero-wrap' },
    h(
      'header',
      { class: 'image-hero', role: 'banner' },
      h('img', {
        class: 'image-hero__img',
        src: hero.src,
        alt: hero.alt,
        loading: 'eager',
        decoding: 'async',
      }),
      h(
        'div',
        { class: 'image-hero__overlay' },
        h(
          'div',
          { class: 'image-hero__inner' },
          h('span', { class: 'image-hero__dates' }, TRIP.dates),
          h('h1', { class: 'image-hero__title' }, opts.title),
          opts.lede ? h('p', { class: 'image-hero__lede' }, opts.lede) : null,
          hero.ctaLabel && hero.ctaHref
            ? h(
                'a',
                { class: 'image-hero__cta', href: hero.ctaHref },
                hero.ctaLabel,
                h('span', { 'aria-hidden': 'true' }, ' ↓')
              )
            : null
        )
      ),
      h('span', { class: 'image-hero__credit' }, hero.credit)
    ),
    // Path indicator + closure banner ride in a tinted band BELOW the photo
    // so the hero stays cinematic. Band always renders so the path indicator
    // can appear later (via subscription) without re-mounting the shell.
    h(
      'div',
      { class: 'image-hero-band' },
      h(
        'div',
        { class: 'image-hero-band__inner' },
        buildPathIndicator(),
        opts.showClosure ? buildClosureBanner() : null
      )
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
  initGlobalFab();
  void refreshBadges();
  attachBackToTop();
  attachNavFade(body);
  // First-visit explainer popup (Erin's intro to the 💬 mechanic).
  // Self-suppresses via localStorage after one show.
  showWelcomePopup();

  return main;
}

/**
 * Mobile nav fade — toggle the right-edge gradient off when the user has
 * scrolled to the end of the nav list. Lifted from Austria 2026 horizontal-
 * scroll patterns. Pure visual signal; doesn't affect functionality if it
 * fails (the nav already scrolls fine).
 */
function attachNavFade(body: HTMLElement): void {
  const list = body.querySelector<HTMLElement>('.site-nav__list');
  const wrap = body.querySelector<HTMLElement>('.site-nav__list-wrap');
  if (!list || !wrap) return;
  const update = (): void => {
    const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
    wrap.classList.toggle('site-nav__list-wrap--at-end', atEnd);
  };
  list.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // Run once on mount to catch the case where no overflow exists.
  setTimeout(update, 0);
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

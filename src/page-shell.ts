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
 * NAV — hybrid 3-flat + 3-dropdown IA (2026-05-17 PM, replacing 4-bucket
 *   all-dropdown shipped earlier the same day at f5a8b37).
 *
 *   Story-arc left-to-right reads the booking sequence:
 *     Stay → Do → Get there → Costs → For Erin → More
 *
 *   3 flat anchors (Stay · Costs · For Erin) put the SPINE pages one tap from
 *   anywhere. 3 dropdowns (Do · Get there · More) hold peer/reference content
 *   that's acceptable behind a click.
 *
 *   Desktop (>=720px): flat anchors render as direct <a>; dropdowns as button
 *     triggers with menu panels. Mobile (<720px): hamburger → slide-over from
 *     the right; flat anchors render as plain links, dropdowns as <details>
 *     with the active page's bucket auto-expanded.
 *   Breadcrumb under the nav: [Bucket] → [Page].
 *
 *   Strategy doc: projects/north-cascades-2026/NAV_STRATEGY_2026-05-17.md
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
import { initPicksFab } from './sections/picks-fab';
import { attachBackToTop } from './sections/back-to-top';
import { showWelcomePopup } from './sections/welcome-popup';
import { initSearchOverlay } from './sections/search-overlay';

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
  | 'hidden-gems'
  | 'map'
  | 'weather-plan-c'
  | 'search'
  | 'wa20-status'
  | 'how-to';

interface NavEntry {
  id: PageId;
  href: string;
  label: string;
  /** One-line description shown in dropdown panel + mobile slide-over. */
  desc?: string;
}

type BucketId = 'stay' | 'hikes' | 'map' | 'costs' | 'for-erin' | 'more';

/**
 * NavBucket — either:
 *   - kind: 'flat'     — renders as a single <a> top-level link
 *                        (entries has exactly 1 entry; label === entry.label)
 *   - kind: 'dropdown' — renders as a button + dropdown panel (desktop) /
 *                        <details> (mobile). entries can have many.
 *
 * The hybrid nav puts SPINE pages (Stay, Costs, For Erin) one tap from
 * anywhere via 'flat' buckets; reference content lives in 'dropdown' buckets
 * (Do, Get there, More).
 */
type NavBucket =
  | {
      kind: 'flat';
      id: BucketId;
      label: string;
      /** The single page this flat link represents (used for active state). */
      pageId: PageId;
      href: string;
    }
  | {
      kind: 'dropdown';
      id: BucketId;
      label: string;
      entries: readonly NavEntry[];
    };

/**
 * Lean 5-flat + 1-dropdown nav (declutter pass, 2026-05-21).
 *
 * Replaces the hybrid 3-flat + 3-dropdown nav (NAV_STRATEGY_2026-05-17.md). The
 * trip is booked, so the comparison-era IA (How to / Do / Get there buckets,
 * 13 linked pages) was over-built for a 4-night trip with one companion.
 * Allison: "trim everything that seems trimmable — we don't need it to be
 * overwhelming."
 *
 * Flat spine — one tap each:
 *   Stay (lodging) · Hikes · Map · Costs · For Erin
 * Plus ONE "More" dropdown for the still-useful secondary pages:
 *   Travel (flights) · Rental · Seattle · Groceries · Pre-trip
 *
 * De-surfaced (files KEPT, reachable by URL, just not linked in nav):
 *   Viewpoints, Lakes, Activities, Hidden gems, Top sunsets, Towns, How-to,
 *   Weather Plan C, Details, Notes, Driving, WA-20-status. Per Allison's
 *   "don't disappear → archive nicely → pullable when needed."
 *
 * The PageId union stays intact so those pages still build + are URL-reachable.
 */
const NAV_BUCKETS: readonly NavBucket[] = [
  {
    kind: 'flat',
    id: 'stay',
    label: 'Stay',
    pageId: 'lodging',
    href: 'lodging.html',
  },
  {
    kind: 'flat',
    id: 'hikes',
    label: 'Hikes',
    pageId: 'hikes',
    href: 'hikes.html',
  },
  {
    kind: 'flat',
    id: 'map',
    label: 'Map',
    pageId: 'map',
    href: 'map.html',
  },
  {
    kind: 'flat',
    id: 'costs',
    label: 'Costs',
    pageId: 'costs',
    href: 'costs.html',
  },
  {
    kind: 'flat',
    id: 'for-erin',
    label: 'For Erin',
    pageId: 'for-erin',
    href: 'for-erin.html',
  },
  {
    kind: 'dropdown',
    id: 'more',
    label: 'More',
    entries: [
      { id: 'travel', href: 'travel.html', label: 'Travel', desc: 'Flights + routings' },
      { id: 'rental', href: 'rental.html', label: 'Rental', desc: 'Car: automatic, all-in price' },
      { id: 'seattle', href: 'seattle.html', label: 'Seattle', desc: 'Day 1 + Day 5 anchor' },
      { id: 'food', href: 'food.html', label: 'Groceries', desc: 'Buy + cook the whole trip' },
      { id: 'pre-trip', href: 'pre-trip.html', label: 'Pre-trip', desc: 'Book-by dates + verifications' },
    ],
  },
];

/**
 * Flat lookup — bucket ID for any page, plus an entry-or-synthetic-entry per
 * page (flat buckets synthesise a 1-entry record so breadcrumb rendering can
 * stay uniform across both kinds).
 */
const PAGE_TO_BUCKET = new Map<PageId, BucketId>();
const PAGE_TO_ENTRY = new Map<PageId, NavEntry>();
for (const bucket of NAV_BUCKETS) {
  if (bucket.kind === 'flat') {
    PAGE_TO_BUCKET.set(bucket.pageId, bucket.id);
    PAGE_TO_ENTRY.set(bucket.pageId, {
      id: bucket.pageId,
      href: bucket.href,
      label: bucket.label,
    });
  } else {
    for (const entry of bucket.entries) {
      PAGE_TO_BUCKET.set(entry.id, bucket.id);
      PAGE_TO_ENTRY.set(entry.id, entry);
    }
  }
}
/**
 * Home is always reachable via the brand pill and isn't listed as its own nav
 * item in the hybrid IA. Tag it with a synthetic 'home' bucket so the
 * breadcrumb logic still has a record (the breadcrumb is suppressed on home
 * anyway, but other code paths read PAGE_TO_BUCKET defensively).
 */
PAGE_TO_BUCKET.set('home', 'stay'); // placeholder — home doesn't show a breadcrumb
PAGE_TO_ENTRY.set('home', { id: 'home', href: './', label: 'Home' });

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
   * Per-page verification date string (added 2026-05-17, plan item #8). Renders
   * in the footer as "Researched {verifiedOn} · Re-verify before booking week."
   *
   * Falls back to TRIP.researchedOn when omitted. Pages whose CONTENT carries
   * its own per-section verifiedOn (lodging, hikes, viewpoints, lakes,
   * activities, hidden-gems, towns, wa20-status) pass a representative date
   * here — a single global "researched on" line is a lie about which page's
   * facts are how old. Per-page verification is the fail-loud signal.
   */
  verifiedOn?: string;
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

/**
 * CROSS_PROMO — per-page "Related →" strip (added 2026-05-17, plan item #9).
 *
 * Each page maps to 3 sibling pages chosen for circulation: the bottom-of-page
 * exit is wasted real estate on a multi-page site. Path-filter state survives
 * navigation (NAV uses normal <a href> links), so cross-promo isn't dead-ending,
 * it's continuing the same filtered view.
 *
 * Chosen by hand, not algorithmic — each trio answers "if a reader finished
 * THIS page, what's the most useful next page?" Examples:
 *   - lodging → hikes/costs/map (what's nearby, what does it cost, where is it)
 *   - hikes → lodging/activities/viewpoints (where to sleep near them,
 *     non-hiking peer days, drive-up alternatives)
 *   - travel → rental/driving-cascades/costs (the transit chain)
 */
// Declutter pass (2026-05-21): targets are restricted to pages still in the
// nav (home, lodging, hikes, map, costs, for-erin, travel, rental, seattle,
// food, pre-trip) so cross-promo never dead-links to a de-surfaced page.
// De-surfaced source pages keep an entry (still URL-reachable) but point only
// at in-nav siblings.
const CROSS_PROMO: Record<PageId, readonly PageId[]> = {
  home: ['lodging', 'hikes', 'map'],
  lodging: ['hikes', 'costs', 'map'],
  hikes: ['lodging', 'map', 'costs'],
  activities: ['hikes', 'lodging', 'map'],
  viewpoints: ['hikes', 'map', 'lodging'],
  lakes: ['hikes', 'map', 'lodging'],
  'hidden-gems': ['hikes', 'map', 'lodging'],
  towns: ['lodging', 'seattle', 'map'],
  'top-sunsets': ['lodging', 'map', 'hikes'],
  travel: ['rental', 'seattle', 'costs'],
  rental: ['travel', 'seattle', 'costs'],
  'driving-cascades': ['travel', 'rental', 'map'],
  costs: ['lodging', 'rental', 'hikes'],
  'pre-trip': ['costs', 'lodging', 'travel'],
  seattle: ['travel', 'food', 'lodging'],
  'for-erin': ['home', 'lodging', 'hikes'],
  details: ['home', 'lodging', 'costs'],
  food: ['lodging', 'seattle', 'pre-trip'],
  notes: ['home', 'lodging', 'for-erin'],
  'how-to': ['lodging', 'map', 'costs'],
  'wa20-status': ['travel', 'map', 'pre-trip'],
  'weather-plan-c': ['pre-trip', 'hikes', 'map'],
  map: ['lodging', 'hikes', 'costs'],
  search: ['home', 'lodging', 'hikes'],
};

function buildNav(activeId: PageId): HTMLElement {
  const activeBucket = PAGE_TO_BUCKET.get(activeId);
  return h(
    'nav',
    { class: 'site-nav', 'aria-label': 'Site sections' },
    h(
      'div',
      { class: 'site-nav__inner' },
      h(
        'a',
        { class: 'site-nav__brand', href: './' },
        h('span', { class: 'site-nav__brand-name' }, 'North Cascades'),
        h('span', { class: 'site-nav__brand-dates' }, 'Aug 16-20')
      ),
      // Desktop: bucket buttons + flat links inline; mobile: hidden, hamburger
      // shown instead.
      h(
        'ul',
        { class: 'site-nav__buckets', role: 'menubar', 'aria-label': 'Site navigation' },
        ...NAV_BUCKETS.map((bucket) => {
          const isActive =
            bucket.kind === 'flat' ? bucket.pageId === activeId : activeBucket === bucket.id;
          return bucket.kind === 'flat'
            ? buildFlatLink(bucket, isActive)
            : buildBucketTrigger(bucket, activeId, isActive);
        })
      ),
      buildHamburger()
    )
  );
}

/** Desktop top-level FLAT link (Stay, Costs, For Erin). One tap, no dropdown. */
function buildFlatLink(
  bucket: Extract<NavBucket, { kind: 'flat' }>,
  isActive: boolean
): HTMLElement {
  return h(
    'li',
    { class: `site-nav__bucket${isActive ? ' site-nav__bucket--active' : ''}`, role: 'none' },
    h(
      'a',
      {
        class: `site-nav__flat-link${isActive ? ' site-nav__flat-link--active' : ''}`,
        href: bucket.href,
        role: 'menuitem',
        'aria-current': isActive ? 'page' : undefined,
        'data-bucket': bucket.id,
      },
      bucket.label
    )
  );
}

/** Desktop dropdown trigger + panel for a single bucket. */
function buildBucketTrigger(
  bucket: Extract<NavBucket, { kind: 'dropdown' }>,
  activeId: PageId,
  isActive: boolean
): HTMLElement {
  const btnId = `site-nav-btn-${bucket.id}`;
  const panelId = `site-nav-panel-${bucket.id}`;
  const btn = h(
    'button',
    {
      type: 'button',
      class: `site-nav__bucket-btn${isActive ? ' site-nav__bucket-btn--active' : ''}`,
      id: btnId,
      'aria-haspopup': 'true',
      'aria-expanded': 'false',
      'aria-controls': panelId,
      'data-bucket': bucket.id,
    },
    bucket.label,
    h('span', { class: 'site-nav__bucket-caret', 'aria-hidden': 'true' }, '▾')
  );
  const panel = h(
    'div',
    {
      class: 'site-nav__dropdown',
      id: panelId,
      role: 'menu',
      'aria-labelledby': btnId,
      hidden: true,
    },
    ...bucket.entries.map((entry) =>
      h(
        'a',
        {
          class: `site-nav__dropdown-link${entry.id === activeId ? ' site-nav__dropdown-link--active' : ''}`,
          href: entry.href,
          role: 'menuitem',
          'aria-current': entry.id === activeId ? 'page' : undefined,
        },
        h('span', { class: 'site-nav__dropdown-name' }, entry.label),
        entry.desc ? h('span', { class: 'site-nav__dropdown-desc' }, entry.desc) : null
      )
    )
  );
  return h(
    'li',
    { class: `site-nav__bucket${isActive ? ' site-nav__bucket--active' : ''}`, role: 'none' },
    btn,
    panel
  );
}

function buildHamburger(): HTMLElement {
  return h(
    'button',
    {
      type: 'button',
      class: 'site-nav__hamburger',
      'aria-label': 'Open menu',
      'aria-expanded': 'false',
      'aria-controls': 'site-nav-mobile',
      'data-action': 'open-mobile-nav',
    },
    h('span', { class: 'site-nav__hamburger-icon', 'aria-hidden': 'true' }, '☰')
  );
}

/**
 * Mobile slide-over panel — full-height drawer from the right. Flat buckets
 * render as direct links at the top; dropdown buckets render as <details>
 * below. The bucket containing the active page is auto-expanded.
 *
 * A "Home" link is pinned at the very top because the brand pill collapses
 * inside the hamburger context and we don't want home to require closing the
 * drawer first.
 */
function buildMobileNav(activeId: PageId): HTMLElement {
  const activeBucket = PAGE_TO_BUCKET.get(activeId);
  return h(
    'div',
    {
      class: 'site-nav__mobile',
      id: 'site-nav-mobile',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Site navigation',
      hidden: true,
    },
    h('div', { class: 'site-nav__mobile-backdrop', 'data-action': 'close-mobile-nav' }),
    h(
      'div',
      { class: 'site-nav__mobile-panel' },
      h(
        'div',
        { class: 'site-nav__mobile-header' },
        h('span', { class: 'site-nav__mobile-title' }, 'Menu'),
        h(
          'button',
          {
            type: 'button',
            class: 'site-nav__mobile-close',
            'aria-label': 'Close menu',
            'data-action': 'close-mobile-nav',
          },
          '×'
        )
      ),
      h(
        'div',
        { class: 'site-nav__mobile-body' },
        // Pinned Home link — keeps home reachable from inside the drawer.
        h(
          'a',
          {
            class: `site-nav__mobile-flat${activeId === 'home' ? ' site-nav__mobile-flat--active' : ''}`,
            href: './',
            'aria-current': activeId === 'home' ? 'page' : undefined,
          },
          h('span', { class: 'site-nav__mobile-name' }, 'Home'),
          h(
            'span',
            { class: 'site-nav__mobile-desc' },
            'The trip at a glance'
          )
        ),
        ...NAV_BUCKETS.map((bucket) => buildMobileBucket(bucket, activeId, activeBucket))
      )
    )
  );
}

/** Mobile bucket — flat = single link, dropdown = <details>. */
function buildMobileBucket(
  bucket: NavBucket,
  activeId: PageId,
  activeBucket: BucketId | undefined
): HTMLElement {
  if (bucket.kind === 'flat') {
    const isActive = bucket.pageId === activeId;
    return h(
      'a',
      {
        class: `site-nav__mobile-flat${isActive ? ' site-nav__mobile-flat--active' : ''}`,
        href: bucket.href,
        'aria-current': isActive ? 'page' : undefined,
      },
      h('span', { class: 'site-nav__mobile-name' }, bucket.label),
      h('span', { class: 'site-nav__mobile-desc' }, mobileFlatDesc(bucket.id))
    );
  }
  const open = bucket.id === activeBucket;
  const detailsAttrs: Record<string, string | boolean | undefined> = {
    class: 'site-nav__mobile-bucket',
  };
  if (open) detailsAttrs['open'] = true;
  return h(
    'details',
    detailsAttrs,
    h(
      'summary',
      { class: 'site-nav__mobile-summary' },
      h('span', { class: 'site-nav__mobile-bucket-label' }, bucket.label),
      h('span', { class: 'site-nav__mobile-bucket-caret', 'aria-hidden': 'true' }, '▾')
    ),
    h(
      'ul',
      { class: 'site-nav__mobile-list' },
      ...bucket.entries.map((entry) =>
        h(
          'li',
          { class: 'site-nav__mobile-item' },
          h(
            'a',
            {
              class: `site-nav__mobile-link${entry.id === activeId ? ' site-nav__mobile-link--active' : ''}`,
              href: entry.href,
              'aria-current': entry.id === activeId ? 'page' : undefined,
            },
            h('span', { class: 'site-nav__mobile-name' }, entry.label),
            entry.desc ? h('span', { class: 'site-nav__mobile-desc' }, entry.desc) : null
          )
        )
      )
    )
  );
}

function mobileFlatDesc(id: BucketId): string {
  switch (id) {
    case 'stay':
      return 'The booked stays + where to sleep';
    case 'hikes':
      return 'Signatures + alternates';
    case 'map':
      return 'Where everything is';
    case 'costs':
      return 'Budget ranges + breakdown';
    case 'for-erin':
      return 'Open decisions to weigh in on';
    default:
      return '';
  }
}

/**
 * Breadcrumb — low-contrast line.
 *
 * For dropdown-bucket pages: [Home › Bucket › Page] (e.g. Home › Do › Hikes).
 * For flat-bucket pages (Stay, Costs, For Erin): [Home › Page] — skipping
 * the redundant bucket layer because the bucket IS the page.
 * Suppressed on the home page (the hero already orients).
 */
function buildBreadcrumb(activeId: PageId): HTMLElement | null {
  if (activeId === 'home') return null;
  const bucketId = PAGE_TO_BUCKET.get(activeId);
  const entry = PAGE_TO_ENTRY.get(activeId);
  if (!bucketId || !entry) return null;
  const bucket = NAV_BUCKETS.find((b) => b.id === bucketId);
  if (!bucket) return null;
  const children: Array<HTMLElement | null> = [
    h('a', { class: 'breadcrumb__link', href: './' }, 'Home'),
    h('span', { class: 'breadcrumb__sep', 'aria-hidden': 'true' }, '›'),
  ];
  if (bucket.kind === 'dropdown') {
    children.push(
      h('span', { class: 'breadcrumb__bucket' }, bucket.label),
      h('span', { class: 'breadcrumb__sep', 'aria-hidden': 'true' }, '›')
    );
  }
  children.push(
    h('span', { class: 'breadcrumb__current', 'aria-current': 'page' }, entry.label)
  );
  return h(
    'nav',
    { class: 'breadcrumb', 'aria-label': 'Breadcrumb' },
    ...children
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
        h('strong', {}, 'June 25, 2026'),
        ' (pulled forward from July 4 after the May 13 second emergency contract). Both paths assume worst case.'
      )
    ),
    h(
      'div',
      { class: 'closure-banner__body' },
      h('p', { class: 'closure-banner__detail' }, CLOSURE_ALERT.detail),
      h('p', { class: 'closure-banner__target' }, CLOSURE_ALERT.target),
      h(
        'p',
        { class: 'closure-banner__links', style: 'margin: 0.4rem 0 0; display: flex; flex-wrap: wrap; gap: 0.6rem;' },
        h(
          'a',
          {
            class: 'closure-banner__link',
            href: 'wa20-status.html',
          },
          'WA-20 deep dive →'
        ),
        h(
          'a',
          {
            class: 'closure-banner__link',
            href: CLOSURE_ALERT.liveStatusUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Live WSDOT status ↗'
        )
      ),
      h(
        'p',
        {
          class: 'closure-banner__detail',
          style:
            'font-size: 0.78rem; margin-top: 0.6rem; padding: 0.5rem 0.6rem; background: #fdecec; border: 1px solid #c4393a; color: #6d1a1b; border-radius: 6px;',
        },
        h('strong', {}, 'Conflict — verify before booking week: '),
        'NPS road-conditions page (May 6, 2026 update) lists "Expected reopening: April or early May (weather-dependent)" while WSDOT target above says June 25. Both sources are stale in different directions. Confirm by phone — WSDOT 1-800-695-7623 — before locking the week. ',
        h('a', { href: 'wa20-status.html', class: 'closure-banner__link', style: 'font-weight: 600;' }, 'See sources + phone protocol →')
      ),
      h(
        'p',
        {
          class: 'closure-banner__detail',
          style: 'font-size: 0.72rem; opacity: 0.82; margin-top: 0.6rem; font-style: italic;',
        },
        'Source: WSDOT North Cascades Highway live status · verified May 17, 2026. Re-check before Aug 1.'
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
    // Closure banner rides in a tinted band BELOW the photo so the hero stays
    // cinematic. Only renders when showClosure is set (home page).
    opts.showClosure
      ? h(
          'div',
          { class: 'image-hero-band' },
          h('div', { class: 'image-hero-band__inner' }, buildClosureBanner())
        )
      : null
  );
}

/**
 * Last-sync date — kept inline (not derived) so site-wide updates only require
 * one edit. Bumped by Allison whenever the site is reshaped (NOT per-page
 * verifiedOn — that's the per-fact "when was this confirmed" trail).
 */
const LAST_SYNC = 'May 19, 2026';

function buildFooter(pageId: PageId, verifiedOn: string | undefined): HTMLElement {
  // Per-page verification date (plan item #8, 2026-05-17). Falls back to the
  // site-wide TRIP.researchedOn when a page doesn't pass its own date.
  const verifyDate = verifiedOn ?? TRIP.researchedOn;
  return h(
    'footer',
    { class: 'site-footer' },
    h(
      'div',
      { class: 'site-footer__inner' },
      h('a', { href: './', class: 'site-footer__back' }, '← Back to home'),
      buildCrossPromo(pageId),
      h(
        'p',
        { class: 'site-footer__verified' },
        h('em', {}, `Researched ${verifyDate} · Re-verify before booking week.`)
      ),
      h(
        'p',
        { class: 'site-footer__sync' },
        `Last sync: ${LAST_SYNC}`
      ),
      h(
        'p',
        { class: 'site-footer__tagline' },
        'Made by Allison + Claude for Erin'
      )
    )
  );
}

/**
 * buildCrossPromo — "Related → A · B · C" strip (plan item #9, 2026-05-17).
 * Renders 3 sibling-page text links separated by middle dots. Returns null
 * placeholder if the current page has no entry (defensive — every PageId is
 * mapped in CROSS_PROMO above, but TypeScript can't prove a future page won't
 * slip through).
 */
function buildCrossPromo(pageId: PageId): HTMLElement {
  const related = CROSS_PROMO[pageId] ?? [];
  if (related.length === 0) {
    return h('p', { class: 'site-footer__cross-promo', hidden: true });
  }
  const children: Array<HTMLElement | Text> = [
    h('span', { class: 'site-footer__cross-promo-label' }, 'Related → '),
  ];
  related.forEach((relId, idx) => {
    const entry = PAGE_TO_ENTRY.get(relId);
    if (!entry) return;
    if (idx > 0) {
      children.push(h('span', { class: 'site-footer__cross-promo-sep', 'aria-hidden': 'true' }, ' · '));
    }
    children.push(
      h(
        'a',
        { class: 'site-footer__cross-promo-link', href: entry.href },
        entry.label
      )
    );
  });
  return h('p', { class: 'site-footer__cross-promo' }, ...children);
}

/**
 * Mount the shell into <body>, return the <main> element to fill with the
 * page's actual content.
 *
 * Order: nav → breadcrumb → page-header (or hero) → main → footer.
 * Also mounts the global notes modal + back-to-top button + the mobile
 * slide-over nav panel (sits at the end of body, toggled by the hamburger).
 */
export function mountPageShell(opts: ShellOptions): HTMLElement {
  const body = document.body;
  // Skip-link is in index.html already, leave it alone.
  const main = h('main', { class: 'page-main', id: 'page-main' });
  const header = buildPageHeader(opts);
  const breadcrumb = buildBreadcrumb(opts.pageId);
  const fragments: (HTMLElement | null)[] = [
    buildNav(opts.pageId),
    breadcrumb,
    header,
    main,
    buildFooter(opts.pageId, opts.verifiedOn),
    buildMobileNav(opts.pageId),
  ];
  for (const el of fragments) {
    if (el) body.appendChild(el);
  }

  initNotesModal();
  initGlobalFab();
  // Unified ✓ Picks FAB — viewpoints / lakes / towns / hidden gems / sunsets.
  // Mounted on every page; stays hidden until at least one shortlist
  // registered on this page has at least one pick.
  initPicksFab();
  // Cmd/Ctrl + / search overlay — mounts on every page that does not opt out
  // via `data-search-skip`. Cmd+K stays bound to the notes widget.
  initSearchOverlay();
  void refreshBadges();
  attachBackToTop();
  attachNavBehavior(body);
  // First-visit explainer popup (Erin's intro to the 💬 mechanic).
  // Self-suppresses via localStorage after one show.
  showWelcomePopup();

  return main;
}

/**
 * Wire all nav interactions:
 *   - Desktop bucket buttons: click toggles dropdown, hover opens, ESC closes,
 *     click-outside closes, ArrowDown focuses first menu item, ArrowLeft/Right
 *     cycle between bucket buttons.
 *   - Mobile hamburger: opens slide-over; ESC + backdrop + close-button close;
 *     focus is moved into the panel + trapped while open.
 *   - Path-filter state survives untouched (NAV uses normal <a href> links).
 */
function attachNavBehavior(body: HTMLElement): void {
  const nav = body.querySelector<HTMLElement>('.site-nav');
  const mobile = body.querySelector<HTMLElement>('.site-nav__mobile');
  if (!nav || !mobile) return;

  const bucketBtns = Array.from(nav.querySelectorAll<HTMLButtonElement>('.site-nav__bucket-btn'));
  const hamburger = nav.querySelector<HTMLButtonElement>('.site-nav__hamburger');

  const closeAllDropdowns = (exceptId?: string | null): void => {
    bucketBtns.forEach((btn) => {
      const id = btn.dataset['bucket'];
      if (exceptId && id === exceptId) return;
      btn.setAttribute('aria-expanded', 'false');
      const panelId = btn.getAttribute('aria-controls');
      if (panelId) {
        const panel = document.getElementById(panelId);
        if (panel) panel.hidden = true;
      }
    });
  };

  const openDropdown = (btn: HTMLButtonElement): void => {
    const bucketId = btn.dataset['bucket'] ?? null;
    closeAllDropdowns(bucketId);
    btn.setAttribute('aria-expanded', 'true');
    const panelId = btn.getAttribute('aria-controls');
    if (panelId) {
      const panel = document.getElementById(panelId);
      if (panel) panel.hidden = false;
    }
  };

  bucketBtns.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeAllDropdowns();
      } else {
        openDropdown(btn);
      }
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown(btn);
        const panelId = btn.getAttribute('aria-controls');
        if (panelId) {
          const panel = document.getElementById(panelId);
          const first = panel?.querySelector<HTMLAnchorElement>('a');
          first?.focus();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = bucketBtns[(idx + 1) % bucketBtns.length];
        next?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = bucketBtns[(idx - 1 + bucketBtns.length) % bucketBtns.length];
        prev?.focus();
      } else if (e.key === 'Escape') {
        closeAllDropdowns();
      }
    });
  });

  // Per-panel keyboard navigation (arrow keys cycle links, ESC closes).
  bucketBtns.forEach((btn) => {
    const panelId = btn.getAttribute('aria-controls');
    if (!panelId) return;
    const panel = document.getElementById(panelId);
    if (!panel) return;
    panel.addEventListener('keydown', (e) => {
      const links = Array.from(panel.querySelectorAll<HTMLAnchorElement>('a'));
      const active = document.activeElement as HTMLElement | null;
      const currentIdx = active ? links.indexOf(active as HTMLAnchorElement) : -1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[(currentIdx + 1) % links.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[(currentIdx - 1 + links.length) % links.length]?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeAllDropdowns();
        btn.focus();
      } else if (e.key === 'Tab') {
        // Let Tab close the dropdown naturally so focus moves on.
        closeAllDropdowns();
      }
    });
  });

  // Click outside closes all dropdowns.
  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Node)) return;
    if (nav.contains(e.target)) return;
    closeAllDropdowns();
  });

  // ESC anywhere closes both dropdowns and mobile panel.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAllDropdowns();
    if (!mobile.hidden) closeMobile();
  });

  // ─── Mobile slide-over ───
  const openMobile = (): void => {
    mobile.hidden = false;
    // Trigger transition on next frame
    requestAnimationFrame(() => {
      mobile.classList.add('site-nav__mobile--open');
    });
    body.classList.add('site-nav__mobile-open');
    hamburger?.setAttribute('aria-expanded', 'true');
    const firstLink = mobile.querySelector<HTMLAnchorElement>(
      '.site-nav__mobile-bucket[open] .site-nav__mobile-link'
    );
    (firstLink ?? mobile.querySelector<HTMLButtonElement>('.site-nav__mobile-close'))?.focus();
  };

  const closeMobile = (): void => {
    mobile.classList.remove('site-nav__mobile--open');
    body.classList.remove('site-nav__mobile-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    // Hide after transition completes so it leaves the a11y tree.
    setTimeout(() => {
      if (!mobile.classList.contains('site-nav__mobile--open')) {
        mobile.hidden = true;
      }
    }, 240);
    hamburger?.focus();
  };

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobile.hidden) openMobile();
    else closeMobile();
  });

  mobile.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const action = e.target.closest<HTMLElement>('[data-action]')?.dataset['action'];
    if (action === 'close-mobile-nav') {
      closeMobile();
    }
  });

  // Focus trap for the mobile panel.
  mobile.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || mobile.hidden) return;
    const focusable = mobile.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });
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

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
import { attachBackToTop } from './sections/back-to-top';
import { showWelcomePopup } from './sections/welcome-popup';
import { initSearchOverlay } from './sections/search-overlay';
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
  | 'hidden-gems'
  | 'map'
  | 'weather-plan-c'
  | 'search'
  | 'wa20-status';

interface NavEntry {
  id: PageId;
  href: string;
  label: string;
  /** One-line description shown in dropdown panel + mobile slide-over. */
  desc?: string;
}

type BucketId = 'stay' | 'do' | 'get-there' | 'costs' | 'for-erin' | 'more';

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
 * Hybrid 3-flat + 3-dropdown nav structure (added 2026-05-17 PM).
 *
 * Replaces the all-dropdown 4-bucket nav shipped earlier same day at f5a8b37
 * (Plan / Explore / Logistics / Talk).
 *
 * Story arc reads left-to-right as the booking sequence:
 *   Stay → Do → Get there → Costs → For Erin → More
 *
 * Why hybrid (per NAV_STRATEGY_2026-05-17.md):
 *   - Stay (lodging) is the highest-traffic decision. Flat = one tap.
 *   - Costs is its own anchor — Allison touches repeatedly. Flat.
 *   - For Erin is the WHOLE POINT of the site (she reacts). Flat = obvious.
 *   - Do groups things-to-do-each-day (Hikes / Viewpoints / Lakes / Activities
 *     / Hidden gems / Towns) — coherent "what fills the day" bucket.
 *   - Get there groups transit chain (Travel / Rental / Driving / Seattle).
 *   - More holds admin + reference (Pre-trip / Groceries / Top sunsets /
 *     Details / Notes). Naming "More" instead of "Talk" so 1-item dropdowns
 *     are no longer wasteful.
 *
 * Towns is in Do (not Get there) because Erin "happy to visit towns if
 * interesting" — they fill the day, they're not pure transit context.
 *
 * Sunsets stays linkable from lodging cards (page kept), but demoted to More
 * because Allison clarified "not a big sunset trip."
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
    kind: 'dropdown',
    id: 'do',
    label: 'Do',
    entries: [
      { id: 'map', href: 'map.html', label: 'Map', desc: 'Path-aware interactive map' },
      { id: 'hikes', href: 'hikes.html', label: 'Hikes', desc: 'Signatures + alternates' },
      { id: 'viewpoints', href: 'viewpoints.html', label: 'Viewpoints', desc: 'Drive-up postcards' },
      { id: 'lakes', href: 'lakes.html', label: 'Lakes', desc: 'Water swaps + rentals' },
      { id: 'activities', href: 'activities.html', label: 'Activities', desc: 'Non-hiking ways to spend a day' },
      { id: 'hidden-gems', href: 'hidden-gems.html', label: 'Hidden gems', desc: '12 lesser-known spots' },
      { id: 'towns', href: 'towns.html', label: 'Towns', desc: 'Marblemount → Winthrop corridor' },
    ],
  },
  {
    kind: 'dropdown',
    id: 'get-there',
    label: 'Get there',
    entries: [
      { id: 'travel', href: 'travel.html', label: 'Travel', desc: 'Flights + routings' },
      { id: 'rental', href: 'rental.html', label: 'Rental', desc: 'Car: automatic, all-in price' },
      { id: 'driving-cascades', href: 'driving-cascades.html', label: 'Driving', desc: 'WA-20 + Cascade River Rd' },
      { id: 'seattle', href: 'seattle.html', label: 'Seattle', desc: 'Day 1 + Day 5 anchor' },
    ],
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
      { id: 'pre-trip', href: 'pre-trip.html', label: 'Pre-trip', desc: 'Book-by dates + verifications' },
      { id: 'food', href: 'food.html', label: 'Groceries', desc: 'Buy + cook the whole trip' },
      { id: 'weather-plan-c', href: 'weather-plan-c.html', label: 'Weather Plan C', desc: 'Smoke + bad-air swaps' },
      { id: 'top-sunsets', href: 'top-sunsets.html', label: 'Top sunsets', desc: 'Sunset perks per lodging' },
      { id: 'details', href: 'details.html', label: 'Details', desc: 'Restaurants + bring list + decisions' },
      { id: 'notes', href: 'notes.html', label: 'Notes', desc: 'Comments + change log' },
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
            'Three paths + the trip at a glance'
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
      return 'Where to sleep, per path';
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
        'NPS road-conditions page (May 6, 2026 update) lists "Expected reopening: April or early May (weather-dependent)" while WSDOT target above says July 4. Both sources are stale in different directions. Confirm by phone — WSDOT 1-800-695-7623 — before locking the week. ',
        h('a', { href: 'wa20-status.html', class: 'closure-banner__link', style: 'font-weight: 600;' }, 'See sources + phone protocol →')
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
    buildFooter(),
    buildMobileNav(opts.pageId),
  ];
  for (const el of fragments) {
    if (el) body.appendChild(el);
  }

  initNotesModal();
  initGlobalFab();
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

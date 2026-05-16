import { TRIP } from '../data/trip';
import { CLOSURE_ALERT } from '../data/closure';
import { h } from '../dom';

// Seven chips — the access patterns we actually expect. Map + For-Erin earn
// their spots: Erin needs to find her own section without scrolling past 18
// sections; Map is the geographic-orient surface and was previously buried.
// Everything else is one scroll away.
const NAV_LINKS: { id: string; label: string }[] = [
  { id: 'paths', label: 'Paths' },
  { id: 'map', label: 'Map' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'lodging', label: 'Lodging' },
  { id: 'hikes', label: 'Hikes' },
  { id: 'for-erin', label: 'For Erin' },
  { id: 'decisions', label: 'Decisions' },
];

/**
 * Closure banner — compact <details> by default.
 *
 * The road-closure premise IS the trip's contingency framing, so we don't hide
 * it entirely. But the V1 banner was 229px of orange wall above the hero
 * content + path picker — disproportionate for what's basically a status note.
 * Now: single-line summary expandable in place. No "Dismiss" — the closure is
 * load-bearing for the path-picker context.
 */
function buildBanner(): HTMLElement {
  return h(
    'details',
    {
      class: 'closure-banner',
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
        '. The 3 paths below assume worst case.'
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

export function renderHero(): HTMLElement {
  const nav = h(
    'nav',
    { class: 'hero__nav', 'aria-label': 'Section navigation' },
    h(
      'ul',
      { class: 'hero__nav-list' },
      ...NAV_LINKS.map((link) =>
        h('li', {}, h('a', { class: 'hero__nav-link', href: `#${link.id}` }, link.label))
      )
    )
  );

  return h(
    'header',
    { class: 'hero', id: 'top' },
    h(
      'div',
      { class: 'hero__inner' },
      h('p', { class: 'hero__eyebrow' }, TRIP.travelers),
      h('h1', { class: 'hero__title' }, TRIP.name),
      h(
        'p',
        { class: 'hero__meta' },
        h('span', {}, TRIP.dates),
        h('span', { class: 'hero__dot', 'aria-hidden': 'true' }, '·'),
        h('span', {}, TRIP.duration)
      ),
      buildBanner(),
      nav
    )
  );
}

import { TRIP } from '../data/trip';
import { CLOSURE_ALERT } from '../data/closure';
import { h } from '../dom';

const NAV_LINKS: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'flights', label: 'Flights' },
  { id: 'rental', label: 'Rental car' },
  { id: 'lodging', label: 'Lodging' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'hikes', label: 'Hikes' },
  { id: 'viewpoints', label: 'Viewpoints' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'seattle', label: 'Seattle' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'decisions', label: 'Open decisions' },
];

const DISMISS_KEY = 'ncades2026.closureDismissed';

function buildBanner(): HTMLElement {
  const dismissed = localStorage.getItem(DISMISS_KEY) === '1';
  const banner = h(
    'aside',
    {
      class: `closure-banner${dismissed ? ' closure-banner--collapsed' : ''}`,
      role: 'alert',
      'aria-live': 'polite',
    },
    h('div', { class: 'closure-banner__icon', 'aria-hidden': 'true' }, '⚠'),
    h(
      'div',
      { class: 'closure-banner__body' },
      h('h3', { class: 'closure-banner__title' }, CLOSURE_ALERT.headline),
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
    ),
    h(
      'button',
      {
        class: 'closure-banner__dismiss',
        type: 'button',
        'aria-label': 'Dismiss closure banner',
      },
      'Dismiss'
    )
  );

  const dismiss = banner.querySelector<HTMLButtonElement>('.closure-banner__dismiss');
  dismiss?.addEventListener('click', () => {
    banner.classList.add('closure-banner--collapsed');
    localStorage.setItem(DISMISS_KEY, '1');
  });

  return banner;
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

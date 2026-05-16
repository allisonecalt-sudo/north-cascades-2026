/**
 * Lodging — Terra Nova-tier cabins lead, splurge + basic collapsed below.
 *
 * No "Top pick" crown. Cards group by tier (fits-brief / splurge / basic) so
 * the reader sees the cluster that matches the brief first; the rest sit
 * behind disclosures.
 */

import {
  EAST_LODGING,
  KITCHEN_LABELS,
  WEST_LODGING,
  type KitchenLevel,
  type Lodging,
  type LodgingTier,
} from '../data/lodging';
import { badge, h, section } from '../dom';

function renderPhoto(lodging: Lodging): HTMLElement {
  const { photo } = lodging;
  const isRepresentative = photo.credit?.toLowerCase().includes('unsplash') ?? false;
  const img = h('img', {
    class: 'card__img',
    src: photo.src,
    alt: isRepresentative
      ? `Representative photo (not actual property): ${photo.alt}`
      : photo.alt,
    width: photo.width,
    height: photo.height,
    loading: 'lazy',
    decoding: 'async',
  });
  const figure = h('figure', { class: 'card__figure' }, img);
  if (isRepresentative) {
    figure.append(
      h(
        'p',
        { class: 'card__photo-warning' },
        'Representative photo — not the actual property. See booking link for real photos.'
      )
    );
  }
  if (photo.credit) {
    const credit = photo.creditUrl
      ? h(
          'figcaption',
          { class: 'card__credit' },
          h('a', { href: photo.creditUrl, rel: 'noopener', target: '_blank' }, photo.credit)
        )
      : h('figcaption', { class: 'card__credit' }, photo.credit);
    figure.append(credit);
  }
  return figure;
}

function kitchenBadgeKind(level: KitchenLevel): 'good' | 'info' | 'warn' {
  if (level === 'full') return 'good';
  if (level === 'kitchenette') return 'info';
  return 'warn';
}

function renderLodgingCard(lodging: Lodging): HTMLElement {
  return h(
    'article',
    {
      class: `card lodging-card lodging-card--${lodging.tier}`,
      'data-vibe': lodging.vibe,
    },
    renderPhoto(lodging),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, lodging.name),
      h(
        'div',
        { class: 'card__badges' },
        badge(KITCHEN_LABELS[lodging.kitchen], kitchenBadgeKind(lodging.kitchen))
      )
    ),
    h('p', { class: 'card__address' }, lodging.address),
    lodging.phone ? h('p', { class: 'card__phone' }, lodging.phone) : null,
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Type'),
      h('dd', {}, lodging.type),
      h('dt', {}, '$/night'),
      h('dd', {}, lodging.pricePerNight),
      h('dt', {}, 'Location'),
      h('dd', {}, lodging.distance)
    ),
    h('p', { class: 'card__note' }, lodging.notes),
    lodging.bookingUrl
      ? h(
          'p',
          { class: 'card__cta' },
          h(
            'a',
            { class: 'card__cta-link', href: lodging.bookingUrl, rel: 'noopener', target: '_blank' },
            'Booking link'
          )
        )
      : null,
    lodging.bookingHint ? h('p', { class: 'card__hint' }, lodging.bookingHint) : null
  );
}

function byTier(lodgings: Lodging[], tier: LodgingTier): Lodging[] {
  return lodgings.filter((l) => l.tier === tier);
}

function renderPanel(id: string, title: string, lodgings: Lodging[]): HTMLElement {
  const fitsBrief = byTier(lodgings, 'fits-brief');
  const splurge = byTier(lodgings, 'splurge');
  const basic = byTier(lodgings, 'budget-or-basic');
  const notes = byTier(lodgings, 'note');

  const fitsBriefGrid = h('div', { class: 'card-grid' }, ...fitsBrief.map(renderLodgingCard));

  const splurgeBlock =
    splurge.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Splurge options (${splurge.length})`
          ),
          h('div', { class: 'card-grid' }, ...splurge.map(renderLodgingCard))
        )
      : null;

  const basicBlock =
    basic.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Cheaper / more basic options (${basic.length})`
          ),
          h('div', { class: 'card-grid' }, ...basic.map(renderLodgingCard))
        )
      : null;

  const notesBlock =
    notes.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Status notes (${notes.length})`
          ),
          h('div', { class: 'card-grid' }, ...notes.map(renderLodgingCard))
        )
      : null;

  return h(
    'div',
    {
      class: 'tab-panel',
      id: `lodging-panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `lodging-tab-${id}`,
    },
    h('h3', { class: 'tab-panel__title' }, title),
    h(
      'p',
      { class: 'section__lede' },
      `Spacious, a little nicer than basic, around $200-300 — the Terra Nova tier from last time. ${fitsBrief.length} cabin / lodge options that fit. Splurge + cheaper sit below.`
    ),
    fitsBriefGrid,
    splurgeBlock,
    basicBlock,
    notesBlock
  );
}

export function renderLodging(): HTMLElement {
  const tabs = h(
    'div',
    { class: 'tabs', role: 'tablist', 'aria-label': 'Lodging side' },
    h(
      'button',
      {
        class: 'tab tab--active',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-west',
        'aria-selected': 'true',
        'aria-controls': 'lodging-panel-west',
        'data-target': 'west',
      },
      `West · Nights 1-2`
    ),
    h(
      'button',
      {
        class: 'tab',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-east',
        'aria-selected': 'false',
        'aria-controls': 'lodging-panel-east',
        'data-target': 'east',
      },
      `East · Nights 3-4`
    )
  );

  const westPanel = renderPanel(
    'west',
    'West side — Marblemount / Rockport / Concrete',
    WEST_LODGING
  );
  const eastPanel = renderPanel('east', 'East side — Winthrop / Mazama', EAST_LODGING);
  eastPanel.hidden = true;

  const wrap = section(
    'lodging',
    'Lodging',
    // Gist in 3 lines.
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Two bases — west side (Marblemount/Rockport, Nights 1-2) and east side (Winthrop/Mazama, Nights 3-4).'),
      h('li', { class: 'gist__item' }, 'Brief: spacious + a little nicer than basic + ~$200-300/night (Terra Nova-tier from last time). Kitchens are a bonus, not a requirement.'),
      h('li', { class: 'gist__item' }, 'Splurge ($400+) and cheaper/basic options are kept behind disclosures.')
    ),
    tabs,
    westPanel,
    eastPanel
  );

  tabs.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const side = target.dataset['target'];
    if (side !== 'west' && side !== 'east') return;
    const allTabs = tabs.querySelectorAll<HTMLButtonElement>('.tab');
    allTabs.forEach((t) => {
      const active = t.dataset['target'] === side;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    westPanel.hidden = side !== 'west';
    eastPanel.hidden = side !== 'east';
  });

  return wrap;
}

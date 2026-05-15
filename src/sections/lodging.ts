import {
  EAST_LODGING,
  KITCHEN_LABELS,
  WEST_LODGING,
  type KitchenLevel,
  type Lodging,
} from '../data/lodging';
import { badge, h, section } from '../dom';

function renderPhoto(lodging: Lodging): HTMLElement {
  const { photo } = lodging;
  // Unsplash photos are thematic/representative, not photos of the actual
  // property. Flag them so travelers don't think this is what they're booking.
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
      class: `card lodging-card${lodging.topPick ? ' lodging-card--top' : ''}`,
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
        lodging.topPick ? badge('Top pick', 'good') : null,
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
            'Book / details'
          )
        )
      : null,
    lodging.bookingHint ? h('p', { class: 'card__hint' }, lodging.bookingHint) : null
  );
}

function renderPanel(id: string, title: string, lodgings: Lodging[]): HTMLElement {
  const topPicks = lodgings.filter((l) => l.topPick);
  const rest = lodgings.filter((l) => !l.topPick);

  const topGrid = h('div', { class: 'card-grid' }, ...topPicks.map(renderLodgingCard));
  const restDisclosure =
    rest.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Show ${rest.length} more option${rest.length === 1 ? '' : 's'}`
          ),
          h('div', { class: 'card-grid' }, ...rest.map(renderLodgingCard))
        )
      : null;

  const panel = h(
    'div',
    {
      class: 'tab-panel',
      id: `lodging-panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `lodging-tab-${id}`,
    },
    h('h3', { class: 'tab-panel__title' }, title),
    topGrid,
    restDisclosure
  );
  return panel;
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

  const westPanel = renderPanel('west', 'West side — Marblemount / Rockport / Concrete', WEST_LODGING);
  const eastPanel = renderPanel('east', 'East side — Winthrop / Mazama', EAST_LODGING);
  eastPanel.hidden = true;

  const wrap = section(
    'lodging',
    'Lodging',
    h(
      'p',
      { class: 'section__lede' },
      'Cabins with full kitchens take priority — both travelers keep kosher and the corridor has zero kosher restaurants, so self-catering is the plan. Every card shows kitchen status at a glance.'
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

import {
  EAST_LODGING,
  VIBE_LABELS,
  WEST_LODGING,
  type Lodging,
  type LodgingVibe,
} from '../data/lodging';
import { badge, h, section } from '../dom';

function renderPhoto(lodging: Lodging): HTMLElement {
  const { photo } = lodging;
  const img = h('img', {
    class: 'card__img',
    src: photo.src,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    loading: 'lazy',
    decoding: 'async',
  });
  const figure = h('figure', { class: 'card__figure' }, img);
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

function renderLodgingCard(lodging: Lodging): HTMLElement {
  const card = h(
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
      lodging.topPick ? badge('Top pick', 'good') : null
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
  return card;
}

function uniqueVibes(lodgings: Lodging[]): LodgingVibe[] {
  const seen = new Set<LodgingVibe>();
  for (const l of lodgings) seen.add(l.vibe);
  // Preserve a stable ordering aligned with VIBE_LABELS keys.
  return (Object.keys(VIBE_LABELS) as LodgingVibe[]).filter((v) => seen.has(v));
}

function renderFilters(
  panel: HTMLElement,
  lodgings: Lodging[],
  panelId: string
): HTMLElement {
  const vibes = uniqueVibes(lodgings);
  const allChip = h(
    'button',
    {
      type: 'button',
      class: 'chip chip--active',
      'data-filter': 'all',
      'aria-pressed': 'true',
    },
    `All (${lodgings.length})`
  );
  const chips = vibes.map((v) => {
    const count = lodgings.filter((l) => l.vibe === v).length;
    return h(
      'button',
      {
        type: 'button',
        class: 'chip',
        'data-filter': v,
        'aria-pressed': 'false',
      },
      `${VIBE_LABELS[v]} (${count})`
    );
  });
  const bar = h(
    'div',
    {
      class: 'chip-row',
      role: 'group',
      'aria-label': `Filter ${panelId} lodging by vibe`,
    },
    allChip,
    ...chips
  );
  bar.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const filter = target.dataset['filter'];
    if (!filter) return;
    const allChips = bar.querySelectorAll<HTMLButtonElement>('.chip');
    allChips.forEach((c) => {
      const active = c.dataset['filter'] === filter;
      c.classList.toggle('chip--active', active);
      c.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const cards = panel.querySelectorAll<HTMLElement>('.lodging-card');
    cards.forEach((card) => {
      const vibe = card.dataset['vibe'];
      card.hidden = filter !== 'all' && vibe !== filter;
    });
  });
  return bar;
}

function renderPanel(id: string, title: string, lodgings: Lodging[]): HTMLElement {
  const grid = h('div', { class: 'card-grid' }, ...lodgings.map(renderLodgingCard));
  const panel = h(
    'div',
    {
      class: 'tab-panel',
      id: `lodging-panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `lodging-tab-${id}`,
    },
    h('h3', { class: 'tab-panel__title' }, title),
    renderFilters(grid, lodgings, id),
    grid
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
      `West side · Nights 1-2 (${WEST_LODGING.length})`
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
      `East side · Nights 3-4 (${EAST_LODGING.length})`
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
      'Two travelers sharing — Erin prefers spacious + a little nicer than basic. Cabins, lodges, B&Bs, vacation rentals, glamping, and ranch stays below. Tabs split by side; chips filter by vibe.'
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

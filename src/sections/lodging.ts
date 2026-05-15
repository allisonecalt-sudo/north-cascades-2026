import { EAST_LODGING, WEST_LODGING, type Lodging } from '../data/lodging';
import { badge, h, section } from '../dom';

function renderLodgingCard(lodging: Lodging): HTMLElement {
  return h(
    'article',
    { class: `card lodging-card${lodging.topPick ? ' lodging-card--top' : ''}` },
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
    lodging.bookingHint ? h('p', { class: 'card__hint' }, lodging.bookingHint) : null
  );
}

function renderPanel(id: string, title: string, lodgings: Lodging[]): HTMLElement {
  return h(
    'div',
    {
      class: 'tab-panel',
      id: `lodging-panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `lodging-tab-${id}`,
    },
    h('h3', { class: 'tab-panel__title' }, title),
    h('div', { class: 'card-grid' }, ...lodgings.map(renderLodgingCard))
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
      'West side · Nights 1-2'
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
      'East side · Nights 3-4'
    )
  );

  const westPanel = renderPanel('west', 'West side — Marblemount / Rockport', WEST_LODGING);
  const eastPanel = renderPanel('east', 'East side — Winthrop / Mazama', EAST_LODGING);
  eastPanel.hidden = true;

  const wrap = section(
    'lodging',
    'Lodging',
    h(
      'p',
      { class: 'section__lede' },
      'Two bases. West side covers Cascade Pass + park interior. East side covers Maple Pass + Washington Pass.'
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

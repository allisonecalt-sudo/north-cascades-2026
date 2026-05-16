import { RENTAL_OPTIONS, type RentalOption } from '../data/rental';
import { h, section } from '../dom';

function renderCard(option: RentalOption): HTMLElement {
  return h(
    'article',
    { class: 'card rental-card' },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label)
    ),
    h('p', { class: 'card__subtitle' }, option.vehicleType),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Cost (5 days)'),
      h('dd', {}, option.costRange),
      h('dt', {}, 'Pairs with'),
      h('dd', {}, option.pairsWith)
    ),
    h('p', { class: 'card__note' }, option.tradeoff)
  );
}

export function renderRental(): HTMLElement {
  return section(
    'rental',
    'Rental car',
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'All majors operate at SEA and BLI; one-way BLI→SEA drop fees on majors run ~$50-150.'),
      h(
        'li',
        { class: 'gist__item' },
        'Compact SUV is the all-purpose pick; sedan works too — Cascade River Rd is gravel-but-passable for any car with reasonable clearance.'
      ),
      h('li', { class: 'gist__item' }, 'Pick the rental that pairs with whichever flight option locks in.')
    ),
    h('div', { class: 'card-grid' }, ...RENTAL_OPTIONS.map(renderCard))
  );
}

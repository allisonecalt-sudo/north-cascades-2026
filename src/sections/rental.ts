import { RENTAL_OPTIONS, type RentalOption } from '../data/rental';
import { badge, h, section } from '../dom';

function recBadge(rec: RentalOption['recommended']): HTMLElement | null {
  if (!rec) return null;
  if (rec === 'best-value') return badge('Best value', 'good');
  if (rec === 'cheapest') return badge('Cheapest', 'info');
  if (rec === 'flex') return badge('Flex pick', 'info');
  if (rec === 'avoid') return badge('Skip / avoid', 'warn');
  return null;
}

function renderCard(option: RentalOption): HTMLElement {
  const isRec = option.recommended === 'best-value';
  return h(
    'article',
    { class: `card rental-card${isRec ? ' rental-card--recommended' : ''}` },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label),
      recBadge(option.recommended)
    ),
    h('p', { class: 'card__subtitle' }, option.vehicleType),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Cost (5 days)'),
      h('dd', {}, option.costRange),
      h('dt', {}, 'Flexibility'),
      h('dd', {}, option.flexibility)
    ),
    h('p', { class: 'card__note' }, option.tradeoff)
  );
}

export function renderRental(): HTMLElement {
  return section(
    'rental',
    'Rental car',
    h(
      'p',
      { class: 'section__lede' },
      'All majors operate at both BLI and SEA. BLI→SEA distance is ~94 mi. One-way drop fees on majors are typically $50-150.'
    ),
    h('div', { class: 'card-grid' }, ...RENTAL_OPTIONS.map(renderCard))
  );
}

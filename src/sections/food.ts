/**
 * Food Strategy — Kosher.
 *
 * Both travelers keep kosher. The corridor (Marblemount → Winthrop) has
 * zero kosher restaurants. This section covers: pre-trip stocking stops,
 * trail lunch packing, hechsher cheat sheet, and Chabad / kosher community
 * contacts for emergencies or Shabbat questions.
 */

import {
  CHABAD_CONTACTS,
  FOOD_STRATEGY_SUMMARY,
  GROCERY_STOPS,
  HECHSHER_CHEAT,
  HIKE_LUNCHES,
  type ChabadContact,
  type GroceryStop,
  type PantryNote,
} from '../data/food';
import { h, section } from '../dom';

function renderGroceryStop(stop: GroceryStop): HTMLElement {
  return h(
    'article',
    { class: 'card food-card' },
    h('h4', { class: 'food-card__title' }, stop.name),
    h('p', { class: 'food-card__address' }, stop.address),
    stop.phone ? h('p', { class: 'food-card__phone' }, stop.phone) : null,
    stop.hours ? h('p', { class: 'food-card__hint' }, stop.hours) : null,
    h('p', { class: 'food-card__why' }, stop.why),
    h(
      'div',
      { class: 'food-card__stock' },
      h('strong', {}, 'Stock up on: '),
      h('span', {}, stop.stockUp)
    )
  );
}

function renderPantryNote(note: PantryNote): HTMLElement {
  return h(
    'li',
    { class: 'mini-list__item' },
    h('strong', { class: 'mini-list__label' }, note.topic),
    h('span', { class: 'mini-list__detail' }, note.detail)
  );
}

function renderChabadContact(contact: ChabadContact): HTMLElement {
  return h(
    'li',
    { class: 'mini-list__item' },
    h('strong', { class: 'mini-list__label' }, contact.name),
    h(
      'span',
      { class: 'mini-list__detail' },
      contact.area,
      contact.phone ? ` · ${contact.phone}` : '',
      ' — ',
      contact.note,
      contact.url
        ? h(
            'span',
            {},
            ' ',
            h(
              'a',
              { href: contact.url, target: '_blank', rel: 'noopener noreferrer' },
              'website →'
            )
          )
        : null
    )
  );
}

export function renderFood(): HTMLElement {
  return section(
    'food',
    'Food strategy (kosher)',
    h('p', { class: 'section__lede' }, FOOD_STRATEGY_SUMMARY),

    // Stocking stops — surface the two most-important, collapse rest.
    h(
      'div',
      { class: 'subsection' },
      h('h3', { class: 'subsection__title' }, 'Pre-trip grocery stops'),
      h(
        'div',
        { class: 'card-grid' },
        ...GROCERY_STOPS.slice(0, 2).map(renderGroceryStop)
      ),
      GROCERY_STOPS.length > 2
        ? h(
            'details',
            { class: 'disclosure' },
            h(
              'summary',
              { class: 'disclosure__summary' },
              `Other stocking stops + FYI (${GROCERY_STOPS.length - 2})`
            ),
            h(
              'div',
              { class: 'card-grid' },
              ...GROCERY_STOPS.slice(2).map(renderGroceryStop)
            )
          )
        : null
    ),

    // Hike lunches.
    h(
      'div',
      { class: 'subsection' },
      h('h3', { class: 'subsection__title' }, 'Hike lunches + cooler discipline'),
      h('ul', { class: 'mini-list' }, ...HIKE_LUNCHES.map(renderPantryNote))
    ),

    // Hechsher cheat sheet — collapsed by default.
    h(
      'details',
      { class: 'disclosure' },
      h('summary', { class: 'disclosure__summary' }, 'Hechsher cheat sheet (7)'),
      h('ul', { class: 'mini-list' }, ...HECHSHER_CHEAT.map(renderPantryNote))
    ),

    // Chabad + kosher community contacts.
    h(
      'div',
      { class: 'subsection' },
      h('h3', { class: 'subsection__title' }, 'Chabad + kosher community contacts'),
      h(
        'p',
        { class: 'section__lede' },
        'For emergency-kosher questions, supply runs, or Shabbat hospitality. Call ahead.'
      ),
      h('ul', { class: 'mini-list' }, ...CHABAD_CONTACTS.map(renderChabadContact))
    )
  );
}

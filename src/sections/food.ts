/**
 * Kosher notes — one short paragraph, no architecture.
 *
 * Per Allison May 16: "you can tell us all kosher stuff to know but we can
 * also shop at reg supermarkets and buying food." The kosher footprint on
 * this site is intentionally tight — one approach paragraph + a slim Seattle
 * Va\'ad resources line. No Chabad-emergency rigging. No grocery-pilgrimage
 * stops. Kosher restaurants live in the Restaurants section, not here.
 */

import { FOOD_APPROACH } from '../data/food';
import { h, section } from '../dom';

export function renderFood(): HTMLElement {
  return section(
    'food',
    'Kosher notes',
    h(
      'div',
      { class: 'food-approach' },
      h('h3', { class: 'food-approach__title' }, FOOD_APPROACH.headline),
      h('p', { class: 'food-approach__body' }, FOOD_APPROACH.body)
    ),
    h(
      'ul',
      { class: 'mini-list' },
      h(
        'li',
        { class: 'mini-list__item' },
        h('strong', { class: 'mini-list__label' }, 'Hechsher cheat'),
        h(
          'span',
          { class: 'mini-list__detail' },
          'OU, OK, Star-K, Kof-K, CRC are widely accepted. For packaged goods, any of these on the label = good to go.'
        )
      ),
      h(
        'li',
        { class: 'mini-list__item' },
        h('strong', { class: 'mini-list__label' }, 'Seattle Va\'ad'),
        h(
          'span',
          { class: 'mini-list__detail' },
          'The local certifying agency. Restaurant + grocery list: ',
          h(
            'a',
            { href: 'https://seattlevaad.org/kosher-portfolio', target: '_blank', rel: 'noopener noreferrer' },
            'seattlevaad.org/kosher-portfolio →'
          )
        )
      ),
      h(
        'li',
        { class: 'mini-list__item' },
        h('strong', { class: 'mini-list__label' }, 'Cabin meals'),
        h(
          'span',
          { class: 'mini-list__detail' },
          'Packaged hechsher goods + fridge + microwave covers most meals — pasta, sealed sauces, rotisserie chicken, fruit, salad, bread. Sit-down kosher options live in the Food + restaurants section.'
        )
      )
    )
  );
}

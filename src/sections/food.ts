/**
 * Kosher notes — one short paragraph, no architecture.
 *
 * Per Allison May 16: "you can tell us all kosher stuff to know but we can
 * also shop at reg supermarkets and buying food." The kosher footprint on
 * this site is intentionally tight — one approach paragraph + a slim Seattle
 * Va\'ad resources line. No Chabad-emergency rigging. No grocery-pilgrimage
 * stops. Kosher restaurants live in the Restaurants section, not here.
 */

import { FOOD_APPROACH, FOOD_BUDGET } from '../data/food';
import { h, section } from '../dom';

function renderBudgetBlock(): HTMLElement {
  return h(
    'div',
    { class: 'food-budget' },
    h('h3', { class: 'food-budget__title' }, FOOD_BUDGET.headline),
    h(
      'div',
      { class: 'food-budget__totals' },
      h(
        'div',
        { class: 'food-budget__total-row' },
        h('span', { class: 'food-budget__total-label' }, 'Groceries · per person · 5 days'),
        h(
          'span',
          { class: 'food-budget__total-amount' },
          `$${FOOD_BUDGET.perPersonLow}-$${FOOD_BUDGET.perPersonHigh}`
        )
      ),
      h(
        'div',
        { class: 'food-budget__total-row' },
        h('span', { class: 'food-budget__total-label' }, 'Restaurants · per person · whole trip'),
        h(
          'span',
          { class: 'food-budget__total-amount' },
          `$${FOOD_BUDGET.restaurantsLow}-$${FOOD_BUDGET.restaurantsHigh}`
        )
      ),
      h(
        'div',
        { class: 'food-budget__total-row food-budget__total-row--combined' },
        h('span', { class: 'food-budget__total-label' }, 'Combined trip food cost · for 2'),
        h(
          'span',
          { class: 'food-budget__total-amount' },
          `$${(FOOD_BUDGET.totalLow + FOOD_BUDGET.restaurantsLow * 2)}-$${(FOOD_BUDGET.totalHigh + FOOD_BUDGET.restaurantsHigh * 2)}`
        )
      )
    ),
    h('p', { class: 'food-budget__note' }, FOOD_BUDGET.note),
    h('h4', { class: 'food-budget__subtitle' }, 'Shopping plan + costs'),
    h(
      'ul',
      { class: 'food-budget__list' },
      ...FOOD_BUDGET.shoppingPlan.map((item) =>
        h(
          'li',
          { class: 'food-budget__list-item' },
          h('strong', { class: 'food-budget__list-where' }, item.where),
          h('span', { class: 'food-budget__list-cost' }, item.cost),
          h('p', { class: 'food-budget__list-detail' }, item.detail)
        )
      )
    ),
    h('h4', { class: 'food-budget__subtitle' }, 'Restaurant picks · price/person'),
    h(
      'ul',
      { class: 'food-budget__restaurants' },
      ...FOOD_BUDGET.restaurantPicks.map((r) =>
        h(
          'li',
          { class: 'food-budget__rest-item' },
          h('strong', { class: 'food-budget__rest-name' }, r.name),
          h('span', { class: 'food-budget__rest-cost' }, r.cost),
          h('span', { class: 'food-budget__rest-note' }, r.note)
        )
      )
    ),
    h(
      'p',
      { class: 'food-budget__verified' },
      'Verified May 19, 2026 against BLS grocery norms + per-restaurant Yelp price tiers. WA gas-tax inflation is bleeding into grocery prices too — re-verify the week before the trip.'
    )
  );
}

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
    renderBudgetBlock(),
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

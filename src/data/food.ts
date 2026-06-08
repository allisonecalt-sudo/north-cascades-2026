/**
 * Food approach — short, flexible. Both keep kosher; packaged hechsher goods
 * from any major supermarket cover the corridor. $ ranges verified 2026-05-19.
 */

export const FOOD_APPROACH = {
  headline: 'Self-cater the easy way',
  body: 'Both keep kosher. Stock packaged hechsher goods on the way in; top up along the route.',
} as const;

/** Concrete dollar plan — added 2026-05-19 so the food page carries real $. */
export const FOOD_BUDGET = {
  headline: 'What it actually costs',
  perPersonLow: 110,
  perPersonMid: 160,
  perPersonHigh: 220,
  totalLow: 220,
  totalMid: 320,
  totalHigh: 440,
  seattleStockUp: 180,
  midTripSupplement: 60,
  pantryOpenerKit: 25,
  restaurantsLow: 30,
  restaurantsMid: 75,
  restaurantsHigh: 120,
  note:
    'Per person, 5 days. Built from $75-120/person/week US grocery norms (BLS 2026) + ~30-50% kosher premium. Restaurants NOT central — budget 1-2 sit-downs max.',
  shoppingPlan: [
    {
      where: 'Seattle Day 1 — Va\'ad stock-up (the big haul)',
      cost: '~$180 (for 2)',
      detail: 'QFC U-Village (2746 NE 45th St) for OU/Star-K/Kof-K packaged items; Trader Joe\'s for hechsher cheese/bread/snacks. PCC View Ridge has Va\'ad bulk.',
    },
    {
      where: 'Pantry opener kit',
      cost: '~$25',
      detail: 'Salt, pepper, oil, sugar, dish soap, paper towels — rentals don\'t reliably stock basics.',
    },
    {
      where: 'Marblemount + Mazama stores',
      cost: '~$60 mid-trip top-up',
      detail: 'Bread, fruit, snacks, milk. Staples only, no Va\'ad oversight.',
    },
    {
      where: 'Day-5 return (optional)',
      cost: '~$30-50 if kosher deli',
      detail: 'QFC Mercer Island Va\'ad deli counter — only for a sit-down meal before the SEA flight.',
    },
  ],
  restaurantPicks: [
    { name: 'Old Schoolhouse Brewery (Winthrop)', cost: '~$15-25/person', note: 'Brewpub, casual.' },
    { name: 'Arrowleaf Bistro (Winthrop)', cost: '~$30-50/person', note: 'Nicer dinner; reservation recommended.' },
    { name: 'Buffalo Run / Mondo (Marblemount)', cost: '~$15-25/person', note: 'Casual, end-of-day options.' },
    { name: 'Birdsview Brewing (Concrete, en route)', cost: '~$15-25/person', note: 'On the BLI→Marblemount drive Day 1.' },
    { name: 'Rocking Horse Bakery (Winthrop)', cost: '~$8-15/person', note: 'Coffee + pastry pre-hike fuel.' },
    { name: 'Sheri\'s Sweet Shoppe (Winthrop)', cost: '~$5-10', note: 'Ice cream + candy stop.' },
  ],
} as const;

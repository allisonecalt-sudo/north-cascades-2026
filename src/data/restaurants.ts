/**
 * Restaurants — KOSHER ONLY.
 *
 * Tightened May 16, 2026 (Allison): *"no eating idf not kosher restaurant"* +
 * *"we dont need to see none kosher places."*
 *
 * UI/IA rule: every restaurant entry across this site is hechsher-certified.
 * Non-kosher restaurants are simply not in scope — not even as "context" or
 * "worth knowing about." Corridor towns (Marblemount, Rockport, Concrete,
 * Winthrop, Mazama, Bellingham) have no kosher restaurants → single-line
 * "no kosher options here" notice that points back to cabin-cooking strategy.
 *
 * Seattle Va\'ad-certified options are the only sit-down kosher meals on the
 * trip route.
 */

export interface Restaurant {
  name: string;
  address: string;
  note: string;
  phone?: string;
  /** Kosher-only — hechsher always present. */
  hechsher: string;
  website?: string;
}

export interface RestaurantTown {
  town: string;
  /** Single-line context. */
  context?: string;
  /** True when no kosher options exist here — town renders the "no kosher" notice instead of a list. */
  noKosher?: boolean;
  places: Restaurant[];
}

export const RESTAURANTS: RestaurantTown[] = [
  // ---------- Corridor towns — no kosher options ----------
  {
    town: 'Marblemount · Rockport · Concrete',
    context:
      'No kosher restaurants in these towns. Default to cabin meals — see Kosher notes section for the supermarket strategy.',
    noKosher: true,
    places: [],
  },
  {
    town: 'Winthrop · Mazama',
    context:
      'No kosher restaurants here. Default to cabin meals — see Kosher notes section for the supermarket strategy.',
    noKosher: true,
    places: [],
  },

  // ---------- Seattle Va\'ad-certified ----------
  {
    town: 'Seattle — kosher options',
    context:
      'Va\'ad-certified sit-down + grocery options. The only kosher restaurants on the trip route — useful for a Day-5 stop or a pre/post-trip Seattle overnight.',
    places: [
      {
        name: 'QFC Mercer Island — kosher deli counter',
        address: '7823 SE 28th St, Mercer Island, WA 98040',
        phone: '(206) 230-0745',
        hechsher: 'Seattle Va\'ad',
        note:
          'Full kosher deli inside the QFC supermarket — ready meals, rotisserie chicken, sushi, deli platters. ~10 min off I-90 between Winthrop and SEA — natural Day-5 lunch stop.',
      },
      {
        name: 'Pabla Indian Cuisine',
        address: '364 Renton Center Way SW, Renton, WA 98057',
        phone: '(425) 228-4625',
        hechsher: 'Seattle Va\'ad (dairy)',
        note:
          'Vegetarian + dairy Indian. ~15 min from SEA. Sit-down option if the Day-5 wait stretches.',
        website: 'https://www.pablaindiancuisine.com/',
      },
      {
        name: 'Teapot Vegetarian House',
        address: '125 E Pine St, Seattle, WA 98122',
        hechsher: 'Seattle Va\'ad (pareve)',
        note: 'Vegan/pareve pan-Asian on Capitol Hill. Sit-down option if you want a Seattle dinner.',
      },
      {
        name: 'Einstein Bros. Bagels — University Village',
        address: '2746 NE 45th St, Seattle, WA 98105',
        phone: '(206) 522-1998',
        hechsher: 'Seattle Va\'ad',
        note:
          'Va\'ad-certified at this U-Village store only — the chain is not universally kosher. Good breakfast/lunch stop near UW.',
      },
      {
        name: 'QFC University Village — packaged kosher section',
        address: '2746 NE 45th St, Seattle, WA 98105',
        phone: '(206) 522-7440',
        hechsher: 'Seattle Va\'ad (packaged)',
        note: 'Packaged kosher selection, no hot deli counter. Smaller scope than Mercer Island.',
      },
      {
        name: 'Seattle Kosher (online grocery + prepared)',
        address: 'Delivery + online — seattlekosher.com',
        hechsher: 'Seattle Va\'ad',
        note: 'Order online for pickup or delivery — useful for a pre-trip stocking run.',
        website: 'https://seattlekosher.com/',
      },
    ],
  },
];

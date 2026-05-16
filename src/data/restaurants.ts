/**
 * Restaurants — practical mix.
 *
 * Both travelers keep kosher but flexibly (packaged hechsher goods + a fridge
 * cover the trip). This section lists:
 *   1. Worth-knowing places in the corridor towns (Marblemount, Winthrop) — non-
 *      kosher but useful to know when eating out makes sense.
 *   2. The handful of Va\'ad-certified kosher options in Seattle, for the Day-5
 *      stop or anyone who wants a kosher sit-down meal.
 *
 * No "NO KOSHER HERE" panic-blocks. The kosher footprint is tight and
 * informational.
 */

export interface Restaurant {
  name: string;
  address: string;
  note: string;
  phone?: string;
  /** Only filled for kosher-certified places. */
  hechsher?: string;
  website?: string;
}

export interface RestaurantTown {
  town: string;
  /** Optional 1-line context for the section. */
  context?: string;
  places: Restaurant[];
}

export const RESTAURANTS: RestaurantTown[] = [
  // ---------- Corridor (non-kosher; worth knowing) ----------
  {
    town: 'Marblemount · Rockport',
    context: 'Casual spots if eating out one night makes sense. No kosher restaurants in these towns — cabin dinners are the easier default.',
    places: [
      {
        name: 'Buffalo Run Restaurant',
        address: '60084 WA-20, Marblemount',
        note: 'American, elk + buffalo burgers, casual roadhouse.',
      },
      {
        name: 'Mondo Restaurant',
        address: '60102 WA-20, Marblemount',
        note: 'American + Korean fusion. Slightly higher reviews than Buffalo Run.',
      },
      {
        name: 'Birdsview Brewing Co',
        address: '38302 WA-20, Concrete (~25 min west of Marblemount)',
        note: 'Brewery + pub food on the drive in from Bellingham. Easy first-night option.',
      },
      {
        name: 'Marblemount Country Store',
        address: '59924 WA-20, Marblemount',
        note: 'Sandwiches + supplies. Useful trailhead-lunch stop.',
      },
    ],
  },
  {
    town: 'Winthrop · Mazama',
    context: 'Mix of casual and a nicer-night option. No kosher restaurants here either; eating in is the default but eating out works if the night calls for it.',
    places: [
      {
        name: 'Arrowleaf Bistro',
        address: '207 White Ave, Winthrop',
        note: 'Seasonal local cuisine, river deck. The nicer Winthrop dinner option — books up, reserve ~2 weeks out.',
      },
      {
        name: 'Old Schoolhouse Brewery',
        address: '155 Riverside Ave, Winthrop',
        note: 'Brewpub on the Chewuch River, live music summer weekends. Casual.',
      },
      {
        name: 'Rocking Horse Bakery',
        address: '265 Riverside Ave, Winthrop',
        note: 'Coffee, pastries, breakfast.',
      },
      {
        name: 'Mazama Store',
        address: '50 Lost River Rd, Mazama',
        note: 'Bakery + deli sandwiches + coffee. Great trailhead-lunch stop if staying near Freestone.',
      },
      {
        name: 'East 20 Pizza',
        address: '720 WA-20, Winthrop',
        note: 'Casual pizza option.',
      },
      {
        name: 'Three Fingered Jacks Saloon',
        address: '176 Riverside Ave, Winthrop',
        note: 'Old-west saloon, breakfast + dinner.',
      },
    ],
  },

  // ---------- Seattle kosher options ----------
  {
    town: 'Seattle — kosher options',
    context: 'Useful for the Day-5 stop or if eating kosher out matters that day. All Seattle Va\'ad-certified unless flagged otherwise.',
    places: [
      {
        name: 'QFC Mercer Island — kosher deli counter',
        address: '7823 SE 28th St, Mercer Island, WA 98040',
        phone: '(206) 230-0745',
        hechsher: 'Seattle Va\'ad',
        note:
          'Full kosher deli inside the QFC supermarket — ready meals, rotisserie chicken, sushi, deli platters. ~10 min off I-90 between Winthrop and SEA.',
      },
      {
        name: 'Pabla Indian Cuisine',
        address: '364 Renton Center Way SW, Renton, WA 98057',
        phone: '(425) 228-4625',
        hechsher: 'Seattle Va\'ad (dairy)',
        note: 'Vegetarian + dairy Indian. ~15 min from SEA. Sit-down option if the Day-5 wait stretches.',
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

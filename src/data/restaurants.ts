export interface Restaurant {
  name: string;
  address: string;
  note: string;
  phone?: string;
  hechsher?: string;
  website?: string;
}

export interface RestaurantTown {
  town: string;
  /** True if the town has zero kosher restaurants — fail-loud rule. */
  noKosher?: boolean;
  noKosherNote?: string;
  places: Restaurant[];
}

/**
 * KOSHER-ONLY. Both travelers keep kosher. Non-kosher listings removed.
 * Research date: May 15, 2026. Sources: Seattle Va'ad
 * (seattlevaad.org/kosher-portfolio), Chabad UW, Hillel UW, QFC Mercer Island.
 * Re-verify hours + hechsher within 2 weeks of departure.
 */
export const RESTAURANTS: RestaurantTown[] = [
  {
    town: 'Marblemount · Rockport · Concrete',
    noKosher: true,
    noKosherNote:
      'No kosher restaurants in any of these towns. Tiny rural communities (combined population under 1,200). Self-catering required for the two west-side nights — see the Food Strategy section. Confirmed via Seattle Va\'ad portfolio and a direct kosher-establishment search across Skagit County (May 15, 2026).',
    places: [],
  },
  {
    town: 'Winthrop · Mazama',
    noKosher: true,
    noKosherNote:
      'No kosher restaurants on the east side of the corridor. The Methow Valley has no Jewish community infrastructure — closest hechsher-certified kitchen is ~3.5 hrs back to Seattle. Self-catering only for the two east-side nights. The Mazama Store + Methow Valley grocery stops have packaged OU/OK goods for the cooler.',
    places: [],
  },
  {
    town: 'Bellingham (BLI fly-in)',
    noKosher: true,
    noKosherNote:
      'No Va\'ad-certified restaurants in Bellingham. Trader Joe\'s Bellingham (2410 James St, 360-734-5166) and the local Haggen + Fred Meyer carry packaged kosher (OU/OK) for stocking the cooler on arrival. Chabad of Whatcom County exists for Shabbat/community contact but no public kosher kitchen.',
    places: [],
  },
  {
    town: 'Seattle — kosher restaurants + delis',
    places: [
      {
        name: 'QFC Mercer Island — kosher deli counter',
        address: '7823 SE 28th St, Mercer Island, WA 98040',
        phone: '(206) 230-0745',
        hechsher: 'Seattle Va\'ad',
        note:
          'Best one-stop kosher pick in the Seattle area. Full kosher deli counter inside the QFC supermarket: ready-to-eat meals, rotisserie chicken, sushi, deli platters, meat + cheese. Pair with the grocery aisles for trip-prep stocking. North end of Mercer Island — 10 min from I-90, ~15 min from downtown.',
      },
      {
        name: 'QFC University Village — kosher section',
        address: '2746 NE 45th St, Seattle, WA 98105',
        phone: '(206) 522-7440',
        hechsher: 'Seattle Va\'ad (packaged kosher section)',
        note:
          'Smaller scope than Mercer Island — packaged kosher selection, not a hot deli counter. Useful if you base in Seattle proper for the Day-5 stop.',
      },
      {
        name: 'Einstein Bros. Bagels — University Village',
        address: '2746 NE 45th St, Seattle, WA 98105',
        phone: '(206) 522-1998',
        hechsher: 'Seattle Va\'ad',
        note:
          'CORRECTED 2026-05-15 — the Va\'ad-certified Einstein Bros. is the UNIVERSITY VILLAGE store (next door to QFC U-Village, same address block, different storefront), NOT a Renton or Tukwila location. The Einstein Bros. chain is NOT universally kosher — only this specific U-Village store is Va\'ad-supervised. If you\'re doing Mercer Island QFC for the deli run, U-Village is ~15 min north of it; if heading back to SEA from north, pass it on I-5. [verify hours pre-trip]',
      },
      {
        name: 'Pabla Indian Cuisine',
        address: '364 Renton Center Way SW, Renton, WA 98057',
        phone: '(425) 228-4625',
        hechsher: 'Seattle Va\'ad (dairy · chalav stam)',
        note:
          'Vegetarian + dairy Indian. ~15 min from SEA. Good sit-down dinner option if Day-5 wait stretches to 4+ hours.',
        website: 'https://www.pablaindiancuisine.com/',
      },
      {
        name: 'Teapot Vegetarian House',
        address: '125 E Pine St, Seattle, WA 98122',
        hechsher: 'Seattle Va\'ad (pareve)',
        note:
          'Vegan/pareve pan-Asian on Capitol Hill. ~15 min from downtown, ~25 min from SEA. Sit-down option if you want a real Seattle dinner that\'s still kosher.',
      },
      {
        name: 'Island Crust Café — CLOSED · NOT KOSHER',
        address: '7525 SE 24th St, Mercer Island, WA 98040',
        hechsher: 'NONE — certification lost October 2022',
        note:
          'DO NOT EAT HERE. Island Crust lost its Seattle Va\'ad certification in October 2022 after non-kosher cheese was discovered by a Va\'ad supervisor. The owner publicly announced he would reopen without kosher certification. Yelp lists the business as CLOSED as of October 2024. Listed here only as a NEGATIVE — flag for any older guide that still claims this is kosher. [verified 2026-05-15]',
      },
      {
        name: 'Seattle Kosher (online grocery + prepared)',
        address: 'Delivery + online — seattlekosher.com',
        hechsher: 'Seattle Va\'ad',
        note:
          'Order kosher groceries + prepared meals online for pickup or delivery — useful for a pre-trip stocking run before driving north from SEA.',
        website: 'https://seattlekosher.com/',
      },
    ],
  },
];

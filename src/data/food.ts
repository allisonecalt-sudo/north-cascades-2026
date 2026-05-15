/**
 * Food Strategy — Kosher.
 *
 * Both travelers keep kosher. The corridor (Marblemount → Winthrop) has
 * ZERO kosher restaurants and ZERO Jewish-community infrastructure. The
 * trip is self-catering with packaged + pre-prepped meals carried in from
 * Seattle/Bellingham.
 *
 * Research date: May 15, 2026.
 * Sources: Seattle Va'ad (seattlevaad.org/kosher-portfolio), Chabad UW,
 * Hillel UW, Trader Joe's locations, QFC Mercer Island. Re-verify hours
 * + hechsher within 2 weeks of departure.
 */

export interface GroceryStop {
  name: string;
  address: string;
  phone?: string;
  why: string;
  stockUp: string;
  hours?: string;
}

export interface PantryNote {
  topic: string;
  detail: string;
}

export interface ChabadContact {
  name: string;
  area: string;
  phone?: string;
  url?: string;
  note: string;
}

export const GROCERY_STOPS: GroceryStop[] = [
  {
    name: 'QFC Mercer Island (kosher deli counter)',
    address: '7823 SE 28th St, Mercer Island, WA 98040',
    phone: '(206) 230-0745',
    why: 'The single most important stop. Va\'ad-certified kosher deli inside a full supermarket — meat, cheese, rotisserie chicken, sushi, deli platters, plus the entire QFC packaged-kosher selection. ~15 min from downtown Seattle, ~25 min from SEA. Stop on Day 1 between airport and the drive north.',
    stockUp:
      'Deli sandwiches + wraps for the cooler · rotisserie chicken (vacuum-pack and freeze for night 2-3) · sliced deli meats + cheeses · fresh challah or rolls · prepared salads · hummus/dips',
    hours: '[verify hours — typically 6am-11pm]',
  },
  {
    name: 'Trader Joe\'s — Bellingham',
    address: '2410 James St, Bellingham, WA 98225',
    phone: '(360) 734-5166',
    why: 'If flying into BLI, this is the natural stocking stop before driving WA-20 east. TJ\'s carries ~600+ kosher-certified packaged items — OU/OK across most of its house-brand snacks, frozen meals, cheese, and pantry goods. ~10 min from the airport.',
    stockUp:
      'Packaged kosher cheeses · OU snacks (crackers, trail mix, dried fruit) · frozen pizzas/burritos · sealed tuna, salmon · OU peanut butter · yogurts · sealed challah/bread alternatives · OU coffee',
  },
  {
    name: 'Trader Joe\'s — Seattle (multiple locations)',
    address: 'Queen Anne · Capitol Hill · U-District',
    why: 'Same kosher-friendly inventory as Bellingham if flying SEA-roundtrip. Pair with the Mercer Island QFC stop for full menu coverage.',
    stockUp: 'Same packaged-kosher list as Bellingham TJ\'s.',
  },
  {
    name: 'Marblemount Country Store (FYI only)',
    address: '59924 WA-20, Marblemount, WA 98267',
    why: 'Not kosher-certified — listed only so you know what NOT to count on. Useful for sealed/OU-stamped grab items (water, sealed snacks, fresh fruit), nothing prepared.',
    stockUp:
      'Sealed bottled water · whole fruit · pre-packaged snacks with reliable hechsher only · OU candy bars · canned tuna with hechsher',
  },
  {
    name: 'Mazama Store (FYI only)',
    address: '50 Lost River Rd, Mazama, WA 98833',
    why: 'Bakery + deli — not kosher. Same role as Marblemount Country Store on the east side. Sealed packaged items + whole fruit only.',
    stockUp: 'Sealed snacks with hechsher · whole fruit · sealed drinks.',
  },
];

export const HIKE_LUNCHES: PantryNote[] = [
  {
    topic: 'Trail sandwiches + wraps',
    detail:
      'Build sandwiches the night before in the cabin: deli meat or cheese from QFC Mercer Island, on bagged rolls or wraps. Wrap tight in foil + zip-loc, pack in a soft-sided cooler with ice packs (freeze the packs overnight at the cabin).',
  },
  {
    topic: 'Hechshered hike snacks',
    detail:
      'Bissli, Bamba, Osem crackers, Kedem grape juice + tea biscuits all carry OU. Sealed Manischewitz crackers, Israeli/Sephardic snacks travel well — Trader Joe\'s Bellingham + Seattle stock most. Sealed cheese sticks (OU) handle a day in a cooler.',
  },
  {
    topic: 'Trail mix + bars',
    detail:
      'Most Clif Bars are OU-D. KIND Bars are widely OU. Trader Joe\'s house-brand trail mixes are mostly OU — double-check each bag at the shelf. Verify each bar before trip; some flavors are NOT certified even when the line is.',
  },
  {
    topic: 'Cooler discipline',
    detail:
      'Buy a styrofoam or soft cooler in Seattle/Bellingham + freeze ice packs at each cabin overnight. Daytime trailhead heat in Mazama can hit 85°F — keep meat + dairy in a separate cold layer with extra ice. Cascade Pass parking sits 60+ miles from any service — pack two backups per person (extra sandwich, extra bars).',
  },
];

export const HECHSHER_CHEAT: PantryNote[] = [
  {
    topic: 'OU (Orthodox Union)',
    detail:
      'The biggest North American certifier — circled U logo. Default-trust hechsher; on most QFC + TJ\'s packaged items.',
  },
  {
    topic: 'OK (OK Kosher Certification)',
    detail: 'K inside a circle. Widely accepted. Common on snacks + dairy.',
  },
  {
    topic: 'Star-K',
    detail: 'K inside a star. Baltimore-based, broadly accepted across communities.',
  },
  {
    topic: 'Kof-K',
    detail: 'K with a small "K" beside it. Widely accepted on prepared/packaged foods.',
  },
  {
    topic: 'CRC (Chicago Rabbinical Council)',
    detail: 'cRc logo. Reliable, common on Midwest-distributed products.',
  },
  {
    topic: 'Seattle Va\'ad',
    detail:
      'Local Pacific Northwest certifier (Va\'ad Harabanim of Greater Seattle). Certifies QFC Mercer Island + U-Village kosher sections, Einstein Bros. University Village (NOT Renton/Tukwila), Pabla Indian, Teapot Vegetarian, Seattle Kosher Catering, Leah\'s Catering. Standards aligned with OU.',
  },
  {
    topic: 'Plain "K"',
    detail:
      'A plain "K" without a recognized symbol behind it is NOT a reliable certification — anyone can print it. Pass on items marked only with a generic K.',
  },
];

export const CHABAD_CONTACTS: ChabadContact[] = [
  {
    name: 'Chabad at UW (Campus Chabad House)',
    area: 'University District, Seattle',
    url: 'https://www.jewishuw.com/',
    note:
      'Free 4-course Friday Shabbat dinner during the school year. Open community — call before showing up. Best emergency-kosher contact in north Seattle if a question or supply issue comes up.',
  },
  {
    name: 'Hillel UW',
    area: 'University District, Seattle',
    phone: '(206) 527-1997',
    url: 'https://www.hilleluw.org/',
    note:
      'Kosher Shabbat dinners (catered by Leah\'s Catering of Seattle, Va\'ad-certified) free every Friday in term. Hours Mon-Thu 9am-8pm, Fri 9am-4pm.',
  },
  {
    name: 'Chabad Lubavitch of Greater Seattle (Seward Park)',
    area: 'Seward Park (south Seattle)',
    url: 'https://www.chabadofseattle.org/',
    note:
      'Largest Orthodox Jewish community in Seattle is in Seward Park. Mikvah, daily minyan, kosher catering through Seattle Kosher Catering. Hub for any "I need real kosher fast" question.',
  },
  {
    name: 'Chabad of Bellevue / Kirkland (Eastside)',
    area: 'Bellevue + Kirkland (Eastside)',
    url: 'https://www.chabadbellevue.org/',
    note:
      'Closest Chabad to Mercer Island QFC. Maintains a kosher resource guide for visitors — call ahead for current restaurant + grocery picks.',
  },
  {
    name: 'Chabad of Whatcom County (Bellingham)',
    area: 'Bellingham',
    note:
      'Closest Jewish community to the BLI side of the trip. No public kosher kitchen, but the contact point if a kosher question comes up while basing on the west side. [verify current contact at chabad.org/centers]',
  },
];

export const FOOD_STRATEGY_SUMMARY =
  'Self-catering — there are zero kosher restaurants between Bellingham and Winthrop. The plan: stock up at QFC Mercer Island (full Va\'ad-certified deli) + Trader Joe\'s before leaving the city, cook in the cabin, pack hike lunches the night before. Every lodging recommendation flags its kitchen status. Re-verify hours + hechsher within 2 weeks of trip.';

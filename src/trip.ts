// ===========================================================================
// trip.ts — THE single data module for the North Cascades 2026 brochure.
//
// What this is: every fact the brochure renders — trip meta, the base, days +
//   day-shapes, the open lodging decision, practical notes, costs, on-trip kit.
//   Zero facts are hardcoded in index.html or main.ts; they all flow from here
//   (spec rule A7). ONE source of truth per fact.
// Why it exists: the old site contradicted itself (4 vs 5 bases, three "current
//   picks", drive times based on Marblemount after the house moved 40 min west).
//   This module is reconciled against BOOKED.md.
// What's decided: facts mined 2026-06-10 from BOOKED.md + trip-plan.md +
//   src/data/itinerary.ts (the corrected, west-rebased day plan, WTA stats) +
//   the old data files (lodging.ts for the 3 booked stays + prices + drive
//   times; viewpoints/hikes for photo credits). Drive times re-based from the
//   Sedro-Woolley / Arlington house, NOT from Marblemount.
// PRIVACY: this file is PUBLIC (GitHub Pages). NO Airbnb confirmation codes
//   (HM…), NO eTicket numbers, NO seat numbers, NO fares, NO the unconfirmed
//   private Sedro-Woolley street address. The public site shows flight numbers
//   + times only (BOOKED.md rule). Privacy-check.mjs is the hard gate.
//
// WA-20 caveat (fail-loud, dated): WSDOT now targets a FULL reopen of SR-20 on
//   Fri Jun 19, 2026 (verified Jun 10 2026 via Cascadia Daily News + Whatcom
//   News — accelerated from the earlier Jul 4 / Jun 25 estimates; Diablo Lake
//   Overlook + Ross Dam already reopened May 30). The east-side day still
//   carries an honest re-check line because the timeline depends on weather.
//   Source: https://wsdot.wa.gov/travel/real-time/mountainpasses/north-cascade-hwy
// ===========================================================================

export interface TripMeta {
  name: string;
  subtitle: string;
  dateRange: string;
  travelers: string;
  nights: number;
  statusLine: string;
  heroPhoto: Photo;
}

export interface Photo {
  /** Working image URL — local file under public/img (served at /img/...). */
  src: string;
  /** Label shown over the photo — every photo has a JOB (spec rule A8). */
  label: string;
  /** Alt text for screen readers / fail-loud if the image 404s. */
  alt: string;
  /** Source credit. */
  credit: string;
}

// --- Place links (spec rule A9b — pins + websites always reachable) ----------
// Every named place carries TWO standing links in one predictable spot:
//   📍 Navigate → Google Maps · ↗ Website → official page.
// `query` is always present (builds the Google Maps search URL). `website` is
// OPTIONAL — if no trustworthy URL exists it is OMITTED (never invented). The
// three BOOKED Airbnbs have NO listing URL captured anywhere in the repo, so
// they render with 📍 Navigate only — the omission is honest, not faked.
export interface PlaceLinks {
  /** Exact "place name, town" used to build the Google Maps search URL. */
  query: string;
  /** Real official URL, or undefined when none is trustworthy. */
  website?: string;
}

/** Build a Google Maps search URL from an exact place query (spec A9b). */
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Icon-coded one-line block on a day card (spec B3). */
export type BlockIcon = 'drive' | 'activity' | 'sunset' | 'food' | 'stay' | 'time';

export interface DayBlock {
  icon: BlockIcon;
  /** The scannable one-liner (label-style, ≤ ~12 words). */
  line: string;
  /** Drive time shown ON the line — "· 1h15 from base" (DELTA 4). */
  driveFromBase?: string;
  /** Optional tap-to-expand detail (recommendation, not order). */
  detail?: string;
  /** A named place → gets 📍 Navigate + ↗ Website as the LAST line of its detail. */
  place?: { name: string; links: PlaceLinks };
  /** Fail-loud WA-20 caveat — renders as a dated re-check banner on this block. */
  wa20?: boolean;
}

// --- Day-shape options (spec rule, DELTA 3) ---------------------------------
// On the three full days, instead of a bare "pick one" list, offer 2–3 FULLY
// FORMED day shapes. Each shape = a complete scheduled mini-plan: morning →
// afternoon → golden-hour close, every stop a named place with its drive time
// from the (still-undecided) base. Calm, suggestive, pickable.
export interface ShapeStop {
  /** Part of day: "Morning" / "Afternoon" / "Golden hour". */
  when: string;
  /** The named place. */
  place: string;
  /** Drive time from base, e.g. "1h15 from base" (or "" for at-the-house). */
  drive: string;
  /** One-line what-you-do. */
  line: string;
  /** Tap-to-expand detail + (last line) the place links. */
  detail?: string;
  links?: PlaceLinks;
  /** Fail-loud WA-20 caveat on an east-side stop. */
  wa20?: boolean;
}

export interface DayShape {
  /** Concrete shape name — "The Cascade Pass day", not a mood. */
  name: string;
  /** ≤14-word one-line summary of the shape. */
  summary: string;
  /** Morning → afternoon → golden-hour stops. */
  stops: ShapeStop[];
}

export interface Day {
  id: string;
  /** "Sun Aug 16" — short, for the heading. */
  dateLabel: string;
  dayOfWeek: string;
  /** Short title — one idea for the day. */
  title: string;
  /** Logistics string that rides in the heading: drive time / move note. */
  logistics: string;
  /** The single fixed-slot labeled photo for the day. */
  photo: Photo;
  /** ≤50-word TLDR — what the day is about. */
  tldr: string;
  /** 3–5 icon-coded blocks. */
  blocks: DayBlock[];
  /** Free-day day-shape options (DELTA 3) — renders under the blocks. */
  shapes?: DayShape[];
}

export type BaseStatus = 'booked' | 'open';

export interface Base {
  id: string;
  /** Public-facing name (no conf code, no street address). */
  name: string;
  town: string;
  nights: number;
  dateLabel: string;
  status: BaseStatus;
  /** Whether this candidate is the suggested lean (★). */
  recommended?: boolean;
  /** Who holds it (Allison / Erin). */
  heldBy: string;
  /** Short scannable chips (beds · kitchen · drive). */
  chips: string[];
  /** ≤50-word what-it-is. */
  blurb: string;
  photo: Photo;
  /** True when `photo` is a representative North-Cascades shot, NOT the listing
   *  itself — renders a fail-loud "representative photo" banner (old-site honesty). */
  representativePhoto?: boolean;
  /** 📍 Navigate (+ ↗ Website only if a real listing URL exists — none do). */
  links: PlaceLinks;
  /** Drive to the Marblemount-area trailheads, the trip's anchor. */
  driveToTrailheads: string;
}

// --- On-trip kit (spec rule A9b, DELTA 2) -----------------------------------
export interface KitPlace {
  name: string;
  links: PlaceLinks;
}
export interface KitGroup {
  base: string;
  places: KitPlace[];
}

export interface OpenDecision {
  /** Ask-framed headline (spec rule A9). */
  ask: string;
  leaning: string;
  options: { name: string; note: string; recommended: boolean }[];
  freshness: string;
}

export interface PracticalNote {
  label: string;
  body: string;
}

export interface Costs {
  headline: string;
  approx: string;
  basis: string;
  perPerson: { who: string; amount: string; note: string }[];
}

export interface TripData {
  meta: TripMeta;
  /** The three candidate west-side houses (the open decision is which ONE). */
  bases: Base[];
  days: Day[];
  openDecision: OpenDecision;
  practical: PracticalNote[];
  costs: Costs;
  kit: KitGroup[];
  /** The one honest WA-20 caveat line, dated — rendered wherever wa20:true. */
  wa20Caveat: string;
  /** WSDOT real-time page for the caveat link. */
  wa20Url: string;
}

// --- Local photos (mined from public/img — they actually show the place) -----
// All served from /img/… (vite copies public/ to the dist root). Eager-loaded
// in main.ts so full-page screenshots never catch an empty frame.
const P = {
  diabloLake: {
    src: 'img/diablo-lake-from-overlook-03.jpg',
    label: 'Diablo Lake from the WA-20 overlook — the signature turquoise',
    alt: 'Turquoise Diablo Lake from the WA-20 overlook, surrounded by forested peaks.',
    credit: 'Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
  },
  diabloPyramid: {
    src: 'img/pyramid-peak-reflected-in-diablo-lake.jpg',
    label: 'Pyramid Peak reflected in Diablo Lake',
    alt: 'Pyramid Peak reflected in the turquoise water of Diablo Lake in summer.',
    credit: 'Ron Clausen · CC BY-SA 4.0 (Wikimedia)',
  },
  cascadePass: {
    src: 'img/cascade-pass-in-wa.jpg',
    label: 'Cascade Pass — the west-side postcard',
    alt: 'Summer view from Cascade Pass looking into the Stehekin valley with glaciated peaks beyond.',
    credit: 'Jeffhollett · CC BY-SA 4.0 (Wikimedia)',
  },
  sahaleArm: {
    src: 'img/sahale-arm-in-wa.jpg',
    label: 'Sahale Arm — the whole park from the ridge',
    alt: 'Sahale Arm ridge climbing above Cascade Pass with glaciated peaks all around.',
    credit: 'Wikimedia · CC',
  },
  maplePass: {
    src: 'img/view-from-maple-pass.jpg',
    label: 'Maple Pass — the east-side ridgeline loop',
    alt: 'Panoramic ridgeline view from Maple Pass over alpine valleys and Lake Ann.',
    credit: 'Wikimedia · CC BY 2.0',
  },
  rainyLake: {
    src: 'img/rainy-lake-im-north-cascades-national-park.jpg',
    label: 'Rainy Lake — paved, easy, alpine cirque',
    alt: 'Rainy Lake basin in North Cascades National Park — alpine cirque with waterfalls down the back wall.',
    credit: 'Wikimedia · CC',
  },
  blueLake: {
    src: 'img/blue-lake-in-okanogan-national-forest.jpg',
    label: 'Blue Lake under the Liberty Bell group',
    alt: 'Blue Lake under the granite spires of the Liberty Bell group on a clear summer day.',
    credit: 'Miguel Vieira · CC BY 2.0 (Wikimedia)',
  },
  washingtonPass: {
    src: 'img/washington-pass-overlook.jpg',
    label: 'Washington Pass Overlook — Liberty Bell',
    alt: 'Liberty Bell Mountain and Early Winters Spires above the WA-20 hairpin from Washington Pass Overlook.',
    credit: 'Laurel F · CC BY-SA 2.0 (Wikimedia)',
  },
  artistPoint: {
    src: 'img/artist-point-at-north-cascades-in-wa.jpg',
    label: 'Artist Point — Baker + Shuksan side',
    alt: 'Artist Point at the end of Mt. Baker Highway with alpine peaks and meadows.',
    credit: 'Wikimedia · CC',
  },
  shuksanTarn: {
    src: 'img/mount-shuksan-tarn.jpg',
    label: 'Mount Shuksan over an alpine tarn, Heather Meadows',
    alt: 'Mount Shuksan reflected in an alpine tarn in the Heather Meadows area.',
    credit: 'Wikimedia · CC',
  },
  ladderCreek: {
    src: 'img/ladder-creek-falls-at-newhalem-wa.jpg',
    label: 'Ladder Creek Falls, Newhalem — lit after dusk',
    alt: 'Ladder Creek Falls plunging through narrow mossy granite walls behind the Gorge Powerhouse in Newhalem.',
    credit: 'Ron Clausen · CC BY-SA 4.0 (Wikimedia)',
  },
  rossLake: {
    src: 'img/ross-lake-morning.jpg',
    label: 'Ross Lake in the morning',
    alt: 'Ross Lake at first light, framed by the North Cascades.',
    credit: 'Wikimedia · CC',
  },
  highwayCol: {
    src: 'img/north-cascades-highway-from-burgundy-col.jpg',
    label: 'The North Cascades from above the highway',
    alt: 'The North Cascades and WA-20 corridor seen from Burgundy Col in summer.',
    credit: 'Wikimedia · CC',
  },
  methowRiver: {
    src: 'img/methow-river.jpg',
    label: 'The Methow River, east-side valley',
    alt: 'The Methow River running clear through the east-side valley near Winthrop.',
    credit: 'Wikimedia · CC',
  },
  methowSunset: {
    src: 'img/methow-river-near-pateros-at-sunset.jpg',
    label: 'Methow River at sunset',
    alt: 'The Methow River near Pateros glowing at sunset.',
    credit: 'Wikimedia · CC',
  },
  winthrop: {
    src: 'img/winthrop-usa-19801491829.jpg',
    label: 'Winthrop — the old-west boardwalk town',
    alt: 'The old-west boardwalk main street of Winthrop, Washington in summer.',
    credit: 'Wikimedia · CC',
  },
  pattersonLake: {
    src: 'img/pattersonlake-winthrop.jpg',
    label: 'Patterson Lake near Winthrop',
    alt: 'Patterson Lake near Winthrop with a calm reflection of the Cascades in summer.',
    credit: 'Wikimedia · CC',
  },
} as const satisfies Record<string, Photo>;

// The single WA-20 caveat line + WSDOT link (fail-loud, dated). Rendered as a
// banner on every block/stop flagged wa20:true — the east-side destinations.
const WA20_CAVEAT =
  'WA-20 (SR-20) reopen target Fri Jun 19, 2026 — verified Jun 10. The Diablo Lake & Ross Dam stretch already reopened May 30; the last closed section is on track but weather-dependent. Re-check WSDOT before this day.';
const WA20_URL = 'https://wsdot.wa.gov/travel/real-time/mountainpasses/north-cascade-hwy';

export const TRIP: TripData = {
  meta: {
    name: 'North Cascades',
    subtitle: 'Turquoise lakes, alpine passes, a slow sunset to close each day',
    dateRange: 'Sun Aug 16 – Thu Aug 20, 2026',
    travelers: 'Allison + Erin',
    nights: 4,
    statusLine: 'Flights booked ✓ · one west-side house to pick from three',
    heroPhoto: P.diabloLake,
  },

  // The THREE candidate houses — all held for Aug 16–20, all west of the WA-20
  // corridor. The open decision is which ONE to keep; cancel the other two
  // before their free-cancel windows. No Airbnb listing URL exists in the repo
  // for any of them → 📍 Navigate only (honest omission, not a fake link).
  bases: [
    {
      id: 'carriage-house',
      name: 'The Carriage House',
      town: 'Sedro-Woolley, WA',
      nights: 4,
      dateLabel: 'Sun Aug 16 – Thu Aug 20',
      status: 'open',
      recommended: true,
      heldBy: 'Erin booked',
      chips: [
        '5.0★ · 12 reviews',
        'Guest favorite',
        '2 bd · 2 beds · sleeps 4',
        'Full kitchen',
        '~1h15 to trailheads',
      ],
      blurb:
        'Entire guesthouse — 2 bedrooms, 2 beds, full kitchen + dishwasher + washer/dryer + AC, self check-in. Rails-to-Trails path behind the property. 5.0★ over 12 reviews, guest-favorite / top-10% of homes. The strongest fit for the “cook kosher + two real beds” brief.',
      photo: P.methowRiver,
      representativePhoto: true,
      links: { query: 'Sedro-Woolley Washington' },
      driveToTrailheads: '~1h15 to Marblemount-area trailheads',
    },
    {
      id: 'lakeside-cabin',
      name: 'Lakeside Cabin w/ Dock, Boats & Stunning Views',
      town: 'Sedro-Woolley, WA',
      nights: 4,
      dateLabel: 'Sun Aug 16 – Thu Aug 20',
      status: 'open',
      heldBy: 'Allison booked',
      chips: [
        'Sleeps 4',
        'Lakefront + private dock',
        'Boats (fish/swim)',
        'Closest — on SR-20',
        '~1h15 to trailheads',
      ],
      blurb:
        'Lakefront cabin with a private dock and boats — fish or swim off the back. Host (Jackie) actively engaged. Sits closest to the corridor of the three, right on SR-20. ~$1,193 for the 4 nights. The “water at the door, slow-cabin day” option.',
      photo: P.pattersonLake,
      representativePhoto: true,
      links: { query: 'Sedro-Woolley Washington lakefront' },
      driveToTrailheads: '~1h15 to Marblemount-area trailheads (closest)',
    },
    {
      id: 'jade-river',
      name: 'Jade River Haven',
      town: 'Arlington, WA',
      nights: 4,
      dateLabel: 'Sun Aug 16 – Thu Aug 20',
      status: 'open',
      heldBy: 'Allison booked',
      chips: [
        'Sleeps 6',
        'Brand-new build',
        'Gas fireplace',
        '500 ft private riverfront',
        '~1h30 to trailheads',
      ],
      blurb:
        'Brand-new build with a gas fireplace and 500 ft of private river frontage in the forest — the newest/nicest interior of the three. Off Hwy-530, ~20 min farther from the corridor than the Sedro-Woolley pair. ~$1,126 for the 4 nights. The “most polished house, longest drive” option.',
      photo: P.methowSunset,
      representativePhoto: true,
      links: { query: 'Arlington Washington' },
      driveToTrailheads: '~1h30 to Marblemount-area trailheads (farthest)',
    },
  ],

  days: [
    {
      id: 'sun-aug-16',
      dateLabel: 'Sun Aug 16',
      dayOfWeek: 'Sunday',
      title: 'Land at SEA, stock up, drive north, settle in',
      logistics: 'Land SEA 11:03 · stock-up + drive ~1h30 to the house',
      photo: P.highwayCol,
      tldr: 'Land 11:03 on UA1330, grab the rental car at SEA, do the kosher stock-up at QFC University Village on the way out, then drive ~1h30 up I-5 to the booked west-side house. Easy evening — unpack, cook in, settle.',
      blocks: [
        { icon: 'time', line: 'Land SEA 11:03 (UA1330) → collect rental car at SEA' },
        {
          icon: 'food',
          line: 'Kosher stock-up at QFC University Village',
          driveFromBase: 'on the way out of Seattle',
          detail:
            'QFC U-Village (2746 NE 45th St) for OU/Star-K/Kof-K packaged items + a kosher deli counter; Trader Joe’s nearby for hechsher cheese, bread, snacks. This is the trip’s one real grocery run — the house has a full kitchen and there are no kosher restaurants up north. Buy for all 4 nights.',
          place: {
            name: 'QFC University Village, Seattle',
            links: { query: 'QFC University Village 2746 NE 45th St Seattle' },
          },
        },
        {
          icon: 'drive',
          line: 'Drive Seattle → the booked house',
          driveFromBase: '~1h30 up I-5 N',
          detail:
            '~75–80 mi up I-5 N. ~1h30 to Sedro-Woolley (Carriage House / Lakeside Cabin); Arlington (Jade River) is ~20 min closer off Hwy-530. Settle the exact figure once the house is picked.',
        },
        {
          icon: 'stay',
          line: 'Check in + cook the first dinner at the house',
          detail:
            'Full-kitchen house — easy first night. The Marblemount cluster is ~1h15 east, so the Newhalem / Ladder Creek orientation drive is better saved for a hike day than tonight. Unwind at the house.',
        },
      ],
    },
    {
      id: 'mon-aug-17',
      dateLabel: 'Mon Aug 17',
      dayOfWeek: 'Monday',
      title: 'A full day in the park',
      logistics: 'Full day · a day from here could look like…',
      photo: P.cascadePass,
      tldr: 'First full day. Three shapes it could take — the big west-side hike (Cascade Pass), the easy turquoise-lakes loop (Diablo Lake + Thunder Knob), or the Mt. Baker side (Artist Point). Each is fully planned below, drive times from the house, golden-hour close.',
      blocks: [
        {
          icon: 'time',
          line: 'Cascade River Rd parking fills by ~9–10am in August — early start',
          detail:
            'For the Cascade Pass shape: trailhead parking fills early. Aim to leave the house by ~6:30–7am given the ~1h15 + Cascade River Rd leg. The other two shapes are far more relaxed on timing.',
        },
      ],
      shapes: [
        {
          name: 'The Cascade Pass day',
          summary: 'The west-side postcard hike — wide alpine pass, glaciers all around.',
          stops: [
            {
              when: 'Morning',
              place: 'Cascade Pass trailhead (Cascade River Rd)',
              drive: '~2h15 from base',
              line: 'Drive in, climb the switchbacks to the pass at 5,400 ft',
              detail:
                '~50 min to the Marblemount area + ~1h up Cascade River Rd (final 13 mi compacted dirt + gravel, any car with reasonable clearance is fine, go slow). Cascade Pass: 7.0 mi RT · ~1,800 ft gain · 3.5–4 hrs, moderate (WTA). Pack lunch + 2L water each — no services at the trailhead.',
              links: {
                query: 'Cascade Pass Trailhead North Cascades',
                website: 'https://www.wta.org/go-hiking/hikes/cascade-pass',
              },
            },
            {
              when: 'Afternoon',
              place: 'Sahale Arm add-on (only if both feel strong)',
              drive: 'from the pass',
              line: 'Optional ridge climb for the whole-park view',
              detail:
                'Cascade Pass + Sahale Arm: 12.8 mi RT · ~4,100 ft gain · 7–8 hrs, strenuous. The postcard of the whole park. With the longer drive from the west-side house this needs a very early start — judge it on the morning, no pressure.',
              links: {
                query: 'Sahale Arm North Cascades',
                website: 'https://www.wta.org/go-hiking/hikes/sahale-arm',
              },
            },
            {
              when: 'Golden hour',
              place: 'Back at the house',
              drive: '~2h15 back to base',
              line: 'Drive back, cook in, early night after a big day',
              detail:
                'Long drive home after a long hike — pasta + sealed sauce is the easy post-hike dinner. Sunset on the drive back down the Skagit valley.',
            },
          ],
        },
        {
          name: 'The Diablo Lake day',
          summary: 'Turquoise lakes + an easy Thunder Knob walk — no big climb.',
          stops: [
            {
              when: 'Morning',
              place: 'Diablo Lake Overlook',
              drive: '~1h45 from base',
              line: 'The signature turquoise glacier-flour lake from above',
              detail:
                'MP 132 on WA-20 — large parking, restrooms, interpretive shelter. The signature North Cascades photo. Already reopened May 30, so this is accessible regardless of the last closed stretch. 20–30 min.',
              links: { query: 'Diablo Lake Overlook WA-20' },
              wa20: true,
            },
            {
              when: 'Afternoon',
              place: 'Thunder Knob Trail (Colonial Creek)',
              drive: '~1h40 from base',
              line: 'Easy 3.6 mi to a Diablo Lake view from above',
              detail:
                'Trailhead at Colonial Creek South Campground (MP 130). 3.6 mi RT · ~635 ft gain · 1.5–2 hrs, easy-moderate. Picnic lunch at Colonial Creek. A gentle counter-day to the Cascade Pass effort.',
              links: {
                query: 'Thunder Knob Trailhead Colonial Creek',
                website: 'https://www.wta.org/go-hiking/hikes/thunder-knob',
              },
              wa20: true,
            },
            {
              when: 'Golden hour',
              place: 'Ladder Creek Falls, Newhalem',
              drive: '~1h30 from base',
              line: 'Short lit falls loop on the way home',
              detail:
                'MP 120, behind the Gorge Powerhouse in Newhalem. Short paved ~0.5 mi loop, lit from dusk to 11pm — a lovely easy close before the drive back to the house.',
              links: { query: 'Ladder Creek Falls Newhalem' },
            },
          ],
        },
        {
          name: 'The Mt. Baker day',
          summary: 'Baker + Shuksan from Artist Point — a WA-20-free option.',
          stops: [
            {
              when: 'Morning',
              place: 'Artist Point (Heather Meadows)',
              drive: '~1h45 from base',
              line: 'Drive WA-542 up to the road’s end for Baker + Shuksan',
              detail:
                'Mt. Baker side via WA-542 from the Bellingham direction — does NOT depend on the WA-20 east-side reopen, so it’s the natural backup if the corridor or smoke is a problem. Easy walking among alpine lakes with Baker + Shuksan in view.',
              links: {
                query: 'Artist Point Mount Baker Highway',
                website: 'https://www.wta.org/go-hiking/hikes/heather-meadows',
              },
            },
            {
              when: 'Afternoon',
              place: 'Chain Lakes / Picture Lake stroll',
              drive: 'at Artist Point',
              line: 'Tarns + the classic Shuksan reflection',
              detail:
                'The Heather Meadows / Picture Lake area has the famous Shuksan-reflected-in-the-tarn shot, plus easy walks around the Chain Lakes. As far or as little as legs want.',
              links: { query: 'Picture Lake Heather Meadows Mount Baker' },
            },
            {
              when: 'Golden hour',
              place: 'Back at the house',
              drive: '~1h45 back to base',
              line: 'Drive down off the mountain, cook in',
              detail:
                'Long alpine evening light on the WA-542 descent, then home to the house for dinner.',
            },
          ],
        },
      ],
    },
    {
      id: 'tue-aug-18',
      dateLabel: 'Tue Aug 18',
      dayOfWeek: 'Tuesday',
      title: 'A full day in the park',
      logistics: 'Full day · a day from here could look like…',
      photo: P.diabloPyramid,
      tldr: 'Second full day. Two clear shapes — the east-side classic (Maple Pass Loop, WA-20-dependent) or an easy lakes-and-viewpoints drive along WA-20 (Diablo, Ross Lake, Rainy Lake). Whatever you pick, a lakeside golden hour closes it.',
      blocks: [
        {
          icon: 'time',
          line: 'Pick by the morning’s weather + WA-20 status',
          detail:
            'If the corridor is fully open and clear, the east-side Maple Pass shape is the headline. If you’d rather a low-effort day or the corridor is still patchy, the lakes-and-viewpoints drive is the calm pick.',
          wa20: true,
        },
      ],
      shapes: [
        {
          name: 'The Maple Pass day',
          summary: 'The east-side classic loop — meadows, ridgeline, Lake Ann below.',
          stops: [
            {
              when: 'Morning',
              place: 'Rainy Pass trailhead (Maple Pass Loop)',
              drive: '~2h15 from base',
              line: 'Counterclockwise loop up to the panoramic ridge',
              detail:
                'MP 158 on WA-20 (east end of the corridor — depends on the full reopen). Maple Pass Loop: 7.2 mi loop · ~2,020 ft gain · 4–5 hrs, moderate (WTA). Counterclockwise is easier on the knees. Optional 1-mi spur down to Lake Ann.',
              links: {
                query: 'Rainy Pass Maple Pass Trailhead WA-20',
                website: 'https://www.wta.org/go-hiking/hikes/maple-pass',
              },
              wa20: true,
            },
            {
              when: 'Afternoon',
              place: 'Blue Lake (shorter alternate)',
              drive: '~2h15 from base',
              line: 'Or the easier 4.4 mi lake under Liberty Bell',
              detail:
                'If Maple Pass is too much: Blue Lake, 4.4 mi RT · ~1,050 ft · 2–3 hrs, easy-moderate, trailhead MP 161. An alpine lake right under the Liberty Bell spires. (Cutthroat Pass via the PCT, 10 mi RT, is the harder alternate if you want bigger.)',
              links: {
                query: 'Blue Lake Trailhead WA-20 North Cascades',
                website: 'https://www.wta.org/go-hiking/hikes/blue-lake',
              },
              wa20: true,
            },
            {
              when: 'Golden hour',
              place: 'Washington Pass Overlook on the way back',
              drive: '~2h10 from base',
              line: 'Quick paved walk to the Liberty Bell ledge view',
              detail:
                'MP 162 — a short 400-ft paved trail to a dramatic ledge over Liberty Bell + Early Winters Spires + the WA-20 hairpin. 20 min, fully accessible. A perfect last-light stop before the long drive home.',
              links: { query: 'Washington Pass Overlook WA-20' },
              wa20: true,
            },
          ],
        },
        {
          name: 'The lakes & viewpoints day',
          summary: 'An easy WA-20 drive — Diablo, Ross Lake, Rainy Lake, all paved.',
          stops: [
            {
              when: 'Morning',
              place: 'Diablo Lake + Ross Lake Overlooks',
              drive: '~1h45 from base',
              line: 'The two turquoise-lake pull-offs, back to back',
              detail:
                'Diablo Lake Overlook (MP 132) then Ross Lake Overlook (MP 135) — both already reopened May 30. Big views, short walks, restrooms at Diablo. The signature lake photos with almost no effort.',
              links: { query: 'Ross Lake Overlook WA-20' },
              wa20: true,
            },
            {
              when: 'Afternoon',
              place: 'Rainy Lake (paved, easy)',
              drive: '~2h from base',
              line: 'Flat 1.8 mi paved walk to an alpine cirque lake',
              detail:
                'MP 158 — a wheelchair-accessible 1.8 mi RT paved path to Rainy Lake, an alpine cirque with waterfalls down the back wall. The gentlest way to stand at a high alpine lake. (East end of the corridor — same WA-20 caveat.)',
              links: {
                query: 'Rainy Lake Trailhead WA-20 North Cascades',
                website: 'https://www.wta.org/go-hiking/hikes/rainy-lake',
              },
              wa20: true,
            },
            {
              when: 'Golden hour',
              place: 'Ladder Creek Falls or a Diablo pull-off',
              drive: '~1h30 from base',
              line: 'Easy lit-falls loop, then drive home',
              detail:
                'Close at Ladder Creek Falls in Newhalem (short paved loop, lit at dusk) on the way out, or just linger at a Diablo Lake pull-off for last light. Home to cook in.',
              links: { query: 'Ladder Creek Falls Newhalem' },
            },
          ],
        },
      ],
    },
    {
      id: 'wed-aug-19',
      dateLabel: 'Wed Aug 19',
      dayOfWeek: 'Wednesday',
      title: 'A full day in the park',
      logistics: 'Full day · a day from here could look like…',
      photo: P.blueLake,
      tldr: 'Last full day. Two shapes — the second big hike (whichever of Cascade Pass / Maple Pass you didn’t do), or a slow lakeside-cabin day at the house with a short local walk. You’ve earned the choice. Golden hour to close.',
      blocks: [
        {
          icon: 'sunset',
          line: 'However the day goes — a lakeside or river golden hour to close',
          place: {
            name: 'Sedro-Woolley / Skagit valley',
            links: { query: 'Sedro-Woolley Washington' },
          },
        },
      ],
      shapes: [
        {
          name: 'The second-big-hike day',
          summary: 'Do the other marquee trail — the one you skipped Monday/Tuesday.',
          stops: [
            {
              when: 'Morning',
              place: 'Cascade Pass OR Maple Pass (whichever is left)',
              drive: '~2h15 from base',
              line: 'The second signature trail of the trip',
              detail:
                'If you did Cascade Pass earlier, do Maple Pass now (east side, WA-20-dependent); if you did Maple Pass, do Cascade Pass (west side, Cascade River Rd). Same stats as before — early start, packed lunch, 2L water each.',
              links: { query: 'North Cascades National Park trailheads' },
              wa20: true,
            },
            {
              when: 'Afternoon',
              place: 'Winthrop walkabout (if east-side)',
              drive: '~2h from base',
              line: 'Old-west boardwalk + ice cream, if you’re out east',
              detail:
                'Only if you went east for Maple Pass: the Winthrop boardwalk on Riverside Ave, Sheri’s Sweet Shoppe for ice cream, a stretch by the Methow River before the long drive back. (If you stayed west for Cascade Pass, skip — it’s the wrong direction.)',
              links: { query: 'Winthrop Washington downtown boardwalk' },
              wa20: true,
            },
            {
              when: 'Golden hour',
              place: 'Back at the house',
              drive: '~2h15 back to base',
              line: 'Drive home, last big dinner in',
              detail:
                'The nicer cook-in night — sealed kosher meats or the Seattle-Kosher prepared meals if you stocked them. Sunset on the Skagit valley drive.',
            },
          ],
        },
        {
          name: 'The easy house day',
          summary: 'Stay close — the dock, a short local walk, a real rest day.',
          stops: [
            {
              when: 'Morning',
              place: 'At the house (dock / Rails-to-Trails)',
              drive: 'at the house',
              line: 'Slow morning — water, coffee, the path out back',
              detail:
                'If you picked the Lakeside Cabin: the dock + boats are right there (fish or swim). If the Carriage House: the Rails-to-Trails path runs behind the property. Either way, a genuine rest morning after two hike days.',
              links: { query: 'Sedro-Woolley Washington' },
            },
            {
              when: 'Afternoon',
              place: 'Rasar State Park / Cascade Trail (Sedro-Woolley)',
              drive: '~15–25 min from base',
              line: 'Easy flat Skagit-riverside or rail-trail walk',
              detail:
                'Rasar State Park has easy flat trails along the Skagit River; the Cascade Trail (rail-trail) runs Sedro-Woolley → Concrete. A short, scenic, zero-effort leg-stretch close to the house.',
              links: {
                query: 'Rasar State Park Sedro-Woolley Washington',
                website: 'https://parks.wa.gov/find-parks/state-parks/rasar-state-park',
              },
            },
            {
              when: 'Golden hour',
              place: 'At the house',
              drive: 'at the house',
              line: 'Last sunset from the dock or deck',
              detail:
                'No driving needed — a quiet last evening at the house before the travel day.',
              links: { query: 'Sedro-Woolley Washington' },
            },
          ],
        },
      ],
    },
    {
      id: 'thu-aug-20',
      dateLabel: 'Thu Aug 20',
      dayOfWeek: 'Thursday',
      title: 'Slow morning, drive to SEA for the redeye',
      logistics: 'Full day · only ~1h30 back to SEA from the west house',
      photo: P.rossLake,
      tldr: 'The redeye home isn’t until 10:58 PM, so Thursday is a full, unhurried day. From the west-side house it’s only ~1h30 back to SEA — so a slow morning, an easy add, lunch on the way, and an evening drive to the airport.',
      blocks: [
        { icon: 'time', line: 'Slow morning at the house — pack out unhurried' },
        {
          icon: 'activity',
          line: 'Optional easy add near the house or en route',
          driveFromBase: '~15–60 min',
          detail:
            'A last Skagit-valley walk (Rasar State Park / Cascade Trail), or save it for a Seattle stop. Because the house is west-side, there’s no 4-hour Winthrop→SEA drive — the day is genuinely relaxed.',
          place: {
            name: 'Rasar State Park, Sedro-Woolley',
            links: {
              query: 'Rasar State Park Sedro-Woolley Washington',
              website: 'https://parks.wa.gov/find-parks/state-parks/rasar-state-park',
            },
          },
        },
        {
          icon: 'drive',
          line: 'Drive house → SEA',
          driveFromBase: '~1h30 down I-5 S',
          detail:
            'Only ~75–80 mi back to SEA from the Sedro-Woolley / Arlington area. Lunch on the way — an easy Skagit Valley or north-Seattle stop; QFC Mercer Island has a Va’ad kosher deli counter for a sit-down before the flight if you want one.',
          place: {
            name: 'QFC Mercer Island (Va’ad kosher deli)',
            links: { query: 'QFC Mercer Island Washington' },
          },
        },
        {
          icon: 'time',
          line: 'Return flight — UA2017 redeye, departs SEA 10:58 PM',
          detail:
            'Departs SEA 10:58 PM Thu, lands EWR 7:10 AM Fri Aug 21. A full day in WA — no rush to the airport until the evening. Return the rental car at SEA before the flight.',
        },
      ],
    },
  ],

  openDecision: {
    ask: 'The one open decision: which of the three held houses do you keep?',
    leaning:
      'Leaning The Carriage House (Sedro-Woolley) — 5.0★/12, guest favorite, two real beds + full kitchen for cooking kosher, closest tier on drive, and Erin already booked it. Cancel the other two before their free-cancel windows.',
    options: [
      {
        name: 'The Carriage House — Sedro-Woolley',
        note: '5.0★/12 · guest favorite · 2 beds · full kitchen · ~1h15 · free-cancel ~Aug 23 · Erin booked',
        recommended: true,
      },
      {
        name: 'Lakeside Cabin — Sedro-Woolley',
        note: 'lakefront + dock + boats · sleeps 4 · closest on SR-20 · ~$1,193/4 nights · free-cancel Aug 11 · Allison booked',
        recommended: false,
      },
      {
        name: 'Jade River Haven — Arlington',
        note: 'brand-new build · 500 ft riverfront · sleeps 6 · ~1h30 (farthest) · ~$1,126/4 nights · free-cancel Aug 15 · Allison booked',
        recommended: false,
      },
    ],
    freshness:
      'All three are free-cancel — pick one and cancel the other two before their windows (Lakeside Aug 11 · Jade River Aug 15 · Carriage House ~Aug 23). No listing links are on file in the repo, so each shows 📍 Navigate only — pull the booking page from Airbnb when you cancel.',
  },

  practical: [
    {
      label: 'Kosher strategy (no Shabbat this trip)',
      body: 'The trip runs Sun→Thu, so there is NO Shabbat to plan around. The whole kosher plan is one Seattle stock-up + cooking in: QFC University Village (2746 NE 45th St) for OU/Star-K/Kof-K packaged items + a kosher deli counter, Trader Joe’s for hechsher cheese/bread/snacks. The booked house has a full kitchen. There are no kosher restaurants up north — buy for all 4 nights on the way in. QFC Mercer Island has a Va’ad deli counter for a sit-down on the drive back if you want one.',
    },
    {
      label: 'WA-20 (North Cascades Highway) status',
      body: 'WSDOT now targets a full reopen of SR-20 on Fri Jun 19, 2026 (verified Jun 10 — accelerated from the earlier Jul 4 / Jun 25 estimates). The Diablo Lake Overlook + Ross Dam stretch already reopened May 30. The last closed section (Ross Dam → Porcupine Creek, ~MP 134–156) is on track but weather-dependent. East-side destinations (Maple Pass, Washington Pass, Rainy Lake) need the full reopen — re-check WSDOT before any east-side day. West-side days (Cascade Pass, Diablo Lake) and the Mt. Baker side do not depend on it. August wildfire smoke is the other real risk — check inciweb.nwcg.gov + airnow.gov from Aug 1.',
    },
    {
      label: 'Flights',
      body: 'Out: UA1330 EWR→SEA, Sun Aug 16, 7:59 AM → 11:03 AM. Home: UA2017 SEA→EWR, Thu Aug 20, 10:58 PM redeye → 7:10 AM Fri Aug 21. Both booked — details on file. (Allison’s TLV→NYC leg is a separate ticket; the joint booking starts at NYC.)',
    },
    {
      label: 'Rental car + driving',
      body: 'SEA round-trip rental — no one-way drop fee with the west-side house and the redeye both ending at SEA. A mid-size SUV or sedan is fine; Cascade River Rd’s 13 mi of gravel just needs reasonable clearance, taken slow. Download offline Google Maps + AllTrails for the WA-20 corridor + Cascade River Rd — there’s no cell service from Newhalem to Rainy Pass. Pass: a $30 Northwest Forest Pass covers the east-side trailheads (Rainy/Blue/Cutthroat); North Cascades NP has no entrance fee.',
    },
    {
      label: 'Rhythm',
      body: 'One west-side house, four nights — no mid-trip move. Three full park days, each offered as a couple of fully-formed shapes you pick by the morning’s weather and WA-20 status. Easy-to-moderate hiking, big alpine views, back to a full kitchen and two real beds each night. Drive times are honestly from the (still-undecided) house, so a couple show a range.',
    },
  ],

  costs: {
    headline: 'Lodging ~$1,126–1,193 / 4 nights',
    approx: 'one house · 4 nights · 2 people (Carriage House Aug-price not yet captured)',
    basis:
      'Only the two Allison-booked houses have captured 4-night prices (Lakeside ~$1,193, Jade River ~$1,126); the Carriage House Aug 16–20 price is on Erin’s account and not yet captured. Flights are booked separately (fares on file, not shown). Re-confirm the kept house’s price before cancelling the others.',
    perPerson: [
      { who: 'Lakeside Cabin', amount: '~$1,193', note: '4 nights total (Allison-booked)' },
      { who: 'Jade River Haven', amount: '~$1,126', note: '4 nights total (Allison-booked)' },
    ],
  },

  kit: [
    {
      base: 'The house (pick one of three) + Seattle',
      places: [
        {
          name: 'The Carriage House — Sedro-Woolley (leaning)',
          links: { query: 'Sedro-Woolley Washington' },
        },
        {
          name: 'Lakeside Cabin — Sedro-Woolley',
          links: { query: 'Sedro-Woolley Washington lakefront' },
        },
        { name: 'Jade River Haven — Arlington', links: { query: 'Arlington Washington' } },
        {
          name: 'QFC University Village (kosher stock-up)',
          links: { query: 'QFC University Village 2746 NE 45th St Seattle' },
        },
        {
          name: 'QFC Mercer Island (Va’ad deli, return day)',
          links: { query: 'QFC Mercer Island Washington' },
        },
      ],
    },
    {
      base: 'West side — Cascade Pass + Diablo Lake',
      places: [
        {
          name: 'Cascade Pass Trailhead (Cascade River Rd)',
          links: {
            query: 'Cascade Pass Trailhead North Cascades',
            website: 'https://www.wta.org/go-hiking/hikes/cascade-pass',
          },
        },
        {
          name: 'Sahale Arm (Cascade Pass add-on)',
          links: {
            query: 'Sahale Arm North Cascades',
            website: 'https://www.wta.org/go-hiking/hikes/sahale-arm',
          },
        },
        { name: 'Diablo Lake Overlook', links: { query: 'Diablo Lake Overlook WA-20' } },
        {
          name: 'Thunder Knob Trail (Colonial Creek)',
          links: {
            query: 'Thunder Knob Trailhead Colonial Creek',
            website: 'https://www.wta.org/go-hiking/hikes/thunder-knob',
          },
        },
        { name: 'Ladder Creek Falls, Newhalem', links: { query: 'Ladder Creek Falls Newhalem' } },
        { name: 'Ross Lake Overlook', links: { query: 'Ross Lake Overlook WA-20' } },
      ],
    },
    {
      base: 'East side — Maple Pass (WA-20-dependent)',
      places: [
        {
          name: 'Rainy Pass / Maple Pass Loop trailhead',
          links: {
            query: 'Rainy Pass Maple Pass Trailhead WA-20',
            website: 'https://www.wta.org/go-hiking/hikes/maple-pass',
          },
        },
        {
          name: 'Blue Lake Trailhead',
          links: {
            query: 'Blue Lake Trailhead WA-20 North Cascades',
            website: 'https://www.wta.org/go-hiking/hikes/blue-lake',
          },
        },
        {
          name: 'Rainy Lake (paved, accessible)',
          links: {
            query: 'Rainy Lake Trailhead WA-20 North Cascades',
            website: 'https://www.wta.org/go-hiking/hikes/rainy-lake',
          },
        },
        { name: 'Washington Pass Overlook', links: { query: 'Washington Pass Overlook WA-20' } },
        {
          name: 'Winthrop (old-west boardwalk)',
          links: { query: 'Winthrop Washington downtown boardwalk' },
        },
        {
          name: 'WSDOT — SR-20 real-time status',
          links: { query: 'North Cascades Highway WSDOT status', website: WA20_URL },
        },
      ],
    },
    {
      base: 'Mt. Baker side + easy days',
      places: [
        {
          name: 'Artist Point (Heather Meadows)',
          links: {
            query: 'Artist Point Mount Baker Highway',
            website: 'https://www.wta.org/go-hiking/hikes/heather-meadows',
          },
        },
        {
          name: 'Picture Lake / Chain Lakes',
          links: { query: 'Picture Lake Heather Meadows Mount Baker' },
        },
        {
          name: 'Rasar State Park (easy Skagit walk)',
          links: {
            query: 'Rasar State Park Sedro-Woolley Washington',
            website: 'https://parks.wa.gov/find-parks/state-parks/rasar-state-park',
          },
        },
        {
          name: 'Seattle-Tacoma Airport (SEA)',
          links: {
            query: 'Seattle-Tacoma International Airport',
            website: 'https://www.portseattle.org/sea-tac',
          },
        },
      ],
    },
  ],

  wa20Caveat: WA20_CAVEAT,
  wa20Url: WA20_URL,
};

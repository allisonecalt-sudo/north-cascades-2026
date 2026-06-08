/**
 * weather-plan-c.ts — PNW weather + smoke contingency data for Aug 16-20, 2026.
 *
 * Pre-built per `nc-improvement-plan-2026-05-17.md` ("Pages NC needs"):
 *   *"PNW rain-swap for any day. Mid-August NC weather is mostly dry but
 *   smoke-from-wildfires is the real Plan C. Pre-build it now, populate later
 *   as research lands."*
 *
 * The asymmetry vs Austria's weather-plan-c page:
 *   - Austria worry = afternoon thunderstorms 12+ rain days/month.
 *   - NC worry = smoke. Mid-August is mostly dry (precipitation near zero on
 *     the east side, low on the west side) but late-July through September is
 *     PNW fire season and the smoke can roll in from BC + eastern WA in 24 hrs.
 *
 * AQI THRESHOLDS — pre-populated sensible defaults. Allison's call to override.
 *   - <= 100 (Good / Moderate)  → no swap, go as planned
 *   - 100-150 (Sensitive groups) → consider town/drive-up viewpoints over high
 *     altitude hikes
 *   - 150-200 (Unhealthy)        → mask up + stay car-based
 *   - > 200 (Very Unhealthy +)   → drive home / stay indoors
 *
 * Sources for the AQI bands: EPA AirNow guidance for "Unhealthy for Sensitive
 * Groups" (101-150) and "Unhealthy" (151-200). Wildfire-smoke guidance also
 * notes that PM2.5 exposure during physical exertion is dose-multiplied — so
 * the swap from "hike day" to "drive day" matters more than the swap from
 * "drive day" to "town day."
 *
 * RESEARCH-NEEDED markers: anywhere this data lists a specific year's fire
 * history, AQI archive, or wildfire-detection lag time and that claim is not
 * yet verified, the entry carries researchNeeded = true so a future research
 * pass can fill in.
 */

export type SwapDayKind = 'hike' | 'drive' | 'town' | 'lake';

export type TriggerLevel = 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'hazardous';

export interface TriggerStage {
  level: TriggerLevel;
  aqiBand: string;
  label: string;
  /** What it physically feels like at that AQI band. */
  feel: string;
  /** What to actually do. */
  action: string;
  /** Hex band color matched to AirNow's six-band palette (closest semantic). */
  band: 'yellow' | 'orange' | 'red' | 'purple';
}

export interface PlanCSwap {
  kind: SwapDayKind;
  /** Plain header — "If today was a hike day". */
  headline: string;
  /** 1-line summary of what to swap to. */
  swapTo: string;
  /** 2-4 concrete swap examples — actual places on this trip. */
  examples: readonly string[];
  /** When this DOESN'T need a swap (mostly true for Town days). */
  unaffected?: string;
}

export interface IndoorRefuge {
  name: string;
  /** Town + region cue. */
  where: string;
  address?: string;
  /** Opening hours summary — verify before trip in July sweep. */
  hours: string;
  /** Why it earns a smoke-day visit (HVAC, indoor exhibits, etc.). */
  why: string;
  /** External info source. */
  source?: { name: string; url: string };
  /** True if a verification pass is still owed on this row. */
  researchNeeded?: boolean;
}

export interface WatchSource {
  name: string;
  url: string;
  /** Why this source — what it tells you and when to check it. */
  use: string;
  /** Suggested cadence. */
  when: string;
}

export interface PrepItem {
  /** Header — "N95 masks". */
  item: string;
  /** Why pack it, what to look for. */
  detail: string;
  /** Optional per-traveler count. */
  count?: string;
}

export interface FireHistoryRow {
  year: number;
  /** Headline summary of fire-season severity that mid-August. */
  summary: string;
  /** True if this row still needs research-verification. */
  researchNeeded: boolean;
  /** Optional source link if known. */
  source?: { name: string; url: string };
}

export interface WeatherPlanCData {
  /** "Researched May 17, 2026" — pull date so reader knows freshness. */
  asOf: string;
  /** TLDR line for the top card. */
  tldr: string;
  /** 2-3 baseline weather facts (highs / lows / precipitation). */
  baseline: readonly string[];
  /** Trigger ladder — AQI bands + actions. */
  triggers: readonly TriggerStage[];
  /** Plan-C swaps per day-type. */
  swaps: readonly PlanCSwap[];
  /** Indoor refuges to escape smoke. */
  refuges: readonly IndoorRefuge[];
  /** Sources to bookmark + monitor. */
  watchSources: readonly WatchSource[];
  /** Pre-trip prep checklist. */
  prep: readonly PrepItem[];
  /** Last 3 NC August fire seasons (flagged research-needed where unverified). */
  history: readonly FireHistoryRow[];
}

export const WEATHER_PLAN_C: WeatherPlanCData = {
  asOf: 'May 17, 2026',
  tldr:
    'The real Plan C trigger is wildfire smoke, not rain. When the AQI moves, swap hike → drive, drive → town, town → indoor refuge — or drive home early.',
  baseline: [
    'Highs 70-80°F west, 75-85°F east. Lows 45-55°F in the valleys, near freezing at elevation.',
    'Precipitation near-zero east, low west — bring a light shell but expect dry days.',
    'Smoke season late July–Sep: can flip the AQI from "good" to "unhealthy" in 24 hrs.',
  ],
  triggers: [
    {
      level: 'moderate',
      aqiBand: 'AQI 51-100',
      label: 'Yellow / Moderate',
      band: 'yellow',
      feel:
        'Slight haze; distant peaks lose definition. Most people fine.',
      action:
        'No swap. Go as planned. Eye drops + sunglasses help.',
    },
    {
      level: 'unhealthy-sensitive',
      aqiBand: 'AQI 101-150',
      label: 'Orange / Unhealthy for sensitive groups',
      band: 'orange',
      feel:
        'Visible smoke. Peaks faded. Throat scratchy after sustained time outside. Sun goes orange-pink mid-day.',
      action:
        'Swap the hike for a town visit or drive-up viewpoint. Light days stay as planned. Mask on any walk over ~30 min.',
    },
    {
      level: 'unhealthy',
      aqiBand: 'AQI 151-200',
      label: 'Red / Unhealthy',
      band: 'red',
      feel:
        'Heavy smoke. Throat + eyes burn. Short walks tire you. Sun red all day; distance vision gone.',
      action:
        'Mask up, stay car-based. Drive-up viewpoints OK with windows up + recirculate. Skip hikes. Indoor refuge or apartment day. If both bases are this bad, drive west toward Seattle.',
    },
    {
      level: 'hazardous',
      aqiBand: 'AQI 200+',
      label: 'Purple / Very unhealthy → Hazardous',
      band: 'purple',
      feel:
        'Apocalyptic. Sun barely visible. Mask to reach the car. Headaches within hours.',
      action:
        "Drive home early. SEA is usually less smoky (marine air pushes smoke inland). East-based: Stevens Pass (US-2) can get you out from under the plume. Flying out Day 4 instead of Day 5 is a valid call.",
    },
  ],
  swaps: [
    {
      kind: 'hike',
      headline: 'If today was a hike day',
      swapTo:
        'Swap to a drive-up viewpoint or town visit. Smoke + exertion is the worst combination.',
      examples: [
        'Drive WA-20 Diablo Lake → Washington Pass, windows up + recirculate. ~3 hrs RT from a west base.',
        'Winthrop boardwalk + Mazama Store walking — short distances, masks ready.',
        'Lakeside at Patterson Lake or Diablo overlook, no real hike — sit + read + nap.',
        'If AQI clears by afternoon, push the hike to an evening start (5-9pm).',
      ],
    },
    {
      kind: 'drive',
      headline: 'If today was a drive day (WA-20 sightseeing)',
      swapTo:
        'Feasible up to AQI ~150 — the car is a refuge. Above that, swap to a town or apartment day.',
      examples: [
        'Drive the corridor windows up + recirculate. Overlooks only — skip short trails (Thunder Knob, Rainy Lake walk).',
        'Cut it short: Diablo Lake Overlook + Washington Pass, skip the rest.',
        'Above AQI 200: drive home toward SEA, under the marine inversion.',
      ],
    },
    {
      kind: 'town',
      headline: 'If today was a town day (Winthrop / Mazama / Marblemount)',
      swapTo: 'Mostly UNAFFECTED. Short walks, masks easy, indoor refuges close.',
      examples: [
        'Add an indoor stop: NPS Newhalem Visitor Center (smoke-day HVAC + exhibits).',
        'Trade the longer boardwalk loop for café-hopping with shorter outdoor segments.',
        'Use it as a forced rest — laundry, journals, cooking, porch reading.',
      ],
      unaffected:
        'Town days are the most smoke-resilient — short outdoor + frequent indoor.',
    },
    {
      kind: 'lake',
      headline: 'If today was a lake / Diablo / Ross day',
      swapTo:
        'Swap to a drive-up viewpoint or apartment day. Lake days are mid-exertion, and smoke pools in valley bottoms — sometimes worse than higher up.',
      examples: [
        "Skip the Diablo paddle. Stop at the overlook — same view, no exposure.",
        'Cabin day: kitchen cooking + lake view from the porch.',
        'If AQI splits east vs west (common), drive to the cleaner side for a half-day.',
      ],
    },
  ],
  refuges: [
    {
      name: 'NPS North Cascades Visitor Center',
      where: 'Newhalem · WA-20 MP 120',
      address: '502 Newhalem St, Rockport, WA 98283',
      hours: 'Daily 9am-5pm (summer) — verify before trip',
      why:
        'Best smoke-day refuge in the corridor. HVAC, exhibits, ranger talks, indoor seating. Free.',
      source: {
        name: 'NPS · Visitor Centers (incl. North Cascades VC)',
        url: 'https://www.nps.gov/noca/planyourvisit/visitorcenters.htm',
      },
      researchNeeded: false,
    },
    {
      name: "Sheri's Sweet Shoppe + boardwalk arcade",
      where: 'Winthrop · downtown',
      address: '207 Riverside Ave, Winthrop, WA 98862',
      hours: 'Daily ~10am-9pm summer — verify',
      why:
        'Indoor ice cream + candy + boardwalk shops. Short hops between doorways = easy mask discipline.',
      researchNeeded: true,
    },
    {
      name: 'Shafer Historical Museum',
      where: 'Winthrop · 1 block off Riverside',
      address: '285 Castle Ave, Winthrop, WA 98862',
      hours: 'Memorial Day to Sep 30, daily 10am-5pm — verify',
      why:
        'Indoor history museum + historic buildings. Small admission.',
      source: {
        name: 'Shafer Museum',
        url: 'https://shafermuseum.org/',
      },
      researchNeeded: true,
    },
    {
      name: 'Mazama Store',
      where: 'Mazama · WA-20 corridor',
      address: '50 Lost River Rd, Mazama, WA 98833',
      hours: 'Daily 7am-6pm (summer) — verify',
      why:
        'Bakery + deli + general store. Indoor seating, coffee, A/C. Quick refuge between viewpoints.',
      source: {
        name: 'Mazama Store',
        url: 'https://themazamastore.com/',
      },
      researchNeeded: false,
    },
    {
      name: 'Cascadian Farm Organic Roadside Stand',
      where: 'Rockport · WA-20 ~25 min west of Marblemount',
      address: '55749 WA-20, Rockport, WA 98283',
      hours: 'May-Oct, daily ~10am-6pm — verify',
      why:
        'Indoor café + ice cream + farm-stand snacks on the Bellingham–park drive. Bathroom + indoor stop.',
      researchNeeded: true,
    },
  ],
  watchSources: [
    {
      name: 'AirNow.gov · interactive AQI map',
      url: 'https://www.airnow.gov/?city=Marblemount&state=WA',
      use:
        'Live AQI for any zip/city — the federal source. Use this number for the thresholds above.',
      when: 'Daily from Aug 1 onward + the morning of every outdoor day during the trip.',
    },
    {
      name: 'PurpleAir map',
      url: 'https://map.purpleair.com/1/i/mAQI/a10/p604800/cC0#7/48.6/-120.7',
      use:
        'Dense citizen-sensor network — higher resolution than AirNow in the Methow + Skagit valleys. Answers "worse in Mazama or Winthrop right now?"',
      when: 'Morning-of for each day. The default link lands centered on the North Cascades.',
    },
    {
      name: 'Washington Smoke Blog',
      url: 'https://wasmoke.blogspot.com/',
      use:
        'Daily fire-season summary from WA agencies + tribal coordinators — forecasts where smoke is going, not just where it is.',
      when: 'Bookmark before trip; check each morning of the trip Aug 16-20.',
    },
    {
      name: 'NWS forecast · Marblemount',
      url: 'https://forecast.weather.gov/MapClick.php?lat=48.5326&lon=-121.4445',
      use:
        'West-base forecast. Check thunderstorm risk + wind direction (wind shifts move smoke).',
      when: 'Evening before any outdoor day.',
    },
    {
      name: 'NWS forecast · Mazama / Winthrop',
      url: 'https://forecast.weather.gov/MapClick.php?lat=48.5919&lon=-120.4022',
      use: 'Same as above but for the east base.',
      when: 'Evening before any outdoor day.',
    },
    {
      name: 'NPS · North Cascades air quality + road conditions',
      url: 'https://www.nps.gov/noca/planyourvisit/conditions.htm',
      use:
        'Park-side fire/trail/road closures. Lags WSDOT 24-48 hrs but authoritative for trail closures.',
      when: 'Morning of any park-side day.',
    },
    {
      name: 'InciWeb · active wildfires (national)',
      url: 'https://inciweb.nwcg.gov/',
      use:
        'Federal incident clearinghouse. Identify the SOURCE of smoke to predict if it stays or moves. Filter to WA.',
      when: 'Daily from Aug 1 onward.',
    },
  ],
  prep: [
    {
      item: 'N95 / KN95 masks',
      count: '3 per traveler',
      detail:
        'Real N95/KN95 — not surgical, not cloth (surgical does nothing for PM2.5). Pack sealed. Hope to leave them packed.',
    },
    {
      item: 'Eye drops',
      count: '1-2 bottles',
      detail:
        'Smoke hits eyes hardest. Plain saline or preservative-free tears (Refresh, Systane). Cheap, light.',
    },
    {
      item: 'Indoor activity reserve',
      detail:
        'Pre-download 2-3 movies + a book per traveler. Smoke days suit cabin cooking, journals, card games.',
    },
    {
      item: 'Closeable car ventilation',
      detail:
        'Verify the rental has working recirculate mode; test it Day 1. With recirculate, the car is a portable refuge.',
    },
    {
      item: 'Flex flight policy',
      detail:
        'Book flights with a 24-hr change window or same-day standby. Smoke can flip a trip in 24 hrs — flying out Day 4 or extending to Day 6 is real money in worst cases.',
    },
  ],
  history: [
    {
      year: 2023,
      summary:
        'Sourdough Fire (late July, → ~7,800 acres by mid-Aug). WA-20 closed Newhalem → Rainy Pass ~2 weeks; reopened Aug 23 transit-only. Mid-August corridor trips significantly disrupted.',
      researchNeeded: false,
      source: {
        name: 'InciWeb · Sourdough Fire 2023 archive',
        url: 'https://inciweb.nwcg.gov/',
      },
    },
    {
      year: 2024,
      summary:
        'Largely clear August; Methow AQI mostly Good / Moderate. (VERIFY against 2024 fire archives + AirNow historical.)',
      researchNeeded: true,
    },
    {
      year: 2025,
      summary:
        'Bad late-August Methow AQI — several days Unhealthy+ from BC + eastern WA fires. (VERIFY against the 2025 fire archive.)',
      researchNeeded: true,
    },
    {
      year: 2017,
      summary:
        'Diamond Creek Fire (Pasayten, north of Mazama) burned ~128,000 acres late July–Oct. Multi-week heavy Methow smoke incl. August. Precedent for "east-side trip blown by north-of-park fire."',
      researchNeeded: false,
      source: {
        name: 'InciWeb · Diamond Creek Fire archive',
        url: 'https://inciweb.nwcg.gov/',
      },
    },
  ],
};

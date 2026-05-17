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
    'August NC is mostly dry. Rain is a non-event; the real Plan C trigger is wildfire smoke. ' +
    'When the AQI moves, swap hike → drive, drive → town, town → indoor refuge — or drive home early.',
  baseline: [
    'Daytime highs: 70-80°F west side (Marblemount / Newhalem), 75-85°F east side (Winthrop / Mazama is drier + warmer).',
    'Overnight lows: 45-55°F in the valleys; can drop near freezing at elevation (Sahale Glacier camp, etc.).',
    'Precipitation: near-zero east side, low on the west side. Bring a light rain shell but expect dry days.',
    'Thunderstorm risk: rare in the valleys, possible at elevation in the afternoon — clears by evening.',
    'Smoke season: late July through September is PNW fire season. Smoke usually blows in from BC fires or eastern WA — can flip the AQI from "good" to "unhealthy" in 24 hours.',
  ],
  triggers: [
    {
      level: 'moderate',
      aqiBand: 'AQI 51-100',
      label: 'Yellow / Moderate',
      band: 'yellow',
      feel:
        'Slight haze on the horizon, distant peaks lose definition. Most people fine; sensitive ' +
        'lungs might notice on long exertion.',
      action:
        'No swap needed. Go ahead with the planned day. Eye drops + sunglasses help with the haze.',
    },
    {
      level: 'unhealthy-sensitive',
      aqiBand: 'AQI 101-150',
      label: 'Orange / Unhealthy for sensitive groups',
      band: 'orange',
      feel:
        'Visible smoke. Peaks faded or invisible. Throat scratchy after sustained outdoor time. ' +
        'Sun goes orange-pink mid-day (looks pretty, signals bad).',
      action:
        'Swap the hike day for a town visit OR drive-up viewpoint (less exertion = less smoke inhaled). ' +
        'Already-light days (town, lakeside lounging) stay as planned. Take a mask on any walk over ~30 min.',
    },
    {
      level: 'unhealthy',
      aqiBand: 'AQI 151-200',
      label: 'Red / Unhealthy',
      band: 'red',
      feel:
        'Heavy smoke in the air. Throat + eyes burn. Even short walks tire you out. Sun is red ' +
        'all day. Distance vision gone.',
      action:
        'Mask up + stay car-based. Drive-up viewpoints OK with windows up + recirculate. Skip any hike. ' +
        'Indoor refuge or apartment-day are the move. If both bases are this bad, drive west toward ' +
        'Seattle to see if you can outrun it.',
    },
    {
      level: 'hazardous',
      aqiBand: 'AQI 200+',
      label: 'Purple / Very unhealthy → Hazardous',
      band: 'purple',
      feel:
        'Apocalyptic. Sun barely visible. Mask required to walk to the car. Headaches within hours ' +
        'of exposure.',
      action:
        "Drive home early. SEA is usually less smoky than the east side because marine air pushes " +
        "smoke inland. If you're east-based, the Stevens Pass route (US-2) can sometimes get you " +
        "out from under the plume. Don't push through — flying out on Day 4 instead of Day 5 is a " +
        'valid call here.',
    },
  ],
  swaps: [
    {
      kind: 'hike',
      headline: 'If today was a hike day',
      swapTo:
        'Swap to a drive-up viewpoint OR town visit. Smoke + exertion is the worst combination ' +
        '(PM2.5 dose multiplied by deeper breathing).',
      examples: [
        'Drive WA-20 Diablo Lake → Washington Pass — windows up, recirculate on. ~3 hours round trip ' +
          'from a west base, the viewpoints earn the day even hazy.',
        'Winthrop OldWest boardwalk + Mazama Store walking — short distances, masks ready.',
        'Lakeside day at Patterson Lake or Diablo overlook without a real hike — sit + read + nap.',
        'If the AQI is forecast to clear by afternoon, push the hike to an evening start (5pm-9pm).',
      ],
    },
    {
      kind: 'drive',
      headline: 'If today was a drive day (WA-20 sightseeing)',
      swapTo:
        'Still feasible up to AQI ~150 — the car is a refuge. Above that, swap to a town day or ' +
        'apartment day.',
      examples: [
        'Drive the corridor with windows up + recirculate on. Hit overlooks only — skip the short ' +
          'trails (Thunder Knob, Rainy Lake walk).',
        'Cut the drive short. Stop at Diablo Lake Overlook + Washington Pass + skip the rest.',
        'Above AQI 200: drive home (toward SEA) instead. Get under the marine inversion.',
      ],
    },
    {
      kind: 'town',
      headline: 'If today was a town day (Winthrop / Mazama / Marblemount)',
      swapTo: 'Mostly UNAFFECTED. Towns are short walks, masks easy, indoor refuges close.',
      examples: [
        'Add an extra indoor stop: NPS Newhalem Visitor Center (great smoke-day HVAC + exhibits).',
        'Trade the longer boardwalk loop for café-hopping with shorter outdoor segments.',
        'Use this day as a forced rest — laundry, journals, kitchen cooking, read on the porch.',
      ],
      unaffected:
        'Town days are the most smoke-resilient because they default to short outdoor + frequent ' +
        'indoor. The Erin / Allison rhythm of cabin-base + cooking + walking suits a smoke window well.',
    },
    {
      kind: 'lake',
      headline: 'If today was a lake / Diablo / Ross day',
      swapTo:
        'Swap to a drive-up viewpoint OR apartment day. Lake days are mid-exertion (paddling, walking ' +
        'shoreline) and smoke pools in valley bottoms — sometimes WORSE than higher elevations.',
      examples: [
        "Skip Diablo paddle. Stop at the overlook instead — same view, no exposure.",
        'Cabin day with kitchen cooking + the lake view from the porch.',
        'If the AQI splits east vs west (common — fires often only affect one side), drive to the ' +
          'cleaner side for a half-day.',
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
        'The single best smoke-day refuge in the corridor. HVAC, interpretive exhibits, ranger ' +
        'talks, big windows + indoor seating. Free.',
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
        'Indoor ice cream + candy + small shops up and down the boardwalk. Short hops between ' +
        'doorways = easier mask discipline than long walks.',
      researchNeeded: true,
    },
    {
      name: 'Shafer Historical Museum',
      where: 'Winthrop · 1 block off Riverside',
      address: '285 Castle Ave, Winthrop, WA 98862',
      hours: 'Memorial Day to Sep 30, daily 10am-5pm — verify',
      why:
        'Indoor history museum + historic buildings. Small admission. Free smoke break with ' +
        'something to look at.',
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
        'Bakery + deli + general store. Indoor seating, coffee, sandwich-makings, ' +
        'air-conditioning. Quick refuge between drive-up viewpoints.',
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
        'Indoor café + ice cream + farm-stand snacks on the drive between Bellingham and the park. ' +
        'Bathroom stop + indoor option if the smoke is rolling in from the west.',
      researchNeeded: true,
    },
  ],
  watchSources: [
    {
      name: 'AirNow.gov · interactive AQI map',
      url: 'https://www.airnow.gov/?city=Marblemount&state=WA',
      use:
        'Live AQI for any zip code or city. The federal source. Use this number to call the ' +
        'thresholds above.',
      when: 'Daily from Aug 1 onward + the morning of every outdoor day during the trip.',
    },
    {
      name: 'PurpleAir map',
      url: 'https://map.purpleair.com/1/i/mAQI/a10/p604800/cC0#7/48.6/-120.7',
      use:
        'Dense network of citizen sensors — much higher resolution than AirNow especially in ' +
        'the Methow + Skagit valleys. Useful when you need to know "is it worse in Mazama or ' +
        'Winthrop right now?"',
      when: 'Morning-of for each day. The default link lands centered on the North Cascades.',
    },
    {
      name: 'Washington Smoke Blog',
      url: 'https://wasmoke.blogspot.com/',
      use:
        'WA state agencies + tribal AQI coordinators publish a daily summary during fire season. ' +
        'Includes a forecast of where the smoke is going, not just where it is.',
      when: 'Bookmark before trip; check each morning of the trip Aug 16-20.',
    },
    {
      name: 'NWS forecast · Marblemount',
      url: 'https://forecast.weather.gov/MapClick.php?lat=48.5326&lon=-121.4445',
      use:
        'Standard weather forecast for the west base. Use to check thunderstorm risk + wind ' +
        'direction (wind shifts move smoke).',
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
        'Park-side updates on fire closures, trail closures, road status. Sometimes lags 24-48 ' +
        'hrs behind WSDOT but is authoritative for trail closures.',
      when: 'Morning of any park-side day.',
    },
    {
      name: 'InciWeb · active wildfires (national)',
      url: 'https://inciweb.nwcg.gov/',
      use:
        'Federal incident clearinghouse. Use to identify the SOURCE of any smoke (so you can ' +
        'predict whether it stays or moves). Filter to Washington state.',
      when: 'Daily from Aug 1 onward.',
    },
  ],
  prep: [
    {
      item: 'N95 / KN95 masks',
      count: '3 per traveler',
      detail:
        'Real N95 (or KN95 equivalent) — not surgical, not cloth. Surgical masks do nothing for ' +
        'PM2.5. Pack in a sealed bag so they stay clean. Hope to leave them packed.',
    },
    {
      item: 'Eye drops',
      count: '1-2 bottles',
      detail:
        'Smoke is the worst on eyes. Plain saline or preservative-free artificial tears (Refresh, ' +
        'Systane). Cheap, light, makes a moderate smoke day livable.',
    },
    {
      item: 'Indoor activity reserve',
      detail:
        'Pre-download 2-3 movies + a book or two per traveler. Smoke days are good for cabin ' +
        'cooking, journals, long card games. Don\'t fight the day — adapt.',
    },
    {
      item: 'Closeable car ventilation',
      detail:
        'Verify the rental has working recirculate mode on the climate control. Test it on Day 1. ' +
        'A car with recirculate is a portable refuge; one without is just a tent with wheels.',
    },
    {
      item: 'Flex flight policy',
      detail:
        'Book flight tickets with a 24-hr change window or a same-day-standby option. Smoke can ' +
        'flip a trip in 24 hrs — being able to fly home on Day 4 instead of Day 5 (or extend to ' +
        'Day 6 if AQI clears late) is real money in worst-case smoke scenarios.',
    },
  ],
  history: [
    {
      year: 2023,
      summary:
        'Sourdough Fire (start late July, 100+ acres → grew to ~7,800 acres by mid-Aug). WA-20 ' +
        'closed Newhalem → Rainy Pass for ~2 weeks; reopened Aug 23 as transit-only with no ' +
        'stopping. Mid-August trips to the corridor were significantly disrupted.',
      researchNeeded: false,
      source: {
        name: 'InciWeb · Sourdough Fire 2023 archive',
        url: 'https://inciweb.nwcg.gov/',
      },
    },
    {
      year: 2024,
      summary:
        'Largely clear August in the NC corridor. Methow Valley AQI mostly Good / Moderate. ' +
        '(VERIFY before trip — this row needs a real check against 2024 fire archives + AirNow ' +
        'historical data.)',
      researchNeeded: true,
    },
    {
      year: 2025,
      summary:
        'Bad late-August AQI in the Methow Valley — several days at Unhealthy or worse due to BC + ' +
        'eastern WA fires combining. (VERIFY before trip — research needed against the actual ' +
        '2025 fire archive.)',
      researchNeeded: true,
    },
    {
      year: 2017,
      summary:
        'Diamond Creek Fire (Pasayten Wilderness, north of Mazama) burned ~128,000 acres late ' +
        'July through October. Caused multi-week heavy smoke in Methow Valley including August. ' +
        'Reference precedent for "east-side trip blown by north-of-park fire."',
      researchNeeded: false,
      source: {
        name: 'InciWeb · Diamond Creek Fire archive',
        url: 'https://inciweb.nwcg.gov/',
      },
    },
  ],
};

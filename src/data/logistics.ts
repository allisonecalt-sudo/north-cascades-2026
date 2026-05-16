export interface LogisticsItem {
  topic: string;
  detail: string;
  link?: { label: string; url: string };
}

export const LOGISTICS: LogisticsItem[] = [
  {
    topic: 'Entrance fee',
    detail:
      'North Cascades National Park has NO entrance fee. A Northwest Forest Pass ($5/day or $30/year) IS required at some Forest Service trailheads — Park Butte, Rainy Pass, Blue Lake, Cutthroat.',
  },
  {
    topic: 'America the Beautiful pass',
    detail:
      '$80 (US residents) covers Northwest Forest Pass everywhere on this trip + any other NP for 12 months. Worth it only if you’ll hit another NP this year. Otherwise the $30 Northwest Forest Pass works.',
    link: { label: 'Buy at recreation.gov', url: 'https://www.recreation.gov/' },
  },
  {
    topic: 'Permits — day hikes',
    detail: 'No permit needed for any day hike in this plan.',
  },
  {
    topic: 'Cascade Pass parking',
    detail: 'No permit, but parking fills by 9-10 AM in August. Arrive by 8:30 AM.',
  },
  {
    topic: 'Cell service',
    detail:
      'Marblemount: Verizon 4G/5G. Newhalem → Rainy Pass: NO service, 60+ mi dead zone. Mazama/Winthrop: Verizon + AT&T 4G. Trailheads: no service. Download offline Google Maps + AllTrails GPX before leaving Bellingham.',
  },
  {
    topic: 'Weather (mid-August)',
    detail:
      'Daytime 70-85°F (warmer/drier east), nights 45-55°F. Low rain risk. Bring a light shell anyway.',
  },
  {
    topic: 'Wildfire / smoke risk',
    detail:
      'August is fire season. SR-20 has closed for fire before (Sourdough Fire 2023, ~2 weeks; Diamond Creek 2017). Methow Valley east side has had multiple August fire-smoke events — AQI can move from "good" to "unhealthy" in 24 hrs when winds shift. Tuck 2-3 N95/KN95 masks per person; monitor InciWeb + AirNow from ~Aug 1. Path A (west-side only) is more fire-resilient than Paths B + C.',
    link: { label: 'InciWeb (active wildfires)', url: 'https://inciweb.nwcg.gov/' },
  },
  {
    topic: 'Air quality (AirNow)',
    detail:
      'Live AQI for Marblemount, Newhalem, Mazama, Winthrop. Threshold: AQI <100 = fine; 100-150 = sensitive groups; 150+ = swap to indoor day. Check 24-48 hrs before any pass-hike day.',
    link: { label: 'AirNow live AQI map', url: 'https://www.airnow.gov/' },
  },
  {
    topic: 'Cascade River Rd drive timing',
    detail:
      'Last 13 mi is compacted dirt + gravel, narrow in spots, one-vehicle-wide in places. Plan ~1 hr Marblemount → trailhead (not the 30 min Google Maps suggests). Typically open mid-July through October.',
  },
  {
    topic: 'WA-20 live road status',
    detail: 'Check WSDOT morning-of for live conditions and any closure updates.',
    link: {
      label: 'WSDOT real-time travel',
      url: 'https://wsdot.com/travel/real-time/mountainpasses/north-cascades-highway',
    },
  },
  {
    topic: 'Cascade River Rd',
    detail:
      'Typically open mid-July through October. Confirm at recreation.gov or call NPS 360-854-7200 before Day 2.',
  },
];

export const CONTINGENCIES = [
  {
    id: 'stevens-pass',
    label: 'Stevens Pass loop',
    detail:
      'SEA roundtrip. Drive US-2 east via Stevens Pass → Leavenworth → Wenatchee → Chelan → Pateros → Winthrop (~4 hr 10 min, 189 mi). Hike Maple Pass / Blue Lake / Cutthroat. Skips Cascade Pass + Diablo Lake.',
  },
  {
    id: 'west-only',
    label: 'West-side only',
    detail:
      'BLI roundtrip (or SEA RT). Base Marblemount. Hike Cascade Pass + Park Butte + Mt. Baker / Artist Point. Skip east side entirely.',
  },
  {
    id: 'punt-sep',
    label: 'Punt to September',
    detail:
      'September is normally fine and crowds drop after Labor Day. Decision date: if WA-20 still closed by Aug 1, switch.',
  },
];

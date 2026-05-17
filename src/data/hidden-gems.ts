/**
 * hidden-gems.ts — research-backed "beyond the marquee" destinations for
 * Aug 16-20, 2026. Wave 3 #11 from `projects/north-cascades-2026/README.md`:
 *   *"research beyond the curated 6-8 NPS-popular hikes. Find lesser-known
 *   West side viewpoints (Sauk Mountain summit, Hidden Lake Lookout, Park
 *   Butte alternates), East side (Patterson Lake, Lake Chelan, Methow
 *   viewpoints), Mt. Baker area (Heliotrope Ridge), Olympics if time permits.
 *   Same 'wow filter' as Austria's stunning-hunt."*
 *
 * Filter applied for this set:
 *   - Wow-payoff per mile or per drive-minute (the "stunning-hunt" bar).
 *   - Lesser-known than the marquee picks already in `hikes.ts` — these don't
 *     duplicate Cascade Pass / Maple Pass / Blue Lake / Thunder Knob / etc.
 *   - Summer-feasible Aug 16-20 (no snow / ice / winter routes).
 *   - Honest about the catch: road access, exposure, permit, status.
 *
 * Each entry includes WHY it's "hidden" vs the marquee picks so the reader
 * sees the trade. Photos: Wikimedia preferred, real place-matched shots.
 *
 * NOTE: this data set is exploratory — it's the menu the reader picks FROM
 * for a flex-day or a Plan-B swap. It is not the day's locked plan.
 */

import type { HikePhoto } from './hikes';

export type GemEffort = 'low' | 'moderate' | 'strenuous' | 'expert-only';
export type GemSide = 'west' | 'east' | 'mt-baker' | 'either';

/** Reuse the hike photo shape so the photo-carousel renderer accepts both. */
export type GemPhoto = HikePhoto;

export interface GemSource {
  /** Plain label — e.g. "WTA · Sauk Mountain". */
  name: string;
  url: string;
}

export interface GemDriveTime {
  /** Plain name of the base — e.g. "From Marblemount (west base)". */
  from: string;
  /** Plain text drive — e.g. "~25 min". */
  text: string;
}

export interface GemStatus {
  kind: 'closed' | 'caution' | 'access-warning';
  label: string;
  detail: string;
  asOf: string;
  sourceUrl?: string;
}

export interface HiddenGem {
  id: string;
  name: string;
  /** Trailhead / start point + region cue ("West / Mt. Baker corridor"). */
  where: string;
  side: GemSide;
  effort: GemEffort;
  /** "4.0 mi RT" / "drive-up · 0.1 mi" / "9.0 mi RT". */
  length: string;
  /** "+1,200 ft" / "minimal" / "+3,300 ft". */
  elevation: string;
  /** "Yes · FR 1030 rough but passable" / "No — paved" / similar. */
  roadAccessRequired: string;
  permit: 'none' | 'nw-forest-pass' | 'discover-pass' | 'recreation-gov';
  /** 2-line "why this is hidden" framing. */
  whyHidden: string;
  /** 2-line trip-fit lede — when in the 5-day shape this lands. */
  tripFit: string;
  /** Drive-time matrix from each base — Marblemount, Mazama, Winthrop. */
  driveFromBases: GemDriveTime[];
  /** 1-3 trust-signal source links (WTA recent report, AllTrails, Reddit, NPS). */
  sources: GemSource[];
  /** Photo carousel (1-3 photos). Place-matched, summer-season shots only. */
  photos: readonly GemPhoto[];
  /** Status badge for closed / cautioned trails — renders `.badge--bad`. */
  status?: GemStatus;
  /** "Verified on" date so freshness shows on each card. */
  verifiedAsOf: string;
  /**
   * WA-20 through-route dependency — same convention as `data/viewpoints.ts`,
   * `data/hikes.ts`, `data/lakes.ts`, `data/activities.ts`. Added 2026-05-17
   * by the integration-audit pass.
   */
  needsWa20Through?: boolean;
}

export const HIDDEN_GEMS: HiddenGem[] = [
  // ====================================================================
  // WEST SIDE
  // ====================================================================
  {
    id: 'sauk-mountain-summit',
    needsWa20Through: false,
    name: 'Sauk Mountain summit',
    where: 'FR 1030 off WA-20, ~25 min west of Marblemount (West)',
    side: 'west',
    effort: 'moderate',
    length: '4.2 mi RT',
    elevation: '+1,200 ft',
    roadAccessRequired: 'Yes — FR 1030 is steep narrow gravel, rough but passable for the rental',
    permit: 'nw-forest-pass',
    whyHidden:
      "Same effort as Maple Pass for half the distance — but it's a West-side gem, so it doesn't make NPS-popular lists. Locals know it; trip-blog readers don't.",
    tripFit:
      'Slots cleanly into a West-base day when Cascade Pass feels too long. Wildflower-streaked switchbacks open to Baker / Shuksan / Pickets / San Juans on a clear day.',
    driveFromBases: [
      { from: 'Marblemount', text: '~25 min · 12 mi' },
      { from: 'Concrete', text: '~10 min · 5 mi' },
      { from: 'Mazama', text: 'WA-20 closed mid-corridor → not feasible' },
      { from: 'Winthrop', text: 'WA-20 closed mid-corridor → not feasible' },
    ],
    sources: [
      { name: 'WTA · Sauk Mountain', url: 'https://www.wta.org/go-hiking/hikes/sauk-mountain' },
      { name: 'AllTrails · Sauk Mountain', url: 'https://www.alltrails.com/trail/us/washington/sauk-mountain' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sauk%20Mountain%20%281835204681%29.jpg?width=1280',
        alt: 'Sauk Mountain summit with wildflower meadows + view across the Skagit Valley to Mt. Baker.',
        credit: 'Photo: Miguel Vieira · CC BY 2.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Sauk_Mountain_(1835204681).jpg',
        width: 1600,
        height: 1067,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'hidden-lake-lookout',
    needsWa20Through: false,
    name: 'Hidden Lake Lookout',
    where: 'FR 1540 off Cascade River Rd, near Marblemount (West)',
    side: 'west',
    effort: 'strenuous',
    length: '9.0 mi RT',
    elevation: '+3,300 ft',
    roadAccessRequired: 'Yes — FR 1540 high-clearance recommended; verify before counting on it',
    permit: 'none',
    whyHidden:
      "It's IG-famous for the lookout photo but the road + climb keep most visitors away. The lookout itself is volunteer-maintained, not in the NPS-recommended list.",
    tripFit:
      'A big-day option if both feel strong — same Cascade River Rd access as the Cascade Pass marquee. Pair with a Marblemount west-base; not feasible from East.',
    driveFromBases: [
      { from: 'Marblemount', text: '~40 min drive + FR 1540 last mile' },
      { from: 'Concrete', text: '~1 hr + FR 1540 last mile' },
      { from: 'Mazama', text: 'WA-20 closed mid-corridor → not feasible' },
      { from: 'Winthrop', text: 'WA-20 closed mid-corridor → not feasible' },
    ],
    sources: [
      { name: 'WTA · Hidden Lake Lookout', url: 'https://www.wta.org/go-hiking/hikes/hidden-lake-1' },
      { name: 'AllTrails · Hidden Lake Trail', url: 'https://www.alltrails.com/trail/us/washington/hidden-lake-trail' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hidden%20Lake%20Peak.jpg?width=1280',
        alt: 'Hidden Lake Lookout perched on a granite ridge above an alpine lake in the North Cascades.',
        credit: 'Photo: Trailspotter · CC BY 2.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Hidden_Lake_Peak.jpg',
        width: 1600,
        height: 1067,
      },
    ],
    status: {
      kind: 'caution',
      label: 'Road access flagged',
      detail:
        'FR 1540 status varies year to year — high-clearance recommended even when "open." Check the Mt. Baker-Snoqualmie NF road status page before counting on a sub-9-mile RT (an extra walk-in adds significantly to the day).',
      asOf: 'May 17, 2026',
      sourceUrl: 'https://www.fs.usda.gov/r6/mbs/roadcondrep',
    },
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'park-butte-fire-lookout',
    needsWa20Through: false,
    name: 'Park Butte fire lookout',
    where: 'FR 13 off Baker Lake Rd, Mt. Baker SW flank (West / Mt. Baker)',
    side: 'mt-baker',
    effort: 'moderate',
    length: '7.5 mi RT',
    elevation: '+2,200 ft',
    roadAccessRequired: 'Yes — Baker Lake Rd paved; FR 13 last 4 mi is gravel, passable',
    permit: 'nw-forest-pass',
    whyHidden:
      'Sits SW of the park boundary inside the Mt. Baker Wilderness — not a North Cascades NP trail and therefore omitted from most North Cascades trip lists. Locals call it the Baker face-shot.',
    tripFit:
      'Strong West-base alternate if WA-20 stays closed and the East side is off-limits. Historic 1932 lookout, in-your-face Mt. Baker. Long-ish drive (1 hr 15 min from Marblemount) earns the view.',
    driveFromBases: [
      { from: 'Marblemount', text: '~1 hr 15 min · 35 mi' },
      { from: 'Concrete', text: '~1 hr · 27 mi' },
      { from: 'Mazama', text: 'WA-20 closed → not feasible' },
      { from: 'Winthrop', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Park Butte', url: 'https://www.wta.org/go-hiking/hikes/park-butte' },
      { name: 'AllTrails · Park Butte Lookout', url: 'https://www.alltrails.com/trail/us/washington/park-butte-trail' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Park-butte-lookout.jpg?width=1280',
        alt: 'Park Butte fire lookout on a clear summer day with Mt. Baker rising behind.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Park-butte-lookout.jpg',
        width: 1600,
        height: 1067,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'pyramid-lake',
    needsWa20Through: false,
    name: 'Pyramid Lake',
    where: 'MP 127 WA-20, west of Newhalem (West)',
    side: 'west',
    effort: 'low',
    length: '4.2 mi RT',
    elevation: '+1,500 ft',
    roadAccessRequired: 'No — paved-highway trailhead pull-off',
    permit: 'none',
    whyHidden:
      "Sits at the same milepost band as Diablo + Newhalem but reads as 'just another forested trail' next to those marquee names — so trip lists skip it. Real payoff: a quiet pocket lake under Pyramid Peak.",
    tripFit:
      "Low-energy day or rainy morning — short, no road logistics, on the way to / from any West-base lodging. Skip if you're chasing alpine; take if you want forest + reflection.",
    driveFromBases: [
      { from: 'Marblemount', text: '~15 min · 8 mi' },
      { from: 'Concrete', text: '~30 min · 18 mi' },
      { from: 'Mazama', text: 'WA-20 closed → not feasible' },
      { from: 'Winthrop', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Pyramid Lake', url: 'https://www.wta.org/go-hiking/hikes/pyramid-lake' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pyramid%20Peak%20reflected%20in%20Diablo%20Lake.jpg?width=1280',
        alt: 'Pyramid Peak reflected in Diablo Lake — the same Pyramid Peak that towers above Pyramid Lake.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Pyramid_Peak_reflected_in_Diablo_Lake.jpg',
        width: 1600,
        height: 1067,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'trail-of-cedars-newhalem',
    needsWa20Through: false,
    name: 'Trail of the Cedars + Newhalem walks',
    where: 'End of Main St, Newhalem · MP 120 (West)',
    side: 'west',
    effort: 'low',
    length: '0.3 mi loop (+ optional add-ons)',
    elevation: 'minimal',
    roadAccessRequired: 'No — paved walk from town parking',
    permit: 'none',
    whyHidden:
      "It's literally inside Newhalem so it gets dismissed as 'a town walk' rather than a hike. The suspension bridge + old-growth cedar interpretive loop is genuinely beautiful and 5 min from your car.",
    tripFit:
      'Low-energy day, rainy morning, post-drive stretch. Pair with Ladder Creek Falls + Skagit General Store kosher snack-check for a complete low-effort Newhalem stop.',
    driveFromBases: [
      { from: 'Marblemount', text: '~18 min · 9 mi' },
      { from: 'Concrete', text: '~30 min · 17 mi' },
      { from: 'Mazama', text: 'WA-20 closed → not feasible' },
      { from: 'Winthrop', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Trail of the Cedars', url: 'https://www.wta.org/go-hiking/hikes/trail-of-the-cedars' },
      { name: 'NPS · Newhalem trails', url: 'https://www.nps.gov/noca/planyourvisit/newhalem.htm' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Newhalem%2C%20WA%20-%20Trail%20of%20the%20Cedars%2001.jpg?width=1280',
        alt: 'Suspension footbridge over the Skagit River at the start of the Trail of the Cedars in Newhalem.',
        credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Newhalem,_WA_-_Trail_of_the_Cedars_01.jpg',
        width: 1600,
        height: 1067,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },

  // ====================================================================
  // MT. BAKER CORRIDOR (separate from West because WA-542 is its own approach)
  // ====================================================================
  {
    id: 'heliotrope-ridge',
    needsWa20Through: false,
    name: 'Heliotrope Ridge',
    where: 'FR 39 (Glacier Creek Rd) off WA-542 · Mt. Baker corridor',
    side: 'mt-baker',
    effort: 'moderate',
    length: '5.5 mi RT',
    elevation: '+1,400 ft',
    roadAccessRequired: 'Yes — FR 39 currently closed at mile 1 (washouts)',
    permit: 'nw-forest-pass',
    whyHidden:
      "Off the WA-20 corridor entirely — a Mt. Baker side trip. People doing 'the North Cascades' usually never hit it. Coleman Glacier overlook is on every climbers' photo reel.",
    tripFit:
      'Day-1 Bellingham detour material — only if road reopens AND you flew into BLI. Otherwise skip; the drive from Marblemount is 2+ hours each way for a 3-4 hour hike.',
    driveFromBases: [
      { from: 'Bellingham (BLI)', text: '~1 hr 15 min · 50 mi (once road reopens)' },
      { from: 'Marblemount', text: '~2 hr each way — skip unless making a Bellingham loop' },
      { from: 'Mazama', text: 'WA-20 closed → not feasible' },
      { from: 'Winthrop', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Heliotrope Ridge', url: 'https://www.wta.org/go-hiking/hikes/heliotrope-ridge' },
      { name: 'USFS · Mt. Baker road status', url: 'https://www.fs.usda.gov/r6/mbs/roadcondrep' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Heliotrope%20Ridge%20snowmelt.jpg?width=1280',
        alt: 'Heliotrope Ridge meadows under Mt. Baker with the Coleman Glacier behind.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Heliotrope_Ridge_snowmelt.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coleman%20Glacier%206984.JPG?width=1280',
        alt: 'Coleman Glacier on Mt. Baker — the photo payoff at the end of the Heliotrope Ridge trail.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Coleman_Glacier_6984.JPG',
        width: 1600,
        height: 1067,
      },
    ],
    status: {
      kind: 'closed',
      label: 'Trailhead currently CLOSED',
      detail:
        'Glacier Creek Rd (FR 39) closed at mile 1 due to washouts at miles 3.6 and 3.8 (WTA alert 3.20.26). Trail effectively inaccessible until road is repaired. May or may not reopen by Aug 16 — re-check WTA before counting on this one.',
      asOf: 'May 17, 2026',
      sourceUrl: 'https://www.wta.org/go-hiking/hikes/heliotrope-ridge',
    },
    verifiedAsOf: 'May 17, 2026',
  },

  // ====================================================================
  // EAST SIDE
  // ====================================================================
  {
    id: 'cutthroat-lake',
    needsWa20Through: true,
    name: 'Cutthroat Lake (lake-only)',
    where: 'MP 167 WA-20 · Cutthroat Creek TH (East)',
    side: 'east',
    effort: 'low',
    length: '3.8 mi RT',
    elevation: '+400 ft',
    roadAccessRequired: 'No — paved WA-20 pull-off',
    permit: 'nw-forest-pass',
    whyHidden:
      "Sits next to Maple Pass + Blue Lake in everyone's lists, so trip blogs default to those. Cutthroat Lake alone (skipping the steep pass extension) is a gentle alpine lake walk most planners overlook.",
    tripFit:
      "Easy East-base half-day from Mazama or Winthrop. Loop with a Washington Pass Overlook drive-by for the photo + dinner in Mazama. If you want more, the 10-mi Cutthroat Pass extension up the PCT is the marquee version.",
    driveFromBases: [
      { from: 'Mazama', text: '~15 min · 9 mi' },
      { from: 'Winthrop', text: '~30 min · 22 mi' },
      { from: 'Marblemount', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Cutthroat Lake', url: 'https://www.wta.org/go-hiking/hikes/cutthroat-lake' },
      { name: 'AllTrails · Cutthroat Lake', url: 'https://www.alltrails.com/trail/us/washington/cutthroat-lake-trail' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Between%20Rainy%20and%20Washington%20Pass%20%2836871032836%29.jpg?width=1280',
        alt: 'Cutthroat Peak above the Rainy / Washington Pass corridor — the basin Cutthroat Lake sits in.',
        credit: 'Photo: Robert Ashworth · CC BY 2.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Between_Rainy_and_Washington_Pass_(36871032836).jpg',
        width: 2048,
        height: 1536,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'goat-peak-lookout',
    needsWa20Through: false,
    name: 'Goat Peak Lookout',
    where: 'FR 5225 off Mazama Rd · East / Mazama side',
    side: 'east',
    effort: 'moderate',
    length: '5.0 mi RT',
    elevation: '+1,400 ft',
    roadAccessRequired: 'Yes — FR 5225 gravel, narrow last 3 mi, passable for rental',
    permit: 'nw-forest-pass',
    whyHidden:
      "Methow locals' favorite quick lookout hike — staffed fire lookout above the valley — but tourists default to Maple Pass / Blue Lake. Half the distance for a 360° view across the whole Methow.",
    tripFit:
      "Mazama-based half-day with a real summit payoff. Good morning hike before a Winthrop afternoon. Pair with the Mazama Store kosher snack run before the FR 5225 turnoff.",
    driveFromBases: [
      { from: 'Mazama', text: '~30 min · 11 mi (incl. FR 5225)' },
      { from: 'Winthrop', text: '~45 min · 22 mi' },
      { from: 'Marblemount', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Goat Peak Lookout', url: 'https://www.wta.org/go-hiking/hikes/goat-peak-lookout' },
      { name: 'AllTrails · Goat Peak', url: 'https://www.alltrails.com/trail/us/washington/goat-peak-lookout-trail' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Goat%20peak%20small.jpg?width=1280',
        alt: 'Goat Peak fire lookout on a clear summer day above the Methow Valley.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Goat_peak_small.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Goat%20Peak%2C%20Cascades.jpg?width=1280',
        alt: 'Goat Peak in the North Cascades with the fire lookout perched on the ridge.',
        credit: 'Photo: Gregg M. Erickson · CC BY-SA 3.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Goat_Peak,_Cascades.jpg',
        width: 1600,
        height: 1067,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'tiffany-mountain',
    needsWa20Through: false,
    name: 'Tiffany Mountain summit',
    where: 'FR 39 off WA-20 east of Winthrop · Okanogan NF (East)',
    side: 'east',
    effort: 'moderate',
    length: '6.4 mi RT',
    elevation: '+1,700 ft',
    roadAccessRequired: 'Yes — FR 39 + FR 100 last 7 mi rough gravel, high-clearance preferred',
    permit: 'nw-forest-pass',
    whyHidden:
      "Sits ~1 hr east of Winthrop in the Okanogan NF — almost no North Cascades trip lists include it. A wildflower-streaked 8,242 ft summit with Cascades-to-Pasayten panorama. Locals' summer go-to.",
    tripFit:
      'East-base wildflower day for late-summer color (mid-July through mid-August is peak). Long drive earned by a true open-summit. Skip if FR 39/100 access has degraded — check Methow Trails before going.',
    driveFromBases: [
      { from: 'Winthrop', text: '~1 hr 15 min · 27 mi (incl. FR roads)' },
      { from: 'Mazama', text: '~1 hr 30 min · 38 mi' },
      { from: 'Marblemount', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Tiffany Mountain', url: 'https://www.wta.org/go-hiking/hikes/tiffany-mountain' },
      { name: 'AllTrails · Tiffany Mountain', url: 'https://www.alltrails.com/trail/us/washington/tiffany-mountain' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tiffany%20Mountain%20south%20side.JPG?width=1280',
        alt: 'Tiffany Mountain south side in summer — open ridge with wildflowers.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Tiffany_Mountain_south_side.JPG',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tiffany%20Mt%20%288275%20feet%29.jpg?width=1280',
        alt: 'Tiffany Mt summit ridge in the Okanogan-Wenatchee NF.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Tiffany_Mt_(8275_feet).jpg',
        width: 1600,
        height: 1067,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'slate-peak',
    needsWa20Through: false,
    name: 'Slate Peak (drive-up lookout)',
    where: "Hart's Pass FR 5400 from Mazama · ends at 7,440 ft (East)",
    side: 'east',
    effort: 'low',
    length: 'drive-up + 0.5 mi short walk to lookout',
    elevation: 'minimal walk · 7,440 ft summit',
    roadAccessRequired: 'YES — highest drivable road in Washington · narrow exposed gravel · ~1 hr each way from Mazama',
    permit: 'none',
    whyHidden:
      "Tied for highest drivable point in WA but the road is the catch — exposed cliff-edge gravel keeps most rental-car drivers away. Those who go get a 360° Pasayten + Cascades panorama with almost no effort.",
    tripFit:
      "East-base sunset / stargazing window — Aug 18 is new moon. Slate is far enough east that WA-20 closure doesn't block it. Drive carefully; the road is the experience.",
    driveFromBases: [
      { from: 'Mazama', text: '~1 hr · 22 mi (gravel · slow)' },
      { from: 'Winthrop', text: '~1 hr 30 min · 35 mi' },
      { from: 'Marblemount', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: "WTA · Slate Peak / Hart's Pass", url: 'https://www.wta.org/go-hiking/hikes/slate-peak' },
      { name: 'NPS · scenic drives', url: 'https://www.nps.gov/noca/planyourvisit/scenicdrives.htm' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pasayten%20Slate%20Peak.JPG?width=1280',
        alt: 'Slate Peak summit area in the Pasayten Wilderness — open ridge above tree line.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Pasayten_Slate_Peak.JPG',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Devils%20Peak%20from%20the%20lookout%20on%20Slate%20Peak.jpg?width=1280',
        alt: 'Devils Peak seen from the fire lookout on Slate Peak.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Devils_Peak_from_the_lookout_on_Slate_Peak.jpg',
        width: 1600,
        height: 1067,
      },
    ],
    status: {
      kind: 'access-warning',
      label: 'Exposed mountain road',
      detail:
        "FR 5400 above Hart's Pass is narrow, cliff-edged, no guardrail. Normally accessible mid-August once snow melts but check road status before going. Not for white-knuckle drivers; not for RVs or trailers.",
      asOf: 'May 17, 2026',
      sourceUrl: 'https://www.fs.usda.gov/r6/mbs/roadcondrep',
    },
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'maple-pass-frisco',
    needsWa20Through: true,
    name: 'Maple Pass + Frisco Mountain extension',
    where: 'MP 158 WA-20 from Rainy Pass · off-trail ridge add-on (East)',
    side: 'east',
    effort: 'strenuous',
    length: '~9 mi total (Maple Pass 7.2 + Frisco add 1.5-2)',
    elevation: '+2,800 ft (Maple Pass base + ridge scramble)',
    roadAccessRequired: 'No — paved Rainy Pass trailhead',
    permit: 'nw-forest-pass',
    whyHidden:
      "Maple Pass is the marquee; the Frisco Mountain ridge add-on is an off-trail scramble from Heather Pass that almost nobody does. Same trailhead, +1.5 hours, summit-of-the-day.",
    tripFit:
      "Only if both feel strong AND have a navigation comfort level (off-trail scramble). Solid for Allison if Erin is good with the marquee loop alone. Otherwise pick one or the other — don't try to do both as a casual day.",
    driveFromBases: [
      { from: 'Mazama', text: '~25 min · 17 mi' },
      { from: 'Winthrop', text: '~50 min · 32 mi' },
      { from: 'Marblemount', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'WTA · Maple Pass', url: 'https://www.wta.org/go-hiking/hikes/maple-pass' },
      { name: 'Summitpost · Frisco Mountain', url: 'https://www.summitpost.org/frisco-mountain/151013' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maple%20Pass%20Loop%20%28Frisco%20Mountain%2C%20Washington%29%20%289924249083%29.jpg?width=1280',
        alt: 'Maple Pass Loop ridge with Frisco Mountain rising above the basin.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Maple_Pass_Loop_(Frisco_Mountain,_Washington)_(9924249083).jpg',
        width: 1600,
        height: 1067,
      },
    ],
    status: {
      kind: 'caution',
      label: 'Off-trail scramble',
      detail:
        "The Frisco extension leaves established trail at Heather Pass. Requires navigation confidence. Don't attempt in low visibility or first thing in the morning when fog can hold the ridge.",
      asOf: 'May 17, 2026',
    },
    verifiedAsOf: 'May 17, 2026',
  },

  // ====================================================================
  // EXPERT-ONLY / OVERNIGHT (wow but not the plan)
  // ====================================================================
  {
    id: 'sahale-glacier-camp',
    needsWa20Through: false,
    name: 'Sahale Glacier Camp (overnight)',
    where: 'End of Cascade River Rd · Sahale Arm to 7,600 ft (West)',
    side: 'west',
    effort: 'expert-only',
    length: '12.8 mi RT (with overnight pack)',
    elevation: '+4,100 ft',
    roadAccessRequired: 'No — paved Cascade River Rd to trailhead',
    permit: 'recreation-gov',
    whyHidden:
      "Listed on every 'top NC backpacking trip' list but the wilderness permit lottery + technical exposure (loose rock, glacier proximity) means few who plan a 5-day NC trip actually book it. Wow but expert-only.",
    tripFit:
      "Not the plan. Listed here so the option is visible — if Erin can't go, this is the kind of solo overnight Allison could pivot to in a future trip. Permits via Recreation.gov ~6 months out.",
    driveFromBases: [
      { from: 'Marblemount', text: '~50 min · 23 mi' },
      { from: 'Mazama', text: 'WA-20 closed → not feasible' },
      { from: 'Winthrop', text: 'WA-20 closed → not feasible' },
    ],
    sources: [
      { name: 'NPS · backcountry permits', url: 'https://www.nps.gov/noca/planyourvisit/backcountry-camping.htm' },
      { name: 'WTA · Sahale Arm trip reports', url: 'https://www.wta.org/go-hiking/hikes/cascade-pass-sahale-arm' },
    ],
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mountain%20view%20from%20Sahale%20Glacier%20Camp%20%283c95838731d24c2b91cedafcf3e0c6f3%29.JPG?width=1280',
        alt: 'Sunrise from Sahale Glacier Camp — ridge above Cascade Pass with the North Cascades all around.',
        credit: 'Photo: NPS · public domain',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Mountain_view_from_Sahale_Glacier_Camp_(3c95838731d24c2b91cedafcf3e0c6f3).JPG',
        width: 1600,
        height: 1067,
      },
    ],
    status: {
      kind: 'caution',
      label: 'Expert-only · permit lottery',
      detail:
        'Sahale Glacier Camp sits at 7,600 ft on loose moraine with glacier proximity. Requires solid scramble skills, glacier-travel awareness, and a wilderness permit booked via Recreation.gov lottery. Not the plan for this trip — listed as a wow-option for future-Allison.',
      asOf: 'May 17, 2026',
    },
    verifiedAsOf: 'May 17, 2026',
  },
];

// ====================================================================
// EFFORT LABEL HELPERS
// ====================================================================
export const EFFORT_LABELS: Record<GemEffort, string> = {
  low: 'Low effort',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
  'expert-only': 'Expert-only',
};

export const SIDE_LABELS: Record<GemSide, string> = {
  west: 'West side',
  east: 'East side',
  'mt-baker': 'Mt. Baker',
  either: 'Either side',
};

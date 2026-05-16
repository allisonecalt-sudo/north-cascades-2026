/**
 * Roadside viewpoints along WA-20.
 *
 * Neutral framing — no "postcard" hierarchy. Diablo Lake + Washington Pass are
 * still the bigger stops (longer durations, more facilities) so they lead the
 * list; the rest are quick pull-offs.
 */

export interface ViewpointPhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export interface Viewpoint {
  milepost: number;
  name: string;
  description: string;
  /** Approx visit time — helps the reader picture the day. */
  timeNeeded: string;
  /** Bigger stops get a photo; pull-offs don't. */
  featured?: boolean;
  photo?: ViewpointPhoto;
}

export const VIEWPOINTS: Viewpoint[] = [
  {
    milepost: 132,
    name: 'Diablo Lake Overlook',
    description:
      'Large parking, restrooms, interpretive shelter. The glacier-flour turquoise lake from above — the signature North Cascades view.',
    timeNeeded: '20-30 min',
    featured: true,
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
      alt: 'Turquoise Diablo Lake from the WA-20 overlook, surrounded by forested peaks.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_from_Overlook_03.jpg',
      width: 1200,
      height: 800,
    },
  },
  {
    milepost: 162,
    name: 'Washington Pass Overlook',
    description:
      '400-ft paved trail to a ledge view of Liberty Bell, Early Winters Spires, and Kangaroo Ridge. Fully accessible.',
    timeNeeded: '20 min',
    featured: true,
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Washington_Pass_and_Liberty_Bell_Mountain.JPG',
      alt: 'Liberty Bell Mountain and Early Winters Spires from Washington Pass Overlook.',
      credit: 'Photo: Jsayre64 · CC BY-SA 3.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_Pass_and_Liberty_Bell_Mountain.JPG',
      width: 1200,
      height: 800,
    },
  },
  {
    milepost: 119,
    name: 'Goodell Creek Overlook',
    description: 'Quick pull-off.',
    timeNeeded: '5 min',
  },
  {
    milepost: 120,
    name: 'Ladder Creek Falls (Gorge Powerhouse)',
    description: 'Short paved loop, lit at night dusk-to-11 pm.',
    timeNeeded: '15 min',
  },
  {
    milepost: 123,
    name: 'Gorge Creek Falls',
    description: 'Pull-out + footbridge over the gorge.',
    timeNeeded: '5-10 min',
  },
  {
    milepost: 130,
    name: 'Colonial Creek South Campground',
    description: 'Trailhead for Thunder Knob; picnic area for a drive-day lunch.',
    timeNeeded: 'Picnic / hike stop',
  },
  {
    milepost: 135,
    name: 'Ross Lake Overlook',
    description: 'Quick pull-off.',
    timeNeeded: '5 min',
  },
  {
    milepost: 158,
    name: 'Rainy Pass / Rainy Lake Trailhead',
    description: 'Paved 1.8 mi RT walk to Rainy Lake; also the trailhead for Maple Pass + Cutthroat Pass.',
    timeNeeded: 'Hike stop',
  },
];

/**
 * Mt. Baker corridor (WA-542) viewpoints — bonus, off-WA-20.
 *
 * Only realistic on Path A (west-side anchor) or on a Day 1 detour from BLI.
 * Surfaced separately so they don\'t pollute the WA-20 mileage list.
 */
export interface BakerViewpoint {
  name: string;
  where: string;
  description: string;
  timeNeeded: string;
}

export const BAKER_VIEWPOINTS: BakerViewpoint[] = [
  {
    name: 'Picture Lake',
    where: 'WA-542 end · Heather Meadows · ~1 hr east of Bellingham',
    description:
      'Maybe the most-photographed scene in Washington — Mt. Shuksan mirrored in the lake. Easy 0.5 mi paved loop around the water. Iconic at sunrise + sunset.',
    timeNeeded: '30-45 min',
  },
  {
    name: 'Artist Point',
    where: 'End of WA-542 · ~5 min past Picture Lake',
    description:
      'Drive-up panorama of Mt. Baker + Mt. Shuksan. Multiple short walks from the parking area. Road closes by snow late October; mid-August always open.',
    timeNeeded: '30-60 min',
  },
  {
    name: 'Heather Meadows',
    where: 'WA-542 · ~10 min before Artist Point',
    description:
      'Wildflower meadows in August, easy walking trails, alpine tarns. Pair with Chain Lakes hike (6-7 mi loop, see Hikes).',
    timeNeeded: '1-2 hrs',
  },
];

export const BAKER_NOTE =
  'These are off WA-20 — they sit on the Mt. Baker corridor (WA-542) east of Bellingham. Best fit: Path A (west-side anchor) Day 4 swap-in, OR a Day 1 detour from BLI before driving to Marblemount.';

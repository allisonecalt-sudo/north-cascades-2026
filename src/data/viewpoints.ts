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

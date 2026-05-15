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
  postcard?: boolean;
  photo?: ViewpointPhoto;
}

export const VIEWPOINTS: Viewpoint[] = [
  {
    milepost: 119,
    name: 'Goodell Creek Overlook',
    description: 'Quick pull-off.',
  },
  {
    milepost: 120,
    name: 'Ladder Creek Falls (Gorge Powerhouse)',
    description: 'Short paved loop, lit at night dusk-to-11 pm.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gorge_Creek_Falls_-_01.jpg',
      alt: 'Cascading waterfall in a forested ravine.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Gorge_Creek_Falls_-_01.jpg',
      width: 800,
      height: 1200,
    },
  },
  {
    milepost: 123,
    name: 'Gorge Creek Falls',
    description: 'Pull-out + footbridge over the gorge.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gorge_Creek_Falls_-_01.jpg',
      alt: 'Gorge Creek Falls cascading 242 feet down the mountain into Gorge Lake.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Gorge_Creek_Falls_-_01.jpg',
      width: 800,
      height: 1200,
    },
  },
  {
    milepost: 130,
    name: 'Colonial Creek South Campground',
    description: 'Trailhead for Thunder Knob; picnic area for Day 3 lunch.',
  },
  {
    milepost: 132,
    name: 'Diablo Lake Overlook',
    description:
      'Large parking, restrooms, interpretive shelter. Glacier-flour turquoise lake — the signature North Cascades photo.',
    postcard: true,
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
    milepost: 135,
    name: 'Ross Lake Overlook',
    description: 'Quick pull-off.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/North_Cascades_-_Ross_Lake_-_2017_8_29.jpg',
      alt: 'Long reservoir of Ross Lake winding through forested mountains.',
      credit: 'Photo: Wikimedia Commons (CC BY-SA)',
      creditUrl: 'https://commons.wikimedia.org/wiki/Category:Ross_Lake_(Washington)',
      width: 1200,
      height: 800,
    },
  },
  {
    milepost: 158,
    name: 'Rainy Pass / Rainy Lake Trailhead',
    description: '1.8 mi paved walk to lake; also Maple Pass + Cutthroat Pass trailhead.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/View_from_Maple_Pass.jpg',
      alt: 'Panoramic ridgeline view from Maple Pass over alpine valleys.',
      credit: 'Photo: Wikimedia Commons · CC BY 2.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:View_from_Maple_Pass.jpg',
      width: 1200,
      height: 844,
    },
  },
  {
    milepost: 162,
    name: 'Washington Pass Overlook',
    description:
      '400-ft paved trail to dramatic ledge view of Liberty Bell + Early Winters Spires + Kangaroo Ridge. Fully accessible.',
    postcard: true,
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Washington_Pass_and_Liberty_Bell_Mountain.JPG',
      alt: 'Liberty Bell Mountain and Early Winters Spires from Washington Pass Overlook.',
      credit: 'Photo: Jsayre64 · CC BY-SA 3.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_Pass_and_Liberty_Bell_Mountain.JPG',
      width: 1200,
      height: 800,
    },
  },
];

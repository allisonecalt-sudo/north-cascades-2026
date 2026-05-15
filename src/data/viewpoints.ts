export interface Viewpoint {
  milepost: number;
  name: string;
  description: string;
  postcard?: boolean;
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
  },
  {
    milepost: 123,
    name: 'Gorge Creek Falls',
    description: 'Pull-out + footbridge over the gorge.',
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
  },
  {
    milepost: 135,
    name: 'Ross Lake Overlook',
    description: 'Quick pull-off.',
  },
  {
    milepost: 158,
    name: 'Rainy Pass / Rainy Lake Trailhead',
    description: '1.8 mi paved walk to lake; also Maple Pass + Cutthroat Pass trailhead.',
  },
  {
    milepost: 162,
    name: 'Washington Pass Overlook',
    description:
      '400-ft paved trail to dramatic ledge view of Liberty Bell + Early Winters Spires + Kangaroo Ridge. Fully accessible.',
    postcard: true,
  },
];

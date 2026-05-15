export interface Lodging {
  id: string;
  name: string;
  address: string;
  phone?: string;
  type: string;
  pricePerNight: string;
  distance: string;
  notes: string;
  bookingHint?: string;
  topPick?: boolean;
}

export const WEST_LODGING: Lodging[] = [
  {
    id: 'skagit-river-resort',
    name: 'Skagit River Resort (Clark’s Cabins)',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 873-2250',
    type: 'Theme cabins · kitchen · gas fireplace',
    pricePerNight: '$150-250 peak',
    distance: '~10 min west of Marblemount · ~30 min to Newhalem Visitor Center',
    notes:
      'Fully equipped theme cabins, recently remodeled. On-site eatery (Clark’s) with famous cinnamon rolls.',
    bookingHint: 'Book direct by phone.',
    topPick: true,
  },
  {
    id: 'glacier-peak',
    name: 'Glacier Peak Resort & Winery',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 708-3005',
    type: 'Cabins · sofa beds · smart TVs · WiFi',
    pricePerNight: '$150-220 cabins',
    distance: 'Same road as Skagit River Resort',
    notes: 'Cabins with on-site restaurant + winery.',
  },
  {
    id: 'buffalo-run',
    name: 'Buffalo Run Inn',
    address: '60084 WA-20, Marblemount, WA 98267',
    phone: '(360) 873-2103',
    type: 'Historic inn (1889, renovated 2004)',
    pricePerNight: '$130-180',
    distance: 'On WA-20 in Marblemount center · walkable to restaurant + country store',
    notes: 'Inn-style rather than cabin. Solid backup if the cabins are booked.',
  },
];

export const EAST_LODGING: Lodging[] = [
  {
    id: 'freestone',
    name: 'Freestone Inn & Cabins',
    address: '31 Early Winters Dr, Mazama, WA 98833',
    type: 'Lodge rooms w/ fireplace + private deck · cabins w/ kitchens · pool · hot tub',
    pricePerNight: '$200-300 lodge · $300+ cabins (Aug peak)',
    distance: '15 mi west of Winthrop · ~25 min to Rainy Pass',
    notes:
      'Closest east-side lodging to Rainy Pass. Strongest match for "spacious + a little nicer than basic."',
    topPick: true,
  },
  {
    id: 'sun-mountain',
    name: 'Sun Mountain Lodge',
    address: '604 Patterson Lake Rd, Winthrop, WA 98862',
    phone: '(509) 996-2211',
    type: 'Iconic ridge-top lodge · Patterson Lake Cabins · spa · multiple restaurants',
    pricePerNight: 'From $270 + ~$25/night resort fee · cabins higher',
    distance: '~10 min from Winthrop · ~45 min to Rainy Pass',
    notes: 'Splurge option — most upscale on the east side. 1,500 acres of trails on property.',
  },
  {
    id: 'methow-river',
    name: 'Methow River Lodge & Cabins',
    address: '110 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-4348',
    type: 'Cabins + lodge rooms on the Methow River',
    pricePerNight: '$200-250',
    distance: 'Walking distance to Winthrop boardwalk + restaurants',
    notes: 'Mid-tier — nicer than basic, walkable to dinner, river setting.',
  },
];

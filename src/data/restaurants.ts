export interface Restaurant {
  name: string;
  address: string;
  note: string;
}

export interface RestaurantTown {
  town: string;
  places: Restaurant[];
}

export const RESTAURANTS: RestaurantTown[] = [
  {
    town: 'Marblemount / Rockport',
    places: [
      {
        name: 'Buffalo Run Restaurant',
        address: '60084 WA-20, Marblemount',
        note: 'American, elk + buffalo burgers, casual.',
      },
      {
        name: 'Mondo Restaurant',
        address: '60102 WA-20, Marblemount',
        note: 'American + Korean fusion. Slightly better reviews than Buffalo Run.',
      },
      {
        name: 'Birdsview Brewing Co',
        address: '38302 WA-20, Concrete (~25 min west of Marblemount)',
        note: 'Brewery + pub food, on the drive in from Bellingham.',
      },
      {
        name: 'Cascadian Farm Roadside Stand',
        address: '55749 WA-20, Rockport',
        note: 'Organic farm stand, ice cream, smoothies — quick stop, not a meal.',
      },
      {
        name: "Clark's Eatery",
        address: 'At Skagit River Resort',
        note: 'On-site if you stay there. Famous cinnamon rolls.',
      },
    ],
  },
  {
    town: 'Winthrop / Mazama',
    places: [
      {
        name: 'Arrowleaf Bistro',
        address: '207 White Ave, Winthrop',
        note: 'Seasonal local cuisine, river deck. Nicer dinner pick — small dining room, books up.',
      },
      {
        name: 'Old Schoolhouse Brewery',
        address: '155 Riverside Ave, Winthrop',
        note: 'Brewpub on the Chewuch River. Live music summer weekends.',
      },
      {
        name: 'Rocking Horse Bakery',
        address: '265 Riverside Ave, Winthrop',
        note: 'Coffee, pastries, breakfast.',
      },
      {
        name: 'East 20 Pizza',
        address: '720 WA-20, Winthrop',
        note: 'Casual pizza.',
      },
      {
        name: 'Three Fingered Jacks Saloon',
        address: '176 Riverside Ave, Winthrop',
        note: 'Old-west saloon. Breakfast + dinner.',
      },
      {
        name: "Sheri's Sweet Shoppe",
        address: '191 Riverside Ave, Winthrop',
        note: 'Ice cream + candy.',
      },
      {
        name: 'Mazama Store',
        address: '50 Lost River Rd, Mazama',
        note: 'Bakery, deli sandwiches, coffee — great trailhead lunch stop.',
      },
    ],
  },
];

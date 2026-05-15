export interface RentalOption {
  id: string;
  label: string;
  vehicleType: string;
  costRange: string;
  flexibility: string;
  tradeoff: string;
  recommended?: 'best-value' | 'cheapest' | 'flex' | 'avoid' | null;
}

export const RENTAL_OPTIONS: RentalOption[] = [
  {
    id: 'sea-rt-suv',
    label: 'SEA roundtrip — Compact SUV',
    vehicleType: 'RAV4 / CR-V class',
    costRange: '~$350-500 + tax · no drop fee',
    flexibility: 'Pairs with SEA-roundtrip flight. Works under every contingency.',
    tradeoff:
      'Clearance is fine for the 13 mi of gravel on Cascade River Rd. AWD nice-to-have but not needed in August.',
    recommended: 'best-value',
  },
  {
    id: 'sea-rt-sedan',
    label: 'SEA roundtrip — Mid-size sedan',
    vehicleType: 'Camry / Accord class',
    costRange: '~$250-400',
    flexibility: 'Cheapest overall. Still fine for Cascade River Rd ("any car w/ reasonable clearance, go slow").',
    tradeoff: 'Less cargo room; lower ride height on the dirt section.',
    recommended: 'cheapest',
  },
  {
    id: 'bli-sea-oneway',
    label: 'BLI → SEA one-way — Compact SUV',
    vehicleType: 'RAV4 / CR-V class',
    costRange: '~$400-600 + $50-150 drop fee = ~$450-750',
    flexibility: 'Pairs with the open-jaw flight plan only.',
    tradeoff:
      'Pays a $100-250 premium for the no-backtrack convenience. Only worth it if WA-20 is confirmed open.',
    recommended: 'avoid',
  },
  {
    id: 'turo',
    label: 'Turo SEA — Mid-size SUV / 4Runner',
    vehicleType: 'Peer-to-peer',
    costRange: '~$300-500 (host-dependent) + delivery fee if non-airport',
    flexibility: 'Selection varies; often cheaper than majors.',
    tradeoff: 'Worth a 10-min check on turo.com. Cancellation policies are host-specific.',
    recommended: 'flex',
  },
  {
    id: 'camper-escape',
    label: 'Escape Camper Vans, SEA',
    vehicleType: 'Camper van (sleeps 2)',
    costRange: '~$200-285/night × 5 = $1,000-1,425 + mileage',
    flexibility: 'Changes the trip vibe — could car-camp Colonial Creek if west side reopens.',
    tradeoff:
      "Erin's brief said 'spacious, a little nicer than basic' — camper van isn't that. Skip unless she actively wants vanlife.",
    recommended: 'avoid',
  },
  {
    id: 'outdoorsy-rv',
    label: 'Outdoorsy class B/C RV',
    vehicleType: 'Larger campervan / small RV',
    costRange: '~$1,500-2,500 for 5 days',
    flexibility: 'Lodging + transport in one.',
    tradeoff: 'Overshoots the brief. Not recommended.',
    recommended: 'avoid',
  },
];

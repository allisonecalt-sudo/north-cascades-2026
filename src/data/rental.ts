/**
 * Rental car — options, not winners.
 *
 * No "best value / cheapest / avoid" badges — they prescribe. Each card just
 * shows cost, what it pairs with, and the tradeoff. Reader picks.
 */

export interface RentalOption {
  id: string;
  label: string;
  vehicleType: string;
  costRange: string;
  pairsWith: string;
  tradeoff: string;
}

export const RENTAL_OPTIONS: RentalOption[] = [
  {
    id: 'sea-rt-suv',
    label: 'SEA roundtrip — Compact SUV',
    vehicleType: 'RAV4 / CR-V class',
    costRange: '~$350-500 + tax · no drop fee',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Pairs with the cleanest flight option. Clearance is fine for the 13 mi of gravel on Cascade River Rd; AWD nice-to-have but not needed in August.',
  },
  {
    id: 'sea-rt-sedan',
    label: 'SEA roundtrip — Mid-size sedan',
    vehicleType: 'Camry / Accord class',
    costRange: '~$250-400',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Cheaper than the SUV. Still fine for Cascade River Rd ("any car with reasonable clearance, go slow"). Less cargo room.',
  },
  {
    id: 'bli-sea-oneway',
    label: 'BLI → SEA one-way — Compact SUV',
    vehicleType: 'RAV4 / CR-V class',
    costRange: '~$400-600 + $50-150 drop fee = ~$450-750',
    pairsWith: 'Open-jaw flight (BLI in / SEA out).',
    tradeoff:
      'Pays ~$100-250 premium for the no-backtrack convenience. Only worth it if WA-20 is confirmed open.',
  },
  {
    id: 'turo',
    label: 'Turo SEA — Mid-size SUV / 4Runner',
    vehicleType: 'Peer-to-peer',
    costRange: '~$300-500 (host-dependent) + delivery fee if non-airport',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff: 'Selection varies. Cancellation policies are host-specific. Worth a 10-min check.',
  },
  {
    id: 'camper-escape',
    label: 'Escape Camper Vans, SEA',
    vehicleType: 'Camper van (sleeps 2)',
    costRange: '~$200-285/night × 5 = $1,000-1,425 + mileage',
    pairsWith: 'Vanlife trip vibe.',
    tradeoff:
      'Different trip entirely — replaces cabin lodging. Doesn\'t match the spacious-cabin brief unless you actively want vanlife.',
  },
];

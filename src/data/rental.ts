/**
 * Rental car — options, not winners.
 *
 * Hard rules (Allison, May 16, 2026):
 *   - **Automatic transmission ONLY.** *"car must be automatic."*
 *   - **Gas or hybrid powertrain.** No EVs (rural charging logistics).
 *   - **Prices quoted ALL-IN with full insurance** (CDW/LDW + liability +
 *     supplemental) — that's the headline number. Bare rental shows only as a
 *     smaller secondary line.
 *
 * No "best value / cheapest / avoid" badges — each card shows cost, pairing,
 * tradeoff. Reader picks.
 */

export type Powertrain = 'gas' | 'hybrid';

export interface RentalOption {
  id: string;
  label: string;
  vehicleType: string;
  /** Powertrain — gas or hybrid only. No EVs. */
  powertrain: Powertrain;
  /** All-in price including CDW/LDW + liability + supplemental insurance. */
  costAllIn: string;
  /** Bare rental price (smaller secondary line) — for transparency. */
  costBare: string;
  pairsWith: string;
  tradeoff: string;
}

export const POWERTRAIN_LABELS: Record<Powertrain, string> = {
  gas: 'Gas · automatic',
  hybrid: 'Hybrid · automatic',
};

/**
 * Pricing notes:
 *   - All US major-rental fleets are automatic by default. Stick shifts are
 *     not offered on standard reservations.
 *   - Full insurance bundle = CDW/LDW (~$25-35/day) + liability supplement
 *     (~$12-18/day) + roadside / SLI (~$6-10/day). Adds ~$45-65/day on top
 *     of the bare rate. 5-day total = ~$225-325 in insurance alone.
 *   - Hybrid options (Prius, RAV4 Hybrid, CR-V Hybrid) typically run $20-40
 *     more total for the week and save ~$40-60 in fuel over 1,200+ trip miles.
 */
export const RENTAL_OPTIONS: RentalOption[] = [
  {
    id: 'sea-rt-suv-hybrid',
    label: 'SEA roundtrip — Compact SUV (hybrid)',
    vehicleType: 'RAV4 Hybrid / CR-V Hybrid · automatic',
    powertrain: 'hybrid',
    costAllIn: '~$620-780 all-in (5 days, full insurance included)',
    costBare: 'Bare rate alone: ~$380-530 + tax',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Clean pairing with the SEA roundtrip flight. Hybrid saves ~$40-60 in fuel over the trip. Clearance is fine for the 13 mi of gravel on Cascade River Rd; AWD nice-to-have but not needed in August. Best all-around pick.',
  },
  {
    id: 'sea-rt-suv-gas',
    label: 'SEA roundtrip — Compact SUV (gas)',
    vehicleType: 'RAV4 / CR-V class · automatic',
    powertrain: 'gas',
    costAllIn: '~$575-725 all-in (5 days, full insurance included)',
    costBare: 'Bare rate alone: ~$350-500 + tax',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Same vehicle class as the hybrid, ~$50 cheaper but you pay it back in fuel. Pick gas if hybrid availability is low.',
  },
  {
    id: 'sea-rt-sedan',
    label: 'SEA roundtrip — Mid-size sedan',
    vehicleType: 'Camry / Accord class · automatic (gas or hybrid)',
    powertrain: 'gas',
    costAllIn: '~$475-625 all-in (5 days, full insurance included)',
    costBare: 'Bare rate alone: ~$250-400',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Cheapest option that still meets the brief. Cascade River Rd is gravel-but-passable ("any car with reasonable clearance, go slow"). Less cargo room than the SUV — manageable for 2 people + bags.',
  },
  {
    id: 'bli-sea-oneway',
    label: 'BLI → SEA one-way — Compact SUV',
    vehicleType: 'RAV4 / CR-V class · automatic (gas or hybrid)',
    powertrain: 'gas',
    costAllIn: '~$725-975 all-in (5 days, full insurance + $50-150 drop fee)',
    costBare: 'Bare rate alone: ~$400-600 + $50-150 drop fee',
    pairsWith: 'Open-jaw flight (BLI in / SEA out).',
    tradeoff:
      'Pays ~$100-250 premium for the no-backtrack convenience. Only worth it if WA-20 is confirmed open.',
  },
  {
    id: 'turo',
    label: 'Turo SEA — Mid-size SUV / 4Runner',
    vehicleType: 'Peer-to-peer · automatic (host-dependent)',
    powertrain: 'gas',
    costAllIn: '~$525-775 all-in (5 days, includes Turo protection plan)',
    costBare: 'Bare rate alone: ~$300-500 (host-dependent) + delivery fee',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Selection varies. Cancellation policies are host-specific. Confirm automatic transmission AND gas/hybrid powertrain when filtering — Turo has more EVs than major rentals. Worth a 10-min check.',
  },
];

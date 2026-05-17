/**
 * Lodging search-guide — "How to search for lodging here" reference section.
 *
 * Extracted 2026-05-17 (Lodging Refactor agent) from `sections/lodging.ts`.
 * Owns:
 *   - `SearchTipGroup` interface
 *   - `SEARCH_GUIDE_GROUPS` data
 *   - `renderSearchGuideGroup` (single group render)
 *   - `renderLodgingSearchGuide` (public — the full collapsible section)
 *
 * Allison's ask (May 17, 2026 via the live site notes widget):
 *   *"send best practice agent here how to search where to sleep and just
 *   get info on sleeping in this area this kid of trip."*
 *
 * Goal: between hero and the cards, give Erin (and anyone reading) a
 * scannable best-practice playbook for finding lodging for THIS kind of
 * trip — US national park gateway, August peak, kosher cook-in, 2 women,
 * mid-tier (~$200-300/night). NOT a wall of prose. Bullet-heavy.
 * Mobile-first (Pixel 7 Pro XL 412×892).
 *
 * Lodging Owner pass 2026-05-17 also collapsed it behind a <details> below
 * the cards — reader who wants the playbook taps to expand; reader who just
 * wants the shortlist sees cards immediately.
 *
 * Deeper research log + sources live at
 *   projects/north-cascades-2026/LODGING_SEARCH_RESEARCH_2026-05-17.md
 * (in the private second-brain repo — not shipped to the site).
 */

import { h, section } from '../../dom';

interface SearchTipGroup {
  id: string;
  title: string;
  intro?: string;
  bullets: { lead: string; rest: string }[];
}

const SEARCH_GUIDE_GROUPS: SearchTipGroup[] = [
  {
    id: 'where',
    title: 'Where to search — ranked for North Cascades',
    intro:
      'Most of the cabin inventory here lives on small property sites, not aggregators. Use multiple surfaces or you will miss things.',
    bullets: [
      {
        lead: 'Direct property sites first.',
        rest: '60-70% of the Marblemount/Mazama/Winthrop cabin inventory is direct-site-only. Usually cheaper than aggregators and the owner writes the copy, so kitchen detail is more honest.',
      },
      {
        lead: 'Google Maps "Lodging" layer.',
        rest: 'Underrated. Pan the map along WA-20 — surfaces tiny mom-and-pop cabins that do not pay for Booking/Airbnb visibility.',
      },
      {
        lead: 'Booking.com.',
        rest: 'Thin inventory both sides of the park, but the filters are the cleanest. Use "kitchen" (read: full), "free cancellation", review count ≥ 50, score ≥ 9.0.',
      },
      {
        lead: 'Airbnb.',
        rest: 'Best signal for cabin-style. Filter "entire home" + "kitchen" + Superhost. Watch the cleaning fee — it can double the effective nightly rate.',
      },
      {
        lead: 'VRBO.',
        rest: 'Similar to Airbnb, skewed older / larger groups, sometimes cheaper. Worth a parallel pass on the same dates.',
      },
      {
        lead: 'HipCamp.',
        rest: 'Tent-cabins, yurts, unique stays (e.g. Rolling Huts in Mazama). Outdoor-skewing — only if you want that vibe.',
      },
      {
        lead: 'Reddit + WTA forums.',
        rest: 'r/NationalParks, r/Seattle, r/WTA threads from the last 2-3 years are gold for under-the-radar picks and which lodges let you start hiking before checkout.',
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Filter for: a real kitchen (kosher cook-in)',
    intro:
      'Both of us keep kosher and the plan is cook-in. A kitchenette is NOT a kitchen — read carefully.',
    bullets: [
      {
        lead: 'Whole-house rentals = almost always full kitchens.',
        rest: 'B&Bs and roadside motels almost never. Cabin resorts are 50/50 — verify per unit, not per property.',
      },
      {
        lead: 'Demand actual kitchen photos.',
        rest: 'Not just "kitchen amenities" checkbox. No photo = probably not full. Marketing copy lies; pixels do not.',
      },
      {
        lead: 'Read for: oven, full fridge, stovetop, pots/pans/utensils.',
        rest: 'Some "kitchens" are stovetop-only. Some are mini-fridge + microwave. "Apartment-sized" (e.g. Freestone) is real but tight — fine for simple cooking, cramped for two people prepping.',
      },
      {
        lead: 'Call before booking.',
        rest: 'Script: "I need a full kitchen — oven, stovetop, full fridge, basic pots and pans. Is that what your [cabin name] has, or is it more of a kitchenette?" Owners will tell you straight.',
      },
      {
        lead: 'Ignore aggregator badges.',
        rest: 'Airbnb "Wow! Worthy" and Booking "Genius" do NOT correlate with kitchen quality. Different signal entirely.',
      },
    ],
  },
  {
    id: 'nature',
    title: 'Filter for: nature-near + sunset',
    intro:
      'Allison stays up later than Erin — sunset-having lodging is a real bonus for the solo wind-down.',
    bullets: [
      {
        lead: 'Lakeside + "west-facing".',
        rest: 'Cross-check on Google Maps satellite — confirm the porch actually faces west. Lakeside listings sometimes face north or east.',
      },
      {
        lead: 'Methow River cabins face east most of the day.',
        rest: 'River runs north-south; sunset is behind the property, not over the water. Still pretty, just not a sunset-over-river shot.',
      },
      {
        lead: 'Patterson Lake (Sun Mountain area) = cleanest east-side sunset-over-lake.',
        rest: 'Diablo Lake and Ross Lake have no traditional lodging — Ross Lake Resort is water-taxi-access only.',
      },
      {
        lead: 'Woods-set ≠ view.',
        rest: 'Forest cabins often have no sky. If sunset matters, prioritize "meadow", "ridge", "lake-front" over "tucked in trees".',
      },
    ],
  },
  {
    id: 'trust',
    title: 'Trust-signal checklist',
    bullets: [
      {
        lead: 'Review count ≥ 50.',
        rest: 'Fewer than that is noise. Pair with score ≥ 9.0 (Booking) or 4.7 (Airbnb).',
      },
      {
        lead: 'Most recent review within 3 months.',
        rest: 'Means the listing is actively maintained, not a ghost.',
      },
      {
        lead: 'Owner responds to negative reviews.',
        rest: 'Bonus if they fix the issue. Red flag if they argue or ignore.',
      },
      {
        lead: 'Photos updated within ~2 years.',
        rest: 'Look for dated finishes (granite countertops in 2010 photos = no update since). Renovation photos are a good sign.',
      },
      {
        lead: 'Cancellation policy: free until 7 days out, minimum.',
        rest: 'North Cascades weather + WA-20 closure risk is real — book flex.',
      },
    ],
  },
];

function renderSearchGuideGroup(group: SearchTipGroup): HTMLElement {
  return h(
    'section',
    { class: 'search-guide__group', 'data-group': group.id },
    h('h3', { class: 'search-guide__group-title' }, group.title),
    group.intro
      ? h('p', { class: 'search-guide__group-intro' }, group.intro)
      : null,
    h(
      'ul',
      { class: 'search-guide__list' },
      ...group.bullets.map((b) =>
        h(
          'li',
          { class: 'search-guide__item' },
          h('strong', { class: 'search-guide__lead' }, b.lead),
          ' ',
          h('span', { class: 'search-guide__rest' }, b.rest)
        )
      )
    )
  );
}

export function renderLodgingSearchGuide(): HTMLElement {
  // Lodging Owner pass 2026-05-17: section moved BELOW the cards + collapsed
  // by default. Reader who wants the playbook taps to expand; reader who just
  // wants the shortlist sees cards immediately. Bridge sentence removed (no
  // longer points "below" since cards are above).
  const intro = h(
    'p',
    { class: 'search-guide__intro' },
    'Same playbook we used to build the shortlist above. Read it if you want to sanity-check our picks, or save it for the next trip.'
  );

  const bookingWindow = h(
    'aside',
    { class: 'search-guide__note search-guide__note--info' },
    h('h3', { class: 'search-guide__note-title' }, 'When to book'),
    h(
      'p',
      {},
      'Now (May 2026) is the sweet spot for August. Peak inventory is roughly 30-50% sold but prices have not surged. ',
      'Marblemount/Newhalem has ~6 properties total, all west-side — books first. ',
      'Mazama/Winthrop has ~20 — more flex, but the marquee picks (Sun Mountain, Freestone, Inn at Mazama) book early for August. ',
      'Sun-Wed mid-week (our trip) is easier than Fri-Sat. If WA-20 reopens July 4 there will be a booking surge — get in before then.'
    )
  );

  const contingency = h(
    'aside',
    { class: 'search-guide__note search-guide__note--warn' },
    h('h3', { class: 'search-guide__note-title' }, 'WA-20 contingency'),
    h(
      'p',
      {},
      'WA-20 through the park is closed for storm-damage repair, target reopen July 4 (a goal, not a promise). ',
      'If you book a west-side primary, hold an east-side backup with free cancellation — and vice versa. ',
      'Direct property cancellation policies tend to be more generous than aggregator policies for small lodges. ',
      'CFAR (Cancel For Any Reason) trip insurance is the only flavor worth considering for this specific risk; default aggregator insurance excludes road closures.'
    )
  );

  // Wrap the entire body in <details> so it collapses by default.
  const body = h(
    'details',
    { class: 'search-guide-details' },
    h(
      'summary',
      { class: 'search-guide-details__summary' },
      'Open the search playbook (when, where, how — for next time too)'
    ),
    intro,
    h(
      'div',
      { class: 'search-guide__groups' },
      ...SEARCH_GUIDE_GROUPS.map(renderSearchGuideGroup)
    ),
    h('div', { class: 'search-guide__notes' }, bookingWindow, contingency)
  );

  return section('lodging-search-guide', 'How to search for lodging here', body);
}

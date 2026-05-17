/**
 * Lodging card — single property render (carousel + pills + body + CTA).
 *
 * Extracted 2026-05-17 (Lodging Refactor agent) from `sections/lodging.ts`.
 * Owns:
 *   - `renderAmenityPills` — optional amenity pill builder
 *   - `renderCarousel`     — Booking.com-style photo carousel (3 slides max)
 *   - `renderDriveMatrix`  — collapsible drive-times table
 *   - `renderLodgingCard`  — the article element a panel renders for each Lodging
 *
 * Carousel stayed inline rather than wrapping `sections/photo-carousel.ts`:
 * the lodging variant has its own classnames (`lcarousel__*`), 3-slide cap,
 * dot indicators, counter pill, representative-photo warning, and credit
 * link — all lodging-specific. Re-routing through the shared module would
 * have meant either parameterizing those flags on the shared one (scope
 * creep beyond this refactor) or duplicating the same logic anyway.
 */

import {
  AVAILABILITY_LABELS,
  DRIVE_DESTINATIONS,
  NATURE_LABELS,
  type Lodging,
  type LodgingAmenities,
} from '../../data/lodging';
import { badge, h } from '../../dom';
import { shortlist, togglePick } from './shortlist';

// ====================================================================
// AMENITY PILLS
// ====================================================================

/**
 * Render the optional amenity-pill set per the May 17, 2026 mini-Booking.com
 * spec: laundry / baths / AC / parking / wifi / pets / hot tub. Only renders
 * a pill when the value is known (i.e. not undefined and not 'unknown') — we
 * intentionally skip rather than render "Unknown" pills, per the fail-loud
 * rule. Returns an array of HTMLElement | null so the caller can spread it
 * into the larger pillRow without empty wrappers.
 */
export function renderAmenityPills(a: LodgingAmenities | undefined): (HTMLElement | null)[] {
  if (!a) return [];
  const pills: (HTMLElement | null)[] = [];
  const pill = (text: string): HTMLElement => h('li', { class: 'card__pill card__pill--amenity' }, text);

  if (a.baths) pills.push(pill(`🛁 ${a.baths} bath${a.baths === '1' ? '' : 's'}`));
  if (a.laundry && a.laundry !== 'unknown') {
    const label = a.laundry === 'in-unit' ? 'In-unit laundry'
      : a.laundry === 'on-site' ? 'On-site laundry'
      : a.laundry === 'shared' ? 'Shared laundry'
      : 'No laundry';
    pills.push(pill(`🧺 ${label}`));
  }
  if (a.ac && a.ac !== 'unknown') {
    pills.push(pill(a.ac === 'yes' ? '❄️ AC' : '🚫 No AC'));
  }
  if (a.parking && a.parking !== 'unknown') {
    const label = a.parking === 'free' ? 'Free parking'
      : a.parking === 'paid' ? 'Paid parking'
      : 'Street parking';
    pills.push(pill(`🅿 ${label}`));
  }
  if (a.wifi && a.wifi !== 'unknown') {
    const label = a.wifi === 'strong' ? 'Strong wifi'
      : a.wifi === 'basic' ? 'Basic wifi'
      : 'No wifi';
    pills.push(pill(`📶 ${label}`));
  }
  if (a.pets && a.pets !== 'unknown') {
    const label = a.pets === 'yes' ? 'Pets OK'
      : a.pets === 'fee' ? 'Pets (fee)'
      : 'No pets';
    pills.push(pill(`🐾 ${label}`));
  }
  if (a.hotTub) pills.push(pill('♨ Hot tub'));
  return pills;
}

// ====================================================================
// PHOTO CAROUSEL
// ====================================================================

export function renderCarousel(lodging: Lodging): HTMLElement {
  // Lodging Owner pass (2026-05-17): cap carousel at 3 slides. Was 5 — but
  // slides 4-5 were almost always the same stock Unsplash forest/firepit/
  // interior across 15+ cards. Cutting tail reduces stock-repetition without
  // touching the data layer. Property-authentic slide 1 stays leading.
  const allPhotos = lodging.photos && lodging.photos.length > 0 ? lodging.photos : [lodging.photo];
  const photos = allPhotos.slice(0, 3);
  const figure = h('figure', { class: 'card__figure card__figure--carousel' });
  const track = h('div', {
    class: 'lcarousel__track',
    role: 'group',
    'aria-label': `Photos of ${lodging.name} (${photos.length})`,
    tabindex: '0',
  });

  photos.forEach((p, idx) => {
    const isRepresentative = p.credit?.toLowerCase().includes('unsplash') ?? false;
    const img = h('img', {
      class: 'lcarousel__img',
      src: p.src,
      alt: isRepresentative
        ? `Representative photo (not actual property): ${p.alt}`
        : p.alt,
      width: p.width,
      height: p.height,
      loading: idx === 0 ? 'eager' : 'lazy',
      decoding: 'async',
    });
    const slide = h('div', { class: 'lcarousel__slide', 'data-slide': idx }, img);
    track.appendChild(slide);
  });

  figure.appendChild(track);

  // Dot indicators
  const dots = h('div', { class: 'lcarousel__dots', 'aria-hidden': 'true' });
  photos.forEach((_, idx) => {
    const dot = h('button', {
      type: 'button',
      class: idx === 0 ? 'lcarousel__dot lcarousel__dot--active' : 'lcarousel__dot',
      'aria-label': `Go to photo ${idx + 1}`,
      'data-slide': idx,
    });
    dots.appendChild(dot);
  });
  figure.appendChild(dots);

  // Count pill (Booking.com-style "1/4")
  const counter = h('span', { class: 'lcarousel__counter' }, `1 / ${photos.length}`);
  figure.appendChild(counter);

  // Wire up: clicking dot scrolls track. IntersectionObserver updates active dot.
  const slides = track.querySelectorAll<HTMLElement>('.lcarousel__slide');
  const dotBtns = dots.querySelectorAll<HTMLButtonElement>('.lcarousel__dot');
  dotBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset['slide'] ?? '0', 10);
      const target = slides[idx];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const target = entry.target as HTMLElement;
          const idx = parseInt(target.dataset['slide'] ?? '0', 10);
          dotBtns.forEach((d, i) => {
            d.classList.toggle('lcarousel__dot--active', i === idx);
          });
          counter.textContent = `${idx + 1} / ${photos.length}`;
        }
      }
    },
    { root: track, threshold: [0.6] }
  );
  slides.forEach((s) => observer.observe(s));

  // Photo credit (first slide)
  const first = photos[0];
  if (first && first.credit) {
    const credit = first.creditUrl
      ? h(
          'figcaption',
          { class: 'card__credit' },
          h('a', { href: first.creditUrl, rel: 'noopener', target: '_blank' }, first.credit)
        )
      : h('figcaption', { class: 'card__credit' }, first.credit);
    figure.appendChild(credit);
  }

  // Representative-photo warning if first slide is unsplash
  const firstIsRep = first?.credit?.toLowerCase().includes('unsplash') ?? false;
  if (firstIsRep) {
    figure.appendChild(
      h(
        'p',
        { class: 'card__photo-warning' },
        'Photos are representative — see booking link for actual property photos.'
      )
    );
  }

  return figure;
}

// ====================================================================
// DRIVE-TIME MATRIX
// ====================================================================

export function renderDriveMatrix(lodging: Lodging): HTMLElement | null {
  if (!lodging.driveTimes || lodging.driveTimes.length === 0) return null;

  const rows = lodging.driveTimes.map((dt) => {
    const dest = DRIVE_DESTINATIONS[dt.destinationId];
    return h(
      'tr',
      { class: 'drive-matrix__row' },
      h('th', { class: 'drive-matrix__dest', scope: 'row' }, dest.short),
      h('td', { class: 'drive-matrix__min' }, `${dt.minutes} min`),
      h('td', { class: 'drive-matrix__mi' }, `${dt.miles} mi`)
    );
  });

  return h(
    'details',
    { class: 'drive-matrix' },
    h('summary', { class: 'drive-matrix__summary' }, `Drive times from here (${lodging.driveTimes.length})`),
    h(
      'table',
      { class: 'drive-matrix__table' },
      h(
        'thead',
        {},
        h(
          'tr',
          {},
          h('th', { scope: 'col' }, 'Destination'),
          h('th', { scope: 'col' }, 'Time'),
          h('th', { scope: 'col' }, 'Distance')
        )
      ),
      h('tbody', {}, ...rows)
    ),
    h(
      'p',
      { class: 'drive-matrix__note' },
      'Drive times from Google Maps norms (May 17, 2026 spot-check). Add buffer for weekend Aug traffic on WA-20.'
    )
  );
}

// ====================================================================
// CARD
// ====================================================================

export function renderLodgingCard(lodging: Lodging, inPath: boolean): HTMLElement {
  const natureLabel = NATURE_LABELS[lodging.natureTag];
  const isTownCenter = lodging.natureTag === 'town-center';

  const notFitBlock = lodging.notFitReason
    ? h(
        'p',
        { class: 'card__not-fit' },
        h('strong', {}, 'Not a fit: '),
        lodging.notFitReason
      )
    : null;

  // Emoji-pill row — May 16-17, 2026 standing rule. (Unchanged from Wave 2.)
  const kitchenLabel =
    lodging.kitchen === 'full'
      ? 'Full kitchen'
      : lodging.kitchen === 'kitchenette'
        ? 'Kitchenette'
        : 'No kitchen';
  const kitchenEmoji =
    lodging.kitchen === 'full' ? '🍳' : lodging.kitchen === 'kitchenette' ? '🍵' : '🚫';
  const viewEmoji =
    lodging.natureTag === 'lakeside'
      ? '🌊'
      : lodging.natureTag === 'riverside'
        ? '💧'
        : lodging.natureTag === 'mountain-view'
          ? '🏔'
          : lodging.natureTag === 'ranch-acreage'
            ? '🐎'
            : lodging.natureTag === 'town-center'
              ? '🏘'
              : '🌲';
  const tierEmoji = lodging.tier === 'splurge' ? '💎' : '💰';
  const sunsetBonus =
    lodging.sunset && lodging.sunset.worth === 'yes' ? ' · 🌅 sunset' : '';
  const reviewsPillScore =
    lodging.reviews.score === 'N/A' ? '[verify]' : lodging.reviews.score;
  const reviewsPillCount =
    lodging.reviews.count === 'N/A' ? '' : ` · ${lodging.reviews.count}`;
  const availabilityPillKind =
    lodging.availability === 'confirmed-aug-16-20'
      ? 'good'
      : lodging.availability === 'sold-out-or-unavailable'
        ? 'warn'
        : 'info';
  const amenityPills = renderAmenityPills(lodging.amenities);
  // Bed summary: extract the short headline from the verbose `beds` string.
  // Pattern: split on first ' — ' / '·' / '(' to keep what's before the
  // disambiguating parenthetical. Falls back to the original string.
  const bedsShort = (() => {
    const raw = lodging.beds;
    // If it contains a parenthetical breakdown, drop it.
    const noParen = raw.replace(/\s*\(.*?\)/g, '').trim();
    // If it contains a · separator with details on the right, take the left.
    const beforeMid = noParen.split('·')[0]?.trim() ?? noParen;
    // If it contains ' — ' (em dash with explanation), take the left side.
    const beforeDash = beforeMid.split(' — ')[0]?.trim() ?? beforeMid;
    // Strip trailing colon-led detail like "Riverside cabin: 1 queen..."
    const afterColon = beforeDash.includes(':') ? beforeDash.split(':').slice(1).join(':').trim() : beforeDash;
    return afterColon.length > 0 && afterColon.length <= 40 ? afterColon : beforeDash;
  })();
  // Lodging Owner pass (2026-05-17): collapse pill density.
  //   - Removed `✅ Verified May 2026` (appears on every card — moved to
  //     page-level disclaimer).
  //   - Removed `⚠️ Verify beds at booking` (87% of cards have it — moved
  //     to page-level disclaimer).
  //   - Removed `📅 Aug 16-20: verify` when value is 'verify-at-booking'
  //     (default state — moved to page-level disclaimer). Still rendered
  //     for 'confirmed-aug-16-20' (good signal) and 'sold-out-or-unavailable'
  //     (warn signal).
  //   - Bed pill summarized to a short headline. Full breakdown lives in
  //     the `notes` and `beds` body text below the carousel.
  const showAvailabilityPill =
    lodging.availability === 'confirmed-aug-16-20' ||
    lodging.availability === 'sold-out-or-unavailable';
  const pillRow = h(
    'ul',
    { class: 'card__pills', 'aria-label': 'At a glance' },
    h('li', { class: 'card__pill' }, `🛏 ${bedsShort}`),
    h('li', { class: 'card__pill' }, `🚪 ${lodging.bedrooms}`),
    h('li', { class: 'card__pill' }, `${kitchenEmoji} ${kitchenLabel}`),
    h(
      'li',
      { class: 'card__pill' },
      `${viewEmoji} ${natureLabel}${sunsetBonus}`
    ),
    ...amenityPills,
    h(
      'li',
      { class: 'card__pill card__pill--reviews' },
      `⭐ ${reviewsPillScore}`,
      h('span', { class: 'card__pill-count' }, reviewsPillCount)
    ),
    h('li', { class: 'card__pill' }, `${tierEmoji} ${lodging.pricePerNight}`),
    showAvailabilityPill
      ? h(
          'li',
          { class: `card__pill card__pill--${availabilityPillKind}` },
          `📅 ${AVAILABILITY_LABELS[lodging.availability]}`
        )
      : null,
    lodging.kosherCookingFit === false
      ? h(
          'li',
          { class: 'card__pill card__pill--bad' },
          '🚫 No real kitchen — won\'t work for cook-in'
        )
      : null,
    // Free-cancellation per-card pill (May 17, 2026 — Allison's booking-
    // discipline ask). Renders ONLY when we have a definitive answer.
    //   - 'no'  → red bad pill (warn the reader before they get attached)
    //   - 'yes' → green good pill (matches the filter chip's promise)
    //   - 'unknown' / omitted → render NOTHING (don't add visual noise for
    //     missing data — fail-loud rule, no fake confidence).
    lodging.freeCancellation === 'no'
      ? h(
          'li',
          { class: 'card__pill card__pill--bad' },
          '🚫 No free cancellation'
        )
      : lodging.freeCancellation === 'yes'
        ? h(
            'li',
            { class: 'card__pill card__pill--good' },
            '✓ Free cancellation'
          )
        : null
  );

  // Nature proximity line — prominent.
  const natureRow = h(
    'p',
    { class: `card__nature card__nature--${lodging.natureTag}` },
    h('strong', {}, `${natureLabel}: `),
    lodging.nature
  );

  // Sunset row.
  const sunsetRow =
    lodging.sunset && lodging.sunset.worth !== 'no'
      ? h(
          'p',
          {
            class: `card__sunset card__sunset--${lodging.sunset.worth}`,
          },
          h(
            'span',
            { class: `badge badge--${lodging.sunset.worth === 'yes' ? 'good' : 'info'} card__sunset-badge` },
            lodging.sunset.worth === 'yes' ? 'Sunset' : 'Sunset · maybe'
          ),
          ' ',
          h('span', { class: 'card__sunset-note' }, lodging.sunset.note)
        )
      : null;

  // Review row.
  const r = lodging.reviews;
  const reviewRow =
    r.score === 'N/A'
      ? null
      : h(
          'div',
          { class: 'card__reviews' },
          h(
            'div',
            { class: 'card__reviews-primary' },
            h('span', { class: 'card__reviews-score' }, r.score),
            h('span', { class: 'card__reviews-count' }, r.count),
            h('span', { class: 'card__reviews-source' }, ` · ${r.source}`)
          ),
          r.secondScore
            ? h(
                'div',
                { class: 'card__reviews-secondary' },
                h('span', { class: 'card__reviews-secondary-score' }, r.secondScore ?? ''),
                ' · ',
                h('span', { class: 'card__reviews-secondary-count' }, r.secondCount ?? ''),
                ` ${r.secondSource ?? ''}`
              )
            : null,
          h('span', { class: 'card__reviews-as-of' }, `Verified ${r.asOf}`)
        );
  const reviewHighlights = r.highlights
    ? h('p', { class: 'card__review-highlights' }, r.highlights)
    : null;

  // Pick button — Wave 3.
  const isPicked = shortlist.has(lodging.id);
  const pickBtn = h(
    'button',
    {
      type: 'button',
      class: isPicked ? 'pick-btn pick-btn--picked' : 'pick-btn',
      'data-lodging-id': lodging.id,
      'aria-pressed': isPicked ? 'true' : 'false',
    },
    isPicked ? '✓ Picked' : '✓ Pick'
  );
  pickBtn.addEventListener('click', () => {
    togglePick(lodging.id);
  });

  return h(
    'article',
    {
      class: `card lodging-card lodging-card--${lodging.tier}${inPath ? ' lodging-card--in-path' : ''}${isPicked ? ' lodging-card--picked' : ''}`,
      'data-vibe': lodging.vibe,
      'data-lodging-id': lodging.id,
      'data-nature': lodging.natureTag,
    },
    renderCarousel(lodging),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, lodging.name),
      h(
        'div',
        { class: 'card__badges' },
        inPath ? badge('In this path', 'good') : null,
        pickBtn
      )
    ),
    pillRow,
    h('p', { class: 'card__address' }, lodging.address),
    lodging.phone ? h('p', { class: 'card__phone' }, lodging.phone) : null,
    notFitBlock,
    natureRow,
    reviewRow,
    reviewHighlights,
    h('p', { class: 'card__extras' }, h('strong', {}, 'Worth noting: '), lodging.extras),
    sunsetRow,
    isTownCenter
      ? h(
          'p',
          { class: 'card__tradeoff' },
          'Walkable to dinner, not woods-set — tradeoff vs nature-immersed picks.'
        )
      : null,
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Type'),
      h('dd', {}, lodging.type),
      h('dt', {}, '$/night'),
      h('dd', {}, lodging.pricePerNight),
      h('dt', {}, 'Location'),
      h('dd', {}, lodging.distance)
    ),
    renderDriveMatrix(lodging),
    h('p', { class: 'card__note' }, lodging.notes),
    lodging.bookingUrl
      ? h(
          'p',
          { class: 'card__cta' },
          h(
            'a',
            { class: 'card__cta-link', href: lodging.bookingUrl, rel: 'noopener', target: '_blank' },
            'Booking link'
          )
        )
      : null,
    lodging.bookingHint ? h('p', { class: 'card__hint' }, lodging.bookingHint) : null
  );
}

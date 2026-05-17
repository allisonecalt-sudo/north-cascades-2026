/**
 * towns.ts (section) — corridor town cards, RICHER pass (May 17, 2026).
 *
 * Allison live-note May 17: *"Could destinations use more beefing up? Reference
 * austria"* — old town cards were a 4-bullet stub with one wiki link. Now
 * matches the Austria base-card depth: photo carousel + at-a-glance pills
 * (walkability, drive-times from each base, best season, parking) + shops +
 * verified badge.
 *
 * NOT restaurants — kosher rule kills restaurant lists. Character / vibe /
 * walkable / shops only.
 *
 * Exports:
 *   - renderTowns()          full Section + carousel-card grid (towns page, home, for-erin)
 *   - renderTownsCompact()   small variant retained for back-compat
 */

import { TOWNS, townsForPath, type Town, type Walkability } from '../data/towns';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { h, section } from '../dom';
import { renderPhotoCarousel } from './photo-carousel';

// =============================================================================
// Pill + helper renderers
// =============================================================================

const WALKABILITY_LABEL: Record<Walkability, string> = {
  high: '🚶 Very walkable',
  medium: '🚶 Walkable',
  low: '🚶 Limited walking',
  none: '🅿 Drive-up only',
};

const WALKABILITY_CLASS: Record<Walkability, string> = {
  high: 'town-card__pill town-card__pill--good',
  medium: 'town-card__pill town-card__pill--good',
  low: 'town-card__pill',
  none: 'town-card__pill town-card__pill--warn',
};

function driveLabel(min: number | null, base: string): string {
  if (min === null || min === 0) return `${base}: you are here`;
  if (min < 60) return `${base}: ${min} min`;
  const hours = Math.floor(min / 60);
  const rem = min % 60;
  return rem === 0 ? `${base}: ${hours}h` : `${base}: ${hours}h ${rem} min`;
}

function renderTownPills(town: Town): HTMLElement {
  const pill = (cls: string, text: string): HTMLElement => h('li', { class: cls }, text);
  const items: HTMLElement[] = [];

  items.push(
    pill(
      `town-card__pill town-card__pill--${town.side}`,
      town.side === 'west' ? '🌲 West side' : '☀ East side'
    )
  );
  items.push(
    pill(
      'town-card__pill town-card__pill--summer',
      `☀ ${town.summerVibe.split('—')[0]?.trim() ?? town.summerVibe}`
    )
  );
  items.push(pill(WALKABILITY_CLASS[town.walkability], WALKABILITY_LABEL[town.walkability]));
  items.push(
    pill('town-card__pill', `📅 ${town.bestSeason.split('.')[0] ?? town.bestSeason}`)
  );
  items.push(
    pill('town-card__pill town-card__pill--good', `✅ Verified ${town.verifiedOn}`)
  );

  return h('ul', { class: 'town-card__pills', 'aria-label': 'At a glance' }, ...items);
}

function renderDriveMatrix(town: Town): HTMLElement {
  const rows: { base: string; min: number | null }[] = [
    { base: 'From Marblemount', min: town.driveFromMarblemountMin },
    { base: 'From Winthrop', min: town.driveFromWinthropMin },
  ];
  return h(
    'div',
    { class: 'town-card__drives' },
    h('p', { class: 'town-card__drives-label' }, 'Drive from each base'),
    h(
      'ul',
      { class: 'town-card__drives-list' },
      ...rows.map((r) =>
        h(
          'li',
          { class: 'town-card__drive-row' },
          h('span', { class: 'town-card__drive-text' }, driveLabel(r.min, r.base))
        )
      )
    )
  );
}

function renderShopsBlock(town: Town): HTMLElement | null {
  if (town.shops.length === 0) return null;
  return h(
    'div',
    { class: 'town-card__shops' },
    h('p', { class: 'town-card__shops-label' }, 'Shops + character'),
    h(
      'ul',
      { class: 'town-card__shops-list' },
      ...town.shops.map((s) => h('li', { class: 'town-card__shops-item' }, s))
    )
  );
}

function renderParkingSeason(town: Town): HTMLElement {
  return h(
    'div',
    { class: 'town-card__meta-row' },
    h(
      'p',
      { class: 'town-card__meta-item' },
      h('strong', {}, '🅿 Parking: '),
      town.parking
    ),
    h(
      'p',
      { class: 'town-card__meta-item' },
      h('strong', {}, '📅 Best season: '),
      town.bestSeason
    ),
    h(
      'p',
      { class: 'town-card__meta-item' },
      h('strong', {}, '🚶 Walking: '),
      town.walkabilityNote
    )
  );
}

// =============================================================================
// CARD
// =============================================================================

function renderTownCard(town: Town): HTMLElement {
  return h(
    'article',
    { class: `town-card town-card--${town.side} town-card--rich`, 'data-town-id': town.id },
    renderPhotoCarousel(town.photos, {
      ariaLabel: `Photos of ${town.name}`,
      className: 'town-card__carousel',
    }),
    h(
      'div',
      { class: 'town-card__body' },
      h(
        'header',
        { class: 'town-card__header' },
        h(
          'span',
          { class: `town-card__side town-card__side--${town.side}` },
          town.side === 'west' ? 'West side' : 'East side'
        ),
        h('h3', { class: 'town-card__name' }, town.name),
        h('p', { class: 'town-card__tagline' }, town.tagline)
      ),
      renderTownPills(town),
      h('p', { class: 'town-card__why' }, town.whyStop),
      h(
        'ul',
        { class: 'town-card__bullets' },
        ...town.bullets.map((b) => h('li', { class: 'town-card__bullet' }, b))
      ),
      renderDriveMatrix(town),
      renderShopsBlock(town),
      renderParkingSeason(town),
      h(
        'p',
        { class: 'town-card__practical' },
        h('strong', {}, 'Practical: '),
        town.practical
      ),
      h(
        'div',
        { class: 'town-card__links' },
        h(
          'a',
          {
            class: 'town-card__link',
            href: town.wikiUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Wikipedia ↗'
        ),
        town.extraLink
          ? h(
              'a',
              {
                class: 'town-card__link',
                href: town.extraLink.url,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              `${town.extraLink.label} ↗`
            )
          : null
      )
    )
  );
}

// =============================================================================
// SECTION
// =============================================================================

export function renderTowns(): HTMLElement {
  const grid = h('div', { class: 'town-grid' });

  const wrap = section(
    'towns',
    'Towns along the corridor',
    h(
      'p',
      { class: 'section__lede' },
      'Five corridor stops worth a walk — character, shops, boardwalks, where the cabins cluster. Restaurants intentionally not listed (kosher self-cater is the food plan — see the Groceries page). These are vibe stops between hikes.'
    ),
    grid
  );

  const paint = (selected: string | null): void => {
    const visible = townsForPath(selected as 'A' | 'B' | 'C' | null);
    grid.replaceChildren(...visible.map(renderTownCard));
    if (visible.length === 0) {
      grid.appendChild(
        h(
          'p',
          { class: 'section__empty' },
          'No corridor towns selected. Clear the path filter to see all five.'
        )
      );
    }
  };

  paint(getSelectedPath());
  subscribeSelectedPath(paint);

  return wrap;
}

/** Small variant — used inline on for-erin page. Same card, no wrapping section. */
export function renderTownsCompact(): HTMLElement {
  const grid = h(
    'div',
    { class: 'town-grid town-grid--compact' },
    ...TOWNS.map(renderTownCard)
  );
  return grid;
}

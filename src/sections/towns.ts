/**
 * towns.ts (section) — corridor town cards.
 *
 * Cards for Marblemount / Newhalem / Mazama / Winthrop. Per Allison
 * May 17, 2026: *"erin happy to visit interesting towns. can have link
 * to those."* Not restaurants — character / vibe / walkable / shops.
 *
 * Filters to the active path: Path A shows west towns only (Marblemount +
 * Newhalem), Paths B + C also show Mazama + Winthrop. Compare-all shows all.
 */

import { TOWNS, townsForPath, type Town } from '../data/towns';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { h, section } from '../dom';

function renderTownCard(town: Town): HTMLElement {
  return h(
    'article',
    { class: `town-card town-card--${town.side}`, 'data-town-id': town.id },
    h(
      'div',
      { class: 'town-card__photo' },
      h('img', {
        src: town.photo.src,
        alt: town.photo.alt,
        loading: 'lazy',
        decoding: 'async',
        width: town.photo.width,
        height: town.photo.height,
      }),
      h('span', { class: 'town-card__photo-credit' }, town.photo.credit ?? '')
    ),
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
      h(
        'ul',
        { class: 'town-card__bullets' },
        ...town.bullets.map((b) => h('li', { class: 'town-card__bullet' }, b))
      ),
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

export function renderTowns(): HTMLElement {
  const grid = h('div', { class: 'town-grid' });

  const wrap = section(
    'towns',
    'Towns along the corridor',
    h(
      'p',
      { class: 'section__lede' },
      'Four stops worth a walk — character, shops, boardwalks. Restaurants intentionally not listed (kosher self-cater is the food plan). These are vibe stops.'
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
          'No corridor towns selected. Clear the path filter to see all four.'
        )
      );
    }
  };

  paint(getSelectedPath());
  subscribeSelectedPath(paint);

  return wrap;
}

/** Small variant — used inline on for-erin page. */
export function renderTownsCompact(): HTMLElement {
  const grid = h(
    'div',
    { class: 'town-grid town-grid--compact' },
    ...TOWNS.map(renderTownCard)
  );
  return grid;
}

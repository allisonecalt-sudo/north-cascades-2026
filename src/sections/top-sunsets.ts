/**
 * top-sunsets.ts — ranked sunset spots renderer.
 *
 * Layout:
 *   - TLDR (Erin sleeps earlier; sunset is Allison's window)
 *   - Sunset times table (per data/sky.ts)
 *   - Ranked list (1-7) with rank pill + coords + view-direction + access-by-base
 *   - Per-spot "best by path" badges (filterable via active path)
 *   - Verified date pill
 */

import { TOP_SUNSETS, SUNSET_TIMES, TOP_SUNSETS_INTRO } from '../data/top-sunsets';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import type { PathLetter } from '../data/costs';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';
import { renderPhotoCarousel } from './photo-carousel';

function renderSpot(spot: (typeof TOP_SUNSETS)[number], activePath: PathLetter | null): HTMLElement {
  const isInPath = activePath ? spot.bestByPath.includes(activePath) : false;
  const isOffPath = activePath && !isInPath;
  const photos = spot.photos && spot.photos.length > 0 ? [...spot.photos] : null;
  return h(
    'article',
    {
      class: `sunset-card${isInPath ? ' sunset-card--in-path' : ''}${isOffPath ? ' sunset-card--off-path' : ''}`,
    },
    photos
      ? renderPhotoCarousel(photos, {
          ariaLabel: `Sunset spot photos: ${spot.name}`,
          className: 'sunset-card__figure',
        })
      : null,
    h(
      'header',
      { class: 'sunset-card__header' },
      h('span', { class: 'sunset-card__rank' }, `#${spot.rank}`),
      h('h3', { class: 'sunset-card__title' }, spot.name),
      h(
        'div',
        { class: 'sunset-card__badges' },
        ...spot.bestByPath.map((p) =>
          h(
            'span',
            { class: `badge badge--${p === activePath ? 'good' : 'info'}` },
            `Path ${p}`
          )
        ),
        spot.verifiedAsOf
          ? h('span', { class: 'badge badge--good' }, `✅ Verified ${spot.verifiedAsOf}`)
          : null
      )
    ),
    h('p', { class: 'sunset-card__where' }, spot.where),
    h(
      'dl',
      { class: 'sunset-card__facts' },
      h('dt', {}, 'View'),
      h('dd', {}, spot.viewDirection),
      spot.elevation ? h('dt', {}, 'Elevation') : null,
      spot.elevation ? h('dd', {}, spot.elevation) : null,
      h('dt', {}, 'Coords'),
      h('dd', { class: 'sunset-card__coords' }, spot.coords),
      h('dt', {}, 'From west base'),
      h('dd', {}, spot.accessFromWest),
      h('dt', {}, 'From east base'),
      h('dd', {}, spot.accessFromEast)
    ),
    h(
      'p',
      { class: 'sunset-card__why' },
      h('strong', {}, 'Why this rank: '),
      spot.why
    ),
    h(
      'p',
      { class: 'sunset-card__allison-fit' },
      h('strong', {}, "Allison's window: "),
      spot.allisonFit
    ),
    spot.fromLodging
      ? h(
          'p',
          { class: 'sunset-card__lodging' },
          h('strong', {}, 'From lodging: '),
          spot.fromLodging
        )
      : null,
    spot.notes
      ? h(
          'p',
          { class: 'sunset-card__notes' },
          h('strong', {}, 'Note: '),
          spot.notes
        )
      : null,
    h(
      'p',
      { class: 'sunset-card__source' },
      'Source: ',
      h(
        'a',
        { href: spot.source.url, rel: 'noopener noreferrer', target: '_blank' },
        spot.source.name,
        ' ↗'
      )
    )
  );
}

export function renderTopSunsets(): HTMLElement {
  const wrap = section(
    'top-sunsets',
    'Top sunsets — ranked',
    h('p', { class: 'section__lede' }, TOP_SUNSETS_INTRO.why),
    renderSectionSources({
      label: 'Sources',
      sources: [
        { name: 'timeanddate.com · Winthrop Aug 2026', url: 'https://www.timeanddate.com/sun/@5816336?month=8&year=2026' },
        { name: 'DarkSky International · Places finder', url: 'https://darksky.org/places/' },
        { name: 'NPS · North Cascades viewpoints', url: 'https://www.nps.gov/noca/planyourvisit/things2do.htm' },
      ],
      asOf: 'May 17, 2026',
    }),
    h(
      'div',
      { class: 'sunset-times' },
      h('h3', { class: 'subsection__title' }, 'Sunset + astro-dark by date'),
      h(
        'table',
        { class: 'sky-table' },
        h(
          'thead',
          {},
          h(
            'tr',
            {},
            h('th', {}, 'Date'),
            h('th', {}, 'Sunset'),
            h('th', {}, 'Astro-dark')
          )
        ),
        h(
          'tbody',
          {},
          ...SUNSET_TIMES.map((r) =>
            h(
              'tr',
              {},
              h('td', {}, r.date),
              h('td', {}, r.sunset),
              h('td', {}, r.astroDark)
            )
          )
        )
      )
    ),
    h(
      'aside',
      { class: 'sunset-callouts' },
      h(
        'p',
        { class: 'sunset-callout' },
        h('strong', {}, 'New moon Aug 18 — '),
        TOP_SUNSETS_INTRO.newMoon
      ),
      h(
        'p',
        { class: 'sunset-callout' },
        h('strong', {}, 'Driving home in the dark — '),
        TOP_SUNSETS_INTRO.drivingHome
      )
    ),
    h('div', { class: 'sunset-list' })
  );

  function paint(selectedId: string | null): void {
    const container = wrap.querySelector<HTMLElement>('.sunset-list');
    if (!container) return;
    const activePath = (selectedId as PathLetter | null) ?? null;
    container.replaceChildren(
      ...TOP_SUNSETS.map((s) => renderSpot(s, activePath))
    );
  }

  paint(getSelectedPath());
  subscribeSelectedPath(paint);

  wrap.append(
    h(
      'p',
      { class: 'costs-fineprint__verified' },
      h('span', { class: 'badge badge--good' }, 'Verified May 17, 2026')
    )
  );

  return wrap;
}

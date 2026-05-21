/**
 * Itinerary — collapsed days, each with a 1-line shape summary.
 *
 * When a path is selected, this section shows ONLY that path's day-by-day
 * (paths each have their own 5-day shape). In compare-all mode, shows the
 * default generic itinerary with branch points called out.
 */

import { ITINERARY, type ItineraryDay } from '../data/itinerary';
import { getPathById, TRIP_PATHS } from '../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { h, section } from '../dom';

function renderDay(day: ItineraryDay, defaultOpen: boolean): HTMLDetailsElement {
  const details = h(
    'details',
    { class: 'day', name: 'itinerary-day' },
    h(
      'summary',
      { class: 'day__summary' },
      h(
        'span',
        { class: 'day__head' },
        h('span', { class: 'day__num' }, `Day ${day.day}`),
        h('span', { class: 'day__date' }, day.date),
        h('span', { class: 'day__title' }, day.title)
      ),
      h('span', { class: 'day__shape' }, day.shape)
    ),
    h(
      'div',
      { class: 'day__body' },
      h(
        'ol',
        { class: 'day__stops' },
        ...day.stops.map((stop) =>
          h(
            'li',
            { class: 'day__stop' },
            h('p', { class: 'day__stop-title' }, stop.step),
            h('p', { class: 'day__stop-detail' }, stop.detail)
          )
        )
      ),
      renderMeals(day)
    )
  );
  if (defaultOpen) details.open = true;
  return details;
}

function renderMeals(day: ItineraryDay): HTMLElement | null {
  const entries: { label: string; value: string }[] = [];
  if (day.meals.breakfast) entries.push({ label: 'Breakfast', value: day.meals.breakfast });
  if (day.meals.lunch) entries.push({ label: 'Lunch', value: day.meals.lunch });
  if (day.meals.dinner) entries.push({ label: 'Dinner', value: day.meals.dinner });
  if (entries.length === 0) return null;
  return h(
    'dl',
    { class: 'day__meals' },
    ...entries.flatMap((entry) => [
      h('dt', {}, entry.label),
      h('dd', {}, entry.value),
    ])
  );
}

function renderBody(container: HTMLElement, selectedId: string | null): void {
  const days = selectedId
    ? getPathById(selectedId as 'A' | 'B')?.itinerary ?? ITINERARY
    : ITINERARY;
  const path = selectedId ? getPathById(selectedId as 'A' | 'B') : null;

  const gist = container.querySelector<HTMLElement>('.gist');
  if (gist) {
    gist.replaceChildren(
      h(
        'li',
        { class: 'gist__item' },
        path
          ? `${path.name} — ${path.lodgingShape}. Back to the cabin by 7-8 PM.`
          : 'Default five-day shape. Pick a path above to see the per-path itinerary. Back to the cabin by 7-8 PM.'
      )
    );
  }

  const daysWrap = container.querySelector<HTMLElement>('.days');
  if (daysWrap) {
    daysWrap.replaceChildren(...days.map((day, idx) => renderDay(day, idx === 0)));
  }

  // Compare-all-mode hint about per-path itineraries.
  let comparison = container.querySelector<HTMLElement>('.itin-compare');
  if (!selectedId) {
    if (!comparison) {
      comparison = h(
        'details',
        { class: 'disclosure itin-compare' },
        h(
          'summary',
          { class: 'disclosure__summary' },
          'How the two paths differ day-by-day'
        ),
        h(
          'ul',
          { class: 'mini-list' },
          ...TRIP_PATHS.map((p) =>
            h(
              'li',
              { class: 'mini-list__item' },
              h('strong', { class: 'mini-list__label' }, p.name),
              h(
                'span',
                { class: 'mini-list__detail' },
                p.itinerary.map((d) => `Day ${d.day}: ${d.title}`).join(' · ')
              )
            )
          )
        )
      );
      container.append(comparison);
    }
  } else if (comparison) {
    comparison.remove();
  }
}

/** Base-shift banner — the booked house moved WEST of the Marblemount cluster
 *  the itinerary was built around. Drive-times are being re-based; some legs
 *  are flagged TBD rather than guessed. */
function renderBaseShiftBanner(): HTMLElement {
  return h(
    'div',
    { class: 'itin-base-shift card__warning', role: 'note' },
    h('p', {}, h('strong', {}, '⚠ Lodging base shifted WEST. ')),
    h(
      'p',
      {},
      'This itinerary was built around a Marblemount base. The booked house is in ',
      h('strong', {}, 'Sedro-Woolley / Arlington'),
      ' — ~40 min farther west. Sedro-Woolley is ≈ ',
      h('strong', {}, '1 hr 15 min'),
      ' to the Marblemount-area trailheads (Cascade Pass etc.). Drive legs below are being re-based from Sedro-Woolley; anything not yet confidently re-estimated is flagged ',
      h('em', {}, '[drive-time TBD — re-verify from Sedro-Woolley]'),
      '.'
    )
  );
}

export function renderItinerary(): HTMLElement {
  const wrap = section(
    'itinerary',
    'Itinerary',
    renderBaseShiftBanner(),
    h('ul', { class: 'gist' }),
    h('div', { class: 'days' })
  );

  renderBody(wrap, getSelectedPath());
  subscribeSelectedPath((next) => renderBody(wrap, next));

  return wrap;
}

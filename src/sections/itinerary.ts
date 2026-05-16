/**
 * Itinerary — collapsed days, each with a 1-line shape summary.
 *
 * No "POSTCARD DAY" / "EAST-SIDE CLASSIC" badges. The day card shows the
 * shape line in the summary so the reader can scan all five days at once
 * without expanding.
 */

import { ITINERARY, type ItineraryDay } from '../data/itinerary';
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

export function renderItinerary(): HTMLElement {
  return section(
    'itinerary',
    'Itinerary',
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Five-day shape — not a script. Each day has anchor options at different effort levels.'),
      h('li', { class: 'gist__item' }, 'Back to the cabin by 7-8 PM, balanced pace.'),
      h('li', { class: 'gist__item' }, 'Tap any day below to expand.')
    ),
    h(
      'div',
      { class: 'days' },
      ...ITINERARY.map((day, idx) => renderDay(day, idx === 0))
    )
  );
}

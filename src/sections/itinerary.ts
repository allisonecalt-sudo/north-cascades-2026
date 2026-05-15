import { ITINERARY, type ItineraryDay } from '../data/itinerary';
import { badge, h, section } from '../dom';

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
      day.badge ? badge(day.badge, 'info') : null
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
      'p',
      { class: 'section__lede' },
      'Tap a day to expand. Built around two anchor hikes — Cascade Pass (Day 2) and Maple Pass Loop (Day 4).'
    ),
    h(
      'div',
      { class: 'days' },
      ...ITINERARY.map((day, idx) => renderDay(day, idx === 0))
    )
  );
}

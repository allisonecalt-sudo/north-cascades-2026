/**
 * Activity add-ons — grouped by category (water lakes first), plus a ruled-out list.
 *
 * Water section was thin pre-2026-05-17 (one Diablo Lake activity); expanded into
 * a real "Water + lakes" subsection with Ross Lake water-taxi, corrected Diablo
 * rental info, Baker Lake swim, Pearrygin swim, Lake Chelan / Stehekin as a
 * long-detour option, and a Skagit riverside note.
 */

import { ACTIVITIES, RULED_OUT, type Activity } from '../data/activities';
import { h, section } from '../dom';

function categoryOf(act: Activity): 'water' | 'town' | 'wildlife' | 'general' {
  return act.category ?? 'general';
}

function renderActivityItem(act: Activity): HTMLElement {
  return h(
    'li',
    { class: 'activities__item' },
    h(
      'div',
      { class: 'activities__head' },
      h('strong', { class: 'activities__name' }, act.name),
      h('span', { class: 'activities__path-fit' }, act.pathFit)
    ),
    h('p', { class: 'activities__where' }, h('strong', {}, 'Where: '), act.where),
    h(
      'p',
      { class: 'activities__meta' },
      h('strong', {}, 'Cost: '),
      act.cost,
      h('span', {}, ' · '),
      h('strong', {}, 'Time: '),
      act.time
    ),
    h('p', { class: 'activities__desc' }, act.description),
    act.sourceUrl
      ? h(
          'p',
          { class: 'activities__source' },
          h(
            'a',
            { href: act.sourceUrl, rel: 'noopener', target: '_blank' },
            (act.sourceLabel ?? 'Source') + ' →'
          )
        )
      : null
  );
}

function renderGroup(title: string, lede: string | null, items: Activity[]): HTMLElement | null {
  if (items.length === 0) return null;
  return h(
    'div',
    { class: 'activities__group' },
    h('h3', { class: 'subsection__title' }, `${title} (${items.length})`),
    lede ? h('p', { class: 'section__lede activities__group-lede' }, lede) : null,
    h('ul', { class: 'activities__list' }, ...items.map(renderActivityItem))
  );
}

export function renderActivities(): HTMLElement {
  const water = ACTIVITIES.filter((a) => categoryOf(a) === 'water');
  const town = ACTIVITIES.filter((a) => categoryOf(a) === 'town');
  const wildlife = ACTIVITIES.filter((a) => categoryOf(a) === 'wildlife');
  const general = ACTIVITIES.filter((a) => categoryOf(a) === 'general');

  return section(
    'activities',
    'Activity add-ons',
    h(
      'p',
      { class: 'section__lede' },
      'Non-hike options for rest days or evenings — paddle, swim, bike, side-town walks. Not "must-do." Just menu items.'
    ),
    renderGroup(
      'Water + lakes',
      'Kayaks, swimming holes, boat tours. Two real on-water rental options in the corridor (Sun Mountain + Ross Lake Resort) plus self-launch + swim spots. Diablo Lake itself has no on-lake rentals — bring or haul.',
      water
    ),
    renderGroup('Side towns + biking', null, town),
    renderGroup('Wildlife', null, wildlife),
    renderGroup('Other', null, general),
    h(
      'details',
      { class: 'disclosure' },
      h('summary', { class: 'disclosure__summary' }, 'Checked + ruled out — for transparency'),
      h(
        'ul',
        { class: 'ruled-out__list' },
        ...RULED_OUT.map((r) =>
          h(
            'li',
            { class: 'ruled-out__item' },
            h('strong', {}, r.what),
            h('p', { class: 'ruled-out__why' }, r.why)
          )
        )
      )
    )
  );
}

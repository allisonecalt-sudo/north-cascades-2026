/**
 * Activity add-ons — non-hike options + an honest ruled-out list.
 */

import { ACTIVITIES, RULED_OUT } from '../data/activities';
import { h, section } from '../dom';

export function renderActivities(): HTMLElement {
  return section(
    'activities',
    'Activity add-ons',
    h(
      'p',
      { class: 'section__lede' },
      'Non-hike options for rest days or evenings — paddle, swim, bike, side-town walks. Not "must-do." Just menu items.'
    ),
    h(
      'ul',
      { class: 'activities__list' },
      ...ACTIVITIES.map((act) =>
        h(
          'li',
          { class: 'activities__item' },
          h(
            'div',
            { class: 'activities__head' },
            h('strong', { class: 'activities__name' }, act.name),
            h('span', { class: 'activities__path-fit' }, act.pathFit)
          ),
          h('p', { class: 'activities__where' }, h('strong', {}, 'Where: '), act.where),
          h('p', { class: 'activities__meta' }, h('strong', {}, 'Cost: '), act.cost, h('span', {}, ' · '), h('strong', {}, 'Time: '), act.time),
          h('p', { class: 'activities__desc' }, act.description)
        )
      )
    ),
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

/**
 * Bring list — PNW August day-hike-focused, compact + mobile-friendly.
 */

import { BRING_GROUPS } from '../data/bring';
import { h, section } from '../dom';

export function renderBring(): HTMLElement {
  return section(
    'bring',
    'Bring list — PNW August',
    h(
      'p',
      { class: 'section__lede' },
      'Not a full packing list — just the items people forget for this corridor in August. Standard clothes + toiletries assumed.'
    ),
    h(
      'div',
      { class: 'bring-groups' },
      ...BRING_GROUPS.map((group, idx) =>
        h(
          'details',
          // First group open by default so the section doesn't read empty;
          // rest collapsed so the section is scannable at ~600px not 2,076px.
          idx === 0 ? { class: 'bring-group', open: true } : { class: 'bring-group' },
          h('summary', { class: 'bring-group__summary' }, group.group, h('span', { class: 'bring-group__count' }, ` · ${group.items.length}`)),
          h(
            'ul',
            { class: 'bring-group__list' },
            ...group.items.map((item) =>
              h(
                'li',
                { class: 'bring-group__item' },
                h('strong', { class: 'bring-group__item-name' }, item.item),
                h('span', { class: 'bring-group__item-why' }, item.why)
              )
            )
          )
        )
      )
    )
  );
}

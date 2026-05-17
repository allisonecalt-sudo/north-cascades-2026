/**
 * story-arc.ts — home-page narrative anchor.
 *
 * Tiny 4-chip strip framed as a sentence: "Where you sleep → What you do →
 * How you get there → What it costs." Each chip links to the corresponding
 * spine page so a cold visitor (read: Erin) can map the trip's planning
 * sequence in ~4 seconds without parsing the nav.
 *
 * Only renders on the home page. Sits between the hero band and the path
 * picker. Complements the nav's hybrid 3-flat + 3-dropdown IA (which already
 * mirrors this arc left-to-right) — this is the inline reinforcement of the
 * same story for first-visit users who haven't looked up at the nav yet.
 *
 * Strategy doc: projects/north-cascades-2026/NAV_STRATEGY_2026-05-17.md
 *
 * 2026-05-17 update (home-page rebuild): added live count badges per chip so
 * "Stay" reads as "Stay (19)" — gives a concrete sense of what's behind each
 * link without forcing a click. Counts pull from the data files so they stay
 * current as new lodging / hikes / activities are added.
 */

import { WEST_LODGING, EAST_LODGING } from '../data/lodging';
import { HIKES } from '../data/hikes';
import { ACTIVITIES } from '../data/activities';
import { h } from '../dom';

interface ArcStep {
  prefix: string; // narrative phrase
  label: string; // the page name
  href: string;
  /** Optional inline count badge — appears as "(19)" next to the label. */
  count?: number;
}

const STORY_ARC: readonly ArcStep[] = [
  {
    prefix: 'Where you sleep',
    label: 'Stay',
    href: 'lodging.html',
    count: WEST_LODGING.length + EAST_LODGING.length,
  },
  {
    prefix: 'What you do',
    label: 'Do',
    href: 'hikes.html',
    count: HIKES.length + ACTIVITIES.length,
  },
  { prefix: 'How you get there', label: 'Get there', href: 'travel.html' },
  { prefix: 'What it costs', label: 'Costs', href: 'costs.html' },
];

export function renderStoryArc(): HTMLElement {
  return h(
    'aside',
    {
      class: 'story-arc',
      'aria-label': 'Trip planning at a glance',
    },
    h(
      'p',
      { class: 'story-arc__intro' },
      'Roughly the order to think through it:'
    ),
    h(
      'ol',
      { class: 'story-arc__steps' },
      ...STORY_ARC.map((step, idx) =>
        h(
          'li',
          { class: 'story-arc__step' },
          h(
            'a',
            { class: 'story-arc__link', href: step.href },
            h('span', { class: 'story-arc__prefix' }, step.prefix),
            h('span', { class: 'story-arc__sep', 'aria-hidden': 'true' }, '→'),
            h('span', { class: 'story-arc__label' }, step.label),
            step.count !== undefined
              ? h('span', { class: 'story-arc__count' }, `(${step.count})`)
              : null
          ),
          idx < STORY_ARC.length - 1
            ? h(
                'span',
                { class: 'story-arc__chevron', 'aria-hidden': 'true' },
                '›'
              )
            : null
        )
      )
    )
  );
}

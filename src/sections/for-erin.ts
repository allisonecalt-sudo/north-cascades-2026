/**
 * For Erin — centralized open decisions she should weigh in on.
 *
 * The whole site is Allison's research. The Notes button (every section
 * has one) is where Erin can leave per-section reactions. This section
 * surfaces the open decisions in one place so she can scan + react fast.
 */

import { QUESTIONS_FOR_ERIN } from '../data/for-erin';
import { h, section } from '../dom';

export function renderForErin(): HTMLElement {
  return section(
    'for-erin',
    'For Erin · open decisions',
    h(
      'p',
      { class: 'section__lede' },
      'Open decisions where your read matters. Leave a note on any section (💬 button) or just talk it through.'
    ),
    h(
      'ul',
      { class: 'for-erin__list' },
      ...QUESTIONS_FOR_ERIN.map((q) =>
        h(
          'li',
          { class: 'for-erin__item' },
          h('h3', { class: 'for-erin__question' }, q.question),
          h('p', { class: 'for-erin__context' }, q.context)
        )
      )
    )
  );
}

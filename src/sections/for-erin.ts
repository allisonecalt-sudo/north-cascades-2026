/**
 * For Erin — centralized open decisions she should weigh in on.
 *
 * Grouped by priority (2026-05-17 PM, per Allison "make it clear what's
 * missing"):
 *   - must-have  → "Before the trip locks, I really need…" (red header)
 *   - shape      → "Helps me build the right trip…" (amber header)
 *   - nice-to-have → "Treats + per-day swaps…" (neutral header)
 *
 * The whole site is Allison's research. The 💬 button (every section
 * has one) is where Erin can leave per-section reactions. This page is
 * the single scan-and-react surface.
 */

import { QUESTIONS_FOR_ERIN, type QuestionPriority } from '../data/for-erin';
import { h, section } from '../dom';

const GROUP_META: Record<
  QuestionPriority,
  { label: string; lede: string; cls: string }
> = {
  must: {
    label: '🚦 Before we lock the trip — I really need these',
    lede: "Five answers that change the whole shape of the trip. Pick any one to start.",
    cls: 'for-erin__group--must',
  },
  shape: {
    label: '🧭 Helps me build the right trip',
    lede: "Pace + day-type stuff. Not blockers, but answers here turn 'good plan' into 'right plan for you.'",
    cls: 'for-erin__group--shape',
  },
  nice: {
    label: '🎁 Treats + per-day swaps',
    lede: "Nice-to-haves. Skip if you don't have an instinct — Allison will pick sane defaults.",
    cls: 'for-erin__group--nice',
  },
};

export function renderForErin(): HTMLElement {
  const groups: QuestionPriority[] = ['must', 'shape', 'nice'];
  const sections = groups.map((g) => {
    const qs = QUESTIONS_FOR_ERIN.filter((q) => q.priority === g);
    if (qs.length === 0) return null;
    const meta = GROUP_META[g];
    return h(
      'div',
      { class: `for-erin__group ${meta.cls}` },
      h('h3', { class: 'for-erin__group-label' }, meta.label),
      h('p', { class: 'for-erin__group-lede' }, meta.lede),
      h(
        'ul',
        { class: 'for-erin__list' },
        ...qs.map((q) =>
          h(
            'li',
            { class: 'for-erin__item' },
            h('h4', { class: 'for-erin__question' }, q.question),
            h('p', { class: 'for-erin__context' }, q.context)
          )
        )
      )
    );
  });

  return section(
    'for-erin',
    'For Erin · what I still need from you',
    h(
      'p',
      { class: 'section__lede' },
      "Grouped by how much it matters. Leave a note on any 💬 button on this page, or text/email Allison — whichever's easier."
    ),
    ...sections.filter((s): s is HTMLDivElement => s !== null)
  );
}

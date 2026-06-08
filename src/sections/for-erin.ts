/**
 * For Erin — centralized open decisions she should weigh in on.
 *
 * Grouped by priority (2026-05-17 PM, per Allison "make it clear what's
 * missing"):
 *   - must-have  → "Five things Allison really needs from you" (red)
 *   - shape      → "Helps shape the right trip…" (amber header)
 *   - nice-to-have → "Treats + per-day swaps…" (neutral header)
 *
 * 2026-05-17 PM update (voice + findability pass):
 *   - Each question <li> now has id="must-{q.id}" / "shape-{q.id}" / "nice-{q.id}"
 *     so the home page's "5 things Allison needs from you" surfacing strip can
 *     deep-link straight to a specific question.
 *   - Each question gets its OWN 💬 mini-button that opens the notes modal
 *     pre-scoped to "for-erin-{q.id}" — so notes can be tagged to the exact
 *     question, not the whole page.
 *   - A "✓ I've answered these" button under the must group lets Erin manually
 *     flip a localStorage flag that hides the home-page surfacing strip.
 *
 * The whole site is Allison's research surface. The 💬 buttons are where Erin
 * leaves reactions — page-level on every section header, plus per-question
 * here on the most-important page.
 */

import { QUESTIONS_FOR_ERIN, type QuestionPriority } from '../data/for-erin';
import { h, section } from '../dom';
import { openGlobalScopeModal } from './notes-button';
import { renderAnswerForm } from './erin-answer-form';
import { hasSchema } from '../data/erin-answers';

/**
 * Same localStorage key as home/erin-musts-strip.ts uses — flipping this hides
 * the home-page "5 things Allison needs" surfacing strip on the next paint.
 */
const MUSTS_ACKED_KEY = 'ncades2026.erin-musts-acked';

const GROUP_META: Record<
  QuestionPriority,
  { label: string; lede: string; cls: string }
> = {
  must: {
    label: '🚦 What Allison really needs from you',
    lede: 'These change the whole shape of the trip.',
    cls: 'for-erin__group--must',
  },
  shape: {
    label: '🧭 Helps shape the right trip',
    lede: 'Pace + day-type. Not blockers.',
    cls: 'for-erin__group--shape',
  },
  nice: {
    label: '🎁 Treats + per-day swaps',
    lede: 'Skip any — Allison picks sane defaults.',
    cls: 'for-erin__group--nice',
  },
};

function renderPerQuestionNoteBtn(
  q: { id: string; priority: QuestionPriority; question: string }
): HTMLElement {
  const scope = `for-erin-${q.id}`;
  const label = `For Erin: ${q.question}`;
  const btn = h(
    'button',
    {
      type: 'button',
      class: 'for-erin__note-btn',
      'aria-label': `Leave a note about: ${q.question}`,
      'data-scope': scope,
    },
    h('span', { 'aria-hidden': 'true' }, '💬'),
    h('span', { class: 'for-erin__note-btn-text' }, 'Leave a note about this')
  );
  btn.addEventListener('click', () => {
    openGlobalScopeModal(scope, label);
  });
  return btn;
}

function renderAckMustsButton(): HTMLElement {
  const btn = h(
    'button',
    {
      type: 'button',
      class: 'for-erin__ack-btn',
      'aria-label': 'Mark the 5 must-answer questions as answered',
    },
    '✓ I\'ve answered these — hide the home reminder'
  );
  // Show initial state.
  const refresh = (): void => {
    try {
      const acked = localStorage.getItem(MUSTS_ACKED_KEY) === '1';
      btn.textContent = acked
        ? '↻ Un-mark as answered (show home reminder again)'
        : '✓ I\'ve answered these — hide the home reminder';
    } catch {
      /* ignore */
    }
  };
  refresh();
  btn.addEventListener('click', () => {
    try {
      const acked = localStorage.getItem(MUSTS_ACKED_KEY) === '1';
      if (acked) localStorage.removeItem(MUSTS_ACKED_KEY);
      else localStorage.setItem(MUSTS_ACKED_KEY, '1');
      refresh();
      // Dispatch a storage-style event so the home page can react if open in
      // another tab — and fire a custom event for same-tab listeners.
      window.dispatchEvent(new CustomEvent('ncades:musts-acked-change'));
    } catch {
      /* ignore */
    }
  });
  return btn;
}

export function renderForErin(): HTMLElement {
  const groups: QuestionPriority[] = ['must', 'shape', 'nice'];
  const sections = groups.map((g) => {
    const qs = QUESTIONS_FOR_ERIN.filter((q) => q.priority === g);
    if (qs.length === 0) return null;
    const meta = GROUP_META[g];
    return h(
      'div',
      { class: `for-erin__group ${meta.cls}`, id: `for-erin-group-${g}` },
      h('h3', { class: 'for-erin__group-label' }, meta.label),
      h('p', { class: 'for-erin__group-lede' }, meta.lede),
      h(
        'ul',
        { class: 'for-erin__list' },
        ...qs.map((q) => {
          // Structured-answer form (2026-05-17 PM): for must-have questions
          // only, sits between context and the 💬 freeform button. Falls back
          // gracefully if the schema is missing.
          const answerForm =
            g === 'must' && hasSchema(q.id)
              ? renderAnswerForm(q.id, q.question, () =>
                  openGlobalScopeModal(
                    `for-erin-${q.id}`,
                    `For Erin: ${q.question}`
                  )
                )
              : null;
          return h(
            'li',
            { class: 'for-erin__item', id: `${g}-${q.id}` },
            h('h4', { class: 'for-erin__question' }, q.question),
            h('p', { class: 'for-erin__context' }, q.context),
            answerForm,
            renderPerQuestionNoteBtn(q)
          );
        })
      ),
      g === 'must'
        ? h(
            'div',
            { class: 'for-erin__ack-row' },
            renderAckMustsButton()
          )
        : null
    );
  });

  // Anchor target — for-erin.html#must lands here at the top of the musts group.
  const mustAnchor = h('div', { id: 'must', class: 'for-erin__anchor', 'aria-hidden': 'true' });

  return section(
    'for-erin',
    'For Erin · what Allison still needs from you',
    h(
      'p',
      { class: 'section__lede' },
      'Grouped by how much each answer changes the trip. Leave a 💬 note or text Allison.'
    ),
    mustAnchor,
    ...sections.filter((s): s is HTMLDivElement => s !== null)
  );
}

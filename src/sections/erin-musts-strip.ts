/**
 * erin-musts-strip.ts — Home-page surfacing of the 5 "must-have" Erin questions.
 *
 * What this is: a compact, prominent list of just the 5 questions from the
 * `must` priority band in /for-erin. Each question is a deep-link into the
 * For-Erin page at the specific question anchor (#must-{id}).
 *
 * Why it exists (2026-05-17 PM, Allison's directive): "this is all on the site
 * so make ux good and easy for her to find it" — referring to the 5 must-have
 * questions. The For Erin page is in the top nav but a first-time visitor
 * doesn't know there are 5 critical questions waiting. This strip surfaces
 * them ABOVE the path picker so Erin lands on them in her first 30 seconds.
 *
 * Visibility rule: only renders while `localStorage['ncades2026.erin-musts-acked']`
 * is unset. The For Erin page exposes a "✓ I've answered these" button that
 * sets that flag. So once Erin signals she's responded, the home reminder
 * stops showing. (Mechanism: same agency-rule principle — system SUGGESTS,
 * never NAGS.)
 *
 * The strip auto-hides itself on the home page if the flag is set. It also
 * subscribes to a custom event so flipping the flag on /for-erin removes the
 * strip immediately if the tab is still on home (rare but cheap).
 */

import { h } from '../dom';
import { QUESTIONS_FOR_ERIN } from '../data/for-erin';
import { latestAnswersForQuestions, type EAnswer } from '../data/erin-answers';

const MUSTS_ACKED_KEY = 'ncades2026.erin-musts-acked';

/**
 * Compact summary of a submitted answer for the home strip — short version
 * so the line stays one-row on mobile.
 */
function shortLabel(ans: EAnswer): string {
  // answer_label is already the human form when set; fall back to value.
  const raw = (ans.answer_label ?? ans.answer_value).trim();
  // Strip "YES: " / "NO: " framing for the pair-text case → keep it brief.
  // Truncate aggressively so the home strip stays scan-friendly.
  const max = 64;
  if (raw.length <= max) return raw;
  return `${raw.slice(0, max - 1).trimEnd()}…`;
}

function isAcked(): boolean {
  try {
    return localStorage.getItem(MUSTS_ACKED_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Build a static wrapper, then either fill it with the strip OR leave it
 * empty (hidden). Returns the wrapper either way so the caller's `.append()`
 * sequence stays clean.
 */
export function renderErinMustsStrip(): HTMLElement {
  const wrap = h('div', { class: 'erin-musts-strip-wrap' });

  /** Latest answer per must question. Populated async; paint() reads it. */
  let answers: Record<string, EAnswer> = {};

  const paint = (): void => {
    if (isAcked()) {
      wrap.replaceChildren();
      wrap.hidden = true;
      return;
    }
    const musts = QUESTIONS_FOR_ERIN.filter((q) => q.priority === 'must');
    // Auto-hide once all 5 are answered — keeps the existing ack flag as a
    // manual override but doesn't require it for the all-done case.
    const allAnswered = musts.every((q) => answers[q.id]);
    if (allAnswered && musts.length > 0) {
      wrap.replaceChildren();
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    const list = h(
      'ul',
      { class: 'erin-musts-strip__list' },
      ...musts.map((q) => {
        const ans = answers[q.id];
        const linkChildren = ans
          ? [
              h(
                'span',
                { class: 'erin-musts-strip__q erin-musts-strip__q--answered' },
                h(
                  'span',
                  { class: 'erin-musts-strip__check', 'aria-hidden': 'true' },
                  '✓ '
                ),
                h('span', { class: 'erin-musts-strip__answer-label' }, shortLabel(ans)),
                h('span', { class: 'erin-musts-strip__q-tail' }, ` · ${q.question}`)
              ),
              h(
                'span',
                { class: 'erin-musts-strip__chev', 'aria-hidden': 'true' },
                '›'
              ),
            ]
          : [
              h('span', { class: 'erin-musts-strip__q' }, q.question),
              h(
                'span',
                { class: 'erin-musts-strip__chev', 'aria-hidden': 'true' },
                '›'
              ),
            ];
        return h(
          'li',
          {
            class: `erin-musts-strip__item${ans ? ' erin-musts-strip__item--answered' : ''}`,
          },
          h(
            'a',
            {
              class: 'erin-musts-strip__link',
              href: `for-erin.html#must-${q.id}`,
            },
            ...linkChildren
          )
        );
      })
    );

    const strip = h(
      'aside',
      {
        class: 'erin-musts-strip',
        'aria-label': '5 must-have questions for Erin',
      },
      h(
        'a',
        {
          class: 'erin-musts-strip__title-link',
          href: 'for-erin.html#must',
        },
        h(
          'h3',
          { class: 'erin-musts-strip__title' },
          '5 things Allison needs from you, Erin → '
        )
      ),
      h(
        'p',
        { class: 'erin-musts-strip__sub' },
        'Tap a question to open the form (or leave a 💬 note). Or just text Allison — whichever is easier.'
      ),
      list,
      h(
        'a',
        {
          class: 'erin-musts-strip__cta',
          href: 'for-erin.html#must',
        },
        'See all five →'
      )
    );

    wrap.replaceChildren(strip);
  };

  paint();

  // Fetch latest answers, then repaint with ✓ inline state.
  const refreshAnswers = async (): Promise<void> => {
    try {
      const musts = QUESTIONS_FOR_ERIN.filter((q) => q.priority === 'must');
      answers = await latestAnswersForQuestions(musts.map((q) => q.id));
      paint();
    } catch {
      // Fail-quiet — strip still works without answer overlay.
    }
  };
  void refreshAnswers();

  // Cross-tab + same-tab updates: storage event for other tabs, custom event
  // for the For-Erin ack button on the same tab if user navs back.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === MUSTS_ACKED_KEY) paint();
    });
    window.addEventListener('ncades:musts-acked-change', () => paint());
    window.addEventListener('focus', paint);
    // When a new answer is submitted from /for-erin in the same tab session
    // (unlikely but possible if the user opens both via tab nav), refresh.
    window.addEventListener('ncades:erin-answer-submitted', () => {
      void refreshAnswers();
    });
  }

  return wrap;
}

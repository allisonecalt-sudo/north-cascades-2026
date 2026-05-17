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

const MUSTS_ACKED_KEY = 'ncades2026.erin-musts-acked';

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

  const paint = (): void => {
    if (isAcked()) {
      wrap.replaceChildren();
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    const musts = QUESTIONS_FOR_ERIN.filter((q) => q.priority === 'must');
    const list = h(
      'ul',
      { class: 'erin-musts-strip__list' },
      ...musts.map((q) =>
        h(
          'li',
          { class: 'erin-musts-strip__item' },
          h(
            'a',
            {
              class: 'erin-musts-strip__link',
              href: `for-erin.html#must-${q.id}`,
            },
            h('span', { class: 'erin-musts-strip__q' }, q.question),
            h(
              'span',
              { class: 'erin-musts-strip__chev', 'aria-hidden': 'true' },
              '›'
            )
          )
        )
      )
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
        'Tap a question to open it + leave a note inline. Or just text Allison — whichever is easier.'
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

  // Cross-tab + same-tab updates: storage event for other tabs, custom event
  // for the For-Erin ack button on the same tab if user navs back.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === MUSTS_ACKED_KEY) paint();
    });
    window.addEventListener('ncades:musts-acked-change', () => paint());
    window.addEventListener('focus', paint);
  }

  return wrap;
}

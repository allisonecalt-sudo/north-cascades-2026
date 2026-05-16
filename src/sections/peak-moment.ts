/**
 * peak-moment.ts — single emotional-anchor callout on the landing.
 *
 * Austria-lifted "Tara-Bridge moment" pattern. Allison's Montenegro feedback
 * loop named the bridge-over-the-canyon as the trip's emotional center; her
 * trip sites since then surface one such "you'll remember this for years"
 * moment on the home page. NC's analog is Cascade Pass — the alpine pass
 * lookout that gives the most cinematic North Cascades view at the easiest
 * grade. Stays brand-consistent (glacial blue + forest tint).
 *
 * Content sourced from the trip's own viewpoint research, not invented.
 * If we move bases or close Cascade River Rd, swap the spot via this file.
 */

import { h, section } from '../dom';

export function renderPeakMoment(): HTMLElement {
  return section(
    'peak-moment',
    'The view you came for',
    h(
      'div',
      { class: 'peak-moment' },
      h('p', { class: 'peak-moment__eyebrow' }, 'Cascade Pass · the alpine moment'),
      h(
        'h3',
        { class: 'peak-moment__title' },
        'Cascade Pass lookout — glacier-bowl panorama at the top of an easy 3.7 mi switchback.'
      ),
      h(
        'p',
        { class: 'peak-moment__body' },
        'Mid-grade, well-graded trail to a saddle ringed by Sahale, Mixup, and Magic Mountain — Daniel Hershman’s Wikimedia shot in the hero is taken just above this point. Six hours round-trip with breaks. If Cascade River Rd is open and a sedan-friendly window holds, this is the day Erin remembers.'
      )
    )
  );
}

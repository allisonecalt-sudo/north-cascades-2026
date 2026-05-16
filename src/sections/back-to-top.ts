/**
 * Floating "Back to top" button.
 *
 * Why: site is ~40,000px tall on mobile. Erin will scroll deep into Lodging or
 * Rental, want to jump back to the Path picker to switch paths, and have to
 * thumb-scroll 30+ viewport heights. A single tap saves the trip up.
 *
 * Visibility: hidden until user has scrolled past one viewport. Doesn't compete
 * with the hero's static nav.
 *
 * Behavior: smooth-scroll to #top. No path mutation, no modal.
 */

import { h } from '../dom';

const VISIBLE_AFTER_PX = 600; // ~1 viewport on Pixel 7 Pro XL

export function attachBackToTop(): void {
  const btn = h(
    'button',
    {
      type: 'button',
      class: 'back-to-top',
      'aria-label': 'Back to top',
      hidden: true,
    },
    h('span', { 'aria-hidden': 'true' }, '↑'),
    h('span', { class: 'back-to-top__label' }, 'Top')
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(btn);

  let ticking = false;
  const update = (): void => {
    const shouldShow = window.scrollY > VISIBLE_AFTER_PX;
    if (shouldShow && btn.hidden) {
      btn.hidden = false;
      requestAnimationFrame(() => btn.classList.add('back-to-top--visible'));
    } else if (!shouldShow && !btn.hidden) {
      btn.classList.remove('back-to-top--visible');
      // Wait for CSS transition before un-rendering.
      setTimeout(() => {
        if (window.scrollY <= VISIBLE_AFTER_PX) btn.hidden = true;
      }, 200);
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

import { TRIP } from '../data/trip';
import { h } from '../dom';

export function renderFooter(): HTMLElement {
  return h(
    'footer',
    { class: 'footer' },
    h(
      'div',
      { class: 'footer__inner' },
      h('p', {}, `Researched ${TRIP.researchedOn}. Re-verify road status, prices, and trail conditions closer to booking.`),
      h(
        'a',
        { href: '#top', class: 'footer__back' },
        'Back to top ↑'
      )
    )
  );
}

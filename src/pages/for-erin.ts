/**
 * for-erin.ts — open decisions Erin should weigh in on.
 *
 * The decision surface — what's still in motion, what's locked, what's
 * waiting on her.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderForErin } from '../sections/for-erin';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'for-erin',
    title: 'For Erin',
    lede: 'Your open decisions. Must-answer at the top — tap a question to answer inline, or just text Allison.',
    imageHero: {
      src: 'img/winthrop-usa-19801491829.jpg',
      alt: 'Winthrop, Washington — Old-West boardwalk town with mountain backdrop',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See open decisions',
      ctaHref: '#for-erin',
    },
  });

  // Towns block intentionally NOT included here — it's full background browsing
  // (carousels, drive matrices, shops) that duplicates the Things-to-Do page and
  // buries the actual decisions. The "town day" choice is already its own
  // question above; deeper town detail is one tap away via the nav + CTAs below.
  main.append(renderForErin(), renderPageCtas('for-erin'));
}

mount();

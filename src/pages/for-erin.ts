/**
 * for-erin.ts — open decisions Erin should weigh in on.
 *
 * The decision surface — what's still in motion, what's locked, what's
 * waiting on her.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderForErin } from '../sections/for-erin';
import { renderTowns } from '../sections/towns';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'for-erin',
    title: 'For Erin',
    lede: 'Open decisions Allison needs Erin to weigh in on. Must-have answers up top — each question has its own 💬 button. Or just text/email Allison.',
    imageHero: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Winthrop%2C_USA_%2819801491829%29.jpg/1920px-Winthrop%2C_USA_%2819801491829%29.jpg',
      alt: 'Winthrop, Washington — Old-West boardwalk town with mountain backdrop',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See open decisions',
      ctaHref: '#for-erin',
    },
  });

  main.append(renderForErin(), renderTowns(), renderPageCtas('for-erin'));
  attachNotesToAllSections(main);
}

mount();

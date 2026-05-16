/**
 * notes.ts — dedicated /notes view.
 *
 * Austria-lifted. Shows every note across the site, grouped by section, with
 * filters for open / addressed. Each group title links back to the section
 * where the note was made.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderNotesSummary } from '../sections/notes-summary';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'notes',
    title: 'Notes from the site',
    lede: 'Every 💬 note across the site, in one feed. Tap any section to jump back to the note\'s context.',
  });

  main.append(renderNotesSummary(), renderPageCtas('notes'));
  attachNotesToAllSections(main);
}

mount();

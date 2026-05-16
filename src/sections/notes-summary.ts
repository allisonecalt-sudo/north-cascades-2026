/**
 * Notes summary — full feed across the site.
 *
 * Austria-lifted: notes.html shows a global feed of every note grouped by
 * section. Each note links back to the section where it was made so Allison
 * (or Erin) can jump to context. Filters: All / Open / Addressed.
 *
 * Loads from Supabase via listNotes(). Reads section labels from a static map
 * so we don't have to roundtrip section title text.
 */

import { listNotes, type Note } from '../data/notes';
import { h, section } from '../dom';

const SECTION_LABELS: Record<string, { label: string; page: string }> = {
  paths: { label: 'Path picker', page: './' },
  'peak-moment': { label: 'Peak moment · Cascade Pass', page: './' },
  map: { label: 'Map', page: './' },
  overview: { label: 'Overview', page: './' },
  itinerary: { label: 'Itinerary', page: './' },
  lodging: { label: 'Lodging', page: 'lodging.html' },
  'cool-sleeping-places': { label: 'Cool sleeping places', page: 'lodging.html' },
  hikes: { label: 'Hikes', page: 'hikes.html' },
  activities: { label: 'Activities', page: 'hikes.html' },
  flights: { label: 'Flights', page: 'travel.html' },
  rental: { label: 'Rental car', page: 'rental.html' },
  restaurants: { label: 'Restaurants', page: 'food.html' },
  food: { label: 'Food + kosher strategy', page: 'food.html' },
  bring: { label: 'Bring (packing list)', page: 'food.html' },
  seattle: { label: 'Seattle', page: 'seattle.html' },
  viewpoints: { label: 'Viewpoints', page: 'hikes.html' },
  sky: { label: 'Sky · sunset · stargazing', page: 'hikes.html' },
  logistics: { label: 'Logistics', page: 'details.html' },
  decisions: { label: 'Open decisions', page: 'details.html' },
  'for-erin': { label: 'For Erin', page: 'for-erin.html' },
};

type FilterMode = 'all' | 'open' | 'addressed';

function escapeText(s: string): string {
  // Inserting via textContent in DOM nodes, so escape only when forcing strings.
  return s;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function renderNote(n: Note): HTMLElement {
  return h(
    'div',
    { class: 'notes-summary__note' },
    h('p', { class: 'notes-summary__note-body' }, n.note),
    h(
      'div',
      { class: 'notes-summary__note-meta' },
      h('span', {}, `👤 ${escapeText(n.author)}`),
      h('span', {}, `🕒 ${formatTime(n.created_at)}`),
      n.path_id ? h('span', {}, `🥾 Path ${n.path_id}`) : null,
      n.addressed
        ? h('span', { class: 'notes-summary__note-addressed' }, '✓ addressed')
        : h('span', {}, 'open')
    )
  );
}

function groupBySection(notes: Note[]): Map<string, Note[]> {
  const groups = new Map<string, Note[]>();
  for (const n of notes) {
    const key = n.section ?? '__general__';
    const arr = groups.get(key) ?? [];
    arr.push(n);
    groups.set(key, arr);
  }
  return groups;
}

function renderGroups(notes: Note[], root: HTMLElement, countLine: HTMLElement): void {
  root.replaceChildren();
  countLine.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'} in this view.`;
  if (notes.length === 0) {
    root.appendChild(
      h(
        'div',
        { class: 'notes-summary__empty' },
        'No notes match this filter. Add a note from any 💬 button on the site — it lands here within seconds.'
      )
    );
    return;
  }

  const groups = groupBySection(notes);
  // Sort sections by recency of their most recent note.
  const ordered = [...groups.entries()].sort(([, a], [, b]) => {
    const aFirst = a[0];
    const bFirst = b[0];
    const aMs = aFirst ? new Date(aFirst.created_at).getTime() : 0;
    const bMs = bFirst ? new Date(bFirst.created_at).getTime() : 0;
    return bMs - aMs;
  });

  for (const [sectionKey, sectionNotes] of ordered) {
    const meta = SECTION_LABELS[sectionKey] ?? {
      label: sectionKey === '__general__' ? 'General / unscoped' : sectionKey,
      page: './',
    };
    const link =
      sectionKey === '__general__'
        ? null
        : h(
            'a',
            { class: 'notes-summary__group-link', href: `${meta.page}#${sectionKey}` },
            'Jump to section ↗'
          );
    const group = h(
      'div',
      { class: 'notes-summary__group' },
      h(
        'h3',
        { class: 'notes-summary__group-title' },
        h('span', {}, `${meta.label} · ${sectionNotes.length}`),
        link
      ),
      ...sectionNotes.map(renderNote)
    );
    root.appendChild(group);
  }
}

export function renderNotesSummary(): HTMLElement {
  const filterAllBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__filter notes-summary__filter--active', 'data-filter': 'all' },
    'All'
  );
  const filterOpenBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__filter', 'data-filter': 'open' },
    'Open only'
  );
  const filterAddrBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__filter', 'data-filter': 'addressed' },
    'Addressed'
  );

  const filterBar = h(
    'div',
    { class: 'notes-summary__filterbar' },
    h('span', {}, 'Filter:'),
    filterAllBtn,
    filterOpenBtn,
    filterAddrBtn
  );

  const countLine = h('p', { class: 'notes-summary__count-line' }, 'Loading…');
  const root = h('div', { class: 'notes-summary' });

  let allNotes: Note[] = [];
  let currentFilter: FilterMode = 'all';

  function applyFilter(): void {
    const filtered =
      currentFilter === 'all'
        ? allNotes
        : currentFilter === 'open'
          ? allNotes.filter((n) => !n.addressed)
          : allNotes.filter((n) => n.addressed);
    renderGroups(filtered, root, countLine);
  }

  filterBar.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const f = target.dataset['filter'] as FilterMode | undefined;
    if (!f) return;
    currentFilter = f;
    filterBar
      .querySelectorAll<HTMLButtonElement>('.notes-summary__filter')
      .forEach((b) => b.classList.toggle('notes-summary__filter--active', b === target));
    applyFilter();
  });

  void (async () => {
    try {
      allNotes = await listNotes();
      applyFilter();
    } catch {
      root.replaceChildren(
        h(
          'div',
          { class: 'notes-summary__empty' },
          'Could not load notes (network or Supabase issue). Try refreshing.'
        )
      );
      countLine.textContent = '';
    }
  })();

  return section(
    'notes-summary',
    'All notes across the site',
    h(
      'p',
      { class: 'cool-sleep__intro-note' },
      'Live feed of every 💬 note left anywhere on the site, grouped by section. Allison\'s Claude reads these between sessions and iterates the plan. Tap a section header to jump back to where the note was made.'
    ),
    filterBar,
    countLine,
    root
  );
}

/**
 * fresh-notes.ts — "Fresh from Erin" feed for the home page.
 *
 * What this is: pulls the 3 most recent notes from Supabase and shows them
 * inline on home so Allison sees what Erin has been saying without having to
 * click into the Notes page. If zero notes (or fetch fails), the section
 * silently doesn't render — no empty state shouting "0 notes."
 *
 * Why on the home page: the site's WHOLE POINT is "Erin reacts → Allison
 * iterates." Surfacing the freshest feedback on the first surface anyone
 * sees collapses the latency of that loop. Allison opens home, sees the
 * 3 latest notes, decides what to address.
 *
 * Filter logic:
 *   - Show the 3 most recent notes regardless of status — pending shows the
 *     hottest stuff; seen/applied still belong on home as confirmation Allison
 *     remembers what's been said.
 *   - Each note links to its source section via the page-anchor mapping
 *     (mirrored from notes-summary.ts so jump-to-section behaves identically).
 *   - "All notes →" link at the bottom points at notes.html for the full feed.
 *
 * Fail-loud: if the fetch errors, render a tiny diagnostic line — never
 * silently hide the section because of a network issue. Status pill shows
 * what's wrong so Allison can debug.
 */

import { h, section } from '../dom';
import { listNotes, type Note } from '../data/notes';

const SECTION_TO_PAGE: Record<string, string> = {
  paths: './',
  'peak-moment': './',
  map: 'map.html',
  overview: './',
  itinerary: './',
  lodging: 'lodging.html',
  'cool-sleeping-places': 'lodging.html',
  hikes: 'hikes.html',
  activities: 'things-to-do.html#activities',
  flights: 'travel.html',
  rental: 'rental.html',
  restaurants: 'food.html',
  food: 'food.html',
  bring: 'pre-trip.html#bring',
  seattle: 'seattle.html',
  viewpoints: 'things-to-do.html#viewpoints',
  sky: 'things-to-do.html#top-sunsets',
  logistics: 'pre-trip.html',
  decisions: 'pre-trip.html#decisions',
  'for-erin': 'things-to-do.html',
  towns: 'things-to-do.html#towns',
  'hidden-gems': 'hidden-gems.html',
  lakes: 'things-to-do.html#lakes',
  costs: 'costs.html',
  'top-sunsets': 'things-to-do.html#top-sunsets',
  'pre-trip': 'pre-trip.html',
  'driving-cascades': 'wa20-status.html#driving-cascades',
  'weather-plan-c': 'weather-plan-c.html',
  'how-to': 'wa20-status.html#how-to',
};

const SECTION_LABEL: Record<string, string> = {
  paths: 'Path picker',
  'peak-moment': 'Cascade Pass moment',
  map: 'Map',
  overview: 'Overview',
  itinerary: 'Itinerary',
  lodging: 'Lodging',
  'cool-sleeping-places': 'Cool sleeping places',
  hikes: 'Hikes',
  activities: 'Activities',
  flights: 'Flights',
  rental: 'Rental car',
  restaurants: 'Restaurants',
  food: 'Food + groceries',
  bring: 'Packing list',
  seattle: 'Seattle',
  viewpoints: 'Viewpoints',
  sky: 'Sunset + sky',
  logistics: 'Logistics',
  decisions: 'Open decisions',
  'for-erin': 'For Erin',
  towns: 'Towns',
  'hidden-gems': 'Hidden gems',
  lakes: 'Lakes',
  costs: 'Costs',
  'top-sunsets': 'Top sunsets',
  'pre-trip': 'Pre-trip',
  'driving-cascades': 'Driving the cascades',
  'weather-plan-c': 'Weather Plan C',
  'how-to': 'How to do this trip',
};

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.round((now - then) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

function statusPill(status: Note['status']): HTMLElement {
  const label =
    status === 'applied' ? 'applied' : status === 'seen' ? 'seen' : 'new';
  return h(
    'span',
    { class: `fresh-notes__pill fresh-notes__pill--${status}` },
    label
  );
}

function renderNoteCard(n: Note): HTMLElement {
  const sectionKey = n.section ?? '';
  const page = SECTION_TO_PAGE[sectionKey] ?? './';
  const label = SECTION_LABEL[sectionKey] ?? 'General';
  const href = sectionKey ? `${page}#${sectionKey}` : page;

  return h(
    'article',
    { class: `fresh-notes__card fresh-notes__card--${n.status}` },
    h(
      'header',
      { class: 'fresh-notes__head' },
      h('span', { class: 'fresh-notes__author' }, n.author),
      h('span', { class: 'fresh-notes__time' }, formatRelative(n.created_at)),
      statusPill(n.status)
    ),
    h(
      'p',
      { class: 'fresh-notes__body' },
      n.note.length > 240 ? n.note.slice(0, 237) + '…' : n.note
    ),
    h(
      'a',
      { class: 'fresh-notes__jump', href },
      `View in ${label} ↗`
    )
  );
}

export function renderFreshNotes(): HTMLElement {
  const wrap = section(
    'fresh-notes',
    'Fresh from Erin',
    h(
      'p',
      { class: 'section__lede' },
      'Three most recent notes left anywhere on the site.'
    )
  );
  const grid = h('div', { class: 'fresh-notes__grid' });
  const status = h('p', { class: 'fresh-notes__loading' }, 'Loading recent notes…');
  wrap.append(grid, status);

  void (async () => {
    try {
      const all = await listNotes();
      const recent = all.slice(0, 3);
      if (recent.length === 0) {
        // No notes at all — collapse the section entirely. Avoids the empty
        // "nothing here yet" state crying for attention on the home page.
        wrap.remove();
        return;
      }
      status.remove();
      grid.replaceChildren(...recent.map(renderNoteCard));
      const allLink = h(
        'p',
        { class: 'fresh-notes__all-link' },
        h('a', { href: 'notes.html' }, `All notes & status workflow (${all.length}) →`)
      );
      wrap.appendChild(allLink);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      status.textContent = `Could not load notes (${msg}). Open notes.html to retry.`;
      status.className = 'fresh-notes__loading fresh-notes__loading--error';
    }
  })();

  return wrap;
}

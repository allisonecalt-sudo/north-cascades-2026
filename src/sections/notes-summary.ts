/**
 * Notes summary — full feed across the site with status workflow.
 *
 * Austria-lifted, NC-extended (Wave 3, May 17, 2026). Shows every note grouped
 * by section. Each note links back to the section where it was made so Allison
 * (or Erin) can jump to context. Adds:
 *   - Filter chips: All / Pending / Seen / Applied (count badges on each)
 *   - Per-note "Mark seen" / "Mark applied" buttons (status workflow)
 *   - Bulk "Mark all pending → seen" button (fires automatically on first
 *     visit so the section badges clear as soon as Allison lays eyes on it)
 *   - Group toggle: By section / By path
 *   - Empty state per filter (different copy for "nothing applied yet" vs
 *     "no pending notes — inbox zero")
 *
 * Status semantics:
 *   pending = note Allison hasn't seen
 *   seen    = Allison has eyes on it, hasn't addressed it
 *   applied = Allison made the change on the site
 *
 * Loads from Supabase via listNotes(). Reads section labels from a static map
 * so we don't have to roundtrip section title text.
 */

import {
  listNotes,
  updateNoteStatus,
  markAllPendingSeen,
  type Note,
  type NoteStatus,
} from '../data/notes';
import { h, section } from '../dom';
import { openLightbox } from './lightbox';

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

type FilterMode = 'all' | 'pending' | 'seen' | 'applied';
type GroupMode = 'section' | 'path';

const FIRST_VISIT_KEY = 'ncades2026.notesPageVisited';

function escapeText(s: string): string {
  return s;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

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
  return formatTime(iso);
}

function showToast(text: string, ms = 2400): void {
  const t = document.createElement('div');
  t.className = 'notes-toast';
  t.textContent = text;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, ms);
}

/** Render a single note card with action buttons. */
function renderNote(n: Note, onChange: () => void): HTMLElement {
  const card = h('div', { class: `notes-summary__note notes-summary__note--${n.status}` });

  const body = h('p', { class: 'notes-summary__note-body' }, n.note);

  // Optional photo — rendered as a tappable thumbnail; click opens lightbox.
  let photoEl: HTMLElement | null = null;
  if (n.photo_url) {
    const url = n.photo_url;
    const img = h('img', {
      src: url,
      alt: 'note photo',
      class: 'notes-summary__note-photo',
      loading: 'lazy',
    }) as HTMLImageElement;
    img.addEventListener('click', () => openLightbox(url));
    photoEl = h('div', { class: 'notes-summary__note-photo-wrap' }, img);
  }

  const meta = h(
    'div',
    { class: 'notes-summary__note-meta' },
    h('span', {}, `👤 ${escapeText(n.author)}`),
    h('span', { title: formatTime(n.created_at) }, `🕒 ${formatRelative(n.created_at)}`),
    n.path_id ? h('span', {}, `🥾 Path ${n.path_id}`) : null,
    h('span', { class: `notes-summary__status-pill notes-summary__status-pill--${n.status}` },
      n.status === 'applied' ? '✓ applied' : n.status === 'seen' ? '· seen' : '· new'
    )
  );

  // Action buttons depend on current status.
  const actions = h('div', { class: 'notes-summary__note-actions' });

  async function patch(next: NoteStatus, label: string): Promise<void> {
    const buttons = actions.querySelectorAll<HTMLButtonElement>('button');
    buttons.forEach((b) => (b.disabled = true));
    try {
      await updateNoteStatus(n.id, next);
      n.status = next;
      n.addressed = next === 'applied';
      showToast(`Note ${label}.`);
      onChange();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Failed: ${msg}`, 4000);
      buttons.forEach((b) => (b.disabled = false));
    }
  }

  if (n.status === 'pending') {
    const seenBtn = h(
      'button',
      { type: 'button', class: 'notes-summary__action' },
      'Mark seen'
    ) as HTMLButtonElement;
    seenBtn.addEventListener('click', () => void patch('seen', 'marked seen'));
    actions.appendChild(seenBtn);
  }
  if (n.status !== 'applied') {
    const applyBtn = h(
      'button',
      {
        type: 'button',
        class: 'notes-summary__action notes-summary__action--primary',
      },
      'Mark applied'
    ) as HTMLButtonElement;
    applyBtn.addEventListener('click', () => void patch('applied', 'applied'));
    actions.appendChild(applyBtn);
  }
  if (n.status === 'applied') {
    const reopenBtn = h(
      'button',
      { type: 'button', class: 'notes-summary__action notes-summary__action--ghost' },
      'Reopen'
    ) as HTMLButtonElement;
    reopenBtn.addEventListener('click', () => void patch('pending', 'reopened'));
    actions.appendChild(reopenBtn);
  }

  if (photoEl) {
    card.append(body, photoEl, meta, actions);
  } else {
    card.append(body, meta, actions);
  }
  return card;
}

function groupBy(notes: Note[], mode: GroupMode): Map<string, Note[]> {
  const groups = new Map<string, Note[]>();
  for (const n of notes) {
    const key =
      mode === 'section'
        ? (n.section ?? '__general__')
        : (n.path_id ?? '__no-path__');
    const arr = groups.get(key) ?? [];
    arr.push(n);
    groups.set(key, arr);
  }
  return groups;
}

function groupTitle(mode: GroupMode, key: string, count: number): { label: string; href: string | null } {
  if (mode === 'section') {
    if (key === '__general__') return { label: `General / unscoped · ${count}`, href: null };
    const meta = SECTION_LABELS[key];
    return {
      label: `${meta?.label ?? key} · ${count}`,
      href: meta ? `${meta.page}#${key}` : null,
    };
  }
  // mode === 'path'
  if (key === '__no-path__') return { label: `No path (compare-all) · ${count}`, href: null };
  return { label: `Path ${key} · ${count}`, href: null };
}

function emptyCopy(filter: FilterMode): string {
  if (filter === 'pending') return 'Inbox zero — no pending notes. Either Allison saw everything or Erin hasn\'t left new feedback yet.';
  if (filter === 'seen') return 'Nothing in the "seen" bucket. Notes you\'ve laid eyes on but haven\'t applied yet will land here.';
  if (filter === 'applied') return 'Nothing applied yet. Once you mark a note as applied, it lives here as a history of what shaped the site.';
  return 'No notes yet. Add one from any 💬 button on the site — it lands here within seconds.';
}

function renderGroups(
  notes: Note[],
  root: HTMLElement,
  countLine: HTMLElement,
  mode: GroupMode,
  filter: FilterMode,
  onChange: () => void
): void {
  root.replaceChildren();
  countLine.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'} in this view.`;
  if (notes.length === 0) {
    root.appendChild(h('div', { class: 'notes-summary__empty' }, emptyCopy(filter)));
    return;
  }

  const groups = groupBy(notes, mode);
  // Sort groups by most recent note.
  const ordered = [...groups.entries()].sort(([, a], [, b]) => {
    const aFirst = a[0];
    const bFirst = b[0];
    const aMs = aFirst ? new Date(aFirst.created_at).getTime() : 0;
    const bMs = bFirst ? new Date(bFirst.created_at).getTime() : 0;
    return bMs - aMs;
  });

  for (const [key, sectionNotes] of ordered) {
    const { label, href } = groupTitle(mode, key, sectionNotes.length);
    const link = href
      ? h('a', { class: 'notes-summary__group-link', href }, 'Jump to section ↗')
      : null;
    const group = h(
      'div',
      { class: 'notes-summary__group' },
      h(
        'h3',
        { class: 'notes-summary__group-title' },
        h('span', {}, label),
        link
      ),
      ...sectionNotes.map((n) => renderNote(n, onChange))
    );
    root.appendChild(group);
  }
}

export function renderNotesSummary(): HTMLElement {
  // --- State ---
  let allNotes: Note[] = [];
  let currentFilter: FilterMode = 'all';
  let currentGroup: GroupMode = 'section';

  // --- Filter chips with live counts ---
  const filterAllBtn = h(
    'button',
    {
      type: 'button',
      class: 'notes-summary__filter notes-summary__filter--active',
      'data-filter': 'all',
    },
    h('span', {}, 'All '),
    h('span', { class: 'notes-summary__filter-count', 'data-count': 'all' }, '0')
  ) as HTMLButtonElement;
  const filterPendingBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__filter', 'data-filter': 'pending' },
    h('span', {}, 'Pending '),
    h('span', { class: 'notes-summary__filter-count notes-summary__filter-count--hot', 'data-count': 'pending' }, '0')
  ) as HTMLButtonElement;
  const filterSeenBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__filter', 'data-filter': 'seen' },
    h('span', {}, 'Seen '),
    h('span', { class: 'notes-summary__filter-count', 'data-count': 'seen' }, '0')
  ) as HTMLButtonElement;
  const filterAppliedBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__filter', 'data-filter': 'applied' },
    h('span', {}, 'Applied '),
    h('span', { class: 'notes-summary__filter-count', 'data-count': 'applied' }, '0')
  ) as HTMLButtonElement;

  const filterBar = h(
    'div',
    { class: 'notes-summary__filterbar' },
    h('span', { class: 'notes-summary__filterbar-label' }, 'Filter:'),
    filterAllBtn,
    filterPendingBtn,
    filterSeenBtn,
    filterAppliedBtn
  );

  // --- Group toggle ---
  const groupBySectionBtn = h(
    'button',
    {
      type: 'button',
      class: 'notes-summary__group-toggle notes-summary__group-toggle--active',
      'data-group': 'section',
    },
    'By section'
  ) as HTMLButtonElement;
  const groupByPathBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__group-toggle', 'data-group': 'path' },
    'By path'
  ) as HTMLButtonElement;
  const groupBar = h(
    'div',
    { class: 'notes-summary__groupbar' },
    h('span', { class: 'notes-summary__filterbar-label' }, 'Group:'),
    groupBySectionBtn,
    groupByPathBtn
  );

  // --- Bulk-mark button ---
  const bulkBtn = h(
    'button',
    { type: 'button', class: 'notes-summary__bulk' },
    'Mark all pending → seen'
  ) as HTMLButtonElement;

  const countLine = h('p', { class: 'notes-summary__count-line' }, 'Loading…');
  const root = h('div', { class: 'notes-summary' });

  function updateFilterCounts(): void {
    const counts = {
      all: allNotes.length,
      pending: allNotes.filter((n) => n.status === 'pending').length,
      seen: allNotes.filter((n) => n.status === 'seen').length,
      applied: allNotes.filter((n) => n.status === 'applied').length,
    };
    const apply = (key: keyof typeof counts): void => {
      const el = filterBar.querySelector<HTMLElement>(`[data-count="${key}"]`);
      if (el) el.textContent = String(counts[key]);
    };
    (Object.keys(counts) as (keyof typeof counts)[]).forEach(apply);
    bulkBtn.disabled = counts.pending === 0;
    bulkBtn.textContent =
      counts.pending === 0
        ? 'Nothing pending'
        : `Mark all ${counts.pending} pending → seen`;
  }

  function applyFilter(): void {
    const filtered =
      currentFilter === 'all'
        ? allNotes
        : allNotes.filter((n) => n.status === currentFilter);
    renderGroups(filtered, root, countLine, currentGroup, currentFilter, () => {
      updateFilterCounts();
      applyFilter();
    });
    updateFilterCounts();
  }

  filterBar.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest<HTMLButtonElement>('[data-filter]');
    if (!btn) return;
    const f = btn.dataset['filter'] as FilterMode | undefined;
    if (!f) return;
    currentFilter = f;
    filterBar
      .querySelectorAll<HTMLButtonElement>('.notes-summary__filter')
      .forEach((b) => b.classList.toggle('notes-summary__filter--active', b === btn));
    applyFilter();
  });

  groupBar.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest<HTMLButtonElement>('[data-group]');
    if (!btn) return;
    const g = btn.dataset['group'] as GroupMode | undefined;
    if (!g) return;
    currentGroup = g;
    groupBar
      .querySelectorAll<HTMLButtonElement>('.notes-summary__group-toggle')
      .forEach((b) => b.classList.toggle('notes-summary__group-toggle--active', b === btn));
    applyFilter();
  });

  bulkBtn.addEventListener('click', async () => {
    bulkBtn.disabled = true;
    const originalText = bulkBtn.textContent;
    bulkBtn.textContent = 'Marking…';
    try {
      const flipped = await markAllPendingSeen();
      if (flipped > 0) {
        // Refresh state locally without a full reload.
        allNotes = allNotes.map((n) =>
          n.status === 'pending' ? { ...n, status: 'seen' as NoteStatus } : n
        );
        showToast(`Marked ${flipped} pending → seen.`);
        applyFilter();
      } else {
        showToast('Nothing pending.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Failed: ${msg}`, 4000);
      bulkBtn.textContent = originalText;
      bulkBtn.disabled = false;
    }
  });

  // --- Load + auto-flip pending → seen on first visit ---
  void (async () => {
    try {
      // Step 1: pull current state for an honest count BEFORE the flip,
      // so we can render the right "Pending" badge briefly.
      allNotes = await listNotes();
      applyFilter();

      // Step 2: on first visit this session, auto-flip pending → seen.
      // Allison opened the notes page — by definition she's seen them.
      // Suppressed on subsequent reloads in the same session (per the
      // session-storage flag) so the bulk button stays useful as a manual
      // re-flip after new notes arrive.
      let firstVisitThisSession = false;
      try {
        firstVisitThisSession = sessionStorage.getItem(FIRST_VISIT_KEY) !== '1';
        sessionStorage.setItem(FIRST_VISIT_KEY, '1');
      } catch {
        /* ignore */
      }
      const hasPending = allNotes.some((n) => n.status === 'pending');
      if (firstVisitThisSession && hasPending) {
        const flipped = await markAllPendingSeen();
        if (flipped > 0) {
          allNotes = allNotes.map((n) =>
            n.status === 'pending' ? { ...n, status: 'seen' as NoteStatus } : n
          );
          showToast(`${flipped} note${flipped === 1 ? '' : 's'} marked as seen.`);
          applyFilter();
        }
      }
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
      'Live feed of every 💬 note left anywhere on the site. Tap a section header to jump back to where the note was made. Workflow: ',
      h('strong', {}, 'pending'),
      ' (Allison hasn\'t seen it) → ',
      h('strong', {}, 'seen'),
      ' (eyes on, not addressed) → ',
      h('strong', {}, 'applied'),
      ' (changed on the site). Opening this page auto-flips pending → seen.'
    ),
    filterBar,
    groupBar,
    h('div', { class: 'notes-summary__bulk-row' }, bulkBtn),
    countLine,
    root
  );
}

/**
 * Notes UI — per-section 💬 button + global modal + read-back list.
 *
 * Why this file exists: lets Erin tap any section's 💬 to leave a note scoped
 * to that section. Notes land in Supabase `north_cascades_notes`. Allison's
 * Claude pulls them at session start.
 *
 * What's decided:
 *   - Per-section button: small inline button injected next to each section's
 *     <h2>. Tap opens a single shared modal pre-scoped to that section.
 *   - Active path awareness: at submit time, reads current `selectedPath`
 *     (A/B) so the row carries the path context.
 *   - Badge counts shown next to each section's button — ONLY pending (unseen)
 *     notes count, so the badge reflects "fresh feedback Allison hasn't read."
 *     Once Allison opens /notes.html the pending → seen flip clears badges.
 *   - Modal also shows existing notes for THIS section, scrollable, with
 *     status pills (pending / seen / applied) + "You" indicator on the
 *     author's own notes (matched against the stored author name).
 *   - Author name persisted in localStorage so they don't retype each time.
 *   - Post-submit toast: "Saved — Allison will see this next time she opens
 *     the site." Wave 3 polish (May 17, 2026).
 *
 * What's built: attachNotesButton(sectionEl), initNotesModal().
 * What's next: optional "addressed" toggle in admin view (Allison-side).
 *
 * Links: see `src/data/notes.ts` for the Supabase client.
 */

import {
  insertNote,
  listNotesBySection,
  countsBySection,
  uploadNotePhoto,
  type Note,
  type PathLetter,
} from '../data/notes';
import { getSelectedPath } from '../state/path';
import { h } from '../dom';
import { openLightbox } from './lightbox';

const AUTHOR_KEY = 'ncades2026.noteAuthor';

let modalEl: HTMLDivElement | null = null;
let currentSection: string | null = null;
// Object-URL for the in-modal preview thumbnail. Revoked on clear/submit/close
// to avoid blob-URL leaks across multiple opens.
let currentPreviewUrl: string | null = null;

function readStoredAuthor(): string {
  try {
    return localStorage.getItem(AUTHOR_KEY) ?? '';
  } catch {
    return '';
  }
}

function writeStoredAuthor(name: string): void {
  try {
    localStorage.setItem(AUTHOR_KEY, name);
  } catch {
    /* ignore */
  }
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeText(s: string): string {
  // Used only via textContent assignment indirectly; we still keep it for clarity in HTML construction
  return s;
}

function showToast(text: string, ms = 3000): void {
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

function buildModal(): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.className = 'notes-modal-backdrop';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.innerHTML = `
    <div class="notes-modal">
      <div class="notes-modal__head">
        <h3 class="notes-modal__title">Leave a note</h3>
        <div class="notes-modal__scope" data-bind="scope-label">whole trip</div>
      </div>
      <p class="notes-modal__sub">
        Type anything — agreement, pushback, "I don't want to drive that far,"
        "this lodging looks better," dealbreakers. Allison's Claude reads these
        and iterates the site.
      </p>
      <label class="notes-modal__field">
        <span>Who's this from?</span>
        <select id="notes-author">
          <option value="Erin">Erin</option>
          <option value="Allison">Allison</option>
        </select>
      </label>
      <label class="notes-modal__field">
        <span>Note</span>
        <textarea id="notes-text" placeholder="Say what you're thinking…"></textarea>
      </label>
      <div class="modal-row note-photo-row">
        <label for="note-photo" class="note-photo-label">
          <span>📷 Attach photo (optional)</span>
          <span class="note-photo-hint">screenshot something to show, or a photo of what's wrong</span>
        </label>
        <input type="file" id="note-photo" accept="image/*" />
        <div id="note-photo-preview" class="note-photo-preview" hidden>
          <img id="note-photo-preview-img" alt="preview" />
          <button type="button" id="note-photo-clear" class="note-photo-clear" aria-label="Remove photo">✕</button>
        </div>
      </div>
      <div class="notes-modal__path" data-bind="path-line"></div>
      <div class="notes-modal__actions">
        <button class="notes-btn" type="button" data-action="cancel">Cancel</button>
        <button class="notes-btn notes-btn--primary" type="button" data-action="submit">Send</button>
      </div>
      <div class="notes-modal__existing">
        <div class="notes-modal__existing-title" data-bind="existing-title">Previous notes</div>
        <div class="notes-modal__list" data-bind="existing-list">
          <p class="notes-modal__empty">Loading…</p>
        </div>
      </div>
    </div>
  `;
  return wrap;
}

function statusPill(status: Note['status']): HTMLElement {
  const label =
    status === 'applied'
      ? '✓ applied'
      : status === 'seen'
        ? '· seen'
        : '· new';
  return h('span', { class: `notes-item__status notes-item__status--${status}` }, label);
}

function renderExisting(listEl: HTMLElement, notes: Note[]): void {
  listEl.replaceChildren();
  if (notes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'notes-modal__empty';
    empty.textContent = 'No notes yet for this section.';
    listEl.appendChild(empty);
    return;
  }
  const storedAuthor = readStoredAuthor().trim().toLowerCase();
  // Notes already come back newest-first from the API (order=created_at.desc).
  for (const n of notes) {
    const item = h('div', { class: `notes-item notes-item--${n.status}` });
    const body = h('div', { class: 'notes-item__body' }, n.note);
    const authorMatchesStored =
      storedAuthor.length > 0 && n.author.trim().toLowerCase() === storedAuthor;
    const meta = h(
      'div',
      { class: 'notes-item__meta' },
      h('span', {}, `👤 ${escapeText(n.author)}`),
      authorMatchesStored ? h('span', { class: 'notes-item__you' }, 'You') : null,
      h('span', {}, `🕒 ${formatRelative(n.created_at)}`),
      n.path_id ? h('span', {}, `🥾 Path ${n.path_id}`) : null,
      statusPill(n.status)
    );
    item.append(body);
    if (n.photo_url) {
      const photoWrap = h('div', { class: 'notes-item__photo-wrap' });
      const photo = h('img', {
        src: n.photo_url,
        alt: 'note photo',
        class: 'notes-item__photo',
        loading: 'lazy',
      }) as HTMLImageElement;
      const url = n.photo_url;
      photo.addEventListener('click', () => openLightbox(url));
      photoWrap.appendChild(photo);
      item.append(photoWrap);
    }
    item.append(meta);
    listEl.appendChild(item);
  }
}

async function loadExistingForSection(section: string): Promise<void> {
  if (!modalEl) return;
  const listEl = modalEl.querySelector<HTMLDivElement>('[data-bind="existing-list"]');
  if (!listEl) return;
  listEl.innerHTML = '<p class="notes-modal__empty">Loading…</p>';
  try {
    const notes = await listNotesBySection(section);
    renderExisting(listEl, notes);
  } catch {
    listEl.innerHTML = '<p class="notes-modal__empty">Could not load existing notes.</p>';
  }
}

function openModal(section: string, sectionLabel: string): void {
  if (!modalEl) return;
  currentSection = section;

  const scopeEl = modalEl.querySelector<HTMLElement>('[data-bind="scope-label"]');
  if (scopeEl) scopeEl.textContent = `on: ${sectionLabel}`;

  const pathLine = modalEl.querySelector<HTMLElement>('[data-bind="path-line"]');
  const path = getSelectedPath();
  if (pathLine) {
    pathLine.textContent = path
      ? `Active path: ${path} — this note will be tagged with it.`
      : 'No path selected — note is general (Compare-all mode).';
  }

  const authorSel = modalEl.querySelector<HTMLSelectElement>('#notes-author');
  if (authorSel) {
    const stored = readStoredAuthor();
    if (stored === 'Erin' || stored === 'Allison') authorSel.value = stored;
  }

  const text = modalEl.querySelector<HTMLTextAreaElement>('#notes-text');
  if (text) text.value = '';

  // Reset photo input + preview every time the modal opens — stale previews
  // from a previous session would be confusing.
  clearPhotoPreview();

  modalEl.classList.add('open');
  void loadExistingForSection(section);

  // Focus text after a tick to ensure modal is visible.
  setTimeout(() => text?.focus(), 50);
}

function clearPhotoPreview(): void {
  if (!modalEl) return;
  const photoInput = modalEl.querySelector<HTMLInputElement>('#note-photo');
  const photoPreview = modalEl.querySelector<HTMLDivElement>('#note-photo-preview');
  const photoPreviewImg = modalEl.querySelector<HTMLImageElement>('#note-photo-preview-img');
  if (photoInput) photoInput.value = '';
  if (photoPreview) photoPreview.hidden = true;
  if (photoPreviewImg) photoPreviewImg.removeAttribute('src');
  if (currentPreviewUrl) {
    URL.revokeObjectURL(currentPreviewUrl);
    currentPreviewUrl = null;
  }
}

function closeModal(): void {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  clearPhotoPreview();
}

async function submitNote(): Promise<void> {
  if (!modalEl || !currentSection) return;
  const authorEl = modalEl.querySelector<HTMLSelectElement>('#notes-author');
  const textEl = modalEl.querySelector<HTMLTextAreaElement>('#notes-text');
  const submitBtn = modalEl.querySelector<HTMLButtonElement>('[data-action="submit"]');
  const photoInput = modalEl.querySelector<HTMLInputElement>('#note-photo');
  if (!authorEl || !textEl || !submitBtn) return;

  const author = authorEl.value.trim() || 'anonymous';
  const text = textEl.value.trim();
  if (!text) {
    textEl.focus();
    return;
  }

  writeStoredAuthor(author);
  const path = getSelectedPath() as PathLetter | null;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  try {
    // If a photo is attached, upload it FIRST. Fail-loud: if upload fails,
    // we don't silently submit text-only — surface the error so the user
    // can retry or remove the photo. Same UX pattern as Austria.
    let photoUrl: string | null = null;
    const file = photoInput?.files?.[0] ?? null;
    if (file) {
      submitBtn.textContent = 'Uploading photo…';
      try {
        photoUrl = await uploadNotePhoto(file);
      } catch (uploadErr) {
        const msg = uploadErr instanceof Error ? uploadErr.message : 'Unknown error';
        showToast(`Photo upload failed: ${msg}. Note not sent — try again or remove the photo.`, 5000);
        return;
      }
      submitBtn.textContent = 'Sending…';
    }
    await insertNote({
      author,
      section: currentSection,
      path_id: path,
      note: text,
      photo_url: photoUrl,
    });
    showToast('Saved — Allison will see this next time she opens the site.');
    textEl.value = '';
    clearPhotoPreview();
    // Refresh existing list + badge counts.
    await loadExistingForSection(currentSection);
    await refreshBadges();
    closeModal();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    showToast(`Failed: ${msg}`, 4000);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send';
  }
}

/**
 * Public wrapper for opening the notes modal scoped to an arbitrary section.
 * Used by the global FAB (`global-fab.ts`) to open the modal pre-scoped to
 * `whole-trip` (the FAB isn't attached to a section header). Idempotently
 * ensures the modal DOM exists, then delegates to the internal `openModal`.
 */
export function openGlobalScopeModal(section: string, sectionLabel: string): void {
  initNotesModal();
  openModal(section, sectionLabel);
}

export function initNotesModal(): void {
  if (modalEl) return;
  modalEl = buildModal();
  document.body.appendChild(modalEl);

  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });
  modalEl
    .querySelector<HTMLButtonElement>('[data-action="cancel"]')
    ?.addEventListener('click', closeModal);
  modalEl
    .querySelector<HTMLButtonElement>('[data-action="submit"]')
    ?.addEventListener('click', () => {
      void submitNote();
    });

  // Photo input — preview the selected image inline. Object URLs revoked
  // on clear/close/submit to avoid leaks across opens.
  const photoInput = modalEl.querySelector<HTMLInputElement>('#note-photo');
  const photoPreview = modalEl.querySelector<HTMLDivElement>('#note-photo-preview');
  const photoPreviewImg = modalEl.querySelector<HTMLImageElement>('#note-photo-preview-img');
  const photoClearBtn = modalEl.querySelector<HTMLButtonElement>('#note-photo-clear');
  if (photoInput && photoPreview && photoPreviewImg && photoClearBtn) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files?.[0] ?? null;
      if (!file) {
        clearPhotoPreview();
        return;
      }
      if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
      currentPreviewUrl = URL.createObjectURL(file);
      photoPreviewImg.src = currentPreviewUrl;
      photoPreview.hidden = false;
    });
    photoClearBtn.addEventListener('click', () => clearPhotoPreview());
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl?.classList.contains('open')) closeModal();
  });
}

/**
 * Inject a 💬 note button into a section header. Call AFTER the section
 * element has been mounted to the DOM.
 */
export function attachNotesButton(sectionEl: HTMLElement): void {
  const sectionId = sectionEl.id;
  if (!sectionId) return;
  const title = sectionEl.querySelector<HTMLHeadingElement>('h2.section__title, h2');
  if (!title) return;
  const sectionLabel = title.textContent?.trim() ?? sectionId;

  // Avoid double-attach (HMR / repeat).
  if (title.querySelector('.notes-trigger')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'notes-trigger';
  btn.setAttribute('aria-label', `Note about "${sectionLabel}" — tell Allison what to change`);
  btn.setAttribute('title', `Tell Allison what to change about "${sectionLabel}"`);
  btn.dataset.section = sectionId;
  btn.innerHTML = `<span aria-hidden="true">💬</span><span class="notes-trigger__count" data-bind="count" hidden>0</span>`;
  btn.addEventListener('click', () => {
    initNotesModal();
    openModal(sectionId, sectionLabel);
  });
  title.appendChild(btn);
}

/**
 * Refresh count badges across all section triggers in one round-trip.
 * Counts ONLY pending notes — once Allison opens /notes.html, those flip to
 * `seen` and the badge clears.
 */
export async function refreshBadges(): Promise<void> {
  try {
    const counts = await countsBySection();
    const triggers = document.querySelectorAll<HTMLButtonElement>('.notes-trigger');
    triggers.forEach((trig) => {
      const section = trig.dataset.section;
      if (!section) return;
      const count = counts[section] ?? 0;
      const countEl = trig.querySelector<HTMLSpanElement>('[data-bind="count"]');
      if (!countEl) return;
      if (count > 0) {
        countEl.textContent = String(count);
        countEl.hidden = false;
        trig.classList.add('has-notes');
      } else {
        countEl.hidden = true;
        trig.classList.remove('has-notes');
      }
    });
  } catch {
    // Silent — badges are non-critical.
  }
}

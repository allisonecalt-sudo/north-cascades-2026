/**
 * Lightweight image lightbox — full-screen view for note photos.
 *
 * Why this file exists: notes can now carry photos (Wave 4, May 17 2026).
 * Tapping a thumbnail in the modal OR on /notes.html should open the image
 * full-screen instead of leaving the page. Mirrors the Austria pattern.
 *
 * What's decided:
 *   - Single shared backdrop, recreated per open (cheap, no leaks).
 *   - Click backdrop or ✕ to close. Esc also closes.
 *   - z-index above the notes modal so it works from inside it.
 *
 * What's built: openLightbox(src).
 * Links: see `data/notes.ts` for photo upload + storage URL pattern.
 */

let activeBackdrop: HTMLDivElement | null = null;

function close(): void {
  if (!activeBackdrop) return;
  activeBackdrop.remove();
  activeBackdrop = null;
  document.removeEventListener('keydown', onKey);
}

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') close();
}

export function openLightbox(src: string): void {
  // Close any existing one first (rare, but defensive).
  close();

  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', 'Photo preview');

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Note photo';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    close();
  });

  backdrop.append(img, closeBtn);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target === img) close();
  });

  document.body.appendChild(backdrop);
  activeBackdrop = backdrop;
  document.addEventListener('keydown', onKey);
}

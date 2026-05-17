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

/**
 * Open a YouTube video in the same lightbox shell.
 *
 * Per Allison May 17, 2026: videos integrated as a small ▶ pill in the
 * at-a-glance pill row that opens a full-screen lightbox on click. Pill
 * stays out of the carousel, photos stay primary, video on-demand.
 *
 * Uses the privacy-friendly youtube-nocookie.com host. No autoplay flag —
 * the user has explicitly opted in by tapping the pill, but autoplay still
 * surprises if they had the volume up. They tap play once more inside the
 * lightbox to actually start.
 */
export function openVideoLightbox(opts: { videoId: string; title: string; creator: string }): void {
  close();

  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop lightbox-backdrop--video';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', `Video: ${opts.title}`);

  const frame = document.createElement('div');
  frame.className = 'lightbox-video-frame';

  const iframe = document.createElement('iframe');
  iframe.className = 'lightbox-video-iframe';
  iframe.src = `https://www.youtube-nocookie.com/embed/${opts.videoId}?rel=0&modestbranding=1`;
  iframe.title = opts.title;
  iframe.setAttribute(
    'allow',
    'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  );
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.setAttribute('loading', 'lazy');

  const caption = document.createElement('p');
  caption.className = 'lightbox-video-caption';
  caption.textContent = `Video by ${opts.creator} on YouTube — not affiliated with this site.`;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    close();
  });

  frame.append(iframe);
  backdrop.append(frame, caption, closeBtn);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.body.appendChild(backdrop);
  activeBackdrop = backdrop;
  document.addEventListener('keydown', onKey);
}

/**
 * video-embed.ts — shared YouTube click-to-load embed.
 *
 * Allison brief (May 17, 2026):
 *   *"also embed videos where helpful simple videos."*
 *
 * Why click-to-load (not lazy <iframe loading="lazy">):
 *   1. Loading 10-15 raw iframes on a long page = 10-15 YouTube player JS
 *      bundles + 10-15 tracker hits even before the user scrolls past.
 *      `loading="lazy"` defers the network fetch but the carousels above the
 *      fold can still pull a couple of players in. Click-to-load is the
 *      industry-standard "facade" pattern (used by web.dev's lite-youtube,
 *      Smashing Magazine, and countless privacy-first sites).
 *   2. Zero JS bundle hit — we render a static <button> with a poster image
 *      and only swap in the <iframe> when the reader actually wants to watch.
 *   3. Bonus: respects the privacy-first ethos (no YouTube cookie/tracker
 *      until the user opts in by clicking play).
 *
 * NEVER autoplay (per brief). All embeds use `youtube-nocookie.com`.
 *
 * Poster: YouTube serves canonical thumbnails at
 *   https://i.ytimg.com/vi/{id}/hqdefault.jpg
 * which always exists for public videos. We use the no-cookie thumbnail host
 * to keep the privacy story consistent.
 */
import { h } from '../dom';

export interface VideoEmbedOptions {
  /**
   * YouTube video ID (the 11-char string after `v=`). Just the ID — we build
   * both the poster URL and the no-cookie embed URL from it.
   */
  videoId: string;
  /** Title shown on the play button + iframe `title` attr for screen readers. */
  title: string;
  /** Channel / uploader name for the disclaimer ("Video by X on YouTube"). */
  creator: string;
  /** Optional className appended to the wrapper for per-page tweaks. */
  className?: string;
}

const STYLE_ID = 'video-embed-styles';

/** Mount the scoped styles once per page-load (no CSS-file churn). */
function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = VIDEO_EMBED_CSS;
  document.head.appendChild(style);
}

/**
 * Build the click-to-load video embed. The placeholder is a real `<button>`
 * (a11y-friendly — keyboard activatable, announces "play video about X")
 * with a poster image. Click swaps the button for an <iframe>.
 */
export function renderVideoEmbed(opts: VideoEmbedOptions): HTMLElement {
  ensureStyles();

  const { videoId, title, creator, className } = opts;
  const wrap = h('figure', {
    class: `video-embed${className ? ' ' + className : ''}`,
  });

  // 16:9 ratio frame (padding-top hack — pre-aspect-ratio CSS for older browsers).
  const frame = h('div', { class: 'video-embed__frame' });

  const poster = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const button = h(
    'button',
    {
      type: 'button',
      class: 'video-embed__play',
      'aria-label': `Play video: ${title}`,
      'data-video-id': videoId,
      'data-video-title': title,
    },
    h('img', {
      class: 'video-embed__poster',
      src: poster,
      alt: `Thumbnail for video: ${title}`,
      loading: 'lazy',
      decoding: 'async',
      width: 480,
      height: 360,
    }),
    h(
      'span',
      { class: 'video-embed__play-icon', 'aria-hidden': 'true' },
      // Inline SVG play triangle — no asset request, scales cleanly.
      // Background circle + white triangle, YouTube-style.
      'html' as never
    ),
    h('span', { class: 'video-embed__play-label' }, '▶ Play video')
  );

  // Replace the "html" placeholder above with an actual SVG play icon.
  const icon = button.querySelector('.video-embed__play-icon');
  if (icon) {
    icon.innerHTML =
      '<svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true" focusable="false">' +
      '<path d="M66.52 7.74a8.21 8.21 0 0 0-5.78-5.81C55.66.5 34 .5 34 .5s-21.66 0-26.74 1.43a8.21 8.21 0 0 0-5.78 5.81A85.6 85.6 0 0 0 0 24a85.6 85.6 0 0 0 1.48 16.26 8.21 8.21 0 0 0 5.78 5.81C12.34 47.5 34 47.5 34 47.5s21.66 0 26.74-1.43a8.21 8.21 0 0 0 5.78-5.81A85.6 85.6 0 0 0 68 24a85.6 85.6 0 0 0-1.48-16.26z" fill="#c4393a"/>' +
      '<path d="M45 24 27 14v20z" fill="#fff"/>' +
      '</svg>';
  }

  button.addEventListener('click', () => {
    // Build the no-cookie embed URL. No autoplay flag — per brief.
    // `rel=0` reduces YouTube's suggested-video sprawl when the video ends.
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
    const iframe = h('iframe', {
      class: 'video-embed__iframe',
      src: embedUrl,
      title,
      // Allow common things YouTube wants without autoplay.
      allow:
        'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      // sandbox kept off — YouTube embeds require their own scripts; the
      // no-cookie domain already gives us the tracker-free posture.
      referrerpolicy: 'no-referrer-when-downgrade',
      allowfullscreen: true,
      loading: 'lazy',
    });
    button.replaceWith(iframe);
  });

  frame.appendChild(button);
  wrap.appendChild(frame);

  // Honest disclaimer line — uploader credit + no-affiliation note.
  const caption = h(
    'figcaption',
    { class: 'video-embed__caption' },
    `Video by ${creator} on YouTube — not affiliated with this site.`
  );
  wrap.appendChild(caption);

  return wrap;
}

const VIDEO_EMBED_CSS = `
.video-embed {
  margin: var(--sp-3, 12px) 0;
  padding: 0;
}
.video-embed__frame {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  background: #1a1a1a;
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
}
.video-embed__play,
.video-embed__iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.video-embed__play {
  padding: 0;
  margin: 0;
  background: #000;
  cursor: pointer;
  display: block;
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
}
.video-embed__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.92;
  transition: opacity 150ms ease;
}
.video-embed__play:hover .video-embed__poster,
.video-embed__play:focus-visible .video-embed__poster {
  opacity: 1;
}
.video-embed__play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  pointer-events: none;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
  transition: transform 150ms ease;
}
.video-embed__play:hover .video-embed__play-icon,
.video-embed__play:focus-visible .video-embed__play-icon {
  transform: translate(-50%, -50%) scale(1.08);
}
.video-embed__play-label {
  position: absolute;
  bottom: 0.6rem;
  left: 0.7rem;
  padding: 0.25rem 0.55rem;
  background: rgba(0,0,0,0.65);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 999px;
  pointer-events: none;
}
.video-embed__play:focus-visible {
  outline: 3px solid var(--c-glacier-500, #4a86a5);
  outline-offset: 2px;
}
.video-embed__caption {
  margin: var(--sp-1, 6px) 0 0;
  font-size: 0.78rem;
  color: var(--c-ink-soft, #514a3b);
  font-style: italic;
  line-height: 1.4;
}
`;

/**
 * photo-carousel.ts — generic Booking.com-style photo carousel.
 *
 * Lifted from the lodging-card carousel and made reusable so hikes /
 * sunsets / Seattle stops / driving viewpoints / travel routes / pre-trip
 * gear / details all get the same swipe-with-dots-and-counter affordance.
 *
 * Per Allison's brief (May 17, 2026):
 *   *"Alright let's get more epicture carsousels of everything ... airbnb-tier
 *   presentation across hikes, activities, viewpoints, Seattle stops, sunsets,
 *   travel, costs cards."*
 *
 * Why a separate module:
 *   - Lodging's carousel was tightly coupled to the `Lodging` type. Generic
 *     callers pass a plain Photo[] and an aria label.
 *   - One CSS class system (`.lcarousel__*`) means one place to fix mobile
 *     bugs + one place to evolve the visual treatment.
 *   - Carries the Unsplash "Representative photo" warning forward so any new
 *     surface using fallback stock gets the same fail-loud honesty.
 */
import { h } from '../dom';

export interface CarouselPhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export interface CarouselOptions {
  ariaLabel: string;
  /** Optional class added to the wrapping <figure>. */
  className?: string;
}

/**
 * Render a horizontal-snap photo carousel with dot indicators + a count pill.
 * Accepts 1+ photos. If only one photo is provided, the dots + counter are
 * suppressed (it's effectively just an image).
 */
export function renderPhotoCarousel(
  photos: readonly CarouselPhoto[],
  opts: CarouselOptions
): HTMLElement {
  const figure = h('figure', {
    class: `card__figure card__figure--carousel${opts.className ? ' ' + opts.className : ''}`,
  });
  const track = h('div', {
    class: 'lcarousel__track',
    role: 'group',
    'aria-label': `${opts.ariaLabel} (${photos.length} photo${photos.length === 1 ? '' : 's'})`,
    tabindex: '0',
  });

  photos.forEach((p, idx) => {
    const isRepresentative = p.credit?.toLowerCase().includes('unsplash') ?? false;
    const img = h('img', {
      class: 'lcarousel__img',
      src: p.src,
      alt: isRepresentative ? `Representative photo: ${p.alt}` : p.alt,
      width: p.width,
      height: p.height,
      loading: idx === 0 ? 'eager' : 'lazy',
      decoding: 'async',
    });
    const slide = h('div', { class: 'lcarousel__slide', 'data-slide': idx }, img);
    track.appendChild(slide);
  });

  figure.appendChild(track);

  if (photos.length > 1) {
    const dots = h('div', { class: 'lcarousel__dots', 'aria-hidden': 'true' });
    photos.forEach((_, idx) => {
      const dot = h('button', {
        type: 'button',
        class: idx === 0 ? 'lcarousel__dot lcarousel__dot--active' : 'lcarousel__dot',
        'aria-label': `Go to photo ${idx + 1}`,
        'data-slide': idx,
      });
      dots.appendChild(dot);
    });
    figure.appendChild(dots);

    const counter = h(
      'span',
      { class: 'lcarousel__counter' },
      `1 / ${photos.length}`
    );
    figure.appendChild(counter);

    // Wire interactions.
    const slides = track.querySelectorAll<HTMLElement>('.lcarousel__slide');
    const dotBtns = dots.querySelectorAll<HTMLButtonElement>('.lcarousel__dot');
    dotBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset['slide'] ?? '0', 10);
        const target = slides[idx];
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const target = entry.target as HTMLElement;
            const idx = parseInt(target.dataset['slide'] ?? '0', 10);
            dotBtns.forEach((d, i) => {
              d.classList.toggle('lcarousel__dot--active', i === idx);
            });
            counter.textContent = `${idx + 1} / ${photos.length}`;
          }
        }
      },
      { root: track, threshold: [0.6] }
    );
    slides.forEach((s) => observer.observe(s));
  }

  // Photo credit (first slide). Booking.com-style understated; bottom of figure.
  const first = photos[0];
  if (first && first.credit) {
    const credit = first.creditUrl
      ? h(
          'figcaption',
          { class: 'card__credit' },
          h('a', { href: first.creditUrl, rel: 'noopener', target: '_blank' }, first.credit)
        )
      : h('figcaption', { class: 'card__credit' }, first.credit);
    figure.appendChild(credit);
  }

  // Unsplash fail-loud — if the first slide is a stock photo, warn.
  const firstIsRep = first?.credit?.toLowerCase().includes('unsplash') ?? false;
  if (firstIsRep) {
    figure.appendChild(
      h(
        'p',
        { class: 'card__photo-warning' },
        'Photos are representative — see source link for the real place.'
      )
    );
  }

  return figure;
}

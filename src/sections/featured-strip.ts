/**
 * featured-strip.ts — landing featured-photo strip (Wave 4, May 17, 2026).
 *
 * What this is: a 2-card horizontal strip below the fold on home.html that
 * sells the TWO PATHS visually before the reader has to read prose. Each
 * card is a hero shot of that path's signature moment + path letter + 2-line
 * pitch + jump-to-path link.
 *
 * Why this exists: per Allison's brief — "carousels everywhere". The home
 * page already has the cinematic image hero, but post-hero, the path picker
 * is text-dense. A featured strip with real summer-verified photos lets the
 * reader's eye anchor each path to a real place before clicking in.
 *
 * Brand-consistent with the rest of the site: glacial palette, no padding,
 * uses the same `.card-grid` minmax fix so mobile renders cleanly.
 *
 * 2026-05-17 home rebuild: each card now surfaces "what's in this path"
 * — the data-file count of lodging + hike options scoped to that path. Helps
 * the reader feel concrete weight ("Path B = 9 lodging options + 5 hikes")
 * before clicking, and shows a "✓ N shortlisted" badge when this browser has
 * picks for the path's lodging set.
 *
 * 2026-05-19: Path C removed entirely per Allison's call.
 */
import { h, section } from '../dom';
import { TRIP_PATHS } from '../data/paths';
import { SHORTLIST_KEY } from './lodging/shortlist';

interface FeaturedCard {
  pathLetter: 'A' | 'B';
  pathLabel: string;
  imgSrc: string;
  imgAlt: string;
  imgCredit: string;
  imgCreditUrl: string;
  pitch: string;
  jumpHref: string;
}

const FEATURED: readonly FeaturedCard[] = [
  {
    pathLetter: 'A',
    pathLabel: 'Path A · West-side base',
    imgSrc: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cascade_Pass_in_WA.jpg?width=1280',
    imgAlt: 'Cascade Pass alpine basin in summer — the postcard view of the west side.',
    imgCredit: 'Photo: Wikimedia · CC',
    imgCreditUrl: 'https://commons.wikimedia.org/wiki/File:Cascade_Pass_in_WA.jpg',
    pitch: 'Single Marblemount base · Cascade Pass + Sahale Arm · Diablo Lake · Park Butte add-on. Cleanest if WA-20 stays closed mid-corridor.',
    jumpHref: '#paths',
  },
  {
    pathLetter: 'B',
    pathLabel: 'Path B · Open-jaw west→east',
    imgSrc: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_(Washington_State).jpg?width=1280',
    imgAlt: 'Diablo Lake turquoise water from the WA-20 overlook — Path B drive-day stop.',
    imgCredit: 'Photo: Wikimedia · CC',
    imgCreditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_(Washington_State).jpg',
    pitch: '2 nights west + 2 nights east · Cascade Pass + Maple Pass · Diablo Lake drive day · Washington Pass alpenglow. The classic if WA-20 reopens.',
    jumpHref: '#paths',
  },
];

function readLodgingPicks(): Set<string> {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((x): x is string => typeof x === 'string'));
    }
  } catch {
    // ignore
  }
  return new Set();
}

interface PathScope {
  lodgingCount: number;
  hikeCount: number;
  picked: number;
}

function scopeForPath(letter: 'A' | 'B', picks: Set<string>): PathScope {
  const path = TRIP_PATHS.find((p) => p.id === letter);
  if (!path) return { lodgingCount: 0, hikeCount: 0, picked: 0 };
  const picked = path.lodgingIds.filter((id) => picks.has(id)).length;
  return {
    lodgingCount: path.lodgingIds.length,
    hikeCount: path.hikeIds.length,
    picked,
  };
}

function renderFeaturedCard(card: FeaturedCard): HTMLElement {
  const picks = readLodgingPicks();
  const scope = scopeForPath(card.pathLetter, picks);
  return h(
    'article',
    { class: `card featured-strip__card featured-strip__card--${card.pathLetter}` },
    h(
      'figure',
      { class: 'featured-strip__figure' },
      h('img', {
        class: 'featured-strip__img',
        src: card.imgSrc,
        alt: card.imgAlt,
        loading: 'lazy',
        decoding: 'async',
        width: 1280,
        height: 853,
      }),
      h(
        'figcaption',
        { class: 'card__credit' },
        h('a', { href: card.imgCreditUrl, rel: 'noopener', target: '_blank' }, card.imgCredit)
      )
    ),
    h(
      'header',
      { class: 'card__header' },
      h(
        'div',
        {},
        h('span', { class: 'featured-strip__eyebrow' }, card.pathLabel),
        h(
          'h3',
          { class: 'card__title' },
          `Path ${card.pathLetter}`
        )
      )
    ),
    h(
      'p',
      { class: 'featured-strip__scope' },
      h(
        'span',
        { class: 'featured-strip__scope-num' },
        `${scope.lodgingCount} lodging · ${scope.hikeCount} hikes`
      ),
      scope.picked > 0
        ? h(
            'span',
            { class: 'featured-strip__scope-picked' },
            `✓ ${scope.picked} shortlisted`
          )
        : null
    ),
    h('p', { class: 'card__note' }, card.pitch),
    h(
      'p',
      { class: 'card__cta' },
      h(
        'a',
        { class: 'card__cta-link', href: card.jumpHref },
        `See Path ${card.pathLetter} details →`
      )
    )
  );
}

export function renderFeaturedStrip(): HTMLElement {
  return section(
    'featured-strip',
    'Two shapes for the same 5 days · pick one or just browse',
    h(
      'p',
      { class: 'section__lede' },
      'Real photos of each path’s signature view. Tap any card to see lodging, hikes, and the day-by-day shape for that path.'
    ),
    h(
      'div',
      { class: 'card-grid card-grid--featured' },
      ...FEATURED.map(renderFeaturedCard)
    )
  );
}

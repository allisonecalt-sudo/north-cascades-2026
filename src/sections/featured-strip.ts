/**
 * featured-strip.ts — landing featured-photo strip (Wave 4, May 17, 2026).
 *
 * What this is: a 3-card horizontal strip below the fold on home.html that
 * sells the THREE PATHS visually before the reader has to read prose. Each
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
 */
import { h, section } from '../dom';

interface FeaturedCard {
  pathLetter: 'A' | 'B' | 'C';
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
  {
    pathLetter: 'C',
    pathLabel: 'Path C · East-heavy',
    imgSrc: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maple_Pass_at_North_Cascades_in_WA.jpg?width=1280',
    imgAlt: 'Maple Pass alpine ridge in summer — Path C east-side signature hike.',
    imgCredit: 'Photo: Wikimedia · CC',
    imgCreditUrl: 'https://commons.wikimedia.org/wiki/File:Maple_Pass_at_North_Cascades_in_WA.jpg',
    pitch: '1 night west + 3 nights east · Maple Pass · Blue Lake · Patterson Lake · Methow Valley sunsets. Most days based out of Winthrop.',
    jumpHref: '#paths',
  },
];

function renderFeaturedCard(card: FeaturedCard): HTMLElement {
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
    'Three paths · pick by what the trip should feel like',
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

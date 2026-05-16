/**
 * Lodging — Terra Nova-tier cabins lead, splurge + basic collapsed below.
 *
 * When a path is selected, lodging cards NOT in that path's recommended ids
 * fade (class `lodging-card--off-path`) and a path notice shows the path's
 * lodging shape at the top of the section. Non-path-matching cards collapse
 * into a "Other options on this corridor" disclosure.
 */

import {
  EAST_LODGING,
  KITCHEN_LABELS,
  WEST_LODGING,
  type KitchenLevel,
  type Lodging,
  type LodgingTier,
} from '../data/lodging';
import { getPathById } from '../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { badge, h, section } from '../dom';

function renderPhoto(lodging: Lodging): HTMLElement {
  const { photo } = lodging;
  const isRepresentative = photo.credit?.toLowerCase().includes('unsplash') ?? false;
  const img = h('img', {
    class: 'card__img',
    src: photo.src,
    alt: isRepresentative
      ? `Representative photo (not actual property): ${photo.alt}`
      : photo.alt,
    width: photo.width,
    height: photo.height,
    loading: 'lazy',
    decoding: 'async',
  });
  const figure = h('figure', { class: 'card__figure' }, img);
  if (isRepresentative) {
    figure.append(
      h(
        'p',
        { class: 'card__photo-warning' },
        'Representative photo — not the actual property. See booking link for real photos.'
      )
    );
  }
  if (photo.credit) {
    const credit = photo.creditUrl
      ? h(
          'figcaption',
          { class: 'card__credit' },
          h('a', { href: photo.creditUrl, rel: 'noopener', target: '_blank' }, photo.credit)
        )
      : h('figcaption', { class: 'card__credit' }, photo.credit);
    figure.append(credit);
  }
  return figure;
}

function kitchenBadgeKind(level: KitchenLevel): 'good' | 'info' | 'warn' {
  if (level === 'full') return 'good';
  if (level === 'kitchenette') return 'info';
  return 'warn';
}

function renderLodgingCard(lodging: Lodging, inPath: boolean): HTMLElement {
  return h(
    'article',
    {
      class: `card lodging-card lodging-card--${lodging.tier}${inPath ? ' lodging-card--in-path' : ''}`,
      'data-vibe': lodging.vibe,
      'data-lodging-id': lodging.id,
    },
    renderPhoto(lodging),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, lodging.name),
      h(
        'div',
        { class: 'card__badges' },
        inPath ? badge('In this path', 'good') : null,
        badge(KITCHEN_LABELS[lodging.kitchen], kitchenBadgeKind(lodging.kitchen))
      )
    ),
    h('p', { class: 'card__address' }, lodging.address),
    lodging.phone ? h('p', { class: 'card__phone' }, lodging.phone) : null,
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Type'),
      h('dd', {}, lodging.type),
      h('dt', {}, '$/night'),
      h('dd', {}, lodging.pricePerNight),
      h('dt', {}, 'Location'),
      h('dd', {}, lodging.distance)
    ),
    h('p', { class: 'card__note' }, lodging.notes),
    lodging.bookingUrl
      ? h(
          'p',
          { class: 'card__cta' },
          h(
            'a',
            { class: 'card__cta-link', href: lodging.bookingUrl, rel: 'noopener', target: '_blank' },
            'Booking link'
          )
        )
      : null,
    lodging.bookingHint ? h('p', { class: 'card__hint' }, lodging.bookingHint) : null
  );
}

function byTier(lodgings: Lodging[], tier: LodgingTier): Lodging[] {
  return lodgings.filter((l) => l.tier === tier);
}

function renderPanel(
  id: string,
  title: string,
  lodgings: Lodging[],
  pathLodgingIds: Set<string> | null
): HTMLElement {
  // If a path is selected, split fits-brief into in-path vs off-path.
  const fitsBrief = byTier(lodgings, 'fits-brief');
  const splurge = byTier(lodgings, 'splurge');
  const basic = byTier(lodgings, 'budget-or-basic');
  const notes = byTier(lodgings, 'note');

  const inPath = (id: string) => (pathLodgingIds ? pathLodgingIds.has(id) : false);
  const visibleFits = pathLodgingIds
    ? fitsBrief.filter((l) => inPath(l.id))
    : fitsBrief;
  const offPathFits = pathLodgingIds
    ? fitsBrief.filter((l) => !inPath(l.id))
    : [];

  const fitsBriefGrid = h(
    'div',
    { class: 'card-grid' },
    ...visibleFits.map((l) => renderLodgingCard(l, inPath(l.id)))
  );

  const offPathBlock =
    offPathFits.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Other Terra Nova-tier options on this corridor (${offPathFits.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Not part of the selected path\'s default plan but bookable here too.'
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...offPathFits.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  const splurgeBlock =
    splurge.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Splurge options (${splurge.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...splurge.map((l) => renderLodgingCard(l, inPath(l.id)))
          )
        )
      : null;

  const basicBlock =
    basic.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Cheaper / more basic options (${basic.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...basic.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  const notesBlock =
    notes.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Status notes (${notes.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...notes.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  return h(
    'div',
    {
      class: 'tab-panel',
      id: `lodging-panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `lodging-tab-${id}`,
    },
    h('h3', { class: 'tab-panel__title' }, title),
    h(
      'p',
      { class: 'section__lede' },
      pathLodgingIds
        ? `${visibleFits.length} option${visibleFits.length === 1 ? '' : 's'} in the selected path. Other Terra Nova-tier picks on this corridor sit below.`
        : `Spacious, a little nicer than basic, around $200-300 — the Terra Nova tier. ${fitsBrief.length} cabin / lodge options that fit. Splurge + cheaper sit below.`
    ),
    fitsBriefGrid,
    offPathBlock,
    splurgeBlock,
    basicBlock,
    notesBlock
  );
}

function determinePanels(selectedId: string | null): {
  showWest: boolean;
  showEast: boolean;
  westLabel: string;
  eastLabel: string;
} {
  if (!selectedId) {
    return { showWest: true, showEast: true, westLabel: 'West · Nights 1-2', eastLabel: 'East · Nights 3-4' };
  }
  const path = getPathById(selectedId as 'A' | 'B' | 'C');
  if (!path) {
    return { showWest: true, showEast: true, westLabel: 'West', eastLabel: 'East' };
  }
  if (path.id === 'A') return { showWest: true, showEast: false, westLabel: 'West · all 4 nights', eastLabel: 'East · not in this path' };
  if (path.id === 'B') return { showWest: true, showEast: true, westLabel: 'West · Nights 1-2', eastLabel: 'East · Nights 3-4' };
  return { showWest: true, showEast: true, westLabel: 'West · Night 1', eastLabel: 'East · Nights 2-4' };
}

function renderBody(wrap: HTMLElement, selectedId: string | null): void {
  const panels = determinePanels(selectedId);
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const pathLodgingIds = path ? new Set(path.lodgingIds) : null;

  const tabs = wrap.querySelector<HTMLElement>('.tabs');
  const westTabBtn = wrap.querySelector<HTMLButtonElement>('#lodging-tab-west');
  const eastTabBtn = wrap.querySelector<HTMLButtonElement>('#lodging-tab-east');
  if (westTabBtn) westTabBtn.textContent = panels.westLabel;
  if (eastTabBtn) eastTabBtn.textContent = panels.eastLabel;
  if (eastTabBtn) {
    eastTabBtn.disabled = !panels.showEast;
    eastTabBtn.classList.toggle('tab--disabled', !panels.showEast);
  }

  const westPanel = renderPanel('west', 'West side — Marblemount / Rockport / Concrete', WEST_LODGING, pathLodgingIds);
  const eastPanel = renderPanel('east', 'East side — Winthrop / Mazama', EAST_LODGING, pathLodgingIds);

  // Default to whichever tab matches the path.
  const defaultSide = path?.id === 'A' ? 'west' : path?.id === 'C' ? 'east' : 'west';
  eastPanel.hidden = defaultSide !== 'east';
  westPanel.hidden = defaultSide !== 'west';

  if (tabs) {
    const allTabs = tabs.querySelectorAll<HTMLButtonElement>('.tab');
    allTabs.forEach((t) => {
      const active = t.dataset['target'] === defaultSide;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  // Replace panel container.
  const container = wrap.querySelector<HTMLElement>('.lodging-panels');
  if (container) {
    container.replaceChildren(westPanel, eastPanel);
  }

  // Update gist
  const gist = wrap.querySelector<HTMLElement>('.gist');
  if (gist) {
    gist.replaceChildren(
      h(
        'li',
        { class: 'gist__item' },
        path
          ? `Filtered to ${path.name}: ${path.lodgingShape}.`
          : 'Two bases — west side (Marblemount/Rockport, Nights 1-2) and east side (Winthrop/Mazama, Nights 3-4).'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Brief: spacious + a little nicer than basic + ~$200-300/night (Terra Nova-tier). Kitchens are a bonus, not a requirement.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        path
          ? 'Other corridor options + splurge + cheaper sit behind disclosures below.'
          : 'Splurge ($400+) and cheaper/basic options are kept behind disclosures.'
      )
    );
  }

  // Tab click handling (re-bound each render).
  if (tabs) {
    const newTabs = tabs.cloneNode(true) as HTMLElement;
    tabs.replaceWith(newTabs);
    newTabs.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      if (target.disabled) return;
      const side = target.dataset['target'];
      if (side !== 'west' && side !== 'east') return;
      const allTabs = newTabs.querySelectorAll<HTMLButtonElement>('.tab');
      allTabs.forEach((t) => {
        const active = t.dataset['target'] === side;
        t.classList.toggle('tab--active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      westPanel.hidden = side !== 'west';
      eastPanel.hidden = side !== 'east';
    });
  }
}

export function renderLodging(): HTMLElement {
  const tabs = h(
    'div',
    { class: 'tabs', role: 'tablist', 'aria-label': 'Lodging side' },
    h(
      'button',
      {
        class: 'tab tab--active',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-west',
        'aria-selected': 'true',
        'aria-controls': 'lodging-panel-west',
        'data-target': 'west',
      },
      'West · Nights 1-2'
    ),
    h(
      'button',
      {
        class: 'tab',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-east',
        'aria-selected': 'false',
        'aria-controls': 'lodging-panel-east',
        'data-target': 'east',
      },
      'East · Nights 3-4'
    )
  );

  const wrap = section(
    'lodging',
    'Lodging',
    h('ul', { class: 'gist' }),
    tabs,
    h('div', { class: 'lodging-panels' })
  );

  renderBody(wrap, getSelectedPath());
  subscribeSelectedPath((next) => renderBody(wrap, next));

  return wrap;
}

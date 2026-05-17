/**
 * wa20-status.ts — renderer for the WA-20 deep-dive page.
 *
 * Layout (top → bottom):
 *   1. Big STATUS PILL with last-verified timestamp
 *   2. TLDR card — "What this means for the trip" (3 bullets)
 *   3. SOURCE-by-SOURCE status table (WSDOT / NPS / news, with last-verified)
 *   4. PHONE-CHECK PROTOCOL card (script + numbers)
 *   5. AFFECTED DESTINATIONS list (grouped by impact, cross-linked to source
 *      pages — `/hikes.html#blue-lake` etc.)
 *   6. CONTINGENCY routing (Stevens Pass / west-only / east-only)
 *   7. Vertical TIMELINE — Dec 2025 → today
 *
 * Reuses existing CSS where possible:
 *   - `.driving-topic` / `.driving-topic--{warn,info,bad}` for the contingency
 *     + source cards (already styled in components.css ~2724-)
 *   - `.section-sources` for the source-strip below the section title
 *   - `.card__pill` for the destination list chips
 *
 * Adds a small WA-20-specific block at the bottom of this file (scoped CSS)
 * for the parts that don't map cleanly to existing classes — the big status
 * pill, the affected-destinations grid, and the vertical timeline. Kept here
 * rather than in components.css to avoid touching another shared file while
 * three other agents are mid-edit on shared surfaces.
 */

import {
  WA20_STATUS,
  WA20_TLDR,
  WA20_SOURCES,
  WA20_PHONE_NUMBERS,
  WA20_PHONE_SCRIPT,
  WA20_AFFECTED,
  WA20_CONTINGENCY,
  WA20_TIMELINE,
  WA20_PAGE_META,
  WA20_CORRIDOR_VIDEO,
  type Wa20Impact,
  type AffectedItem,
} from '../data/wa20-status';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';
import { renderVideoEmbed } from './video-embed';

// ====================================================================
// 1. STATUS PILL
// ====================================================================

function renderStatusPill(): HTMLElement {
  const stateClass = `wa20-status-pill wa20-status-pill--${WA20_STATUS.state}`;
  return h(
    'div',
    { class: 'wa20-status-block' },
    h(
      'div',
      { class: stateClass },
      h('span', { class: 'wa20-status-pill__icon', 'aria-hidden': 'true' }, '⚠'),
      h('span', { class: 'wa20-status-pill__label' }, WA20_STATUS.headline)
    ),
    h(
      'p',
      { class: 'wa20-status-block__range' },
      h('strong', {}, 'Closed segment: '),
      WA20_STATUS.range
    ),
    h(
      'p',
      { class: 'wa20-status-block__asof' },
      'Site-author verified ',
      h('strong', {}, WA20_STATUS.asOfLabel),
      ' — re-confirm by phone before booking week.'
    ),
    h('p', { class: 'wa20-status-block__detail' }, WA20_STATUS.detail),
    h(
      'p',
      { class: 'wa20-status-block__target' },
      h('strong', {}, 'WSDOT target: '),
      WA20_STATUS.target
    )
  );
}

// ====================================================================
// 2. TLDR CARD
// ====================================================================

function renderTldr(): HTMLElement {
  return h(
    'aside',
    { class: 'wa20-tldr', 'aria-label': 'What this means for the trip' },
    h('h3', { class: 'wa20-tldr__title' }, 'What this means for the trip'),
    h(
      'ul',
      { class: 'wa20-tldr__list' },
      ...WA20_TLDR.map((line) => h('li', { class: 'wa20-tldr__item' }, line))
    )
  );
}

// ====================================================================
// 2b. CORRIDOR DRIVE VIDEO — what the road actually looks like
// ====================================================================

function renderCorridorVideo(): HTMLElement {
  return h(
    'div',
    { class: 'wa20-corridor-video' },
    h('h3', { class: 'wa20-block-title' }, 'What the corridor actually looks like'),
    h(
      'p',
      { class: 'wa20-block-lede' },
      'A short drive-through of SR-20 (filmed when the highway was open through). Shows the scale of the closure-affected mid-corridor + the kind of road experience you\'re budgeting for.'
    ),
    renderVideoEmbed({
      videoId: WA20_CORRIDOR_VIDEO.youtubeId,
      title: WA20_CORRIDOR_VIDEO.title,
      creator: WA20_CORRIDOR_VIDEO.creator,
      className: 'video-embed--wa20',
    })
  );
}

// ====================================================================
// 3. SOURCES TABLE
// ====================================================================

function renderSources(): HTMLElement {
  return h(
    'div',
    { class: 'wa20-sources' },
    h('h3', { class: 'wa20-block-title' }, 'Source-by-source status'),
    h(
      'p',
      { class: 'wa20-block-lede' },
      'Three sources, two different stories. WSDOT owns the road and is the authority — NPS road-conditions hasn\'t been re-updated since May 6 and is stale. Local news fills in the milestones.'
    ),
    h(
      'div',
      { class: 'wa20-sources__grid' },
      ...WA20_SOURCES.map(renderSourceCard)
    )
  );
}

function renderSourceCard(src: (typeof WA20_SOURCES)[number]): HTMLElement {
  const toneClass = `wa20-source-card wa20-source-card--${src.trust}`;
  return h(
    'article',
    { class: toneClass },
    h(
      'header',
      { class: 'wa20-source-card__head' },
      h('h4', { class: 'wa20-source-card__authority' }, src.authority),
      h(
        'span',
        { class: `wa20-trust-pill wa20-trust-pill--${src.trust}` },
        src.trust === 'high'
          ? 'High trust'
          : src.trust === 'medium'
            ? 'Medium trust'
            : 'Stale — verify elsewhere'
      )
    ),
    h(
      'p',
      { class: 'wa20-source-card__says' },
      h('strong', {}, 'Says: '),
      src.whatItSays
    ),
    h(
      'p',
      { class: 'wa20-source-card__meta' },
      h('strong', {}, 'Last verified: '),
      src.lastVerified
    ),
    h('p', { class: 'wa20-source-card__trust-note' }, src.trustNote),
    h(
      'p',
      { class: 'wa20-source-card__link' },
      h(
        'a',
        { href: src.url, target: '_blank', rel: 'noopener noreferrer' },
        'Open source ↗'
      )
    )
  );
}

// ====================================================================
// 4. PHONE-CHECK PROTOCOL
// ====================================================================

function renderPhoneProtocol(): HTMLElement {
  return h(
    'aside',
    { class: 'wa20-phone', 'aria-label': 'Before you commit — phone-check protocol' },
    h('h3', { class: 'wa20-phone__title' }, '📞 Before you commit — phone-check protocol'),
    h(
      'p',
      { class: 'wa20-phone__lede' },
      'Two windows to call: ',
      h('strong', {}, 'booking week '),
      '(before locking flights + lodging) and ',
      h('strong', {}, 'morning-of '),
      '(before driving the corridor — if WA-20 has reopened by August, conditions can still flip with smoke or new washouts).'
    ),
    h(
      'div',
      { class: 'wa20-phone__numbers' },
      ...WA20_PHONE_NUMBERS.map((p) =>
        h(
          'div',
          { class: 'wa20-phone__number' },
          h('div', { class: 'wa20-phone__number-label' }, p.label),
          h(
            'a',
            { href: `tel:${p.number.replace(/[^\d+]/g, '')}`, class: 'wa20-phone__number-tel' },
            p.number
          ),
          h('p', { class: 'wa20-phone__number-hint' }, p.hint)
        )
      )
    ),
    h(
      'div',
      { class: 'wa20-phone__script' },
      h('h4', { class: 'wa20-phone__script-title' }, 'Script — exactly what to say'),
      h(
        'ol',
        { class: 'wa20-phone__script-list' },
        ...WA20_PHONE_SCRIPT.map((line) => h('li', { class: 'wa20-phone__script-item' }, line))
      )
    )
  );
}

// ====================================================================
// 5. AFFECTED DESTINATIONS
// ====================================================================

const IMPACT_LABEL: Record<Wa20Impact, string> = {
  lost: 'Unreachable while closed',
  'east-only': 'East-base reachable only',
  'west-only': 'West-base reachable only',
  'either-side': 'Reachable from either side',
};

const SOURCE_PAGE: Record<AffectedItem['source'], string> = {
  hikes: 'hikes.html',
  lakes: 'lakes.html',
  activities: 'activities.html',
  'hidden-gems': 'hidden-gems.html',
  viewpoints: 'viewpoints.html',
};

const SOURCE_LABEL: Record<AffectedItem['source'], string> = {
  hikes: 'Hike',
  lakes: 'Lake',
  activities: 'Activity',
  'hidden-gems': 'Hidden gem',
  viewpoints: 'Viewpoint',
};

function renderAffected(): HTMLElement {
  // Group by impact.
  const groups = new Map<Wa20Impact, AffectedItem[]>();
  for (const item of WA20_AFFECTED) {
    const arr = groups.get(item.impact) ?? [];
    arr.push(item);
    groups.set(item.impact, arr);
  }
  const order: Wa20Impact[] = ['lost', 'east-only', 'west-only', 'either-side'];

  return h(
    'div',
    { class: 'wa20-affected' },
    h('h3', { class: 'wa20-block-title' }, 'What\'s affected'),
    h(
      'p',
      { class: 'wa20-block-lede' },
      'Pulled from the curated hike / lake / activity / hidden-gem / viewpoint cards (anywhere tagged ',
      h('code', {}, 'needsWa20Through'),
      '). Click any name to jump to its full card.'
    ),
    ...order
      .filter((imp) => (groups.get(imp)?.length ?? 0) > 0)
      .map((imp) => renderAffectedGroup(imp, groups.get(imp) ?? []))
  );
}

function renderAffectedGroup(impact: Wa20Impact, items: AffectedItem[]): HTMLElement {
  return h(
    'section',
    { class: `wa20-affected-group wa20-affected-group--${impact}`, 'aria-label': IMPACT_LABEL[impact] },
    h(
      'h4',
      { class: 'wa20-affected-group__title' },
      h('span', { class: `wa20-impact-dot wa20-impact-dot--${impact}`, 'aria-hidden': 'true' }),
      IMPACT_LABEL[impact],
      h('span', { class: 'wa20-affected-group__count' }, ` · ${items.length}`)
    ),
    h(
      'ul',
      { class: 'wa20-affected-group__list' },
      ...items.map(renderAffectedItem)
    )
  );
}

function renderAffectedItem(item: AffectedItem): HTMLElement {
  const href = `${SOURCE_PAGE[item.source]}#${item.anchor}`;
  return h(
    'li',
    { class: 'wa20-affected-item' },
    h(
      'a',
      { class: 'wa20-affected-item__link', href },
      h('span', { class: 'wa20-affected-item__name' }, item.name),
      h('span', { class: 'wa20-affected-item__source-pill' }, SOURCE_LABEL[item.source])
    ),
    h('p', { class: 'wa20-affected-item__location' }, item.location),
    h('p', { class: 'wa20-affected-item__note' }, item.note)
  );
}

// ====================================================================
// 6. CONTINGENCY ROUTING
// ====================================================================

function renderContingency(): HTMLElement {
  return h(
    'div',
    { class: 'wa20-contingency' },
    h('h3', { class: 'wa20-block-title' }, 'Contingency — if WA-20 stays closed'),
    h(
      'p',
      { class: 'wa20-block-lede' },
      'Three plays: drive Stevens Pass on the connector day, anchor west, or anchor east. Each is workable; the call depends on what reopens (or doesn\'t) by booking week in early July.'
    ),
    h(
      'div',
      { class: 'wa20-contingency__grid' },
      ...WA20_CONTINGENCY.map(renderContingencyCard)
    )
  );
}

function renderContingencyCard(c: (typeof WA20_CONTINGENCY)[number]): HTMLElement {
  return h(
    'article',
    { class: `driving-topic driving-topic--${c.tone}`, id: `wa20-contingency-${c.id}` },
    h(
      'header',
      { class: 'driving-topic__header' },
      h('h4', { class: 'driving-topic__title' }, c.title)
    ),
    h('p', { class: 'driving-topic__tldr' }, h('strong', {}, 'TLDR: '), c.tldr),
    h(
      'ul',
      { class: 'driving-topic__body' },
      ...c.body.map((line) => h('li', {}, line))
    ),
    h(
      'p',
      { class: 'wa20-contingency__when' },
      h('strong', {}, 'When to switch: '),
      c.whenToSwitch
    )
  );
}

// ====================================================================
// 7. TIMELINE
// ====================================================================

function renderTimeline(): HTMLElement {
  return h(
    'div',
    { class: 'wa20-timeline' },
    h('h3', { class: 'wa20-block-title' }, 'Recent history — how we got here'),
    h(
      'p',
      { class: 'wa20-block-lede' },
      'Six events from December 2025 → today. The damage is unusual: both a washout and a rockslide in the same closure, in different spots along the corridor.'
    ),
    h(
      'ol',
      { class: 'wa20-timeline__list' },
      ...WA20_TIMELINE.map(renderTimelineEvent)
    )
  );
}

function renderTimelineEvent(ev: (typeof WA20_TIMELINE)[number]): HTMLElement {
  return h(
    'li',
    { class: `wa20-timeline__event wa20-timeline__event--${ev.tone}` },
    h('span', { class: `wa20-timeline__dot wa20-timeline__dot--${ev.tone}`, 'aria-hidden': 'true' }),
    h(
      'div',
      { class: 'wa20-timeline__content' },
      h(
        'div',
        { class: 'wa20-timeline__date' },
        h('time', { dateTime: ev.iso }, ev.date)
      ),
      h('h4', { class: 'wa20-timeline__headline' }, ev.headline),
      h('p', { class: 'wa20-timeline__body' }, ev.body)
    )
  );
}

// ====================================================================
// SCOPED STYLES — mounted once on import (kept here, not in shared CSS,
// so this build doesn't fight the parallel agents touching components.css).
// ====================================================================

const STYLE_ID = 'wa20-status-styles';

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = WA20_CSS;
  document.head.appendChild(style);
}

const WA20_CSS = `
.wa20-status-block {
  background: #fff;
  border: 1px solid var(--c-line, #d9d4ca);
  border-left: 4px solid #c4393a;
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-4, 16px);
  margin-bottom: var(--sp-4, 16px);
}
.wa20-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  margin-bottom: var(--sp-3, 12px);
}
.wa20-status-pill--closed {
  background: #c4393a;
  color: #fff;
}
.wa20-status-pill--partial {
  background: #d9a441;
  color: #2a1d05;
}
.wa20-status-pill--open {
  background: #2a8d5a;
  color: #fff;
}
.wa20-status-pill__icon { font-size: 1rem; }
.wa20-status-block__range {
  margin: 0 0 var(--sp-2, 8px);
  font-size: var(--fs-base, 1rem);
}
.wa20-status-block__asof {
  margin: 0 0 var(--sp-3, 12px);
  font-size: 0.9rem;
  opacity: 0.85;
}
.wa20-status-block__detail {
  margin: 0 0 var(--sp-2, 8px);
  font-size: 0.95rem;
  line-height: 1.55;
}
.wa20-status-block__target {
  margin: 0;
  font-size: 0.95rem;
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
  background: #fdecec;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid #f2b8b9;
  color: #6d1a1b;
}

.wa20-tldr {
  background: var(--c-warm-100, #f5efe2);
  border: 1px solid var(--c-line, #d9d4ca);
  border-left: 4px solid var(--c-glacier-500, #4a86a5);
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-4, 16px);
  margin-bottom: var(--sp-4, 16px);
}
.wa20-tldr__title {
  margin: 0 0 var(--sp-2, 8px);
  font-size: var(--fs-lg, 1.1rem);
}
.wa20-tldr__list {
  margin: 0;
  padding-left: 1.2rem;
}
.wa20-tldr__item {
  margin-bottom: var(--sp-2, 8px);
  line-height: 1.55;
}
.wa20-tldr__item:last-child { margin-bottom: 0; }

.wa20-block-title {
  margin: var(--sp-5, 24px) 0 var(--sp-2, 8px);
  font-size: var(--fs-lg, 1.15rem);
}
.wa20-block-lede {
  margin: 0 0 var(--sp-3, 12px);
  color: var(--c-ink-soft, #514a3b);
  line-height: 1.55;
}

.wa20-sources__grid {
  display: grid;
  gap: var(--sp-3, 12px);
}
.wa20-source-card {
  background: #fff;
  border: 1px solid var(--c-line, #d9d4ca);
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-3, 12px) var(--sp-4, 16px);
  border-left: 4px solid var(--c-line, #d9d4ca);
}
.wa20-source-card--high { border-left-color: #2a8d5a; }
.wa20-source-card--medium { border-left-color: #4a86a5; }
.wa20-source-card--low { border-left-color: #d9a441; background: #fdf6e7; }
.wa20-source-card__head {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--sp-2, 8px);
}
.wa20-source-card__authority { margin: 0; font-size: 1rem; }
.wa20-trust-pill {
  display: inline-block;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}
.wa20-trust-pill--high { background: #e3f1eb; color: #1f4a3a; }
.wa20-trust-pill--medium { background: #e6eff5; color: #1d3d52; }
.wa20-trust-pill--low { background: #fce8c9; color: #5b3d10; }
.wa20-source-card__says, .wa20-source-card__meta, .wa20-source-card__trust-note {
  margin: 0 0 var(--sp-2, 8px);
  font-size: 0.92rem;
  line-height: 1.5;
}
.wa20-source-card__trust-note { color: var(--c-ink-soft, #514a3b); font-style: italic; }
.wa20-source-card__link { margin: 0; font-size: 0.92rem; }

.wa20-phone {
  background: #f4f9fb;
  border: 1px solid #cfdfe7;
  border-left: 4px solid var(--c-glacier-500, #4a86a5);
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-4, 16px);
  margin: var(--sp-4, 16px) 0;
}
.wa20-phone__title { margin: 0 0 var(--sp-2, 8px); font-size: var(--fs-lg, 1.1rem); }
.wa20-phone__lede { margin: 0 0 var(--sp-3, 12px); line-height: 1.55; }
.wa20-phone__numbers {
  display: grid;
  gap: var(--sp-2, 8px);
  margin-bottom: var(--sp-3, 12px);
}
.wa20-phone__number {
  background: #fff;
  border: 1px solid #cfdfe7;
  border-radius: var(--radius-sm, 6px);
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
}
.wa20-phone__number-label { font-weight: 600; font-size: 0.92rem; }
.wa20-phone__number-tel {
  display: inline-block;
  margin: 0.2rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1d3d52;
  text-decoration: none;
  letter-spacing: 0.02em;
}
.wa20-phone__number-tel:hover { text-decoration: underline; }
.wa20-phone__number-hint { margin: 0; font-size: 0.85rem; color: var(--c-ink-soft, #514a3b); }
.wa20-phone__script {
  background: #fff;
  border: 1px solid #cfdfe7;
  border-radius: var(--radius-sm, 6px);
  padding: var(--sp-3, 12px);
}
.wa20-phone__script-title { margin: 0 0 var(--sp-2, 8px); font-size: 0.95rem; }
.wa20-phone__script-list { margin: 0; padding-left: 1.2rem; }
.wa20-phone__script-item { margin-bottom: 0.5rem; line-height: 1.5; font-size: 0.92rem; }
.wa20-phone__script-item:last-child { margin-bottom: 0; }

.wa20-affected-group {
  margin-bottom: var(--sp-4, 16px);
}
.wa20-affected-group__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin: 0 0 var(--sp-2, 8px);
}
.wa20-affected-group__count {
  font-weight: 400;
  color: var(--c-ink-soft, #514a3b);
  font-size: 0.9rem;
}
.wa20-impact-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex: 0 0 12px;
}
.wa20-impact-dot--lost { background: #c4393a; }
.wa20-impact-dot--east-only { background: #d9a441; }
.wa20-impact-dot--west-only { background: #4a86a5; }
.wa20-impact-dot--either-side { background: #2a8d5a; }
.wa20-affected-group__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--sp-2, 8px);
}
.wa20-affected-item {
  background: #fff;
  border: 1px solid var(--c-line, #d9d4ca);
  border-radius: var(--radius-sm, 6px);
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
}
.wa20-affected-item__link {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
}
.wa20-affected-item__link:hover .wa20-affected-item__name { text-decoration: underline; }
.wa20-affected-item__name { font-weight: 600; }
.wa20-affected-item__source-pill {
  display: inline-block;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: var(--c-warm-100, #f5efe2);
  color: var(--c-ink-soft, #514a3b);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.wa20-affected-item__location {
  margin: 0.3rem 0 0.2rem;
  font-size: 0.85rem;
  color: var(--c-ink-soft, #514a3b);
}
.wa20-affected-item__note {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
}

.wa20-contingency__grid {
  display: grid;
  gap: var(--sp-3, 12px);
}
.wa20-contingency__when {
  margin: var(--sp-2, 8px) 0 0;
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
  background: rgba(0,0,0,0.04);
  border-radius: var(--radius-sm, 6px);
  font-size: 0.9rem;
  line-height: 1.5;
}

.wa20-timeline__list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1.2rem;
  position: relative;
}
.wa20-timeline__list::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-line, #d9d4ca);
}
.wa20-timeline__event {
  position: relative;
  padding-bottom: var(--sp-4, 16px);
}
.wa20-timeline__event:last-child { padding-bottom: 0; }
.wa20-timeline__dot {
  position: absolute;
  left: -1.2rem;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px var(--c-line, #d9d4ca);
}
.wa20-timeline__dot--bad { background: #c4393a; }
.wa20-timeline__dot--warn { background: #d9a441; }
.wa20-timeline__dot--info { background: #4a86a5; }
.wa20-timeline__dot--good { background: #2a8d5a; }
.wa20-timeline__date {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-ink-soft, #514a3b);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.wa20-timeline__headline { margin: 0.1rem 0 0.3rem; font-size: 1rem; }
.wa20-timeline__body { margin: 0; line-height: 1.5; font-size: 0.92rem; }

@media (min-width: 720px) {
  .wa20-affected-group__list { grid-template-columns: repeat(2, 1fr); }
}
`;

// ====================================================================
// MAIN RENDERER
// ====================================================================

export function renderWa20Status(): HTMLElement {
  ensureStyles();

  return section(
    'wa20-status',
    'WA-20 — the deep dive',
    h('p', { class: 'section__lede' }, WA20_PAGE_META.lede),
    renderSectionSources({
      label: 'Sources',
      sources: [
        { name: 'WSDOT · live mountain pass status', url: WA20_SOURCES[0]?.url ?? 'https://wsdot.com/' },
        { name: 'NPS · North Cascades road conditions', url: WA20_SOURCES[1]?.url ?? 'https://www.nps.gov/' },
        { name: 'Methow Valley News', url: WA20_SOURCES[2]?.url ?? 'https://methowvalleynews.com/' },
      ],
      asOf: WA20_PAGE_META.asOf,
    }),
    renderStatusPill(),
    renderTldr(),
    renderCorridorVideo(),
    renderSources(),
    renderPhoneProtocol(),
    renderAffected(),
    renderContingency(),
    renderTimeline()
  );
}

/**
 * weather-plan-c.ts — smoke + bad-air Plan C renderer.
 *
 * Layout (top to bottom):
 *   1. TLDR card — "August NC is dry. The real risk is smoke."
 *   2. Baseline weather facts (highs / lows / precipitation / smoke season)
 *   3. Trigger ladder — 4 stages (yellow / orange / red / purple) with actions
 *   4. Plan-C swaps grid — per day-kind (hike / drive / town / lake)
 *   5. Indoor refuges card — 5 places with hours + why
 *   6. Watch sources — bookmark list with usage hints
 *   7. Pre-trip prep checklist — masks / eye drops / etc.
 *   8. History context — last 3 NC August fire seasons, flagged where unverified
 *   9. Verified-on pill
 *
 * Mobile-first. Uses generic `.section`, `.section__title`, `.section__lede` from
 * sections.css; everything else carries a `weather-plan-c__*` BEM prefix and
 * sits in this section's own scoped block at the bottom of the file (no CSS
 * file needed for this drop — minimal styles via inline classes that resolve
 * against existing tokens). Future polish pass can extract to its own CSS file.
 */

import { WEATHER_PLAN_C } from '../data/weather-plan-c';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';

function renderTriggerLadder(): HTMLElement {
  return h(
    'div',
    { class: 'weather-plan-c__triggers' },
    ...WEATHER_PLAN_C.triggers.map((t) =>
      h(
        'article',
        {
          class: `weather-plan-c__trigger weather-plan-c__trigger--${t.band}`,
        },
        h(
          'header',
          { class: 'weather-plan-c__trigger-header' },
          h('span', { class: 'weather-plan-c__trigger-band' }, t.aqiBand),
          h('h3', { class: 'weather-plan-c__trigger-label' }, t.label)
        ),
        h(
          'p',
          { class: 'weather-plan-c__trigger-feel' },
          h('strong', {}, 'Feels like: '),
          t.feel
        ),
        h(
          'p',
          { class: 'weather-plan-c__trigger-action' },
          h('strong', {}, 'Do: '),
          t.action
        )
      )
    )
  );
}

function renderSwapsGrid(): HTMLElement {
  return h(
    'div',
    { class: 'weather-plan-c__swaps' },
    ...WEATHER_PLAN_C.swaps.map((s) =>
      h(
        'article',
        { class: `weather-plan-c__swap weather-plan-c__swap--${s.kind}` },
        h('h3', { class: 'weather-plan-c__swap-headline' }, s.headline),
        h('p', { class: 'weather-plan-c__swap-summary' }, s.swapTo),
        h(
          'ul',
          { class: 'weather-plan-c__swap-examples' },
          ...s.examples.map((ex) => h('li', {}, ex))
        ),
        s.unaffected
          ? h(
              'p',
              { class: 'weather-plan-c__swap-unaffected' },
              h('strong', {}, 'Mostly unaffected: '),
              s.unaffected
            )
          : null
      )
    )
  );
}

function renderRefuges(): HTMLElement {
  return h(
    'div',
    { class: 'weather-plan-c__refuges' },
    ...WEATHER_PLAN_C.refuges.map((r) =>
      h(
        'article',
        { class: 'weather-plan-c__refuge' },
        h(
          'header',
          { class: 'weather-plan-c__refuge-header' },
          h('h3', { class: 'weather-plan-c__refuge-name' }, r.name),
          r.researchNeeded
            ? h('span', { class: 'badge badge--warn' }, '[verify hours before trip]')
            : null
        ),
        h('p', { class: 'weather-plan-c__refuge-where' }, r.where),
        r.address ? h('p', { class: 'weather-plan-c__refuge-address' }, r.address) : null,
        h(
          'p',
          { class: 'weather-plan-c__refuge-hours' },
          h('strong', {}, 'Hours: '),
          r.hours
        ),
        h('p', { class: 'weather-plan-c__refuge-why' }, r.why),
        r.source
          ? h(
              'p',
              { class: 'weather-plan-c__refuge-source' },
              h(
                'a',
                {
                  href: r.source.url,
                  rel: 'noopener noreferrer',
                  target: '_blank',
                },
                r.source.name,
                ' ↗'
              )
            )
          : null
      )
    )
  );
}

function renderWatchSources(): HTMLElement {
  return h(
    'div',
    { class: 'weather-plan-c__watch' },
    h(
      'p',
      { class: 'weather-plan-c__watch-lede' },
      'Bookmark BEFORE the trip — no cell service on WA-20.'
    ),
    h(
      'ul',
      { class: 'weather-plan-c__watch-list' },
      ...WEATHER_PLAN_C.watchSources.map((s) =>
        h(
          'li',
          { class: 'weather-plan-c__watch-item' },
          h(
            'a',
            {
              href: s.url,
              class: 'weather-plan-c__watch-link',
              rel: 'noopener noreferrer',
              target: '_blank',
            },
            s.name,
            ' ↗'
          ),
          h('p', { class: 'weather-plan-c__watch-use' }, s.use),
          h(
            'p',
            { class: 'weather-plan-c__watch-when' },
            h('strong', {}, 'Check: '),
            s.when
          )
        )
      )
    )
  );
}

function renderPrep(): HTMLElement {
  return h(
    'ul',
    { class: 'weather-plan-c__prep' },
    ...WEATHER_PLAN_C.prep.map((p) =>
      h(
        'li',
        { class: 'weather-plan-c__prep-item' },
        h(
          'div',
          { class: 'weather-plan-c__prep-head' },
          h('strong', { class: 'weather-plan-c__prep-name' }, p.item),
          p.count ? h('span', { class: 'weather-plan-c__prep-count' }, ` · ${p.count}`) : null
        ),
        h('p', { class: 'weather-plan-c__prep-detail' }, p.detail)
      )
    )
  );
}

function renderHistory(): HTMLElement {
  return h(
    'div',
    { class: 'weather-plan-c__history' },
    h(
      'p',
      { class: 'weather-plan-c__history-lede' },
      'Recent NC August fire seasons — rough pattern, not a forecast. [verify] rows still need a research-pass.'
    ),
    h(
      'ul',
      { class: 'weather-plan-c__history-list' },
      ...WEATHER_PLAN_C.history.map((row) =>
        h(
          'li',
          { class: 'weather-plan-c__history-row' },
          h(
            'div',
            { class: 'weather-plan-c__history-head' },
            h('strong', { class: 'weather-plan-c__history-year' }, String(row.year)),
            row.researchNeeded
              ? h('span', { class: 'badge badge--warn' }, '[verify]')
              : h('span', { class: 'badge badge--good' }, 'Verified')
          ),
          h('p', { class: 'weather-plan-c__history-summary' }, row.summary),
          row.source
            ? h(
                'p',
                { class: 'weather-plan-c__history-source' },
                'Source: ',
                h(
                  'a',
                  {
                    href: row.source.url,
                    rel: 'noopener noreferrer',
                    target: '_blank',
                  },
                  row.source.name,
                  ' ↗'
                )
              )
            : null
        )
      )
    )
  );
}

export function renderWeatherPlanC(): HTMLElement {
  return section(
    'weather-plan-c',
    'Smoke + bad-air swaps',
    // 1. TLDR card
    h(
      'div',
      { class: 'weather-plan-c__tldr' },
      h('p', {}, h('strong', {}, 'TLDR. '), WEATHER_PLAN_C.tldr)
    ),

    // 2. Baseline weather facts
    h('h3', { class: 'weather-plan-c__h3' }, 'August baseline'),
    h(
      'ul',
      { class: 'weather-plan-c__baseline' },
      ...WEATHER_PLAN_C.baseline.map((b) => h('li', {}, b))
    ),

    // Sources strip
    renderSectionSources({
      label: 'Sources',
      sources: [
        { name: 'AirNow · AQI map', url: 'https://www.airnow.gov/' },
        { name: 'PurpleAir', url: 'https://map.purpleair.com/' },
        { name: 'Washington Smoke Blog', url: 'https://wasmoke.blogspot.com/' },
        { name: 'InciWeb · active fires', url: 'https://inciweb.nwcg.gov/' },
        { name: 'NPS · NC conditions', url: 'https://www.nps.gov/noca/planyourvisit/conditions.htm' },
      ],
      asOf: WEATHER_PLAN_C.asOf,
    }),

    // 3. Trigger ladder
    h('h3', { class: 'weather-plan-c__h3' }, 'Trigger ladder — when to swap'),
    renderTriggerLadder(),

    // 4. Plan-C swaps grid
    h('h3', { class: 'weather-plan-c__h3' }, 'Per-day swaps'),
    renderSwapsGrid(),

    // 5. Indoor refuges
    h('h3', { class: 'weather-plan-c__h3' }, 'Indoor refuges'),
    renderRefuges(),

    // 6. Watch sources
    h('h3', { class: 'weather-plan-c__h3' }, 'Watch sources'),
    renderWatchSources(),

    // 7. Pre-trip prep
    h('h3', { class: 'weather-plan-c__h3' }, 'Pre-trip prep'),
    renderPrep(),

    // 8. History
    h('h3', { class: 'weather-plan-c__h3' }, 'Recent August fire seasons'),
    renderHistory(),

    // 9. Verified-on pill
    h(
      'p',
      { class: 'weather-plan-c__verified' },
      h('span', { class: 'badge badge--good' }, `Verified ${WEATHER_PLAN_C.asOf}`),
      ' · Re-check AirNow + WA Smoke Blog ~Aug 1 and the morning of every outdoor day.'
    )
  );
}

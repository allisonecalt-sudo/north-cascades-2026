/**
 * section-sources.ts — Austria-lifted inline citation strip.
 *
 * Renders a compact "Sources: A · B · C — researched [date]" strip that sits
 * directly under a section's gist. Used on sections where facts need
 * provenance and per-card source pills aren't sufficient.
 *
 * Pattern: each source is a tiny clickable pill with the source name and the
 * URL. Hovering shows underline. Tapping opens the source in a new tab.
 *
 * Use this for sections that surface CLAIMS (WSDOT closure status, drive
 * times, hike stats, sunset times, kosher certifications) — not for sections
 * that are clearly first-party content (e.g. trip overview prose).
 */

import { h } from '../dom';

export interface SectionSource {
  name: string;
  url: string;
}

export interface SectionSourcesOpts {
  /** Plain-language label — what kind of facts these sources back. */
  label?: string;
  sources: SectionSource[];
  /** "Researched May 17, 2026" — pull date so reader knows freshness. */
  asOf: string;
}

export function renderSectionSources(opts: SectionSourcesOpts): HTMLElement {
  const label = opts.label ?? 'Sources';
  return h(
    'div',
    { class: 'section-sources', role: 'note' },
    h('span', { class: 'section-sources__label' }, `${label}: `),
    h(
      'ul',
      { class: 'section-sources__list' },
      ...opts.sources.map((src) =>
        h(
          'li',
          { class: 'section-sources__item' },
          h(
            'a',
            { href: src.url, rel: 'noopener noreferrer', target: '_blank' },
            src.name,
            ' ↗'
          )
        )
      )
    ),
    h('span', { class: 'section-sources__as-of' }, ` · researched ${opts.asOf}`)
  );
}

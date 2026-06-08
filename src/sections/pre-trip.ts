/**
 * pre-trip.ts — milestone-based pre-trip checklist renderer.
 *
 * Rebuilt 2026-05-17 PM. Pre-trip is now the surface Allison opens in the
 * booking-week and the week-before-departure — phase-grouped milestone cards
 * with concrete subitems, countdown per milestone, and a sticky top progress
 * bar that aggregates across every subitem in every milestone.
 *
 * localStorage layout:
 *   `ncades2026.pretrip.{milestone-id}.{subitem-id}` = 'true'  (one key per
 *   subitem; absent = unchecked). This per-subitem key approach (vs the prior
 *   single blob) keeps state robust against future milestone-list edits, makes
 *   any single corruption local, and is trivially mirror-able to Supabase
 *   later.
 *
 * Phase groupings:
 *   1. Booking week — lodging lock           (Jun 15)
 *   2. Booking week 2 — road, flights, car   (Jun 25 – Jul 15)
 *   3. Two weeks out — verify-the-booked-thing (Aug 2)
 *   4. Final week — last calls + pack        (Aug 14-15)
 *   5. Day-of                                 (Aug 16)
 *
 * Date source: data/pre-trip.ts MILESTONES (which itself mirrors the dates in
 * sections/trip-state.ts). If a date moves, edit data/pre-trip.ts + trip-state.ts.
 */

import {
  MILESTONES,
  PHASE_TITLE,
  PHASE_BLURB,
  daysUntilDate,
  daysUntilTrip,
  totalSubitemCount,
  type Milestone,
  type Phase,
  type Subitem,
} from '../data/pre-trip';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';

/** localStorage key prefix. NEVER change — checked state is keyed under this. */
const STATE_KEY_PREFIX = 'ncades2026.pretrip';

/** Single-key namespace for the progress-bar cache (display only). */
const PROGRESS_DOM_SELECTOR = '.pre-trip__progress-fill';
const PROGRESS_LABEL_SELECTOR = '.pre-trip__progress-count';
const PROGRESS_PERCENT_SELECTOR = '.pre-trip__progress-percent';

/** Returns the localStorage key for a subitem. */
function keyFor(milestoneId: string, subitemId: string): string {
  return `${STATE_KEY_PREFIX}.${milestoneId}.${subitemId}`;
}

/** Read whether a subitem is checked. */
function isChecked(milestoneId: string, subitemId: string): boolean {
  try {
    return localStorage.getItem(keyFor(milestoneId, subitemId)) === 'true';
  } catch {
    return false;
  }
}

/** Persist a checked / unchecked subitem. */
function writeChecked(milestoneId: string, subitemId: string, checked: boolean): void {
  try {
    if (checked) {
      localStorage.setItem(keyFor(milestoneId, subitemId), 'true');
    } else {
      localStorage.removeItem(keyFor(milestoneId, subitemId));
    }
  } catch {
    /* private-browsing / quota — fail silently, UI still reflects the toggle */
  }
}

/** Count checked subitems across every milestone. */
function countCheckedSubitems(): number {
  let count = 0;
  for (const m of MILESTONES) {
    for (const s of m.subitems) {
      if (isChecked(m.id, s.id)) count++;
    }
  }
  return count;
}

/** Count checked subitems within a single milestone. */
function countCheckedInMilestone(milestone: Milestone): number {
  let count = 0;
  for (const s of milestone.subitems) {
    if (isChecked(milestone.id, s.id)) count++;
  }
  return count;
}

/** Format the countdown for a milestone — "in 38 days" / "today!" / "✓ 4 days ago". */
function countdownLabel(daysAway: number, allDone: boolean): string {
  if (allDone) return '✓ done';
  if (daysAway < 0) {
    const abs = Math.abs(daysAway);
    return `Was ${abs === 1 ? 'yesterday' : `${abs} days ago`}`;
  }
  if (daysAway === 0) return 'Today!';
  if (daysAway === 1) return 'Tomorrow';
  return `In ${daysAway} days`;
}

/** Urgency band for a milestone — drives color + ribbon tone. */
function urgencyTone(daysAway: number, allDone: boolean): 'done' | 'now' | 'soon' | 'future' | 'past' {
  if (allDone) return 'done';
  if (daysAway < 0) return 'past';
  if (daysAway <= 3) return 'now';
  if (daysAway <= 14) return 'soon';
  return 'future';
}

/** Render one subitem row with a checkbox. */
function renderSubitem(
  milestoneId: string,
  subitem: Subitem,
  onChange: () => void
): HTMLElement {
  const checked = isChecked(milestoneId, subitem.id);
  const checkboxId = `pretrip-${milestoneId}-${subitem.id}`;
  const checkbox = h('input', {
    type: 'checkbox',
    id: checkboxId,
    class: 'pre-trip__sub-checkbox',
  }) as HTMLInputElement;
  checkbox.checked = checked;
  const row = h(
    'li',
    {
      class: `pre-trip__sub${checked ? ' pre-trip__sub--done' : ''}`,
      'data-subitem-id': subitem.id,
    },
    checkbox,
    h(
      'div',
      { class: 'pre-trip__sub-body' },
      h('label', { for: checkboxId, class: 'pre-trip__sub-label' }, subitem.label),
      subitem.hint ? h('p', { class: 'pre-trip__sub-hint' }, subitem.hint) : null
    )
  );
  checkbox.addEventListener('change', () => {
    writeChecked(milestoneId, subitem.id, checkbox.checked);
    row.classList.toggle('pre-trip__sub--done', checkbox.checked);
    onChange();
  });
  return row;
}

/** Render one milestone card. */
function renderMilestone(milestone: Milestone, onChange: () => void): HTMLElement {
  const daysAway = daysUntilDate(milestone.date);
  const checkedCount = countCheckedInMilestone(milestone);
  const allDone = checkedCount === milestone.subitems.length;
  const tone = urgencyTone(daysAway, allDone);
  const cd = countdownLabel(daysAway, allDone);

  const links: HTMLElement[] = [];
  if (milestone.link) {
    const isExternal = milestone.link.url.startsWith('http');
    links.push(
      h(
        'a',
        {
          class: 'pre-trip__milestone-link',
          href: milestone.link.url,
          target: isExternal ? '_blank' : undefined,
          rel: isExternal ? 'noopener noreferrer' : undefined,
        },
        milestone.link.label,
        isExternal ? ' ↗' : ' →'
      )
    );
  }
  if (milestone.secondaryLink) {
    const isExternal = milestone.secondaryLink.url.startsWith('http');
    links.push(
      h(
        'a',
        {
          class: 'pre-trip__milestone-link pre-trip__milestone-link--secondary',
          href: milestone.secondaryLink.url,
          target: isExternal ? '_blank' : undefined,
          rel: isExternal ? 'noopener noreferrer' : undefined,
        },
        milestone.secondaryLink.label,
        isExternal ? ' ↗' : ' →'
      )
    );
  }

  return h(
    'article',
    {
      class: `pre-trip__milestone pre-trip__milestone--${tone}${allDone ? ' pre-trip__milestone--all-done' : ''}`,
      'data-milestone-id': milestone.id,
    },
    h(
      'header',
      { class: 'pre-trip__milestone-head' },
      h(
        'div',
        { class: 'pre-trip__milestone-headline' },
        h('p', { class: 'pre-trip__milestone-date' }, milestone.dateLabel),
        h('h4', { class: 'pre-trip__milestone-title' }, milestone.title)
      ),
      h(
        'span',
        { class: `pre-trip__milestone-countdown pre-trip__milestone-countdown--${tone}` },
        cd
      )
    ),
    h('p', { class: 'pre-trip__milestone-action' }, milestone.action),
    h(
      'ul',
      { class: 'pre-trip__sub-list' },
      ...milestone.subitems.map((s) => renderSubitem(milestone.id, s, onChange))
    ),
    h(
      'footer',
      { class: 'pre-trip__milestone-foot' },
      h(
        'span',
        { class: 'pre-trip__milestone-progress' },
        `${checkedCount} / ${milestone.subitems.length} done`
      ),
      links.length > 0 ? h('span', { class: 'pre-trip__milestone-links' }, ...links) : null
    )
  );
}

/** Phase group wrapping multiple milestone cards. */
function renderPhase(phase: Phase, milestones: Milestone[], onChange: () => void): HTMLElement {
  return h(
    'div',
    { class: `pre-trip__phase pre-trip__phase--${phase}` },
    h(
      'div',
      { class: 'pre-trip__phase-head' },
      h('h3', { class: 'pre-trip__phase-title' }, PHASE_TITLE[phase]),
      h('p', { class: 'pre-trip__phase-blurb' }, PHASE_BLURB[phase])
    ),
    h(
      'div',
      { class: 'pre-trip__phase-cards' },
      ...milestones.map((m) => renderMilestone(m, onChange))
    )
  );
}

/** Group milestones by phase, preserving the order they appear in MILESTONES. */
function groupByPhase(): Array<{ phase: Phase; milestones: Milestone[] }> {
  const order: Phase[] = [
    'booking-week-1',
    'booking-week-2',
    'two-weeks-out',
    'final-week',
    'day-of',
  ];
  return order
    .map((phase) => ({
      phase,
      milestones: MILESTONES.filter((m) => m.phase === phase),
    }))
    .filter((g) => g.milestones.length > 0);
}

export function renderPreTrip(): HTMLElement {
  const totalSubitems = totalSubitemCount();
  const daysToTrip = daysUntilTrip();
  const groups = groupByPhase();

  /** Repaint the top progress bar + per-milestone counters. */
  function paintProgress(): void {
    const done = countCheckedSubitems();
    const pct = totalSubitems === 0 ? 0 : Math.round((done / totalSubitems) * 100);
    const fillEl = document.querySelector<HTMLElement>(PROGRESS_DOM_SELECTOR);
    if (fillEl) fillEl.style.width = `${pct}%`;
    const countEl = document.querySelector(PROGRESS_LABEL_SELECTOR);
    if (countEl) countEl.textContent = `${done} / ${totalSubitems} subtasks done`;
    const pctEl = document.querySelector(PROGRESS_PERCENT_SELECTOR);
    if (pctEl) pctEl.textContent = `${pct}%`;
    // Repaint each milestone's footer count.
    for (const m of MILESTONES) {
      const card = document.querySelector<HTMLElement>(
        `[data-milestone-id="${m.id}"]`
      );
      if (!card) continue;
      const checked = countCheckedInMilestone(m);
      const progressEl = card.querySelector('.pre-trip__milestone-progress');
      if (progressEl) {
        progressEl.textContent = `${checked} / ${m.subitems.length} done`;
      }
      const allDone = checked === m.subitems.length;
      card.classList.toggle('pre-trip__milestone--all-done', allDone);
      // Refresh the countdown ribbon if "all-done" status flipped.
      const cdEl = card.querySelector<HTMLElement>('.pre-trip__milestone-countdown');
      if (cdEl) {
        const daysAway = daysUntilDate(m.date);
        cdEl.textContent = countdownLabel(daysAway, allDone);
        const tone = urgencyTone(daysAway, allDone);
        cdEl.className = `pre-trip__milestone-countdown pre-trip__milestone-countdown--${tone}`;
      }
    }
  }

  const tripCountdownLabel =
    daysToTrip < 0
      ? `Trip started ${Math.abs(daysToTrip)} days ago`
      : daysToTrip === 0
        ? 'Trip starts TODAY'
        : `${daysToTrip} days until Aug 16, 2026`;

  const wrap = section(
    'pre-trip',
    'Pre-trip checklist',
    h(
      'p',
      { class: 'section__lede' },
      `${totalSubitems} subtasks. Soonest due: flights, Mon Jun 1.`
    ),
    renderSectionSources({
      label: 'Built from',
      sources: [
        {
          name: 'Home widget milestones (trip-state.ts)',
          url: 'index.html#trip-state',
        },
        {
          name: 'WSDOT WA-20 live status',
          url: 'https://wsdot.com/travel/real-time/mountainpasses/north-cascades-highway',
        },
        {
          name: 'NPS North Cascades planning',
          url: 'https://www.nps.gov/noca/planyourvisit/index.htm',
        },
      ],
      asOf: 'May 17, 2026',
    }),
    // ── Sticky top countdown + progress bar ──
    h(
      'div',
      { class: 'pre-trip__countdown' },
      h(
        'span',
        { class: 'pre-trip__countdown-days' },
        String(Math.max(0, daysToTrip))
      ),
      h(
        'div',
        { class: 'pre-trip__countdown-body' },
        h('p', { class: 'pre-trip__countdown-label' }, tripCountdownLabel),
        h(
          'p',
          { class: 'pre-trip__progress' },
          h(
            'span',
            { class: 'pre-trip__progress-count' },
            `0 / ${totalSubitems} subtasks done`
          ),
          h(
            'span',
            { class: 'pre-trip__progress-bar' },
            h('span', { class: 'pre-trip__progress-fill', style: 'width: 0%' })
          ),
          h('span', { class: 'pre-trip__progress-percent' }, '0%')
        )
      )
    ),
    // ── Phase-grouped milestone cards ──
    ...groups.map((g) => renderPhase(g.phase, g.milestones, paintProgress)),
    // ── Reset ──
    h(
      'p',
      { class: 'pre-trip__reset' },
      h(
        'button',
        {
          type: 'button',
          class: 'pre-trip__reset-btn',
          'data-action': 'reset-checks',
        },
        'Reset all checkboxes'
      )
    )
  );

  // Defer initial progress paint until the section is mounted.
  setTimeout(paintProgress, 0);

  // Wire reset (event-delegated so it survives any future re-render).
  wrap.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset['action'] !== 'reset-checks') return;
    if (!confirm('Clear every pre-trip checkbox?')) return;
    for (const m of MILESTONES) {
      for (const s of m.subitems) {
        try {
          localStorage.removeItem(keyFor(m.id, s.id));
        } catch {
          /* ignore */
        }
      }
    }
    wrap.querySelectorAll<HTMLInputElement>('.pre-trip__sub-checkbox').forEach((cb) => {
      cb.checked = false;
    });
    wrap.querySelectorAll('.pre-trip__sub--done').forEach((row) => {
      row.classList.remove('pre-trip__sub--done');
    });
    paintProgress();
  });

  return wrap;
}

/**
 * pre-trip.ts — countdown checklist renderer with localStorage state.
 *
 * Per TRAVEL.md page inventory + Allison's pre-trip-prep needs:
 *   - Days-until-trip banner at top
 *   - Grouped checklist (bookings / verify / kosher pantry / pack / connectivity / US-specific / day-of)
 *   - localStorage state per task-id; checked rows fade + check stays across reloads
 *   - Earliest/latest days-out indicators colored by current time
 *   - Mobile-first
 */

import {
  PRE_TRIP_GROUPS,
  daysUntilTrip,
  type PreTripTask,
} from '../data/pre-trip';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';

const STATE_KEY = 'nc2026.preTripChecks';

interface CheckState {
  [taskId: string]: boolean;
}

function readState(): CheckState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as CheckState;
    }
    return {};
  } catch {
    return {};
  }
}

function writeState(state: CheckState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private-browsing errors */
  }
}

function urgencyBand(task: PreTripTask, daysOut: number): 'open' | 'now' | 'late' | 'closed' | 'future' {
  if (daysOut < 0) return 'closed';
  if (daysOut > task.earliestDaysOut) return 'future';
  if (daysOut <= 0) return 'late';
  if (daysOut <= task.latestDaysOut) return 'now';
  return 'open';
}

function bandLabel(band: ReturnType<typeof urgencyBand>): string {
  switch (band) {
    case 'future':
      return 'Window opens later';
    case 'open':
      return 'Window open';
    case 'now':
      return 'Do this now';
    case 'late':
      return 'Overdue / last call';
    case 'closed':
      return 'Trip in progress';
  }
}

function renderTaskRow(
  task: PreTripTask,
  daysOut: number,
  state: CheckState,
  onToggle: (taskId: string, checked: boolean) => void
): HTMLElement {
  const checked = state[task.id] === true;
  const band = urgencyBand(task, daysOut);
  const checkboxId = `pretrip-${task.id}`;

  const checkbox = h('input', {
    type: 'checkbox',
    id: checkboxId,
    class: 'pre-trip__checkbox',
    checked,
  }) as HTMLInputElement;
  checkbox.checked = checked;
  checkbox.addEventListener('change', () => {
    onToggle(task.id, checkbox.checked);
  });

  return h(
    'li',
    {
      class: `pre-trip__row pre-trip__row--${band}${checked ? ' pre-trip__row--done' : ''}`,
      'data-task-id': task.id,
    },
    checkbox,
    h(
      'div',
      { class: 'pre-trip__body' },
      h('label', { for: checkboxId, class: 'pre-trip__label' }, task.label),
      h('p', { class: 'pre-trip__why' }, task.why),
      h(
        'p',
        { class: 'pre-trip__meta' },
        h('span', { class: `pre-trip__band pre-trip__band--${band}` }, bandLabel(band)),
        ' · ',
        h(
          'span',
          { class: 'pre-trip__window' },
          `Window: ${task.earliestDaysOut}-${task.latestDaysOut} days out`
        )
      ),
      task.link
        ? h(
            'a',
            {
              href: task.link.url,
              class: 'pre-trip__link',
              target: task.link.url.startsWith('http') ? '_blank' : undefined,
              rel: task.link.url.startsWith('http') ? 'noopener noreferrer' : undefined,
            },
            task.link.label,
            task.link.url.startsWith('http') ? ' ↗' : ' →'
          )
        : null
    )
  );
}

export function renderPreTrip(): HTMLElement {
  const daysOut = daysUntilTrip();
  const state = readState();

  function onToggle(taskId: string, checked: boolean): void {
    state[taskId] = checked;
    writeState(state);
    // Toggle the row class without full re-render.
    const row = document.querySelector(`[data-task-id="${taskId}"]`);
    if (row) row.classList.toggle('pre-trip__row--done', checked);
    // Refresh progress count.
    paintProgress();
  }

  const totalTasks = PRE_TRIP_GROUPS.flatMap((g) => g.tasks).length;
  function paintProgress(): void {
    const done = Object.values(state).filter((v) => v).length;
    const progressEl = document.querySelector('.pre-trip__progress-count');
    if (progressEl) progressEl.textContent = `${done} / ${totalTasks} done`;
    const barEl = document.querySelector<HTMLElement>('.pre-trip__progress-fill');
    if (barEl) barEl.style.width = `${Math.round((done / totalTasks) * 100)}%`;
  }

  const countdownLabel =
    daysOut < 0
      ? `Trip started ${Math.abs(daysOut)} days ago`
      : daysOut === 0
        ? 'Trip starts TODAY'
        : `${daysOut} days until Aug 16, 2026`;

  const wrap = section(
    'pre-trip',
    'Pre-trip checklist',
    h(
      'p',
      { class: 'section__lede' },
      `Countdown checklist with checkbox state saved to your device. ${totalTasks} tasks across 7 groups — windows open earliest-to-latest as the trip approaches.`
    ),
    renderSectionSources({
      label: 'Built from',
      sources: [
        { name: 'TRAVEL.md · pre-trip intake', url: '#' },
        { name: 'WSDOT · WA-20 reopen target Jul 4', url: 'https://wsdot.com/travel/real-time/mountainpasses/north-cascades-highway' },
        { name: 'NPS · North Cascades trip planner', url: 'https://www.nps.gov/noca/planyourvisit/index.htm' },
      ],
      asOf: 'May 17, 2026',
    }),
    h(
      'div',
      { class: 'pre-trip__countdown' },
      h('span', { class: 'pre-trip__countdown-days' }, String(Math.max(0, daysOut))),
      h(
        'div',
        { class: 'pre-trip__countdown-body' },
        h('p', { class: 'pre-trip__countdown-label' }, countdownLabel),
        h(
          'p',
          { class: 'pre-trip__progress' },
          h('span', { class: 'pre-trip__progress-count' }, `0 / ${totalTasks} done`),
          h(
            'span',
            { class: 'pre-trip__progress-bar' },
            h('span', { class: 'pre-trip__progress-fill', style: 'width: 0%' })
          )
        )
      )
    ),
    ...PRE_TRIP_GROUPS.map((group) =>
      h(
        'div',
        { class: 'pre-trip__group' },
        h('h3', { class: 'pre-trip__group-title' }, group.group),
        h('p', { class: 'pre-trip__group-blurb' }, group.blurb),
        h(
          'ul',
          { class: 'pre-trip__list' },
          ...group.tasks.map((task) =>
            renderTaskRow(task, daysOut, state, onToggle)
          )
        )
      )
    ),
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

  // Defer progress paint until DOM is mounted.
  setTimeout(paintProgress, 0);

  // Wire reset.
  wrap.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset['action'] !== 'reset-checks') return;
    if (!confirm('Clear all pre-trip checkbox state?')) return;
    for (const k of Object.keys(state)) delete state[k];
    writeState(state);
    wrap.querySelectorAll<HTMLInputElement>('.pre-trip__checkbox').forEach((cb) => {
      cb.checked = false;
    });
    wrap.querySelectorAll('.pre-trip__row--done').forEach((row) => {
      row.classList.remove('pre-trip__row--done');
    });
    paintProgress();
  });

  return wrap;
}

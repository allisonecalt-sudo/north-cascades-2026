/**
 * erin-answer-form.ts — structured-answer form per For-Erin must-have question.
 *
 * Why this file exists (2026-05-17 PM, Allison directive: "her answers should
 * go right into claude" + "both"): renders the radio / chip / text inputs
 * defined in `data/erin-answers.ts` ANSWER_SCHEMAS. Each question's form sits
 * below the context paragraph and above the per-question 💬 freeform button.
 *
 * What's decided:
 *   - One form per question — built lazily after `latestAnswerForQuestion()`
 *     resolves so the initial paint shows either a "Submit" form or a
 *     "✓ Submitted: X" already-answered state.
 *   - Already-answered state shows the submitted label + a "change answer"
 *     button that re-opens the form, plus a deep-link to the existing 💬
 *     modal for leaving a freeform note.
 *   - "Other" / freeform fields collapse into `freeform` on the row.
 *   - Mobile-first: radio/chip targets ≥44px tall. Single column.
 *
 * What's built: renderAnswerForm(question_id, openFreeformModal).
 * What's next: nothing — schema-driven, add new question types by extending
 * ANSWER_SCHEMAS.
 */

import {
  ANSWER_SCHEMAS,
  hasSchema,
  latestAnswerForQuestion,
  submitAnswer,
  type AnswerSchema,
  type EAnswer,
} from '../data/erin-answers';
import { h } from '../dom';

/* ────────────────────────────────────────────────────────────────
 * Inline mini-toast (avoids importing the notes-button private one).
 * ──────────────────────────────────────────────────────────────── */
function showInlineToast(text: string, ms = 2600): void {
  const t = document.createElement('div');
  t.className = 'notes-toast';
  t.textContent = text;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, ms);
}

/* ────────────────────────────────────────────────────────────────
 * Submitted-state renderer
 * ──────────────────────────────────────────────────────────────── */

function describeAnswer(schema: AnswerSchema, ans: EAnswer): string {
  if (schema.kind === 'radio') {
    const match = schema.options.find((o) => o.value === ans.answer_value);
    return ans.answer_label ?? match?.label ?? ans.answer_value;
  }
  if (schema.kind === 'chips') {
    try {
      const vals = JSON.parse(ans.answer_value) as string[];
      const labels = vals.map(
        (v) => schema.options.find((o) => o.value === v)?.label ?? v
      );
      return labels.join(' · ');
    } catch {
      return ans.answer_label ?? ans.answer_value;
    }
  }
  if (schema.kind === 'short-text') {
    if (ans.answer_label && ans.answer_label !== ans.answer_value) {
      return `"${ans.answer_value}" — tags: ${ans.answer_label}`;
    }
    return `"${ans.answer_value}"`;
  }
  if (schema.kind === 'pair-text') {
    try {
      const parsed = JSON.parse(ans.answer_value) as Record<string, string>;
      const a = parsed[schema.a.key]?.trim();
      const b = parsed[schema.b.key]?.trim();
      const parts: string[] = [];
      if (a) parts.push(`YES: ${a}`);
      if (b) parts.push(`NO: ${b}`);
      return parts.join(' · ') || ans.answer_label || ans.answer_value;
    } catch {
      return ans.answer_label ?? ans.answer_value;
    }
  }
  return ans.answer_value;
}

function renderSubmittedState(
  schema: AnswerSchema,
  ans: EAnswer,
  onChange: () => void,
  openFreeformModal: () => void
): HTMLElement {
  const summary = describeAnswer(schema, ans);
  const wrap = h(
    'div',
    { class: 'erin-answer erin-answer--submitted' },
    h(
      'div',
      { class: 'erin-answer__submitted-row' },
      h('span', { class: 'erin-answer__check', 'aria-hidden': 'true' }, '✓'),
      h(
        'div',
        { class: 'erin-answer__submitted-body' },
        h('div', { class: 'erin-answer__submitted-label' }, 'Submitted:'),
        h('div', { class: 'erin-answer__submitted-value' }, summary),
        ans.freeform
          ? h('div', { class: 'erin-answer__submitted-freeform' }, `Note: ${ans.freeform}`)
          : null
      )
    ),
    h(
      'div',
      { class: 'erin-answer__submitted-actions' },
      (() => {
        const change = h(
          'button',
          {
            type: 'button',
            class: 'erin-answer__change-btn',
          },
          'change answer'
        );
        change.addEventListener('click', onChange);
        return change;
      })(),
      (() => {
        const note = h(
          'button',
          {
            type: 'button',
            class: 'erin-answer__leave-note-btn',
          },
          'leave a note'
        );
        note.addEventListener('click', openFreeformModal);
        return note;
      })()
    )
  );
  return wrap;
}

/* ────────────────────────────────────────────────────────────────
 * Form renderers per kind
 * ──────────────────────────────────────────────────────────────── */

interface FormState {
  // For radio kinds.
  radioValue: string | null;
  // For chips kinds.
  chipValues: Set<string>;
  // For short-text + freeform tagsValues.
  textValue: string;
  tagValues: Set<string>;
  // For pair-text.
  pairA: string;
  pairB: string;
  // Universal "add a note alongside" freeform.
  freeform: string;
}

function newState(): FormState {
  return {
    radioValue: null,
    chipValues: new Set(),
    textValue: '',
    tagValues: new Set(),
    pairA: '',
    pairB: '',
    freeform: '',
  };
}

function renderRadioForm(
  schema: Extract<AnswerSchema, { kind: 'radio' }>,
  state: FormState,
  questionLabel: string
): HTMLElement {
  const group = h('div', {
    class: 'erin-answer__options erin-answer__options--radio',
    role: 'radiogroup',
    'aria-label': questionLabel,
  });
  schema.options.forEach((opt) => {
    const id = `eans-${schema.question_id}-${opt.value}`;
    const input = h('input', {
      type: 'radio',
      name: `eans-${schema.question_id}`,
      value: opt.value,
      id,
      class: 'erin-answer__radio',
    }) as HTMLInputElement;
    input.addEventListener('change', () => {
      if (input.checked) state.radioValue = opt.value;
    });
    const label = h(
      'label',
      { class: 'erin-answer__option erin-answer__option--radio', for: id },
      input,
      h('span', { class: 'erin-answer__option-label' }, opt.label)
    );
    group.appendChild(label);
  });
  return group;
}

function renderChipsForm(
  schema: Extract<AnswerSchema, { kind: 'chips' }>,
  state: FormState,
  questionLabel: string
): HTMLElement {
  const group = h('div', {
    class: 'erin-answer__options erin-answer__options--chips',
    role: 'group',
    'aria-label': questionLabel,
  });
  schema.options.forEach((opt) => {
    const btn = h(
      'button',
      {
        type: 'button',
        class: 'erin-answer__chip',
        'data-value': opt.value,
        'aria-pressed': 'false',
      },
      opt.label
    ) as HTMLButtonElement;
    btn.addEventListener('click', () => {
      if (state.chipValues.has(opt.value)) {
        state.chipValues.delete(opt.value);
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('erin-answer__chip--on');
      } else {
        state.chipValues.add(opt.value);
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('erin-answer__chip--on');
      }
    });
    group.appendChild(btn);
  });
  return group;
}

function renderShortTextForm(
  schema: Extract<AnswerSchema, { kind: 'short-text' }>,
  state: FormState
): HTMLElement {
  const wrap = h('div', { class: 'erin-answer__short-text' });
  const ta = h('input', {
    type: 'text',
    class: 'erin-answer__text-input',
    placeholder: schema.placeholder,
    maxlength: String(schema.maxLength),
  }) as HTMLInputElement;
  ta.addEventListener('input', () => {
    state.textValue = ta.value;
  });
  wrap.appendChild(ta);

  if (schema.tags && schema.tags.length > 0) {
    wrap.appendChild(
      h('div', { class: 'erin-answer__tags-label' }, 'Or tap any tags that fit (optional):')
    );
    const tagRow = h('div', {
      class: 'erin-answer__options erin-answer__options--chips',
      role: 'group',
    });
    schema.tags.forEach((opt) => {
      const btn = h(
        'button',
        {
          type: 'button',
          class: 'erin-answer__chip',
          'data-value': opt.value,
          'aria-pressed': 'false',
        },
        opt.label
      ) as HTMLButtonElement;
      btn.addEventListener('click', () => {
        if (state.tagValues.has(opt.value)) {
          state.tagValues.delete(opt.value);
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('erin-answer__chip--on');
        } else {
          state.tagValues.add(opt.value);
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('erin-answer__chip--on');
        }
      });
      tagRow.appendChild(btn);
    });
    wrap.appendChild(tagRow);
  }
  return wrap;
}

function renderPairTextForm(
  schema: Extract<AnswerSchema, { kind: 'pair-text' }>,
  state: FormState
): HTMLElement {
  const wrap = h('div', { class: 'erin-answer__pair' });
  const a = h('input', {
    type: 'text',
    class: 'erin-answer__text-input',
    placeholder: schema.a.placeholder,
    maxlength: String(schema.a.maxLength),
  }) as HTMLInputElement;
  a.addEventListener('input', () => {
    state.pairA = a.value;
  });
  const b = h('input', {
    type: 'text',
    class: 'erin-answer__text-input',
    placeholder: schema.b.placeholder,
    maxlength: String(schema.b.maxLength),
  }) as HTMLInputElement;
  b.addEventListener('input', () => {
    state.pairB = b.value;
  });
  wrap.append(
    h(
      'label',
      { class: 'erin-answer__pair-field' },
      h('span', { class: 'erin-answer__pair-label' }, schema.a.label),
      a
    ),
    h(
      'label',
      { class: 'erin-answer__pair-field' },
      h('span', { class: 'erin-answer__pair-label' }, schema.b.label),
      b
    )
  );
  return wrap;
}

/* ────────────────────────────────────────────────────────────────
 * Form orchestration
 * ──────────────────────────────────────────────────────────────── */

function buildPayload(
  schema: AnswerSchema,
  state: FormState
): { value: string; label: string | null; ok: boolean; errMsg?: string } {
  if (schema.kind === 'radio') {
    if (!state.radioValue) return { value: '', label: null, ok: false, errMsg: 'Pick one' };
    const opt = schema.options.find((o) => o.value === state.radioValue);
    return { value: state.radioValue, label: opt?.label ?? state.radioValue, ok: true };
  }
  if (schema.kind === 'chips') {
    if (state.chipValues.size === 0)
      return { value: '', label: null, ok: false, errMsg: 'Pick at least one' };
    const arr = [...state.chipValues];
    const labels = arr.map(
      (v) => schema.options.find((o) => o.value === v)?.label ?? v
    );
    return { value: JSON.stringify(arr), label: labels.join(' · '), ok: true };
  }
  if (schema.kind === 'short-text') {
    const txt = state.textValue.trim();
    if (!txt && state.tagValues.size === 0)
      return { value: '', label: null, ok: false, errMsg: 'Type a few words or tap a tag' };
    const tagArr = [...state.tagValues];
    const tagLabels = tagArr.map(
      (v) => schema.tags?.find((t) => t.value === v)?.label ?? v
    );
    return {
      value: txt || tagArr.join(','),
      label: tagLabels.length > 0 ? tagLabels.join(' · ') : null,
      ok: true,
    };
  }
  if (schema.kind === 'pair-text') {
    const a = state.pairA.trim();
    const b = state.pairB.trim();
    if (!a && !b)
      return { value: '', label: null, ok: false, errMsg: 'Fill at least one' };
    const payload: Record<string, string> = {};
    if (a) payload[schema.a.key] = a;
    if (b) payload[schema.b.key] = b;
    const labelParts: string[] = [];
    if (a) labelParts.push(`YES: ${a}`);
    if (b) labelParts.push(`NO: ${b}`);
    return { value: JSON.stringify(payload), label: labelParts.join(' · '), ok: true };
  }
  return { value: '', label: null, ok: false, errMsg: 'Unknown form kind' };
}

/* ────────────────────────────────────────────────────────────────
 * Public entry
 * ──────────────────────────────────────────────────────────────── */

/**
 * Render the structured-answer form for a single question. Pass the question
 * label (for accessibility) and a callback that opens the existing 💬 modal
 * scoped to this question.
 *
 * Returns a wrapper element that swaps its contents between three states:
 *   loading → form → submitted (with "change answer" back to form).
 */
export function renderAnswerForm(
  question_id: string,
  questionLabel: string,
  openFreeformModal: () => void
): HTMLElement | null {
  if (!hasSchema(question_id)) return null;
  const schema = ANSWER_SCHEMAS[question_id];
  if (!schema) return null;

  const wrap = h('div', { class: 'erin-answer-wrap' });
  wrap.appendChild(
    h('div', { class: 'erin-answer__loading' }, 'Loading your previous answer…')
  );

  const renderForm = (): void => {
    const state = newState();
    let body: HTMLElement;
    if (schema.kind === 'radio') {
      body = renderRadioForm(schema, state, questionLabel);
    } else if (schema.kind === 'chips') {
      body = renderChipsForm(schema, state, questionLabel);
    } else if (schema.kind === 'short-text') {
      body = renderShortTextForm(schema, state);
    } else {
      body = renderPairTextForm(schema, state);
    }

    // Optional freeform supplemental input for radio/chips schemas.
    const freeformLabel =
      schema.kind === 'radio' || schema.kind === 'chips'
        ? schema.freeformLabel
        : undefined;
    const freeformEl = freeformLabel
      ? (() => {
          const w = h('label', { class: 'erin-answer__freeform-label' });
          w.appendChild(h('span', {}, freeformLabel));
          const ta = h('textarea', {
            class: 'erin-answer__freeform',
            placeholder: 'Add a quick note (optional)',
            rows: '2',
            maxlength: '500',
          }) as HTMLTextAreaElement;
          ta.addEventListener('input', () => {
            state.freeform = ta.value;
          });
          w.appendChild(ta);
          return w;
        })()
      : null;

    const errEl = h('div', { class: 'erin-answer__err', role: 'alert' });
    errEl.hidden = true;

    const submitBtn = h(
      'button',
      {
        type: 'button',
        class: 'erin-answer__submit',
      },
      'Submit answer'
    ) as HTMLButtonElement;

    submitBtn.addEventListener('click', () => {
      const built = buildPayload(schema, state);
      if (!built.ok) {
        errEl.textContent = built.errMsg ?? 'Please complete the form';
        errEl.hidden = false;
        return;
      }
      errEl.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      void (async () => {
        try {
          const row = await submitAnswer({
            question_id,
            answer_value: built.value,
            answer_label: built.label,
            freeform: state.freeform.trim() || null,
            answered_by: 'Erin',
          });
          showInlineToast('Answer saved — Allison will see it next session');
          wrap.replaceChildren(
            renderSubmittedState(schema, row, renderForm, openFreeformModal)
          );
          // Notify any home-strip listeners so the ✓ flips in-page.
          try {
            window.dispatchEvent(
              new CustomEvent('ncades:erin-answer-submitted', {
                detail: { question_id },
              })
            );
          } catch {
            /* ignore */
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errEl.textContent = `Failed: ${msg}`;
          errEl.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit answer';
        }
      })();
    });

    wrap.replaceChildren(
      h(
        'div',
        { class: 'erin-answer erin-answer--form' },
        h('div', { class: 'erin-answer__form-lede' }, 'Quick structured answer:'),
        body,
        freeformEl,
        errEl,
        h(
          'div',
          { class: 'erin-answer__submit-row' },
          submitBtn
        )
      )
    );
  };

  // Kick off the prior-answer load.
  void (async () => {
    try {
      const prior = await latestAnswerForQuestion(question_id);
      if (prior) {
        wrap.replaceChildren(
          renderSubmittedState(schema, prior, renderForm, openFreeformModal)
        );
      } else {
        renderForm();
      }
    } catch {
      // Fail-loud-ish: still let her submit. Network might be flaky.
      renderForm();
    }
  })();

  return wrap;
}

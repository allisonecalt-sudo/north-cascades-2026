/**
 * erin-answers.ts — Supabase REST client for north_cascades_erin_answers.
 *
 * Why this file exists (2026-05-17 PM, Allison directive: "her answers should go
 * right into claude" + "both"): the For-Erin page just shipped per-question 💬
 * freeform notes. This adds STRUCTURED answers alongside — radio/chip/short-text
 * forms whose results land as a known shape Claude can read deterministically
 * instead of parsing prose. Both layers run together so Erin still has a
 * freeform channel for nuance.
 *
 * What's decided:
 *   - Mirrors `data/notes.ts` shape: anon key reuse, REST endpoint, no SDK.
 *   - Table: `public.north_cascades_erin_answers` (id, question_id, answer_value,
 *     answer_label, freeform, answered_by, created_at). Created via Management
 *     API on 2026-05-17, RLS allow-anon insert/select/update.
 *   - Append-only writes — each submit inserts a new row. `latest…` helpers
 *     return the most-recent row per question (created_at DESC, limit 1) so
 *     "change my answer" simply submits a new row that supersedes the prior
 *     one. Audit trail preserved.
 *   - answer_value = canonical id (e.g. 'B', 'moderate-ok'). answer_label =
 *     human string Erin saw when she picked. freeform = optional supplemental
 *     short text per the schema (paired text fields, "Other" specify, etc.).
 *
 * What's built: ANSWER_SCHEMAS, submitAnswer, listAnswersByQuestion,
 *   listAllAnswers, latestAnswerForQuestion.
 * What's next: weekly digest of structured answers folded into the same
 *   second-brain session-start sweep that currently reads notes.
 *
 * Links: `src/sections/for-erin.ts` renders the forms; `src/data/notes.ts` is
 * the freeform sibling.
 */

const SUPABASE_URL = 'https://hpiyvnfhoqnnnotrmwaz.supabase.co';
// Same anon key as notes.ts — safe to expose in the public site, RLS
// restricts access to this table (insert/select/update for anon role).
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaXl2bmZob3Fubm5vdHJtd2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzIwNDEsImV4cCI6MjA4ODA0ODA0MX0.AsGhYitkSnyVMwpJII05UseS_gICaXiCy7d8iHsr6Qw';

const headers: Record<string, string> = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export interface EAnswer {
  id: string;
  question_id: string;
  answer_value: string;
  answer_label: string | null;
  freeform: string | null;
  answered_by: string;
  created_at: string;
}

export interface SubmitAnswerInput {
  question_id: string;
  answer_value: string;
  answer_label?: string | null;
  freeform?: string | null;
  answered_by?: string;
}

/* ────────────────────────────────────────────────────────────────
 * Per-question answer schemas (5 must-have questions only).
 *
 * Each schema is the spec for ONE question's structured form. Renderer in
 * `sections/for-erin.ts` reads it to build radio buttons / chips / text fields.
 *
 * Kinds:
 *   - 'radio'  → single-choice (one of options[].value). Optional freeformLabel
 *               surfaces a small "say more" text input.
 *   - 'chips'  → multi-select chips. answer_value = JSON-stringified array of
 *               selected option values.
 *   - 'short-text' → up to 140 chars; optional `tags` produces a multi-select
 *               chip row alongside.
 *   - 'pair-text' → two short text fields (Hard YES / Hard NO style).
 *               answer_value = JSON-stringified {a, b}.
 * ──────────────────────────────────────────────────────────────── */

export type AnswerSchema =
  | {
      kind: 'radio';
      question_id: string;
      options: { value: string; label: string }[];
      freeformLabel?: string;
    }
  | {
      kind: 'chips';
      question_id: string;
      options: { value: string; label: string }[];
      freeformLabel?: string;
    }
  | {
      kind: 'short-text';
      question_id: string;
      placeholder: string;
      maxLength: number;
      tags?: { value: string; label: string }[];
    }
  | {
      kind: 'pair-text';
      question_id: string;
      a: { key: string; label: string; placeholder: string; maxLength: number };
      b: { key: string; label: string; placeholder: string; maxLength: number };
    };

export const ANSWER_SCHEMAS: Record<string, AnswerSchema> = {
  path: {
    kind: 'radio',
    question_id: 'path',
    options: [
      { value: 'A', label: 'A — simplest, one west-side base' },
      { value: 'B', label: 'B — full park, mid-trip move' },
      { value: 'C', label: 'C — slow east-side base, skips Cascade Pass' },
      { value: 'other', label: 'Other (specify in note)' },
    ],
    freeformLabel: 'Anything to add? (optional)',
  },
  'hike-ceiling': {
    kind: 'chips',
    question_id: 'hike-ceiling',
    options: [
      { value: 'easy-only', label: 'Easy only (<800 ft / <4 mi)' },
      { value: 'moderate-ok', label: 'Moderate ok (800–1500 ft / 4–7 mi)' },
      { value: 'hard-ok', label: 'Hard ok (1500–2500 ft / 7–10 mi)' },
      { value: 'killer-ok', label: 'Up for the killer (2500+ ft / 10+ mi)' },
      { value: 'variable', label: 'Variable — depends on the day' },
    ],
    freeformLabel: 'Anything to add? (optional)',
  },
  'site-channel': {
    kind: 'radio',
    question_id: 'site-channel',
    options: [
      { value: 'notes-here', label: 'Notes here (💬)' },
      { value: 'google-doc', label: 'Google Doc' },
      { value: 'text-email', label: 'Text/email Allison' },
      { value: 'mix-all', label: 'Mix of all three' },
    ],
    freeformLabel: 'Anything to add? (optional)',
  },
  'wants-overall': {
    kind: 'short-text',
    question_id: 'wants-overall',
    placeholder: 'In your own words — what do you want from this trip?',
    maxLength: 140,
    tags: [
      { value: 'recharge', label: 'Recharge' },
      { value: 'big-views', label: 'Big views' },
      { value: 'hike-heavy', label: 'Hike-heavy' },
      { value: 'slow-cozy', label: 'Slow & cozy' },
      { value: 'photo-trip', label: 'Photo trip' },
      { value: 'one-thing', label: "One-thing-I'll-never-forget" },
      { value: 'no-fomo', label: 'No FOMO' },
    ],
  },
  'must-skip-or-must-do': {
    kind: 'pair-text',
    question_id: 'must-skip-or-must-do',
    a: {
      key: 'hard_yes',
      label: "Hard YES (1 thing I'd be sad to miss):",
      placeholder: 'e.g. "see Cascade Pass at golden hour"',
      maxLength: 140,
    },
    b: {
      key: 'hard_no',
      label: 'Hard NO (dealbreaker):',
      placeholder: 'e.g. "no 4 AM starts"',
      maxLength: 140,
    },
  },
};

/** True if the given question_id has a structured-answer schema. */
export function hasSchema(question_id: string): boolean {
  return Object.prototype.hasOwnProperty.call(ANSWER_SCHEMAS, question_id);
}

/* ────────────────────────────────────────────────────────────────
 * REST helpers
 * ──────────────────────────────────────────────────────────────── */

export async function submitAnswer(input: SubmitAnswerInput): Promise<EAnswer> {
  const body = {
    question_id: input.question_id,
    answer_value: input.answer_value,
    answer_label: input.answer_label ?? null,
    freeform: input.freeform ?? null,
    answered_by: input.answered_by ?? 'Erin',
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/north_cascades_erin_answers`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`submitAnswer failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as EAnswer[];
  const first = data[0];
  if (!first) throw new Error('submitAnswer returned no row');
  return first;
}

export async function listAnswersByQuestion(question_id: string): Promise<EAnswer[]> {
  const params = new URLSearchParams({
    select: '*',
    order: 'created_at.desc',
    question_id: `eq.${question_id}`,
  });
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/north_cascades_erin_answers?${params.toString()}`,
    { headers }
  );
  if (!res.ok) throw new Error(`listAnswersByQuestion failed (${res.status})`);
  return (await res.json()) as EAnswer[];
}

export async function listAllAnswers(): Promise<EAnswer[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/north_cascades_erin_answers?select=*&order=created_at.desc`,
    { headers }
  );
  if (!res.ok) throw new Error(`listAllAnswers failed (${res.status})`);
  return (await res.json()) as EAnswer[];
}

/** Most-recent answer for a single question, or null if none yet. */
export async function latestAnswerForQuestion(question_id: string): Promise<EAnswer | null> {
  const params = new URLSearchParams({
    select: '*',
    order: 'created_at.desc',
    question_id: `eq.${question_id}`,
    limit: '1',
  });
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/north_cascades_erin_answers?${params.toString()}`,
    { headers }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as EAnswer[];
  return rows[0] ?? null;
}

/**
 * Batch helper used by the home strip: latest answer for each must-have
 * question in ONE round trip. Returns a map keyed by question_id (missing
 * key = unanswered).
 */
export async function latestAnswersForQuestions(
  question_ids: string[]
): Promise<Record<string, EAnswer>> {
  if (question_ids.length === 0) return {};
  // Build an `in.(...)` filter — server will sort newest-first; we dedupe
  // client-side keeping the first row per question_id.
  const inList = question_ids.map((id) => id.replace(/,/g, '\\,')).join(',');
  const params = new URLSearchParams({
    select: '*',
    order: 'created_at.desc',
    question_id: `in.(${inList})`,
  });
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/north_cascades_erin_answers?${params.toString()}`,
    { headers }
  );
  if (!res.ok) return {};
  const rows = (await res.json()) as EAnswer[];
  const map: Record<string, EAnswer> = {};
  for (const r of rows) {
    if (!map[r.question_id]) map[r.question_id] = r;
  }
  return map;
}

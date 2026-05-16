/**
 * Supabase REST client for north_cascades_notes — minimal, no SDK.
 *
 * Why this file exists: lets Erin (and Allison) leave notes from the live site
 * that land in Supabase, so Allison's Claude can pull them at the start of each
 * session and iterate the trip. Mirrors the Austria notes pattern
 * (`austria_notes` in the same budget-2026 project).
 *
 * What's decided:
 *   - Anon key inlined — RLS allows insert + select only, no PII, public site.
 *   - Table: `north_cascades_notes` (id, author, section, path_id, note,
 *     created_at, addressed). Schema mirrors Austria but with section/path_id
 *     surfaced as first-class columns (Austria used day_id/activity_id).
 *   - `addressed` flips true server-side once Allison's Claude handles a note.
 *
 * What's built: insertNote, listNotes, listNotesBySection.
 * What's next: weekly digest of unaddressed notes (handled in second-brain side).
 *
 * Links: see `projects/north-cascades-2026/README.md` for the trip pitch, and
 * `now/pending-commitments.md` for the per-session polling commitment.
 */

const SUPABASE_URL = 'https://hpiyvnfhoqnnnotrmwaz.supabase.co';
// Anon key — safe to expose in a public site. RLS limits access to the
// north_cascades_notes table only (insert + select for anon role).
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaXl2bmZob3Fubm5vdHJtd2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzIwNDEsImV4cCI6MjA4ODA0ODA0MX0.AsGhYitkSnyVMwpJII05UseS_gICaXiCy7d8iHsr6Qw';

const headers: Record<string, string> = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export type PathLetter = 'A' | 'B' | 'C';

export interface Note {
  id: string;
  author: string;
  section: string | null;
  path_id: PathLetter | null;
  note: string;
  created_at: string;
  addressed: boolean;
}

export interface InsertNoteInput {
  author: string;
  section: string | null;
  path_id: PathLetter | null;
  note: string;
}

export async function insertNote(input: InsertNoteInput): Promise<Note> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/north_cascades_notes`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Insert failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as Note[];
  const first = data[0];
  if (!first) {
    throw new Error('Insert returned no row');
  }
  return first;
}

export async function listNotes(): Promise<Note[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/north_cascades_notes?select=*&order=created_at.desc`,
    { headers }
  );
  if (!res.ok) throw new Error(`List failed (${res.status})`);
  return (await res.json()) as Note[];
}

export async function listNotesBySection(section: string): Promise<Note[]> {
  const params = new URLSearchParams({
    select: '*',
    order: 'created_at.desc',
    section: `eq.${section}`,
  });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/north_cascades_notes?${params.toString()}`, {
    headers,
  });
  if (!res.ok) throw new Error(`List failed (${res.status})`);
  return (await res.json()) as Note[];
}

/**
 * Get section -> count map for badge rendering. Single round-trip.
 */
export async function countsBySection(): Promise<Record<string, number>> {
  const notes = await listNotes();
  const counts: Record<string, number> = {};
  for (const n of notes) {
    if (!n.section) continue;
    counts[n.section] = (counts[n.section] ?? 0) + 1;
  }
  return counts;
}

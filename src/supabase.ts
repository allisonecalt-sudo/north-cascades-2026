// ===========================================================================
// supabase.ts — minimal Supabase REST client for the north_cascades_notes
// table. No SDK. The anon key is safe to expose in a public site because RLS
// allows only insert + select on north_cascades_notes (no auth, no PII).
//
// Table (existing, from the pre-rebuild site): north_cascades_notes —
//   id, author, section, path_id, note, created_at, addressed, status.
// The brochure's floating 💬 button inserts { author, section:'general', note }
// — the tandem-readable feedback channel (Claude reads notes between sessions).
// ===========================================================================

const SUPABASE_URL = 'https://hpiyvnfhoqnnnotrmwaz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaXl2bmZob3Fubm5vdHJtd2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzIwNDEsImV4cCI6MjA4ODA0ODA0MX0.AsGhYitkSnyVMwpJII05UseS_gICaXiCy7d8iHsr6Qw';

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export interface InsertNoteInput {
  note: string;
  author?: string;
  section?: string;
}

export async function insertNote(input: InsertNoteInput): Promise<void> {
  const body = {
    note: input.note,
    author: input.author ?? 'erin',
    section: input.section ?? 'general',
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/north_cascades_notes`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Insert failed (${res.status}): ${text}`);
  }
}

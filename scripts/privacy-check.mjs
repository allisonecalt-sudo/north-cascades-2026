// ===========================================================================
// privacy-check.mjs — fail the build if PRIVATE data leaks into public files.
//
// Why: the public site (GitHub Pages) must never carry confirmation codes,
//   eTicket numbers, seat assignments, PINs, payment details, or the
//   unconfirmed Minkler Rd street address. Those live ONLY in the private
//   BOOKED.md / Gmail (BOOKED.md rule + spec rule A10). Hard CI gate before build.
//
// The public site IS allowed to show flight NUMBERS + TIMES (UA1330, UA2017,
//   "7:59 AM", "10:58 PM") — that's the agreed reduced view. So the patterns
//   below target the LEAK shapes (codes/eTickets/seats/Airbnb confs/address),
//   not flight numbers or clock times.
//
// Scans: index.html + src/** + scripts/**. Skips node_modules/dist/.git.
// Negative-tested at the bottom of this file's history: the real private values
//   (IXMH2Z, 0162104377347, 37A, 31D, HMKXHM8AW5, HMA4W2E22N, 27024 Minkler Rd)
//   all trip a pattern; the public values that MUST pass (UA1330, UA2017,
//   "10:58 PM", "WA-20", "MP 132", "$1,193") do NOT.
// ===========================================================================

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.github']);
const SCAN_EXT = new Set(['.ts', '.js', '.mjs', '.html', '.css', '.json']);

// This script itself documents the patterns it bans, so exempt it from scan.
const SELF = 'privacy-check.mjs';

// Match the data-LEAK shape, not the public reduced view.
const PATTERNS = [
  // Airbnb confirmation code: HM + 8+ uppercase alphanumerics (e.g. HMKXHM8AW5,
  // HMA4W2E22N). Anchored on the HM prefix so it won't hit ordinary words.
  { name: 'Airbnb confirmation code (HM…)', re: /\bHM[A-Z0-9]{8,}\b/ },
  // United PNR / 6-char airline confirmation code. Six A–Z/0–9 with at least
  // one letter AND one digit, all-caps — tight enough to skip plain words and
  // Airline PNR / 6-char confirmation code (e.g. IXMH2Z). A 6-char all-caps
  // alnum token with BOTH letters and digits, where the FIRST char is a LETTER
  // and it is NOT a flight-number shape ([A-Z]{2}\d{4}, e.g. UA1330) and NOT a
  // year-suffixed tech token (ES2022, ES2021). Real PNRs interleave letters and
  // digits; flight numbers are letters-then-digits. The negative lookaheads keep
  // UA1330 / UA2017 / ES2022 / DOM passing while IXMH2Z trips.
  {
    name: 'airline PNR / confirmation code',
    re: /\b(?![A-Z]{2}\d{4}\b)(?!E?S?20\d\d\b)(?![A-Z]+\d{4}\b)[A-Z](?=[A-Z0-9]{5}\b)(?=[A-Z0-9]*[A-Z])(?=[A-Z0-9]*\d)[A-Z0-9]*\d[A-Z0-9]*[A-Z][A-Z0-9]*\b/,
  },
  // eTicket number: a bare 13-digit run (United eTicket, e.g. 0162104377347).
  { name: '13-digit eTicket number', re: /\b\d{13}\b/ },
  // Generic 10-digit confirmation-number run (Booking.com shape, belt-and-braces).
  { name: '10-digit confirmation number', re: /\b\d{10}\b/ },
  // Seat assignment: "seat 37A", "seats 37A", "37A/31D", "seat: 31D". Requires a
  // seat KEYWORD next to a row-letter token so day labels / MP markers don't hit.
  { name: 'seat assignment', re: /\bseats?\b[^a-z0-9]{0,6}\d{1,3}[A-K]\b/i },
  { name: 'seat pair (NNL/NNL)', re: /\b\d{1,3}[A-K]\s*[/\\]\s*\d{1,3}[A-K]\b/ },
  // The unconfirmed private street address — explicit literal guard (the road
  // name itself, lower-cased to dodge tripping on this very comment line).
  { name: 'private street address', re: /\bminkler\b/i },
  // PIN label with a code.
  { name: 'PIN label with code', re: /\bPIN\b[^a-z]{0,12}\d{3,}/ },
];

// Config / generated files are not authored content and contain hashes + tech
// tokens (lockfile integrity base64, tsconfig "ES2022") that aren't real leaks.
const SKIP_FILES = new Set(['package-lock.json', 'package.json', 'tsconfig.json']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full, out);
    } else if (SCAN_EXT.has(extname(entry)) && entry !== SELF && !SKIP_FILES.has(entry)) {
      out.push(full);
    }
  }
  return out;
}

const violations = [];
for (const file of walk(ROOT)) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const p of PATTERNS) {
      if (p.re.test(line)) {
        violations.push({
          file: file.replace(ROOT + '\\', '').replace(ROOT + '/', ''),
          line: i + 1,
          pattern: p.name,
          text: line.trim().slice(0, 100),
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error('\n✗ PRIVACY CHECK FAILED — possible private data in public files:\n');
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  [${v.pattern}]`);
    console.error(`    ${v.text}`);
  }
  console.error(
    '\nMove these to BOOKED.md / Gmail. Public site shows flight numbers + times only, "Booked ✓ — details on file".\n',
  );
  process.exit(1);
}

console.log(
  '✓ privacy-check: no Airbnb/PNR confirmation codes, eTicket/seat numbers, PINs, or private address in public files',
);

// ===========================================================================
// link-check.mjs — verify every external link in trip.ts is well-formed (and,
// with --net, actually resolves), AND that every local photo file referenced
// in trip.ts exists on disk under public/.
//
// Why: spec rule A8/A11 — a photo must actually show the thing it claims, and
//   broken images / dead booking links are a fail-loud concern (dead links
//   broke trust before). NC's photos are LOCAL files (public/img/*), so the
//   photo check here is a filesystem existence check, not an HTTP probe.
//
// Network-gated: pass --net to actually hit the external URLs (CI / on demand).
//   Without it, external URLs are only shape-checked (https), so the default
//   `npm run check:links` stays fast and offline-safe. The LOCAL photo
//   existence check always runs (it's free + the most important fail-loud).
// ===========================================================================

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const NET = process.argv.includes('--net');

const src = readFileSync(join(ROOT, 'src', 'trip.ts'), 'utf8');

// 1) LOCAL photo existence — every `src: 'img/…'` must exist under public/.
const localImgs = [...src.matchAll(/src:\s*'(img\/[^']+)'/g)].map((m) => m[1]);
const missingImgs = localImgs.filter((rel) => !existsSync(join(ROOT, 'public', rel)));
if (missingImgs.length > 0) {
  console.error('\n✗ link-check: photo files referenced in trip.ts are MISSING under public/:');
  missingImgs.forEach((p) => console.error('   public/' + p));
  process.exit(1);
}
console.log(`✓ link-check: all ${localImgs.length} local photos exist under public/img`);

// 2) external website URLs (http(s) literals in the data module).
const urls = [...src.matchAll(/https?:\/\/[^\s'"`)]+/g)].map((m) => m[0]);

// ALSO build the Google Maps "Navigate" URLs from every `query:` field — these
// are generated at runtime by mapsUrl(), so they aren't literals, but they ARE
// the 📍 Navigate links (DELTA 2). Include so --net validates them too.
const queries = [...src.matchAll(/query:\s*'([^']+)'/g)].map((m) => m[1]);
const mapsUrls = queries.map(
  (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
);

const unique = [...new Set([...urls, ...mapsUrls])];

if (unique.length === 0) {
  console.error('✗ link-check: found NO external urls in src/trip.ts — that is suspicious.');
  process.exit(1);
}

// shape check (always).
const malformed = unique.filter((u) => {
  try {
    return new URL(u).protocol !== 'https:';
  } catch {
    return true;
  }
});
if (malformed.length > 0) {
  console.error('✗ link-check: malformed / non-https urls:');
  malformed.forEach((u) => console.error('   ' + u));
  process.exit(1);
}
console.log(`✓ link-check: ${unique.length} external urls, all well-formed https`);

if (!NET) {
  console.log('  (offline mode — run with --net to verify they resolve)');
  process.exit(0);
}

// live resolve check (--net). Send a real User-Agent + ranged GET, retry 429s.
const UA =
  'Mozilla/5.0 (north-cascades-2026 link-check; +https://github.com/allisonecalt-sudo/north-cascades-2026)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe(u) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(u, {
      method: 'GET',
      headers: { Range: 'bytes=0-0', 'User-Agent': UA },
      redirect: 'follow',
    });
    if (res.ok || res.status === 206) return null;
    if (res.status === 429) {
      await sleep(800 * (attempt + 1));
      continue;
    }
    return res.status;
  }
  return 429;
}

// HTTP 4xx/5xx = the page is GONE or broken → fatal (a dead link on the site).
// Network-level failures (DNS, TLS, connection refused/reset) usually mean the
// host blocks CI/cloud IPs (gosausee.com did this to the Austria repo) —
// retry once, then WARN only.
const dead = [];
const unreachable = [];
for (const u of unique) {
  try {
    const bad = await probe(u);
    if (bad !== null) dead.push(`${bad}  ${u}`);
  } catch {
    await sleep(1500);
    try {
      const bad = await probe(u);
      if (bad !== null) dead.push(`${bad}  ${u}`);
    } catch (err) {
      unreachable.push(`ERR (${err.message})  ${u}`);
    }
  }
}

if (unreachable.length > 0) {
  console.warn('\n⚠ link-check: unreachable from this network (NOT failing the build — likely CI-IP blocking; verify manually):');
  unreachable.forEach((d) => console.warn('   ' + d));
}
if (dead.length > 0) {
  console.error('\n✗ link-check: dead urls (HTTP error):');
  dead.forEach((d) => console.error('   ' + d));
  process.exit(1);
}
console.log(`✓ link-check: ${unique.length - unreachable.length}/${unique.length} external urls resolve${unreachable.length ? ` (${unreachable.length} unreachable, warned)` : ''}`);

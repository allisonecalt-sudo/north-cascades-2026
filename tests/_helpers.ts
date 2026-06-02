import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

/** All built pages (html filenames in dist/), e.g. "index.html", "lodging.html".
 *  Read from the build so the suite auto-adapts as pages are added/retired. */
export const PAGES: string[] = readdirSync(DIST)
  .filter((f) => f.endsWith('.html'))
  .sort();

/** Set for O(1) existence checks during link crawling. */
export const PAGE_SET = new Set(PAGES);

/** True for links we should NOT treat as internal page links. */
export function isExternalOrSpecial(href: string): boolean {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('data:') ||
    href.startsWith('javascript:')
  );
}

/** Normalize an internal href to the target html filename (or null for pure
 *  same-page anchors / non-page links). "lodging.html#x" -> "lodging.html". */
export function targetFile(href: string): string | null {
  if (!href || isExternalOrSpecial(href)) return null;
  if (href.startsWith('#')) return null; // same-page anchor
  const noHash = href.split('#')[0].split('?')[0];
  if (noHash === '' || noHash === '.' || noHash === './') return null;
  let file = noHash.replace(/^\.?\//, '');
  // Strip the production base path if an absolute /north-cascades-2026/... slips in.
  file = file.replace(/^north-cascades-2026\//, '');
  if (file.endsWith('/')) file += 'index.html';
  return file;
}

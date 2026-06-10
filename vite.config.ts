import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'node:path';

// Cache-bleed defense plugin (carried over from the Austria rebuild).
// GH-Pages serves HTML with a short max-age via Fastly; rapid-fire deploys can
// leave browser + edge caches holding stale HTML pointing to old bundle hashes.
// Vite already hashes JS/CSS — only HTML needs cache-busting. GH-Pages does NOT
// honor _headers files, so inject equivalent meta tags on every HTML page at
// build time, plus a per-build version stamp for devtools verification.
function htmlCacheBust(buildId: string): Plugin {
  const metaBlock = `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta name="x-build-id" content="${buildId}" />`;
  return {
    name: 'html-cache-bust',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/(<meta charset="UTF-8" \/>)/i, `$1\n    ${metaBlock}`);
      },
    },
  };
}

// GitHub Pages serves at /north-cascades-2026/ — base must match repo name.
// For local dev, base = "/". `vite preview` serves the production build, so it
// must also use the production base, else the built HTML's asset URLs 404.
const isPreview = process.argv.includes('preview');

export default defineConfig(({ command }) => ({
  base: command === 'build' || isPreview ? '/north-cascades-2026/' : '/',
  plugins: [htmlCacheBust(new Date().toISOString())],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // 2026-06-10 SCRATCH REBUILD: the brochure is ONE page. The old multi-
      // page site (lodging/hikes/things-to-do/… .html) lives on branch
      // archive/pre-rebuild-2026-06-10 — pullable, nothing lost.
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 5173,
  },
}));

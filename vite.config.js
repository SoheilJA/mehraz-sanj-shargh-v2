import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const skip = new Set(['node_modules', 'dist', '.git', 'public', 'src', 'scripts'])

function findHtmlEntries(dir, out = {}) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name) || name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) findHtmlEntries(p, out)
    else if (name.endsWith('.html')) {
      const rel = relative(root, p).replace(/\\/g, '/').replace(/\.html$/, '')
      out[rel === 'index' ? 'index' : rel] = p
    }
  }
  return out
}

// Rewrite root-absolute link hrefs in HTML (internal navigation) with the
// configured base, so the site works under GitHub Pages sub-paths.
function htmlBaseLinks() {
  return {
    name: 'html-base-links',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const base = ctx?.server?.config?.base ?? process.env.VITE_BASE ?? '/'
      // Only prefix internal navigation links; leave Vite-rewritten asset URLs
      // (already prefixed with base, no leading slash) untouched.
      return html.replace(/(href=")\/((?!\/)[^"]*")/g, (_, a, rest) =>
        rest.startsWith(base.replace(/^\//, '').split('/')[0] + '/') ? `${a}/${rest}` : `${a}${base}${rest}`
      )
    }
  }
}

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [tailwindcss(), htmlBaseLinks()],
  build: { rollupOptions: { input: findHtmlEntries(root) } }
})

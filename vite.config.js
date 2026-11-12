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

export default defineConfig({
  plugins: [tailwindcss()],
  build: { rollupOptions: { input: findHtmlEntries(root) } }
})

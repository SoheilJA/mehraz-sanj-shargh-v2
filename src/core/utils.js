export const fa = n => new Intl.NumberFormat('fa-IR').format(n)
export const faDigits = s => String(s).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
export const el = html => {
  const t = document.createElement('template')
  t.innerHTML = html.trim()
  return t.content.firstElementChild
}
export const frag = html => {
  const t = document.createElement('template')
  t.innerHTML = html.trim()
  return t.content
}
export const html = arr => arr.map(s => (typeof s === 'string' ? s : s.outerHTML)).join('')
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const norm = s => String(s)
  .replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, ' ')
  .replace(/[\u064B-\u065F]/g, '').trim()

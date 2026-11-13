import { navigation } from '../data/navigation.js'
import { frag } from '../core/utils.js'
import { gsap } from 'gsap'
import { reduced } from '../core/motion.js'

const logo = `<svg viewBox="0 0 48 48" aria-hidden="true">
<rect x="4" y="4" width="40" height="40" rx="10" fill="none" stroke="#28D7C2" stroke-width="2.5"/>
<path d="M24 8v32M8 24h32" stroke="#28D7C2" stroke-width="2" stroke-linecap="round"/>
<circle cx="24" cy="24" r="4" fill="#28D7C2"/>
<circle cx="24" cy="24" r="8.5" fill="none" stroke="#28D7C2" opacity=".4"/></svg>`

export function initNav() {
  const host = document.getElementById('site-nav')
  if (!host) return
  const path = location.pathname
  const base = import.meta.env.BASE_URL
  const links = navigation.main.map(l => {
    const norm = l.href.replace(/index\.html$/, '').replace(/\/$/, '') || base
    const isHome = l.href === base || l.href === '/'
    const active = isHome ? (path === norm || path === norm.replace(/\/$/, '') + '/') : path.startsWith(norm)
    return `<a href="${l.href}" ${active ? 'class="is-active" aria-current="page"' : ''}>${l.label}</a>`
  }).join('')

  host.appendChild(frag(`
    <div class="nav-shell" id="nav-shell">
      <div class="wrap">
        <div class="nav-inner">
          <a class="brand" href="${import.meta.env.BASE_URL}" aria-label="مهراز سنج شرق — صفحهٔ اصلی">${logo}
            <span class="brand-t"><b>مهراز سنج شرق</b></span></a>
          <nav class="nav-links" aria-label="ناوبری اصلی">${links}</nav>
          <div class="nav-actions">
            <a class="btn btn-primary btn-sm nav-cta" href="${import.meta.env.BASE_URL}contact.html">مشاوره</a>
            <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="باز و بستن منو">
              <i data-lucide="menu"></i></button>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu" hidden>
      ${navigation.main.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
      <a class="btn btn-primary btn-lg mobile-cta" href="${import.meta.env.BASE_URL}contact.html">دریافت مشاوره</a>
    </div>`))

  const shell = host.querySelector('#nav-shell')
  const onScroll = () => shell.classList.toggle('is-scrolled', (window.scrollY || 0) > 36)
  addEventListener('scroll', onScroll, { passive: true }); onScroll()

  const menu = host.querySelector('#mobile-menu')
  const toggle = host.querySelector('#nav-toggle')
  let open = false
  const setOpen = v => {
    open = v
    menu.hidden = !v
    toggle.setAttribute('aria-expanded', String(v))
    toggle.innerHTML = `<i data-lucide="${v ? 'x' : 'menu'}"></i>`
    import('../components/icons.js').then(m => m.renderIcons())
    document.documentElement.style.overflow = v ? 'hidden' : ''
    if (v && !reduced) gsap.from(menu.querySelectorAll('a'), { y: 24, opacity: 0, stagger: .06, duration: .5, ease: 'power3.out' })
    if (v) menu.querySelector('a')?.focus()
  }
  toggle.addEventListener('click', () => setOpen(!open))
  addEventListener('keydown', e => { if (e.key === 'Escape' && open) setOpen(false) })
}

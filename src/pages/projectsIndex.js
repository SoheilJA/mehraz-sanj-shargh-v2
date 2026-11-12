import { gsap } from 'gsap'
import { initPage } from '../core/shell.js'
import { projects, cats, catLabel } from '../data/projects.js'
import { visual } from '../components/visuals.js'
import { renderIcons } from '../components/icons.js'

const grid = document.getElementById('proj-grid')
const filters = document.getElementById('proj-filters')

grid.innerHTML = projects.map(p => `
  <a class="card proj-card" href="/projects/${p.slug}.html" data-cat="${p.cat}">
    <div class="pv">${visual(cats[p.cat].visual)}</div>
    <div class="pb">
      <span class="tag tag--teal">${catLabel(p.cat)}</span>
      <h3>${p.title}</h3>
      <p class="lead" style="font-size:.85rem">${p.overview.slice(0, 110)}…</p>
      <span class="link-arrow">مشاهدهٔ پروژه <i data-lucide="arrow-left"></i></span>
    </div>
  </a>`).join('')

const catsArr = [['all', 'همه'], ...Object.entries(cats).map(([k, v]) => [k, v.label])]
filters.innerHTML = catsArr.map(([k, l], i) =>
  `<button class="chip ${i === 0 ? 'is-on' : ''}" data-filter="${k}">${l}</button>`).join('')
filters.addEventListener('click', e => {
  const b = e.target.closest('[data-filter]'); if (!b) return
  filters.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', c === b))
  const f = b.dataset.filter
  const show = [], hide = []
  grid.querySelectorAll('.proj-card').forEach(c =>
    (f === 'all' || c.dataset.cat === f ? show : hide).push(c))
  gsap.to(hide, { opacity: 0, y: 12, duration: .22, onComplete: () => hide.forEach(c => (c.style.display = 'none')) })
  show.forEach(c => (c.style.display = ''))
  gsap.fromTo(show, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power3.out' })
})

const init = async () => { await initPage(); renderIcons() }
init()

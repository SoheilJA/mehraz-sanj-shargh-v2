import { gsap } from 'gsap'
import { initPage } from '../core/shell.js'
import { articles, articleCats } from '../data/articles.js'
import { fa } from '../core/utils.js'
import { renderIcons } from '../components/icons.js'

const grid = document.getElementById('art-grid')
const filters = document.getElementById('art-filters')

const card = a => `
  <a class="card art-card" href="/journal/${a.slug}.html" data-cat="${a.cat}">
    <span class="ai">${fa(String(articles.indexOf(a) + 1)).padStart(2, '۰')}</span>
    <span class="tag tag--teal">${a.cat}</span>
    <h3>${a.title}</h3>
    <p class="art-excerpt">${a.excerpt}</p>
    <span class="mute" style="font-size:.78rem">زمان مطالعه: ${fa(a.min)} دقیقه</span>
  </a>`

grid.innerHTML = articles.map(card).join('')

filters.innerHTML = [['all', 'همه'], ...articleCats.map(c => [c, c])]
  .map(([k, l], i) => `<button class="chip ${i === 0 ? 'is-on' : ''}" data-filter="${k}">${l}</button>`).join('')
filters.addEventListener('click', e => {
  const b = e.target.closest('[data-filter]'); if (!b) return
  filters.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', c === b))
  const f = b.dataset.filter
  const show = [], hide = []
  grid.querySelectorAll('.art-card').forEach(c =>
    (f === 'all' || c.dataset.cat === f ? show : hide).push(c))
  gsap.to(hide, { opacity: 0, y: 12, duration: .22, onComplete: () => hide.forEach(c => (c.style.display = 'none')) })
  show.forEach(c => (c.style.display = ''))
  gsap.fromTo(show, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power3.out' })
})

const init = async () => { await initPage(); renderIcons() }
init()

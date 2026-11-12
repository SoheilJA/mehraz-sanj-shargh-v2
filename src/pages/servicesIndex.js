import { initPage } from '../core/shell.js'
import { services } from '../data/services.js'
import { visual } from '../components/visuals.js'
import { renderIcons } from '../components/icons.js'

document.getElementById('svc-list').innerHTML = services.map(s => `
  <a class="card svc-panel" href="/services/${s.slug}.html" data-reveal>
    <div class="flex justify-between items-start">
      <span class="num-i">${s.num}</span><span class="eyebrow" style="letter-spacing:.2em">${s.en}</span>
    </div>
    <div class="svc-visual">${visual(s.visual)}</div>
    <h3 class="h-sub">${s.title}</h3>
    <p class="lead" style="font-size:.9rem">${s.tagline}</p>
    <span class="link-arrow mt-auto">جزئیات خدمت <i data-lucide="arrow-left"></i></span>
  </a>`).join('')

const init = async () => { await initPage(); renderIcons() }
init()

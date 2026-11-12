import { initPage } from '../core/shell.js'
import { projectBySlug, projects, catLabel, cats } from '../data/projects.js'
import { serviceBySlug } from '../data/services.js'
import { visual } from '../components/visuals.js'
import { renderIcons } from '../components/icons.js'
import { frag } from '../core/utils.js'

const main = document.getElementById('main')
const p = projectBySlug(main.dataset.project)
if (!p) {
  location.replace('/projects/index.html')
} else {
  const others = projects.filter(x => x.slug !== p.slug && x.cat === p.cat).slice(0, 3)
  const related = projects.filter(x => x.slug !== p.slug && x.cat !== p.cat).slice(0, 3)

  main.appendChild(frag(`
    <section class="section" style="padding-block:9rem 2rem">
      <div class="wrap flex flex-col gap-5" data-reveal>
        <p class="eyebrow">PROJECT · ${catLabel(p.cat)}</p>
        <h1 class="h-sec">${p.title}</h1>
        <div class="rule"></div>
        <p class="lead" style="max-width:720px">${p.overview}</p>
      </div>
    </section>
    <section class="section" style="padding-block:1rem">
      <div class="wrap grid md:grid-cols-5 gap-12 items-start">
        <div class="md:col-span-3 flex flex-col gap-6" data-reveal>
          <div class="card p-6">
            <span class="eyebrow" style="display:block;margin-bottom:1.5rem">PROJECT VISUAL — نمایشی</span>
            <div class="proj-showcase flex flex-col gap-4">
              ${p.gallery.map(g => `<div class="svc-visual">${visual(g)}</div>`).join('')}
            </div>
          </div>
          <div class="card p-6 flex flex-col gap-3">
            <span class="eyebrow">APPROACH</span>
            <p class="lead">${p.approach}</p>
          </div>
        </div>
        <div class="md:col-span-2 flex flex-col gap-5 md:sticky" style="top:6.5rem" data-reveal data-delay=".1">
          <div class="card p-6 flex flex-col gap-3">
            <span class="eyebrow">SCOPE OF WORK</span>
            <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.7rem">
              ${p.scope.map(s => `<li class="flex items-start gap-2"><i data-lucide="check" style="color:var(--color-teal);width:18px;height:18px;flex:none;margin-top:.35rem"></i><span class="lead" style="font-size:.92rem">${s}</span></li>`).join('')}
            </ul>
          </div>
          <div class="card p-6 flex flex-col gap-3">
            <span class="eyebrow">SERVICES USED</span>
            <div class="flex flex-wrap gap-2">
              ${p.services.map(sl => `<a class="tag tag--teal" href="/services/${sl}.html">${serviceBySlug(sl)?.title ?? sl}</a>`).join('')}
            </div>
          </div>
          <a class="btn btn-primary" data-magnetic href="/contact.html">درخواست مشابه این خدمت</a>
        </div>
      </div>
    </section>
    <section class="section grid-bg">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">MORE</p>
          <h2 class="h-sec">سایر پروژه‌ها</h2>
          <div class="rule"></div>
        </div>
        <div class="proj-grid" data-reveal-group>
          ${[...others, ...related].map(x => `
            <a class="card proj-card" href="/projects/${x.slug}.html">
              <div class="pv">${visual(cats[x.cat].visual)}</div>
              <div class="pb"><span class="tag tag--teal">${catLabel(x.cat)}</span><h3>${x.title}</h3>
              <span class="link-arrow">مشاهدهٔ پروژه <i data-lucide="arrow-left"></i></span></div>
            </a>`).join('')}
        </div>
      </div>
    </section>
    <section class="section" style="text-align:center">
      <div class="wrap flex flex-col items-center gap-5" data-reveal>
        <h2 class="h-sec">پروژهٔ مشابه دارید؟</h2>
        <a class="btn btn-primary btn-lg" data-magnetic href="/contact.html">دریافت مشاوره</a>
      </div>
    </section>`))
}

const init = async () => { await initPage(); renderIcons() }
init()

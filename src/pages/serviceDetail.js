import { gsap } from 'gsap'
import { initPage } from '../core/shell.js'
import { reduced } from '../core/motion.js'
import { serviceBySlug, services } from '../data/services.js'
import { projects } from '../data/projects.js'
import { visual } from '../components/visuals.js'
import { renderIcons } from '../components/icons.js'
import { frag } from '../core/utils.js'

const main = document.getElementById('main')
const s = serviceBySlug(main.dataset.service)
if (!s) {
  location.replace('/services/index.html')
} else {
  const others = services.filter(x => x.slug !== s.slug)
  const related = projects.filter(p => p.services.includes(s.slug)).slice(0, 3)

  main.appendChild(frag(`
    <section class="section" style="padding-block:9rem 2rem">
      <div class="wrap flex flex-col gap-5" data-reveal>
        <p class="eyebrow">SERVICE ${s.num} · <span style="letter-spacing:.2em">${s.en}</span></p>
        <h1 class="h-sec">${s.title}</h1>
        <div class="rule"></div>
        <p class="lead" style="max-width:680px">${s.tagline}</p>
      </div>
    </section>
    <section class="section" style="padding-block:1rem">
      <div class="wrap grid md:grid-cols-5 gap-12 items-start">
        <div class="md:col-span-3 flex flex-col gap-6" data-reveal>
          <p class="lead">${s.lead}</p>
          <div class="flex flex-col gap-3">
            ${s.what.map(p => `<p class="lead" style="font-size:1rem">— ${p}</p>`).join('')}
          </div>
          <div class="card p-6 flex flex-col gap-3">
            <span class="eyebrow">WORKFLOW</span>
            <div class="mtl" style="padding-block-start:1.5rem">
              <div class="mtl-grid">
                ${s.steps.map(([t, d], i) => `
                  <div class="mtl-step is-on"><span class="st-n">STEP 0${i + 1}</span>
                  <h3 class="h-sub" style="font-size:1rem">${t}</h3>
                  <p class="lead" style="font-size:.85rem">${d}</p></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="md:col-span-2 flex flex-col gap-5 md:sticky" style="top:6.5rem" data-reveal data-delay=".1">
          <div id="svc-hero-visual" class="card p-5"></div>
          <div class="card p-6 flex flex-col gap-3">
            <span class="eyebrow">DELIVERABLES</span>
            <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.7rem">
              ${s.outputs.map(o => `<li class="flex items-start gap-2"><i data-lucide="check" style="color:var(--color-teal);width:18px;height:18px;flex:none;margin-top:.35rem"></i><span class="lead" style="font-size:.92rem">${o}</span></li>`).join('')}
            </ul>
          </div>
          <a class="btn btn-primary" data-magnetic href="/contact.html">درخواست این خدمت</a>
        </div>
      </div>
    </section>
    <section class="section grid-bg">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">APPLICATIONS</p>
          <h2 class="h-sec">کاربردها</h2>
          <div class="rule"></div>
        </div>
        <div class="flex flex-wrap gap-3" data-reveal>
          ${s.uses.map(u => `<span class="tag tag--teal" style="font-size:.85rem;padding:.6rem 1.2rem">${u}</span>`).join('')}
        </div>
      </div>
    </section>
    ${related.length ? `
    <section class="section">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">RELATED PROJECTS</p>
          <h2 class="h-sec">پروژه‌های مرتبط</h2>
          <div class="rule"></div>
        </div>
        <div class="proj-grid" data-reveal-group>
          ${related.map(p => `
            <a class="card proj-card" href="/projects/${p.slug}.html">
              <div class="pv">${visual('profile')}</div>
              <div class="pb"><h3>${p.title}</h3>
              <p class="lead" style="font-size:.85rem">${p.overview.slice(0, 100)}…</p>
              <span class="link-arrow">مشاهدهٔ پروژه <i data-lucide="arrow-left"></i></span></div>
            </a>`).join('')}
        </div>
      </div>
    </section>` : ''}
    <section class="section" style="background:var(--color-deep)">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">OTHER SERVICES</p>
          <h2 class="h-sec">سایر خدمات</h2>
          <div class="rule"></div>
        </div>
        <div class="grid md:grid-cols-3 gap-5" data-reveal-group>
          ${others.map(x => `
            <a class="card p-6 flex flex-col gap-3" href="/services/${x.slug}.html">
              <span class="num-i">${x.num}</span>
              <h3 class="h-sub" style="font-size:1.05rem">${x.title}</h3>
              <p class="lead" style="font-size:.88rem">${x.tagline}</p>
            </a>`).join('')}
        </div>
      </div>
    </section>
    <section class="section" style="text-align:center">
      <div class="wrap flex flex-col items-center gap-5" data-reveal>
        <h2 class="h-sec">پروژهٔ شما، از یک گفت‌وگوی فنی شروع می‌شود</h2>
        <a class="btn btn-primary btn-lg" data-magnetic href="/contact.html">دریافت مشاوره</a>
      </div>
    </section>`))

  document.getElementById('svc-hero-visual').innerHTML = visual(s.visual)
}

const init = async () => { await initPage(); renderIcons() }
init()

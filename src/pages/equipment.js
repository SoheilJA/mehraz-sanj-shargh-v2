import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initPage } from '../core/shell.js'
import { reduced } from '../core/motion.js'
import { equipment } from '../data/equipment.js'
import { visual } from '../components/visuals.js'
import { renderIcons } from '../components/icons.js'
import { frag } from '../core/utils.js'

gsap.registerPlugin(ScrollTrigger)

const main = document.getElementById('main')
main.appendChild(frag(`
  <section class="section" style="padding-block:9rem 2rem">
    <div class="wrap flex flex-col gap-4" data-reveal>
      <p class="eyebrow">EQUIPMENT & CREW</p>
      <h1 class="h-sec">تجهیزات و تیم میدانی</h1>
      <div class="rule"></div>
      <p class="lead" style="max-width:680px">تجهیزات، تنها با تیمی که روش را می‌داند، به دادهٔ معتبر تبدیل می‌شود. ترکیب ابزار دقیق و تیم متخصص، ستون فقرات کیفیت خروجی‌های ماست.</p>
    </div>
  </section>
  <section class="section" style="padding-block:1rem">
    <div class="wrap flex flex-col gap-8" id="equip-body"></div>
  </section>
  <section class="section" style="text-align:center">
    <div class="wrap flex flex-col items-center gap-5" data-reveal>
      <h2 class="h-sec">برای پروژه‌تان تجهیزات و تیم مناسب را هماهنگ می‌کنیم</h2>
      <a class="btn btn-primary btn-lg" data-magnetic href="${import.meta.env.BASE_URL}contact.html">دریافت مشاوره</a>
    </div>
  </section>`))

document.getElementById('equip-body').innerHTML = equipment.map((e, i) => `
  <div class="grid md:grid-cols-2 gap-10 items-center ${i % 2 ? 'md:[direction:ltr]' : ''}" data-reveal>
    <div class="card p-6 md:[direction:rtl]">${visual(e.visual)}</div>
    <div class="flex flex-col gap-4 md:[direction:rtl]">
      <span class="eyebrow" style="letter-spacing:.22em">${e.en}</span>
      <h2 class="h-sec" style="font-size:1.5rem">${e.title}</h2>
      <p class="lead">${e.what}</p>
      <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.6rem">
        ${e.caps.map(c => `<li class="flex items-start gap-2"><i data-lucide="check" style="color:var(--color-teal);width:18px;height:18px;flex:none;margin-top:.35rem"></i><span class="lead" style="font-size:.95rem">${c}</span></li>`).join('')}
      </ul>
    </div>
  </div>`).join('')

const init = async () => { await initPage(); renderIcons() }
init()

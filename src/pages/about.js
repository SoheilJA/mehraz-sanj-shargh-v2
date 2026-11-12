import { gsap } from 'gsap'
import { initPage } from '../core/shell.js'
import { reduced } from '../core/motion.js'
import { visual } from '../components/visuals.js'
import { renderIcons } from '../components/icons.js'

document.getElementById('about-visual').innerHTML = `<div class="card p-6">${visual('control')}</div>`

document.getElementById('about-links').innerHTML = [
  ['نام شرکت', 'شرکت مهندسی نقشه‌برداری مهراز سنج شرق', 'building'],
  ['مدیریت فنی', 'مهندس محمد بخشی — کارشناس مهندسی نقشه‌برداری', 'users'],
  ['محل فعالیت', 'مشهد؛ ارائهٔ خدمات در کل استان خراسان', 'map-pin'],
  ['سبد خدمات', 'کنترل هندسی، توپوگرافی و As-Built، UTM و ثبتی، احجام خاکی', 'layers'],
  ['پروندهٔ پروژه', 'یازده دستهٔ مستند از کنترل شاقولی تا امور ژئودتیک اراضی', 'file-text'],
  ['روش‌شناسی', 'پنج مرحلهٔ کنترل‌شده: شبکه، برداشت، کنترل متقاطع، پردازش، تحویل', 'crosshair']
].map(([t, d, ic]) => `
  <div class="card p-6 flex flex-col gap-3">
    <i data-lucide="${ic}" style="color:var(--color-teal);width:22px;height:22px"></i>
    <h3 class="h-sub" style="font-size:1.05rem">${t}</h3>
    <p class="lead" style="font-size:.88rem">${d}</p>
  </div>`).join('')

const init = async () => {
  await initPage()
  renderIcons()
  if (!reduced) gsap.from('.page-about .rule', { scaleX: 0, transformOrigin: '100% 50%', duration: .8, ease: 'power3.out', delay: .3 })
}
init()

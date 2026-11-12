import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs'
import { initPage } from '../core/shell.js'
import { reduced, onPageHide } from '../core/motion.js'
import { fa } from '../core/utils.js'
import { createTerrain } from '../three/terrain.js'
import { services } from '../data/services.js'
import { projects, cats, catLabel } from '../data/projects.js'
import { articles } from '../data/articles.js'
import { equipment } from '../data/equipment.js'
import { testimonials } from '../data/testimonials.js'
import { visual } from '../components/visuals.js'
import { renderIcons } from '../components/icons.js'
import { fbm } from '../core/noise.js'

gsap.registerPlugin(ScrollTrigger)

/* ---------- hero 3D ---------- */
let heroReady = Promise.resolve()
let hudTimer = null
const canvas = document.getElementById('hero-canvas')
const terrain = createTerrain(canvas, { reduced })
if (terrain) {
  heroReady = terrain.ready
  onPageHide(() => { clearInterval(hudTimer); terrain.dispose() })
} else {
  document.getElementById('hero-fallback').hidden = false
}
if (terrain && !reduced) {
  let E = 625412, N = 4021360, Z = 985.2
  hudTimer = setInterval(() => {
    E += Math.round((Math.random() - .5) * 6); N += Math.round((Math.random() - .5) * 4)
    Z = +(Z + (Math.random() - .5) * .3).toFixed(1)
    document.getElementById('hud-read').textContent = `E ${E.toLocaleString('en')} · N ${N.toLocaleString('en')} · Z ${Z}`
  }, 1400)
}

/* ---------- marquees content ---------- */
const setOf = items => items.map(t => `<span class="mq-item">${t}</span>`).join('')
document.getElementById('mq-services').innerHTML = setOf(services.map(s => s.title))
document.getElementById('mq-cats').innerHTML = setOf(Object.values(cats).map(c => c.label))

/* ---------- 04 services ecosystem ---------- */
document.getElementById('svc-grid').innerHTML = services.map(s => `
  <a class="card svc-panel" href="/services/${s.slug}.html" data-reveal>
    <div class="flex justify-between items-start">
      <span class="num-i">${s.num}</span><span class="eyebrow" style="letter-spacing:.2em">${s.en}</span>
    </div>
    <div class="svc-visual">${visual(s.visual)}</div>
    <h3 class="h-sub">${s.title}</h3>
    <p class="lead" style="font-size:.9rem">${s.tagline}</p>
    <span class="link-arrow mt-auto">جزئیات خدمت <i data-lucide="arrow-left"></i></span>
  </a>`).join('')

/* ---------- 05 data viz ---------- */
const tabs = document.querySelectorAll('[data-tab]')
const panels = { contour: document.getElementById('viz-contour'), profile: document.getElementById('viz-profile') }
let contourDrawn = false, profileDrawn = false

function drawContour() {
  if (contourDrawn) return; contourDrawn = true
  const cv = document.getElementById('contour-canvas'), ctx = cv.getContext('2d')
  const base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height
  const b = base.getContext('2d')
  const pal = ['#0B1220','#0D1626','#101B2C','#132335','#18283B','#1D3147','#23405A','#28506B','#1F6067','#1B6E6E','#23857B','#28D7C2']
  const cell = 4, W = cv.width, H = cv.height
  for (let y = 0; y < H; y += cell) for (let x = 0; x < W; x += cell) {
    const v = fbm(x * .012 + 5, y * .012 + 9, 5)
    b.fillStyle = pal[Math.min(pal.length - 1, Math.floor(v * pal.length))]
    b.fillRect(x, y, cell, cell)
  }
  b.strokeStyle = 'rgba(148,163,184,.08)'
  for (let x = 0; x < W; x += 40) { b.beginPath(); b.moveTo(x, 0); b.lineTo(x, H); b.stroke() }
  for (let y = 0; y < H; y += 40) { b.beginPath(); b.moveTo(0, y); b.lineTo(W, y); b.stroke() }
  b.fillStyle = '#28D7C2'
  ;[[120, 90], [300, 250], [470, 160], [560, 320]].forEach(([x, y]) => { b.beginPath(); b.arc(x, y, 3, 0, 7); b.fill() })
  const redraw = (mx, my) => {
    ctx.drawImage(base, 0, 0)
    ctx.strokeStyle = 'rgba(40,215,194,.7)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, H); ctx.moveTo(0, my); ctx.lineTo(W, my); ctx.stroke()
    ctx.fillStyle = '#28D7C2'; ctx.beginPath(); ctx.arc(mx, my, 4, 0, 7); ctx.fill()
    const E = 625000 + Math.round((mx / W) * 12000), N = 4020000 + Math.round((1 - my / H) * 6000)
    ctx.font = '12px monospace'; ctx.fillStyle = '#F1F5F9'; ctx.textAlign = 'left'; ctx.direction = 'ltr'
    ctx.fillText(`E ${E.toLocaleString('en')}  N ${N.toLocaleString('en')}`, 12, 22)
  }
  redraw(320, 200)
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect()
    redraw((e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height))
  })
}

function drawProfile() {
  if (profileDrawn) return; profileDrawn = true
  const svg = document.getElementById('profile-svg')
  const pts = []
  for (let i = 0; i <= 80; i++) {
    const d = i * 6.25
    const h = (fbm(d * .03 + 3, 7.7, 4) - .5) * 120
    pts.push(`${i * 8},${140 - h}`)
  }
  svg.innerHTML = `
    <g stroke="rgba(148,163,184,.35)"><path d="M0 30h640M0 90h640M0 150h640M0 210h640" stroke-dasharray="2 6"/></g>
    <polyline class="pf-main" points="${pts.join(' ')}" fill="none" stroke="#28D7C2" stroke-width="2"/>
    <path d="M0 150h640" stroke="rgba(148,163,184,.5)"/>
    <g fill="#94A3B8" font-size="11" font-family="monospace">
      <text x="8" y="228">0m</text><text x="300" y="228">250m</text><text x="600" y="228">500m</text>
      <text x="620" y="40" direction="ltr">Z</text></g>`
  const line = svg.querySelector('.pf-main'), len = line.getTotalLength?.() ?? 1600
  line.style.strokeDasharray = len; line.style.strokeDashoffset = len
  anime({ targets: line, strokeDashoffset: [len, 0], duration: reduced ? 0 : 1800, easing: 'easeInOutSine' })
}

tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => { const on = x === t; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on) })
  const k = t.dataset.tab
  Object.entries(panels).forEach(([key, p]) => (p.hidden = key !== k))
  k === 'contour' ? drawContour() : drawProfile()
}))
drawContour()

/* ---------- 06 showcase ---------- */
const grid = document.getElementById('proj-grid')
const filters = document.getElementById('proj-filters')
const cardHTML = p => `
  <a class="card proj-card" href="/projects/${p.slug}.html" data-cat="${p.cat}">
    <div class="pv">${visual(cats[p.cat].visual)}</div>
    <div class="pb">
      <span class="tag tag--teal">${catLabel(p.cat)}</span>
      <h3>${p.title}</h3>
      <p class="lead" style="font-size:.85rem">${p.overview.slice(0, 110)}…</p>
      <span class="link-arrow">مشاهدهٔ پروژه <i data-lucide="arrow-left"></i></span>
    </div>
  </a>`
grid.innerHTML = projects.map(cardHTML).join('')
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

/* ---------- 07 field visual / 08 equipment teaser ---------- */
document.getElementById('field-visual').innerHTML = `<div class="card p-6">${visual('station')}</div>`
document.getElementById('equip-teaser').innerHTML = equipment.map(e => `
  <a class="card p-6 flex flex-col gap-4" href="/equipment.html">
    <span class="eyebrow" style="letter-spacing:.22em">${e.en}</span>
    <div>${visual(e.visual)}</div>
    <h3 class="h-sub">${e.title}</h3>
    <p class="lead" style="font-size:.88rem">${e.what.slice(0, 90)}…</p>
  </a>`).join('')

/* ---------- 10 trust ---------- */
document.getElementById('trust-grid').innerHTML = [
  ['مدیریت', 'مهندس محمد بخشی — کارشناس مهندسی نقشه‌برداری؛ مدیریت فنی و اجرایی شرکت.', 'users'],
  ['پوشش خدمات', 'ارائهٔ خدمات در کل استان خراسان؛ مرکز عملیات: مشهد.', 'map-pin'],
  ['سبد خدمات', 'چهار حوزهٔ تخصصی: کنترل هندسی، توپوگرافی و As-Built، UTM و ثبتی، احجام خاکی.', 'layers'],
  ['تجهیزات', 'توتال استیشن، گیرنده‌های GNSS چندفرکانسی و تیم میدانی متخصص.', 'crosshair'],
  ['مستندات پروژه', 'یازده دستهٔ پروژهٔ مستند، از کنترل شاقولی تا پایش گودبرداری و امور ژئودتیک.', 'file-text'],
  ['همکاری', 'فرایند شروع: تماس، بررسی نیاز، بازدید در صورت لزوم، و توافق مکتوب دامنهٔ کار.', 'check']
].map(([t, d, ic]) => `
  <div class="card p-6 flex flex-col gap-3">
    <i data-lucide="${ic}" style="color:var(--color-teal);width:22px;height:22px"></i>
    <h3 class="h-sub" style="font-size:1.05rem">${t}</h3>
    <p class="lead" style="font-size:.88rem">${d}</p>
  </div>`).join('')

/* ---------- 11 testimonials (sample) ---------- */
document.getElementById('tst-set').innerHTML = testimonials.map(t => `
  <div class="card tst-card mq-item">
    <q>${t.quote}</q>
    <div class="tst-role"><span>${t.role}</span><span class="badge-sample">نمونهٔ نمایشی</span></div>
  </div>`).join('')

/* ---------- 12 journal teaser ---------- */
const pick = ['engineering-surveying-principles', 'high-rise-geometric-control', 'gnss-in-civil-projects']
document.getElementById('journal-teaser').innerHTML = pick.map((s, i) => {
  const a = articles.find(x => x.slug === s)
  return `<a class="card art-card" href="/journal/${a.slug}.html">
    <span class="ai">0${i + 1}</span><span class="tag tag--teal">${a.cat}</span>
    <h3>${a.title}</h3><p class="art-excerpt">${a.excerpt}</p>
    <span class="mute" style="font-size:.78rem">زمان مطالعه: ${fa(a.min)} دقیقه</span>
  </a>`
}).join('')

/* ---------- hero intro + precision draw + methodology ---------- */
const heroEls = document.querySelectorAll('[data-hero]')
gsap.set(heroEls, { opacity: 0, y: 26 })
const init = async () => {
  await initPage({ waitFor: [heroReady] })
  renderIcons()
  if (!reduced) {
    gsap.to(heroEls, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: 'power3.out', delay: .1 })
    anime({ targets: '.hud-chip', opacity: [0, 1], translateY: [8, 0], delay: anime.stagger(220, { start: 700 }), duration: 700, easing: 'easeOutQuad' })
    document.querySelectorAll('.pr-line').forEach(p => {
      const L = 300
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L
      gsap.to(p, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: '#precision-svg', start: 'top 80%', once: true } })
    })
    const line = document.getElementById('mtl-line')
    gsap.to(line, { scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '#mtl', start: 'top 70%', end: 'bottom 55%', scrub: .6 } })
    document.querySelectorAll('.mtl-step').forEach(st =>
      ScrollTrigger.create({ trigger: st, start: 'top 75%', onEnter: () => st.classList.add('is-on') }))
    anime({ targets: '#precision-svg .pr-dot', scale: [0, 1], delay: 1400, duration: 600, easing: 'easeOutElastic(1,.6)' })
  } else heroEls.forEach(e => gsap.set(e, { opacity: 1, y: 0 }))
}
init()

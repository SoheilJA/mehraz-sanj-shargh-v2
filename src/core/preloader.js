import { gsap } from 'gsap'
import { reduced } from './motion.js'
import { faDigits } from './utils.js'

const KEY = 'mss:loaded'
const MAX = 2200

export function initPreloader(waitFor = []) {
  const node = document.getElementById('preloader')
  if (!node) return Promise.resolve()
  const done = () => { node.remove(); document.body.classList.add('is-ready'); try { sessionStorage.setItem(KEY, '1') } catch { /* noop */ } }

  if (reduced || sessionStorage.getItem(KEY)) { done(); return Promise.resolve() }

  const fill = node.querySelector('.pre-fill')
  const pct = node.querySelector('.pre-pct')
  let p = 0
  const set = v => {
    p = Math.max(p, Math.min(100, v))
    fill.style.transform = `scaleX(${p / 100})`
    pct.textContent = faDigits(Math.round(p)) + '٪'
  }
  set(10)

  const tasks = [...waitFor, document.fonts?.ready ?? Promise.resolve()]
  const step = 82 / tasks.length
  tasks.forEach(t => Promise.resolve(t).then(() => set(p + step)).catch(() => set(p + step)))

  return new Promise(resolve => {
    const finish = () => {
      set(100)
      const tl = gsap.timeline({ onComplete: () => { done(); resolve() } })
      tl.to(node.querySelector('.pre-inner'), { opacity: 0, y: -22, duration: .35, ease: 'power2.in' })
        .to(node, { yPercent: -100, duration: .85, ease: 'power4.inOut' }, '-=.1')
    }
    const force = setTimeout(finish, MAX)
    window.addEventListener('load', () => setTimeout(() => { clearTimeout(force); finish() }, 350), { once: true })
    // never stuck: if everything settled early, finish
    Promise.allSettled(tasks).then(() => setTimeout(() => { clearTimeout(force); finish() }, 700))
  })
}

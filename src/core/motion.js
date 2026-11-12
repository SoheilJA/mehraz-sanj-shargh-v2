import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
export const coarse = matchMedia('(pointer: coarse)').matches

export function initLenis() {
  if (reduced) return null
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function initReveal(scope = document) {
  const els = scope.querySelectorAll('[data-reveal]')
  if (reduced || !els.length) return
  els.forEach(elm => {
    gsap.from(elm, {
      opacity: 0, y: 26, duration: .9, ease: 'power3.out',
      delay: +elm.dataset.delay || 0,
      scrollTrigger: { trigger: elm, start: 'top 88%', once: true }
    })
  })
  scope.querySelectorAll('[data-reveal-group]').forEach(group => {
    const kids = [...group.children]
    if (!kids.length) return
    gsap.from(kids, {
      opacity: 0, y: 30, duration: .85, ease: 'power3.out', stagger: .09,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true }
    })
  })
}

export function magnetize(scope = document) {
  if (reduced || coarse) return
  scope.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect()
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .22, duration: .4 })
    })
    btn.addEventListener('pointerleave', () =>
      gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.5)' }))
  })
}

const cleaners = []
export const onPageHide = fn => cleaners.push(fn)
export function runCleanup() {
  cleaners.splice(0).forEach(fn => { try { fn() } catch { /* noop */ } })
  ScrollTrigger.getAll().forEach(t => t.kill())
}

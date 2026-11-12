import { reduced } from '../core/motion.js'

export function initMarquees(scope = document) {
  scope.querySelectorAll('[data-marquee]').forEach(wrap => {
    const inner = wrap.querySelector('.mq-inner')
    const set = inner.querySelector('.mq-set')
    if (!set) return
    if (reduced) return // static single row

    const speed = +(wrap.dataset.speed || 60)   // px per second
    const reverse = wrap.dataset.reverse === '1'
    const pauseHover = wrap.dataset.hover !== '0'
    let running = true, hovered = false, visible = true, raf = null

    const ensureCopies = () => {
      const need = Math.ceil(inner.parentElement.clientWidth / set.offsetWidth) + 1
      let guard = 0
      while (inner.children.length < need && guard++ < 30)
        inner.appendChild(set.cloneNode(true))
    }
    ensureCopies()
    let onResize = () => ensureCopies()
    addEventListener('resize', onResize = (() => { let t; return () => { clearTimeout(t); t = setTimeout(ensureCopies, 200) } })())

    const period = () => set.offsetWidth
    let pos = 0, last = null
    const tick = now => {
      if (last == null) last = now
      const dt = Math.min((now - last) / 1000, .1)
      last = now
      if (running && visible && !hovered) {
        const P = period() || 1
        pos = (pos + dt * speed) % P
        const x = reverse ? -(P - pos) : -pos
        inner.style.transform = `translate3d(${x}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    if (pauseHover) {
      wrap.addEventListener('pointerenter', () => (hovered = true))
      wrap.addEventListener('pointerleave', () => (hovered = false))
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(wrap)

    import('../core/motion.js').then(({ onPageHide }) =>
      onPageHide(() => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', onResize) }))
  })
}

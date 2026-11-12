import { initNav } from '../components/nav.js'
import { initFooter } from '../components/footer.js'
import { renderIcons } from '../components/icons.js'
import { initMarquees } from '../components/marquee.js'
import { initLenis, initReveal, magnetize, runCleanup, onPageHide } from './motion.js'
import { initPreloader } from './preloader.js'

export async function initPage(opts = {}) {
  const pre = initPreloader(opts.waitFor ?? [])
  initNav()
  initFooter()
  renderIcons()
  const lenis = initLenis()
  initReveal(opts.scope)
  magnetize()
  initMarquees()
  onPageHide(() => { lenis?.destroy(); runCleanup() })
  window.addEventListener('pagehide', runCleanup, { once: true })
  await pre
  return { lenis }
}

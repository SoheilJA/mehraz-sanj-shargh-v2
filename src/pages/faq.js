import { initPage } from '../core/shell.js'
import { faqs } from '../data/faq.js'
import { renderIcons } from '../components/icons.js'

const list = document.getElementById('faq-list')
list.innerHTML = faqs.map(([q, a], i) => `
  <div class="faq-item" data-reveal>
    <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
      <span>${q}</span><i data-lucide="chevron-down" class="fq-i"></i>
    </button>
    <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><p>${a}</p></div>
  </div>`).join('')

list.addEventListener('click', e => {
  const btn = e.target.closest('.faq-q'); if (!btn) return
  const item = btn.closest('.faq-item')
  const panel = item.querySelector('.faq-a')
  const open = item.classList.toggle('is-open')
  btn.setAttribute('aria-expanded', String(open))
  panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0'
  list.querySelectorAll('.faq-item').forEach(x => {
    if (x !== item && x.classList.contains('is-open')) {
      x.classList.remove('is-open')
      x.querySelector('.faq-q').setAttribute('aria-expanded', 'false')
      x.querySelector('.faq-a').style.maxHeight = '0'
    }
  })
})

const init = async () => { await initPage(); renderIcons() }
init()

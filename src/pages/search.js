import { initPage } from '../core/shell.js'
import { services } from '../data/services.js'
import { projects } from '../data/projects.js'
import { articles } from '../data/articles.js'
import { norm } from '../core/utils.js'
import { renderIcons } from '../components/icons.js'

const qInput = document.getElementById('q')
const results = document.getElementById('results')

const index = [
  ...services.map(s => ({ title: s.title, cat: 'خدمت', body: [s.tagline, s.lead, ...s.what].join(' '), href: `/services/${s.slug}.html` })),
  ...projects.map(p => ({ title: p.title, cat: 'پروژه', body: [p.overview, ...p.scope].join(' '), href: `/projects/${p.slug}.html` })),
  ...articles.map(a => ({ title: a.title, cat: 'مقاله', body: [a.excerpt, ...a.body.map(([h, p]) => h + ' ' + p)].join(' '), href: `/journal/${a.slug}.html` })),
  { title: 'تجهیزات و تیم میدانی', cat: 'صفحه', body: 'توتال استیشن GNSS چندفرکانسی تیم میدانی متخصص', href: '/equipment.html' },
  { title: 'دربارهٔ ما', cat: 'صفحه', body: 'رویکرد مهندسی روش‌شناسی مدیریت فنی پوشش خراسان', href: '/about.html' },
  { title: 'تماس با ما', cat: 'صفحه', body: 'مشاوره درخواست خدمت تماس ایمیل نشانی مشهد', href: '/contact.html' },
  { title: 'پرسش‌های متداول', cat: 'صفحه', body: faqsText(), href: '/faq.html' }
]
function faqsText() {
  import('../data/faq.js').then(({ faqs }) => { index.at(-1).body += ' ' + faqs.map(f => f.join(' ')).join(' ') })
  return ''
}

const search = q => {
  const nq = norm(q)
  if (nq.length < 2) return []
  const terms = nq.split(/\s+/)
  return index
    .map(item => {
      const hay = norm(`${item.title} ${item.body}`)
      const score = terms.reduce((acc, t) => acc + (item.title.includes(t) ? 3 : hay.includes(t) ? 1 : 0), 0)
      return [item, score]
    })
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item)
}

const render = q => {
  const hits = search(q)
  if (!norm(q).length) results.innerHTML = `<p class="mute">عبارتی وارد کنید تا میان خدمات، پروژه‌ها و مقالات جست‌وجو شود.</p>`
  else if (!hits.length) results.innerHTML = `<div class="card p-6"><p class="lead">نتیجه‌ای یافت نشد؛ عبارت کوتاه‌تری امتحان کنید یا با ما تماس بگیرید.</p></div>`
  else results.innerHTML = hits.map(h => `
    <a class="card p-5 flex items-center justify-between gap-4" href="${h.href}">
      <div class="flex flex-col gap-1"><b>${h.title}</b><span class="mute" style="font-size:.8rem">${h.cat}</span></div>
      <i data-lucide="arrow-left" style="color:var(--color-teal);width:18px;height:18px;flex:none"></i>
    </a>`).join('')
  renderIcons()
}

qInput.addEventListener('input', () => render(qInput.value))

const init = async () => {
  await initPage()
  renderIcons()
  const qp = new URLSearchParams(location.search).get('q')
  if (qp) { qInput.value = qp; render(qp) } else render('')
  qInput.focus()
}
init()

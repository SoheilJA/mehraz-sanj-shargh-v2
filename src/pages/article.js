import { initPage } from '../core/shell.js'
import { articleBySlug, articles } from '../data/articles.js'
import { fa, faDigits } from '../core/utils.js'
import { renderIcons } from '../components/icons.js'
import { frag } from '../core/utils.js'

const main = document.getElementById('main')
const a = articleBySlug(main.dataset.article)
if (!a) {
  location.replace('/journal/index.html')
} else {
  const others = articles.filter(x => x.slug !== a.slug).slice(0, 3)

  main.appendChild(frag(`
    <section class="section" style="padding-block:9rem 2rem">
      <div class="wrap flex flex-col gap-4 items-center" style="text-align:center" data-reveal>
        <p class="eyebrow">JOURNAL · ${a.cat}</p>
        <h1 class="h-sec" style="max-width:820px">${a.title}</h1>
        <div class="rule"></div>
        <p class="lead" style="max-width:680px">${a.excerpt}</p>
        <span class="mute" style="font-size:.8rem">زمان مطالعه: ${fa(a.min)} دقیقه</span>
      </div>
    </section>
    <section class="section" style="padding-block:1rem">
      <div class="wrap">
        <div class="article-body" data-reveal>
          ${a.body.map(([h, p]) => `
            <div class="flex flex-col gap-4">
              <h2>${h}</h2>
              <p>${p}</p>
            </div>`).join('')}
          <div class="card p-6 flex flex-col gap-3" style="margin-top:1rem">
            <span class="eyebrow">GET IN TOUCH</span>
            <p class="lead" style="font-size:.95rem">پرسش فنی دربارهٔ همین موضوع دارید؟ تیم مهراز سنج شرق پاسخگوست.</p>
            <a class="btn btn-primary" data-magnetic href="/contact.html">دریافت مشاوره</a>
          </div>
        </div>
      </div>
    </section>
    <section class="section grid-bg">
      <div class="wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">MORE ARTICLES</p>
          <h2 class="h-sec">سایر مقالات</h2>
          <div class="rule"></div>
        </div>
        <div class="grid md:grid-cols-3 gap-5" data-reveal-group>
          ${others.map(x => `
            <a class="card art-card" href="/journal/${x.slug}.html">
              <span class="ai">0${articles.indexOf(x) + 1}</span><span class="tag tag--teal">${x.cat}</span>
              <h3>${x.title}</h3><p class="art-excerpt">${x.excerpt}</p>
              <span class="mute" style="font-size:.78rem">زمان مطالعه: ${faDigits(x.min)} دقیقه</span>
            </a>`).join('')}
        </div>
      </div>
    </section>`))
}

const init = async () => { await initPage(); renderIcons() }
init()

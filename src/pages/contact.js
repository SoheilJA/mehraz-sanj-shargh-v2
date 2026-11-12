import { initPage } from '../core/shell.js'
import { company } from '../data/company.js'
import { renderIcons } from '../components/icons.js'
import { faDigits } from '../core/utils.js'

document.getElementById('contact-cards').innerHTML = [
  ['phone', 'تلفن‌های تماس', company.phones.map(p =>
    `<a class="lead" style="font-size:.95rem" dir="ltr" href="tel:+98${p.slice(1)}">${faDigits(p)}</a>`).join('')],
  ['mail', 'ایمیل', `<a class="lead" style="font-size:.95rem" dir="ltr" href="mailto:${company.email}">${company.email}</a>`],
  ['map-pin', 'نشانی دفتر', `<span class="lead" style="font-size:.95rem">${company.address}</span>`],
  ['compass', 'پوشش خدمات', `<span class="lead" style="font-size:.95rem">${company.coverage} · ${company.manager} — ${company.managerRole}</span>`]
].map(([ic, t, body]) => `
  <div class="card p-5 flex items-start gap-4">
    <i data-lucide="${ic}" style="color:var(--color-teal);width:22px;height:22px;flex:none;margin-top:.4rem"></i>
    <div class="flex flex-col gap-1"><b>${t}</b>${body}</div>
  </div>`).join('')

const mapSlot = document.getElementById('map-slot')
if (company.mapEmbedUrl) {
  mapSlot.innerHTML = `<iframe src="${company.mapEmbedUrl}" title="نقشهٔ دفتر" style="width:100%;height:100%;border:0" loading="lazy"></iframe>`
} else {
  mapSlot.innerHTML = `<div class="flex flex-col items-center gap-2 p-6 text-center">
    <i data-lucide="map" style="color:var(--color-teal);width:28px;height:28px"></i>
    <span class="mute" style="font-size:.85rem">${company.address}</span>
    <a class="link-arrow" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('مشهد میرزاکوچک خان ۸ ضیائی پناه ۱۸ پلاک ۱۲')}" target="_blank" rel="noopener">مشاهده روی نقشه</a>
  </div>`
}

const form = document.getElementById('contact-form')
const ok = document.getElementById('form-ok')
const mailtoBtn = document.getElementById('mailto-btn')

const buildMailto = () => {
  const name = form.name.value.trim(), phone = form.phone.value.trim(),
    topic = form.topic.value, msg = form.message.value.trim()
  const body = `نام: ${name}%0D%0Aتلفن: ${phone}%0D%0Aموضوع: ${topic}%0D%0A%0D%0A${encodeURIComponent(msg)}`
  return `mailto:${company.email}?subject=${encodeURIComponent('درخواست خدمات — ' + topic)}&body=${body}`
}

const setErr = (input, msg) => {
  const f = input.closest('.field')
  f.classList.toggle('is-err', !!msg)
  f.querySelector('.f-err').textContent = msg
}

const validate = () => {
  let good = true
  const checks = [
    [form.name, v => v.trim().length >= 2, 'نام را کامل وارد کنید.'],
    [form.phone, v => /^0\d{10}$/.test(v.trim().replace(/\s/g, '')), 'شمارهٔ تماس معتبر (۰۹…، ۱۱ رقم) وارد کنید.'],
    [form.topic, v => !!v, 'موضوع درخواست را انتخاب کنید.'],
    [form.message, v => v.trim().length >= 10, 'توضیح کوتاهی (حداقل ۱۰ نویسه) بنویسید.']
  ]
  checks.forEach(([input, fn, msg]) => {
    const pass = fn(input.value)
    setErr(input, pass ? '' : msg)
    if (!pass) good = false
  })
  return good
}

form.addEventListener('submit', e => {
  e.preventDefault()
  if (!validate()) return
  mailtoBtn.href = buildMailto()
  form.hidden = true
  ok.hidden = false
  renderIcons()
})

form.addEventListener('input', e => {
  if (e.target.closest('.field')?.classList.contains('is-err')) validate()
})

document.getElementById('form-reset').addEventListener('click', () => {
  form.reset(); form.hidden = false; ok.hidden = true
})

mailtoBtn.href = buildMailto()

const init = async () => { await initPage(); renderIcons() }
init()

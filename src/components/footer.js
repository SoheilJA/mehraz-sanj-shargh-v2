import { navigation } from '../data/navigation.js'
import { services } from '../data/services.js'
import { company } from '../data/company.js'
import { el } from '../core/utils.js'

export function initFooter() {
  const host = document.getElementById('site-footer')
  if (!host) return
  host.appendChild(el(`
  <div class="footer" >
    <svg class="footer-bg" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="rgba(40,215,194,.10)">${[0,1,2,3,4].map(i =>
        `<path d="M-80 ${90+i*26} C 220 ${50+i*26}, 420 ${150+i*26}, 700 ${95+i*26} S 1050 ${40+i*26}, 1300 ${100+i*26}"/>`).join('')}
      </g>
    </svg>
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <div class="brand" style="margin-bottom:1rem">
            <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
              <rect x="4" y="4" width="40" height="40" rx="10" fill="none" stroke="#28D7C2" stroke-width="2.5"/>
              <path d="M24 8v32M8 24h32" stroke="#28D7C2" stroke-width="2"/>
              <circle cx="24" cy="24" r="4" fill="#28D7C2"/></svg>
            <b style="font-weight:900">مهراز سنج شرق</b></div>
          <p class="lead" style="font-size:.9rem">${company.footerAbout}</p>
        </div>
        <nav aria-label="پیوندهای سایت"><h4>SITE MAP</h4>
          <ul>${navigation.main.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
          <li><a href="/faq.html">پرسش‌های متداول</a></li></ul></nav>
        <nav aria-label="خدمات"><h4>SERVICES</h4>
          <ul>${services.map(s => `<li><a href="/services/${s.slug}.html">${s.title}</a></li>`).join('')}</ul></nav>
        <div><h4>CONTACT</h4>
          <ul>
            <li>${company.manager} — ${company.managerRole}</li>
            <li><a class="f-line" href="tel:+98${company.phones[0].slice(1)}" dir="ltr">${company.phones[0]}</a></li>
            <li><a class="f-line" href="tel:+98${company.phones[1].slice(1)}" dir="ltr">${company.phones[1]}</a></li>
            <li><a class="f-line" href="mailto:${company.email}" dir="ltr">${company.email}</a></li>
            <li>${company.address}</li>
            <li>پوشش خدمات: ${company.coverage}</li>
          </ul></div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${company.name}</span>
        <span class="en" style="letter-spacing:.25em;font-size:.68rem">GEOMATICS · PRECISION ENGINEERING</span>
      </div>
    </div>
  </div>`))
}

// procedural on-brand SVG engineering illustrations (no external images)
const S = 'rgba(148,163,184,.5)'
const T = '#28D7C2'
const w = (vb, body) =>
  `<svg class="diag" viewBox="${vb}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${body}</svg>`

export const visuals = {
  control: w('0 0 240 160', `
    <rect x="30" y="20" width="180" height="120" fill="none" stroke="${S}" stroke-width="1.5"/>
    <path class="dd" d="M30 80h180M120 20v120" stroke="${T}" stroke-width="1" opacity=".7"/>
    <path d="M30 50h10M30 110h10M40 20v10M180 20v10" stroke="${S}"/>
    <g stroke="${T}" opacity=".8"><path class="dd" d="M120 80L70 35M120 80l70 25M120 80L85 130"/></g>
    <circle cx="120" cy="80" r="5" fill="${T}"/>
    <circle data-blink cx="70" cy="35" r="3.5" fill="${T}"/><circle data-blink cx="190" cy="105" r="3.5" fill="${T}" style="animation-delay:.8s"/>
    <circle data-blink cx="85" cy="130" r="3.5" fill="${T}" style="animation-delay:1.4s"/>
    <text x="128" y="76" fill="${S}" font-size="8" font-family="monospace" direction="ltr">N 4,021,360</text>`),

  topo: w('0 0 240 160', `
    <g fill="none" stroke="${S}"><path d="M70 90c-25-8-35-28-18-45s60-18 88-8 40 34 20 52-55 24-90 1z"/>
    <path d="M78 88c-20-7-28-23-13-37s48-13 70-6 32 26 15 40-44 20-72 3z"/>
    <path d="M88 86c-14-5-20-17-9-27s34-9 49-4 23 18 10 28-31 14-50 3z"/></g>
    <g fill="${T}"><circle data-blink cx="95" cy="62" r="3"/><circle data-blink cx="140" cy="55" r="3" style="animation-delay:.7s"/>
    <circle data-blink cx="120" cy="92" r="3" style="animation-delay:1.2s"/><circle data-blink cx="160" cy="75" r="3" style="animation-delay:1.7s"/></g>
    <path class="dd" d="M20 140h200" stroke="${T}" opacity=".5"/>
    <text x="20" y="152" fill="${S}" font-size="8" font-family="monospace" direction="ltr">E 625,412</text>`),

  utm: w('0 0 240 160', `
    <g fill="none" stroke="${S}"><path d="M20 20h200v120H20z"/><path d="M70 20v120M120 20v120M170 20v120M20 60h200M20 100h200"/></g>
    <rect x="120" y="60" width="50" height="40" fill="rgba(40,215,194,.12)" stroke="${T}"/>
    <path class="dd" d="M95 14v132" stroke="${T}" opacity=".6"/>
    <g fill="${S}" font-size="8" font-family="monospace">
      <text x="24" y="16" direction="ltr">625k</text><text x="114" y="16" direction="ltr">630k</text>
      <text x="196" y="16" direction="ltr">635k</text><text x="4" y="64" direction="ltr">4,021k</text><text x="4" y="104" direction="ltr">4,020k</text></g>
    <circle data-blink cx="145" cy="80" r="4" fill="${T}"/>`),

  earth: w('0 0 240 160', `
    <path d="M15 110C60 70 110 125 150 85s60-25 75-35" fill="none" stroke="${S}" stroke-width="2"/>
    <path d="M15 95h210" class="dd" stroke="${T}" stroke-width="1.5"/>
    <path d="M15 95h210v-20H15z" fill="rgba(40,215,194,.07)"/>
    <g stroke="${S}"><path d="M60 70v45M120 75v45M180 60v45"/></g>
    <g fill="${S}" font-size="8" font-family="monospace"><text x="62" y="64" direction="ltr">S1</text><text x="122" y="69" direction="ltr">S2</text><text x="182" y="54" direction="ltr">S3</text></g>
    <rect x="112" y="80" width="16" height="14" fill="none" stroke="${T}"/>
    <text x="112" y="140" fill="${T}" font-size="9" font-family="monospace" direction="ltr">V = ΣA·d</text>`),

  station: w('0 0 240 160', `
    <circle cx="120" cy="86" r="6" fill="${T}"/>
    <path d="M112 92l-14 40M128 92l14 40M120 92v42" stroke="${S}" stroke-width="2" fill="none"/>
    <rect x="108" y="132" width="24" height="5" fill="${S}"/>
    <g stroke="${T}" opacity=".8"><path class="dd" data-sweep d="M120 80L40 24"/><path class="dd" d="M120 80l85-20" style="animation-delay:.5s"/></g>
    <g stroke="${S}" opacity=".5"><path class="dd" d="M120 80L30 130M120 80l95 35"/></g>
    <circle data-blink cx="40" cy="24" r="3" fill="${T}"/><circle data-blink cx="205" cy="60" r="3" fill="${T}" style="animation-delay:.9s"/>`),

  profile: w('0 0 240 160', `
    <g fill="none" stroke="${S}"><path d="M20 30v110M20 140h200"/></g>
    <path d="M20 120C55 60 80 110 110 72s60 30 90 8" fill="none" stroke="${T}" stroke-width="2"/>
    <g stroke="${S}" opacity=".6"><path d="M60 35v105M110 35v105M160 35v105" stroke-dasharray="3 4"/></g>
    <g fill="${T}"><circle data-blink cx="60" cy="92" r="3"/><circle data-blink cx="110" cy="72" r="3" style="animation-delay:.6s"/><circle data-blink cx="160" cy="86" r="3" style="animation-delay:1.1s"/></g>
    <g fill="${S}" font-size="8" font-family="monospace"><text x="220" y="152" direction="ltr">d(m)</text><text x="26" y="28" direction="ltr">Z</text></g>`),

  tower: w('0 0 240 160', `
    <path d="M120 20l-26 110h52z" fill="none" stroke="${S}" stroke-width="1.5"/>
    <g stroke="${S}" opacity=".7"><path d="M104 55h32M99 76h42M96 95h48M93 114h54M112 20l-2 110M128 20l2 110"/></g>
    <path class="dd" d="M120 15v130" stroke="${T}" opacity=".8"/>
    <g fill="${T}"><circle data-blink cx="94" cy="130" r="3"/><circle data-blink cx="146" cy="130" r="3" style="animation-delay:.8s"/></g>
    <path d="M94 130v14M146 130v14" stroke="${S}"/>`),

  arch: w('0 0 240 160', `
    <path d="M35 135c0-55 38-95 85-95s85 40 85 95" fill="none" stroke="${S}" stroke-width="2"/>
    <path d="M60 135c0-42 25-72 60-72s60 30 60 72" fill="none" stroke="${S}" opacity=".55"/>
    <path class="dd" d="M35 135c0-55 38-95 85-95s85 40 85 95" stroke="${T}" stroke-width="1" opacity=".9"/>
    <g stroke="${S}"><path d="M35 135h170M120 40v95" opacity=".6"/></g>
    <circle data-blink cx="120" cy="40" r="4" fill="${T}"/><circle data-blink cx="120" cy="135" r="4" fill="${T}" style="animation-delay:.9s"/>`),

  truss: w('0 0 240 160', `
    <g fill="none" stroke="${S}" stroke-width="1.6">
      <path d="M20 120L60 40l40 80zM60 40l40 80M20 120h40M100 120l40-80l40 80zM140 40l40 80M100 120h40M180 120l40-80"/></g>
    <g fill="${T}"><circle data-blink cx="60" cy="40" r="4"/><circle data-blink cx="140" cy="40" r="4" style="animation-delay:.6s"/>
      <circle data-blink cx="220" cy="40" r="4" style="animation-delay:1.2s"/><circle data-blink cx="20" cy="120" r="4" style="animation-delay:.3s"/></g>
    <path class="dd" d="M20 140h200" stroke="${T}" opacity=".4"/>`),

  land: w('0 0 240 160', `
    <g fill="none" stroke="${S}"><path d="M20 20h200v120H20z"/><path d="M20 70h200M100 20v120"/></g>
    <path d="M52 42c30-16 60 6 84-4s48 2 60 10" fill="none" stroke="${S}" stroke-width="2"/>
    <rect x="26" y="26" width="60" height="36" fill="rgba(40,215,194,.1)" stroke="${T}"/>
    <circle data-blink cx="56" cy="44" r="3.5" fill="${T}"/>
    <path class="dd" d="M150 140L60 20" stroke="${T}" opacity=".35"/>
    <text x="150" y="150" fill="${S}" font-size="8" font-family="monospace" direction="ltr">PARCEL 12-B</text>`),

  industrial: w('0 0 240 160', `
    <g fill="none" stroke="${S}" stroke-width="1.6"><path d="M20 130V70l30-25 30 25v60zM80 130V50h40v80zM120 130V70h50l30 30v30"/></g>
    <g stroke="${T}" opacity=".7"><path class="dd" d="M50 20v-14M100 30v-18M150 24v-14"/></g>
    <g fill="${T}"><circle data-blink cx="50" cy="45" r="3"/><circle data-blink cx="100" cy="50" r="3" style="animation-delay:.7s"/><circle data-blink cx="150" cy="70" r="3" style="animation-delay:1.3s"/></g>
    <path class="dd" d="M20 146h200" stroke="${T}" opacity=".35"/>`),

  gnss: w('0 0 240 160', `
    <path d="M10 34c40-16 180-16 220 0" fill="none" stroke="${S}" stroke-dasharray="4 5"/>
    <g fill="${T}"><rect data-blink x="52" y="22" width="9" height="9" rx="2"/><rect data-blink x="108" y="14" width="9" height="9" rx="2" style="animation-delay:.5s"/>
      <rect data-blink x="168" y="24" width="9" height="9" rx="2" style="animation-delay:1s"/></g>
    <g stroke="${T}" opacity=".75"><path class="dd" d="M57 34L118 108M112 26L122 108M172 34L126 108"/></g>
    <circle cx="122" cy="112" r="5" fill="${T}"/>
    <path d="M114 118l-8 26M130 118l8 26M122 118v26" stroke="${S}" stroke-width="2"/>
    <path class="dd" d="M30 148h180" stroke="${S}" opacity=".5"/>`)
}
export const visual = key => visuals[key] ?? visuals.station

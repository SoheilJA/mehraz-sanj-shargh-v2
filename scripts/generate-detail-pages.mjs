import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { projects, catLabel } from '../src/data/projects.js'
import { articles } from '../src/data/articles.js'
import { company } from '../src/data/company.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const site = company.domain

const shell = ({ title, desc, bodyAttr, script, dirName, slug }) => `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | مهراز سنج شرق</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${title} | مهراز سنج شرق">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fa_IR">
<meta property="og:url" content="https://${site}/${dirName}/${slug}.html">
<meta property="og:image" content="https://${site}/og-cover.svg">
<meta name="theme-color" content="#0B1220">
<link rel="stylesheet" href="${import.meta.env.BASE_URL}src/styles/main.css">
<link rel="icon" href="${import.meta.env.BASE_URL}favicon.svg" type="image/svg+xml">
</head>
<body>
<a class="skip-link" href="#main">پرش به محتوای اصلی</a>
<div id="preloader" role="status" aria-label="در حال بارگذاری">
  <div class="pre-inner">
    <svg class="pre-mark" viewBox="0 0 64 64" aria-hidden="true"><circle class="pre-ring" cx="32" cy="32" r="24"/><path d="M32 4v56M4 32h56" /><circle cx="32" cy="32" r="4"/></svg>
    <div class="pre-brand">مهراز سنج شرق</div>
    <div class="pre-bar"><span class="pre-fill"></span></div>
    <div class="pre-pct">۰٪</div>
  </div>
</div>
<header id="site-nav"></header>
<main id="main" ${bodyAttr}></main>
<footer id="site-footer"></footer>
<noscript><p class="noscript">برای نمایش کامل این صفحه، جاوااسکریپت را فعال کنید. اطلاعات تماس: ۰۹۱۵۴۲۸۴۳۳۵ — mehrazsanjshargh@gmail.com</p></noscript>
<script type="module" src="${script}"></script>
</body>
</html>`

const ensure = d => mkdirSync(join(root, d), { recursive: true })

for (const p of projects) {
  ensure('projects')
  writeFileSync(
    join(root, `projects/${p.slug}.html`),
    shell({
      title: p.title, desc: p.overview.slice(0, 150),
      bodyAttr: `data-project="${p.slug}" class="page-project"`,
      script: '/src/pages/projectDetail.js', dirName: 'projects', slug: p.slug
    })
  )
}

for (const a of articles) {
  ensure('journal')
  writeFileSync(
    join(root, `journal/${a.slug}.html`),
    shell({
      title: a.title, desc: a.excerpt.slice(0, 150),
      bodyAttr: `data-article="${a.slug}" class="page-article"`,
      script: '/src/pages/article.js', dirName: 'journal', slug: a.slug
    })
  )
}

console.log(`Generated ${projects.length} project pages and ${articles.length} article pages.`)

MEHRAZ SANJ SHARQ — Engineering Surveying & Geomatics Website
Static, Persian RTL, dark "digital terrain" engineering website.
Stack: Vite · Tailwind CSS v4 · Three.js · GSAP + ScrollTrigger · Anime.js · Lenis · Lucide.
No CDN, no runtime external dependency — everything is npm-local and self-hosted.

## 1) Setup

```
npm install        # also auto-generates 17 detail pages (projects/journal shells)
```

### Fonts (required once)

Download the Vazirmatn woff2 files from the official release
(https://github.com/rastikerdar/vazirmatn — `fonts/` folder of the release zip) and copy:

- Vazirmatn-Regular.woff2
- Vazirmatn-Medium.woff2
- Vazirmatn-Bold.woff2
- Vazirmatn-Black.woff2

into `public/fonts/`.

## 2) Develop / Build / Ship

```
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
npm run pages      # regenerate detail shells (idempotent; runs on postinstall too)
```

Deploy `dist/` to any static host (Netlify, GitHub Pages…). `404.html` is picked up automatically
by most hosts. Package `dist/` into the delivery archive:

```
cd dist && zip -r ../mehraz-sanj-shargh-dist.zip . && cd ..
zip -r mehraz-sanj-shargh-src.zip . -x "node_modules/*" -x "dist/*" -x ".git/*"
```

## 3) Structure

- `src/data/*` — all content (company, services, projects, articles, equipment, testimonials, faq, navigation). Edit content here, not in layouts.
- `src/three/terrain.js` — the hero digital-terrain engine (procedural, instanced points, shader contours + scan line; WebGL fallback + reduced-motion static frame).
- `src/core/` — shell, preloader (once/session, real progress, ≤2.2s max), Lenis+GSAP setup, reveal/magnetic utils, deterministic noise (shared by 3D + 2D map).
- `src/components/` — nav, footer, marquees (rAF, seamless, RTL-safe, IO-paused), procedural SVG engineering visuals, lucide icons.
- `scripts/generate-detail-pages.mjs` — generates all project/article pages from data (SEO-ready heads).

## 4) Honest-content policy (deliberate)

- Facts come from the company brief only. No invented dates, clients, budgets, stats, brands or testimonials.
- Testimonial marquee shows clearly badged sample data until real ones exist.
- Data-visualizations are labeled «نمایشی» (illustrative).
- Real project photos: drop files into `public/images/projects/` and reference them in `src/data/projects.js` gallery captions to replace the SVG illustrations.
- Optional map embed: set `mapEmbedUrl` in `src/data/company.js`.

## 5) Accessibility & performance

Skip-link, focus-visible rings, ARIA on nav/accordion/tabs/form errors,
prefers-reduced-motion honored everywhere (Lenis off, preloader instant, 3D renders one static frame),
hero pauses off-screen, DPR clamped, all Three/GSAP/Lenis resources disposed on pagehide.

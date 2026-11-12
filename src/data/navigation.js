const B = import.meta.env.BASE_URL
const h = p => (p === '/' ? B : B + p.replace(/^\//, ''))

export const navigation = {
  main: [
    { label: 'صفحه اصلی', href: h('/') },
    { label: 'درباره ما', href: h('/about.html') },
    { label: 'خدمات', href: h('/services/index.html') },
    { label: 'پروژه‌ها', href: h('/projects/index.html') },
    { label: 'تجهیزات', href: h('/equipment.html') },
    { label: 'مجله', href: h('/journal/index.html') },
    { label: 'تماس با ما', href: h('/contact.html') }
  ]
}

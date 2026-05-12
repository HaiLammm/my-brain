# Platform Requirements: DaNangNavi

## Technology Stack

### Core

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14+ (App Router) | SSR for SEO, React ecosystem, solo dev friendly |
| Styling | Tailwind CSS | Rapid development, utility-first, 7-day deadline |
| Font | Noto Sans JP (Google Fonts) | Free, full CJK support |
| Icons | Lucide React | Lightweight, tree-shakeable, line style |
| Images | Next.js Image component | Auto-optimization, WebP, lazy loading |
| Backend (demo) | Mock API (JSON files) | No server needed for demo |
| Backend (production) | FastAPI (Python) | Monorepo architecture |

### Architecture

```
danangnavi/
├── app/                    # Next.js App Router
│   ├── [locale]/           # i18n routing (ja, en, vi)
│   │   ├── page.tsx        # Home Feed (Server Component)
│   │   ├── community/
│   │   ├── listings/
│   │   ├── guides/
│   │   ├── deals/
│   │   └── profile/
│   └── layout.tsx
├── components/
│   ├── client/             # "use client" components
│   │   ├── SearchBar.tsx
│   │   ├── BottomTabNav.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ...
│   ├── server/             # Server actions
│   │   └── actions.ts
│   └── ui/                 # Shared UI components
│       ├── Card.tsx
│       ├── Button.tsx
│       └── ...
├── lib/
│   ├── mock-data/          # JSON mock data
│   └── utils/
├── messages/               # i18n translation files
│   ├── ja.json
│   ├── en.json
│   └── vi.json
└── public/
    └── images/             # Stock photos for demo
```

### Key Principles

- Pages default to Server Components for SEO optimization
- Client components only when interactivity needed (search, nav, filters)
- Server actions for data operations — no exposed API endpoints
- Separate components directory for clean architecture and reusability

---

## Platform Strategy

| Phase | Platform | Detail |
|-------|----------|--------|
| Phase 1 (Demo) | Responsive Web App | Next.js, local only |
| Phase 2 (Launch) | Responsive Web App | Deployed, production backend |
| Phase 3 (Scale) | Web + Native Mobile | iOS/Android when web is stable |

---

## Integrations

### Demo Phase

| Integration | Status | Detail |
|-------------|--------|--------|
| Analytics | Not needed | — |
| Maps | Mock/static | Static images or placeholder |
| Translation | Mock data | Pre-translated JSON in 3 languages |
| Auth | Not needed | — |
| Payment | Not needed | — |

### Production Phase

| Integration | Technology | Purpose |
|-------------|-----------|---------|
| Analytics | Google Analytics | Traffic, user behavior |
| Maps | Google Maps API | Navigation only (no data import) |
| Translation | AI Translation API | EN → JP, EN → VN auto-translate |
| Auth | NextAuth.js | User authentication |
| Email | Transactional email service | Notifications, verification |
| Image moderation | AI moderation | Camera-only photo policy enforcement |

### Future Integrations

| Integration | Purpose | Phase |
|-------------|---------|-------|
| Routing API | Journey-based discovery (#81) | Phase 2 |
| Voice AI | "Bấm là nói hộ" (#14, #15) | Phase 2 |
| Push notifications | Proactive suggestions | Phase 2 |
| LINE/Zalo bridge | Messaging integration | Phase 3 |
| Payment gateway | Booking commission, coupon | Phase 3 |

---

## Contact Strategy

### Channels

| Channel | Demo | Production |
|---------|------|-----------|
| In-app chat | Mock UI | AI auto-translate chat JP↔VN |
| Community | Mock posts/comments | Real-time discussions |
| Booking | Mock "Book" button | Integrated booking system |
| Contact form | Not needed | Email support |

### UX Implications

- "Contact" / "Book" button visible on every listing card
- No phone-first approach — app-native communication
- Business owners manage via dashboard (production phase)

---

## Multilingual Requirements

### Languages

| Language | Code | Role | URL Pattern |
|----------|------|------|-------------|
| Japanese | ja | Default, primary UI | `/ja/{slug}` |
| English | en | Source content | `/en/{slug}` |
| Vietnamese | vi | Business owners, local | `/vi/{slug}` |

### Technical Implementation

| Aspect | Detail |
|--------|--------|
| i18n library | `next-intl` or `next-i18next` |
| URL structure | Locale prefix: `/ja/`, `/en/`, `/vi/` |
| Default locale | `ja` (Japanese) |
| hreflang tags | Auto-generated per page |
| Language switcher | Top nav (desktop), settings (mobile) |
| Translation files | JSON per locale in `/messages/` |
| Fallback | English if translation missing |

### Translation Workflow

| Phase | Method |
|-------|--------|
| Demo | Pre-translated mock data in 3 languages |
| Production | AI auto-translate from EN source |
| Quality control | Community senpai can report bad translations |

---

## SEO Technical Requirements

### Meta & Structured Data

| Requirement | Implementation |
|-------------|---------------|
| Meta tags | Dynamic title + description per page, per language |
| Open Graph | OG tags for social sharing (JP SNS important) |
| Structured data | Schema.org per page type |
| Sitemap | Auto-generated XML including all language versions |
| Robots.txt | Standard crawl directives |
| Canonical URLs | Self-referencing per page |

### Schema.org Types

| Page Type | Schema |
|-----------|--------|
| All pages | WebSite, Organization |
| Listings | LocalBusiness, Restaurant, TouristAttraction, etc. |
| Articles/Guides | Article |
| Community posts | DiscussionForumPosting |
| Deals/Coupons | Offer |
| FAQ | FAQPage |
| Breadcrumbs | BreadcrumbList |

### Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Page load (4G) | < 3s |
| Time to Interactive | < 3.5s |

### Performance Strategy

- Next.js SSR + static generation where possible
- Image optimization via Next.js Image component (WebP, lazy load)
- Minimal client-side JS — Server Components by default
- Font optimization — `next/font` for Noto Sans JP
- Bundle splitting — dynamic imports for heavy components

---

## Security Considerations

| Area | Approach |
|------|----------|
| Authentication | NextAuth.js with secure session management |
| Data | Closed-data policy — 100% internal content |
| Photos | Camera-only enforcement — no gallery uploads |
| Reviews | AI filter for malicious/competitor reviews |
| Privacy | Private searches not logged or visible to others |
| HTTPS | Required for all environments |

---

**Status:** Platform Requirements Complete
**Last Updated:** 2026-04-06

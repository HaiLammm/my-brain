# Content & Language Strategy: DaNangNavi

## Brand Personality

### Attributes

| Attribute | Meaning | Expression |
|-----------|---------|------------|
| Reliable Senpai | Like a trusted senior who knows Da Nang inside out | Always up-to-date data, verified listings, clear sources |
| Warm & Inclusive | Non-judgmental, welcoming everyone — newcomers and veterans | Friendly tone, safe space for private needs, smooth onboarding |
| Locally Rooted | Deep understanding of Da Nang — not surface-level tourist guide | Cultural content, neighborhood guides, local secrets |
| Helpful & Proactive | Doesn't wait to be asked — actively suggests and reminds | Push notifications, AI suggestions, auto-checklists |
| Bridge Builder | Connects Japanese and Vietnamese people, not creating a "bubble" | Voice translation, bilingual content, cross-cultural tips |

### Personality Summary

DaNangNavi speaks like a warm, knowledgeable senpai who has lived in Da Nang for years. It's the trusted friend who knows everything about the city, proactively helps without being asked, and never judges — even for private or sensitive needs.

---

## Tone of Voice

### Tone Spectrum

| Spectrum | Position | Description |
|----------|----------|-------------|
| Formality | 4/5 Casual | Casual but respectful — senpai style, not drinking buddy |
| Mood | 3/5 Balanced | Light and fun but serious when needed (visa, medical) |
| Complexity | 4/5 Simple | Anyone can understand, including elderly users |
| Energy | 4/5 Enthusiastic | Positive, encouraging exploration, but not overexcited |

### We Say / We Don't Say

| Context | We Say | We Don't Say |
|---------|--------|--------------|
| Welcome | "Welcome to Da Nang! We're here for you" | "Dear valued customer" |
| Error | "Oops, something went wrong — let's try again" | "Error 500: Internal Server Error" |
| Success | "All done!" | "Your request has been processed successfully" |
| Visa guide | "Here are 3 steps — we'll guide you through each one" | "Please refer to the administrative procedures below" |
| Food recommendation | "Senpai recommends: chicken pho right near you!" | "List of recommended restaurants" |
| No results | "Nothing found yet — try a different keyword?" | "No results match your search criteria" |
| Coupon | "30% off — grab it now!" | "Promotional code available" |
| Private content | "Private search — only you can see this" | *(no mention)* |

### Tone by Context

| Context | Tone Shift |
|---------|-----------|
| Discovery/food | Fun, enthusiastic — "Try it now!" |
| Visa/admin | Clear, reassuring — "Don't worry, we'll guide you" |
| Medical/private | Gentle, respectful — no emoji, no jokes |
| Community | Warm, inclusive — "Share with everyone!" |

### Do's and Don'ts

| Do | Don't |
|----|-------|
| Speak like a friend — casual, warm | Overly formal corporate tone |
| Use moderate emoji where appropriate | Spam emoji or be overly cutesy |
| Reassure when user might be anxious | Judge or compromise privacy |
| Keep it short and clear | Be verbose or complex |

---

## Language Strategy

### Supported Languages

| Language | Priority | Audience | Coverage |
|----------|----------|----------|----------|
| English | Source (primary) | Base content | 100% — content created in EN first |
| Japanese (日本語) | Primary UI | End users (Japanese) | 100% — auto-translate from EN |
| Vietnamese (Tiếng Việt) | Secondary | Business owners + local content | 100% — auto-translate from EN |

### Translation Approach

| Aspect | Detail |
|--------|--------|
| Source language | English |
| Method | AI auto-translate (EN → JP, EN → VN) |
| Phase 1 (Demo) | Mock data in JP + VN, no real translation engine |
| Phase 2 (Production) | Integrate AI translation API |
| Review | Community senpai can report incorrect translations |

### Localization

| Aspect | Detail |
|--------|--------|
| Currency | VND + JPY (dual display with comparison) |
| Date format | JP: 2026年4月6日 / VN: 06/04/2026 / EN: Apr 6, 2026 |
| Phone | +84 format (Vietnam) |
| Address | Vietnam format |

### Tone Consistency Across Languages

| Language | Tone Adaptation |
|----------|----------------|
| Japanese | Polite-casual (です/ます + friendly), culturally appropriate |
| Vietnamese | Casual-friendly ("nhé", "nào"), approachable |
| English | Warm-casual, friendly |

---

## SEO Strategy

### Keywords by Language

**Japanese (Primary — end user searches)**

| Category | Keywords |
|----------|----------|
| Discovery | ダナン おすすめ, ダナン グルメ, ダナン 観光 |
| Food | ダナン レストラン, ダナン 日本食, ダナン フォー |
| Living | ダナン 移住, ダナン 賃貸, ダナン ビザ |
| Transport | ダナン 移動, ダナン タクシー, ダナン バイク |
| Beauty | ダナン マッサージ, ダナン ヘアサロン |
| Medical | ダナン 病院 日本語, ダナン 健康診断 |
| Community | ダナン 日本人 コミュニティ, ダナン 日本人会 |
| Tourism | ダナン ツアー, ダナン ホテル, ダナン ビーチ |

**Vietnamese**

| Category | Keywords |
|----------|----------|
| Business | đăng ký cửa hàng đà nẵng, quảng cáo nhà hàng đà nẵng |
| Tourism | du lịch đà nẵng, tour đà nẵng, khách nhật đà nẵng |

**English**

| Category | Keywords |
|----------|----------|
| Discovery | danang guide, danang travel, danang food guide |
| Expat | living in danang, danang expat, danang visa |
| Community | japanese community danang, danang japan |

### Page-Keyword Map

| Page | URL | Primary KW (JP) | Primary KW (EN) |
|------|-----|-----------------|-----------------|
| Home | / | ダナン ナビ | danang navi |
| Restaurants | /restaurants | ダナン レストラン | danang restaurants |
| Tourism | /tourism | ダナン 観光 | danang tourism |
| Living Guide | /living | ダナン 移住 | living in danang |
| Community | /community | ダナン 日本人 | danang japanese community |
| Deals | /deals | ダナン クーポン | danang deals |
| Listing Detail | /listing/{slug} | {店名} ダナン | {name} danang |

### URL Structure

| Language | Pattern |
|----------|---------|
| Japanese (default) | danangnavi.com/ja/{slug} |
| English | danangnavi.com/en/{slug} |
| Vietnamese | danangnavi.com/vi/{slug} |

### Structured Data (Schema.org)

| Page Type | Schema |
|-----------|--------|
| All pages | WebSite, Organization |
| Listings | LocalBusiness, Restaurant, etc. |
| Articles/Guides | Article |
| Community posts | DiscussionForumPosting |
| Deals/Coupons | Offer |
| FAQ | FAQPage |

---

## Content Structure Principles

### Pages & Priority

| Page | Priority | Role |
|------|----------|------|
| Home Feed | Critical — first page | Community posts, daily specials, guides, events, trending, quick search |
| Community / Groups | Critical | Senpai posts, discussions, events, groups |
| Listings | Critical | Restaurants, tours, salons, hotels with reviews & pricing |
| Guides | Important | Cultural articles, living guides, checklists |
| Deals / Coupons | Important | Promotions, discounts, promoted listings |
| Personal Profile | Secondary | Bookmarks, history, badges/reputation, settings |

### Navigation Principles

- Home Feed always accessible from any page (1 tap)
- Quick search available everywhere
- Service categories easy to find — minimal depth
- Private content (medical, sensitive) never shown on public feed

### Content Type Guidelines

**UI Microcopy** (buttons, labels, errors):
- Keep short — max 3-4 words for buttons
- Active voice — "Share experience" not "Experience can be shared"
- Specific actions — "Find restaurants" not "Browse"

**Community Content** (posts, reviews):
- Senpai-authored, authentic voice
- Camera-only photos for trust
- Multi-criteria ratings

**Guide Content** (articles, checklists):
- Step-by-step, actionable
- Include pricing context (VND + JPY)
- Always cite sources for legal/visa info

### Content Ownership

| Content Type | Owner | Phase 1 (Demo) |
|-------------|-------|-----------------|
| All content | Lem (solo) | Reference content from Danang Holic, Vietnam Sketch, Hot Pepper |
| Community posts | Mock data | Simulated senpai posts |
| Listings | Mock data | Sample restaurants, tours, salons |

### Writing Checklist

- [ ] Tone matches guidelines (warm, friendly, trustworthy)
- [ ] Language appropriate for target audience
- [ ] Keywords included naturally
- [ ] All 3 languages updated
- [ ] Accessible language (no unexplained jargon)
- [ ] Private/sensitive content handled respectfully

---

## Summary

| Aspect | Detail |
|--------|--------|
| Personality | Reliable Senpai, Warm, Locally Rooted, Proactive, Bridge Builder |
| Tone | Casual (4/5), Balanced mood (3/5), Simple (4/5), Enthusiastic (4/5) |
| Languages | EN (source) → JP (primary UI) → VN (secondary) |
| Top Keywords | ダナン + おすすめ/グルメ/観光/移住/日本人 |
| Content Priority | Home Feed first, then Community, Listings, Guides, Deals |

---

**Status:** Content & Language Strategy Complete
**Next Phase:** Visual Direction
**Last Updated:** 2026-04-06

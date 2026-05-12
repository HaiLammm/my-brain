# Visual Direction: DaNangNavi

## Visual DNA (Quick Reference)

```
Style:        Flat Design + subtle Glassmorphism — clean, modern, tropical portal
Colors:       Navy (#1B2A4A) + Coral (#FF6B4A) + Teal (#2EC4B6) on Warm White
Typography:   Noto Sans JP — humanist, friendly, CJK-ready
Mood:         Warm, Trustworthy, Tropical, Clean, Inviting
Key Element:  Card-based grid with hero photography of Da Nang
```

---

## Existing Brand Assets

| Asset | Status |
|-------|--------|
| Logo | Create new |
| Colors | Create new — navy blue direction |
| Typography | Create new |
| Imagery | Stock for demo, UGC for production |
| Partner constraints | None |

---

## Visual References & Inspiration

### Reference Sites

| Site | What to Take |
|------|-------------|
| **Danang Holic** | Card-based grid, tropical warm colors, hero photography, mood-based browsing |
| **Naver** | Portal all-in-one feel, content-rich homepage, keyword chips, glass-style top bar |

### Design Principles (from References)

| Principle | Source | Application |
|-----------|--------|-------------|
| Card-based grid | Danang Holic | Feed, listings, guides all as cards |
| Warm colors + navy | Danang Holic + brand | Coral accent + navy primary |
| All-in-one portal feel | Naver | Everything on one platform |
| Content-rich homepage | Naver | Home feed with community, deals, guides, trending |
| Mood/category browsing | Danang Holic | "Choose by mood" quick category tags |
| Hero photography | Danang Holic | Large tropical Da Nang imagery |
| Clean organized density | Naver | Information-rich but clear layout |
| Keyword chips + filters | Naver | Quick filter chips for search/discovery |

---

## Design Style

### UI Visual Style: Flat Design + Subtle Glassmorphism

- Flat Design as foundation — clean, content-focused, fast loading
- Glassmorphism touches — translucent top bar, subtle depth
- Modern, approachable, familiar to East Asian users

### Design Aesthetic: Local/Artisan + Minimalism

- Local warmth — tropical, friendly, Da Nang vibe
- Minimalism — sufficient white space, organized, not overwhelming
- Combined = warm but tidy

---

## Color Direction

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Navy Blue | `#1B2A4A` | Headers, nav, primary buttons, brand identity |
| Secondary | Coral/Orange | `#FF6B4A` | CTAs, highlights, deals, accent |
| Accent | Teal | `#2EC4B6` | Links, tags, secondary actions, Da Nang ocean |
| Background | Warm White | `#FAFAF8` | Page background |
| Surface | White | `#FFFFFF` | Cards, modals |
| Text Primary | Dark Navy | `#0D1B2A` | Body text |
| Text Secondary | Gray | `#6B7280` | Captions, metadata |
| Success | Green | `#27AE60` | Confirmations, verified badges |
| Warning | Amber | `#F2994A` | Alerts, cautions |
| Error | Red | `#EB5757` | Errors, destructive actions |

### Scheme Type

Complementary (Navy + Coral) with Teal accent — warm tropical feel balanced by professional navy.

---

## Typography Direction

### Font Family

| Role | Font | Style | Rationale |
|------|------|-------|-----------|
| Headlines | Noto Sans JP Bold | Humanist sans-serif | Friendly, readable in JP + VN + EN |
| Body | Noto Sans JP Regular | Neo-grotesque | Clean, legible, full CJK support |
| UI Labels | Inter / Noto Sans | Medium weight | Compact, clear for buttons and labels |

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 32px | Bold | 1.3 |
| H2 | 24px | Bold | 1.4 |
| H3 | 20px | SemiBold | 1.4 |
| Body | 16px | Regular | 1.6 |
| Caption | 14px | Regular | 1.5 |
| Small | 12px | Regular | 1.5 |

### Key Decision

- Base size 16px with line-height 1.6 for readability
- Must support CJK characters — Noto Sans JP is the safest free option
- Senior-friendly: minimum 14px for any readable text

---

## Layout Direction

### Hero Section: Split Hero

- Search bar + tagline overlaying Da Nang background image
- Actionable immediately — search is the first interaction
- Image: beach, Dragon Bridge, or Ba Na Hills

### Content Layout: Card-Based Grid

```
Desktop (3 columns):  [Card] [Card] [Card]
                      [Card] [Card] [Card]

Tablet (2 columns):   [Card] [Card]
                      [Card] [Card]

Mobile (1 column):    [Card]
                      [Card]
                      [Card]
```

### Navigation

| Platform | Pattern |
|----------|---------|
| Mobile | Bottom tab bar: Home, Community, Search, Deals, Profile (5 tabs) |
| Desktop | Sticky top nav with categories + search |
| Rationale | Bottom tab is familiar to Japanese users (LINE, Naver app pattern) |

### Next.js Architecture

```
app/
├── page.tsx              # Server Component (SEO optimized)
├── layout.tsx            # Server Component
└── ...

components/
├── client/               # "use client" components
│   ├── SearchBar.tsx
│   ├── BottomTabNav.tsx
│   └── ...
├── server/               # Server actions
│   ├── actions.ts
│   └── ...
└── ui/                   # Shared UI (cards, buttons...)
    └── ...
```

- Pages default to Server Components for SEO
- Client components only when interactivity needed
- Server actions for data operations

---

## Visual Effects

| Effect | Level | Detail |
|--------|-------|--------|
| Shadows | Subtle | Cards with soft shadow for depth |
| Animations | Subtle | Fade-in on scroll, smooth transitions |
| Parallax | None | Not needed, keep performance |
| Hover effects | Subtle | Card lift on hover (desktop only) |
| Border radius | 12-16px | Rounded corners — friendly, modern |
| Glassmorphism | Subtle | Top bar translucent effect only |

### Performance Constraints

- Tourists on 4G need fast loading — lazy load images
- Minimal JS animations on mobile
- No auto-play, no sudden pop-ups (senior-friendly)
- Next.js Image component for auto-optimization

---

## Photography & Imagery

### Photography Style: Authentic/Lifestyle

- Real Da Nang imagery — beaches, street food, culture, daily life
- Not overly staged — matches community-first, trustworthy brand
- Warm color grading consistent with tropical palette

### Image Sourcing

| Phase | Source | Content |
|-------|--------|---------|
| Demo | Unsplash / Pexels | "Da Nang", "Vietnamese food", "Asian travel" |
| Production | Camera-only UGC | Business owners photograph their own establishments |
| Editorial | Professional photoshoot | Guides, featured content |

### Image Standards

| Aspect | Standard |
|--------|----------|
| Hero images | 1920px wide, 16:9 ratio |
| Card images | 800px wide, 4:3 ratio |
| Avatars | 1:1 ratio |
| Format | WebP preferred, JPEG fallback |
| Alt text | Required for all images (SEO + accessibility) |
| Optimization | Next.js Image component auto-handles |

### Icon Style

| Aspect | Decision |
|--------|----------|
| Library | Lucide Icons |
| Style | Line icons, 1.5px stroke |
| Size | 24px default |
| Rationale | Clean, modern, lightweight, free |

---

## Design Constraints

| Constraint | Impact on Design |
|-----------|-----------------|
| Solo developer, 7 days | Use UI library (e.g., Tailwind), keep design simple but polished |
| Next.js | SSR for SEO, Image component for optimization |
| Local demo only | No CDN needed, but structure for future deployment |
| 3 languages (EN/JP/VN) | Layout must accommodate text expansion, CJK characters |
| Senior users (secondary) | Min 14px text, large touch targets, no complex gestures |
| Mobile-first (future) | Design responsive, bottom tab nav pattern |

---

**Status:** Visual Direction Complete
**Next Phase:** Platform Requirements, then Phase 2
**Last Updated:** 2026-04-06

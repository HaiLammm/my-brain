# Prototype Roadmap: Scenario 03 — Tomoko's Da Nang Discovery

## Overview

| Field | Value |
|-------|-------|
| **Scenario** | 03: Tomoko's Da Nang Discovery |
| **Goal** | Tomoko finds a great restaurant, orders confidently, and saves money with a coupon |
| **Pages** | 3 |
| **Device** | Fully Responsive (Mobile-first, all breakpoints) |
| **Design Fidelity** | Design System Components (design-tokens.md) |
| **Language** | English |
| **Created** | 2026-04-08 |

---

## Design Tokens

| Token | Value |
|-------|-------|
| Primary | Navy Blue `#1B2A4A` |
| Secondary | Coral `#FF6B4A` |
| Accent | Teal `#2EC4B6` |
| Background | Warm White `#FAFAF8` |
| Surface | White `#FFFFFF` |
| Text Primary | Dark Navy `#0D1B2A` |
| Text Secondary | Gray `#6B7280` |
| Success | Green `#27AE60` |
| Warning | Amber `#F2994A` |
| Error | Red `#EB5757` |
| Font Headlines | Noto Sans JP Bold |
| Font Body | Noto Sans JP Regular |
| Font UI | Inter / Noto Sans Medium |
| Border Radius | 12-16px |
| Icons | Lucide Icons, line style, 1.5px stroke |

---

## Pages

| # | Page | Spec | Status |
|---|------|------|--------|
| 03.1 | Senpai Article/Guide | `C-UX-Scenarios/03-tomokos-danang-discovery/03.1-senpai-article-guide/03.1-senpai-article-guide.md` | Built |
| 03.2 | Translation Tools | `C-UX-Scenarios/03-tomokos-danang-discovery/03.2-translation-tools/03.2-translation-tools.md` | Built |
| 03.3 | Deals & Coupons | `C-UX-Scenarios/03-tomokos-danang-discovery/03.3-deals-coupons/03.3-deals-coupons.md` | Built |

---

## Shared Components

| Component | Used In | Status |
|-----------|---------|--------|
| BottomTabNav | All pages | Done |
| SectionHeader | All pages | Done |
| SenpaiBadge | 03.1, 03.3 | Done |
| FairPriceIndicator | 03.1 | Done |
| DualCurrencyPrice | 03.1, 03.3 | Done |
| SenpaiTipCard | 03.1 | Done |
| FilterChips | 03.1, 03.3 | Done |
| PrimaryCTAButton | All pages | Done |
| ToastNotification | 03.2, 03.3 | Done |

---

## Demo Data

- `data/demo-data.json` — Complete demo dataset with:
  - Current user: Tomoko Ishikawa (tourist, Day 2 of 5-day vacation)
  - 5 restaurants near My Khe Beach with ratings, prices, distances
  - Senpai article: "Top 5 Bun Cha near My Khe Beach"
  - 4 senpai profiles (article authors, reviewers)
  - 5 coupons/deals from local restaurants
  - Translation phrases: common ordering phrases JP↔VN
  - Phrasebook categories for dining situations

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 768px) | Single column, bottom tab nav, translation FAB |
| Tablet (768-1024px) | Wider cards, map sidebar, top nav |
| Desktop (> 1024px) | Two-column layouts, sticky sidebar, no FAB |

---

## Notes

- Fully responsive: mobile-first design with progressive enhancement
- English content for prototype (spec uses Japanese for realistic content)
- All prices shown in dual currency (VND + JPY equivalent)
- Fair-price indicators on restaurant listings
- Translation FAB persistent on article page
- Coupon QR code simulation for redemption flow

# Prototype Roadmap: Scenario 01 — Naoki's First Week

## Overview

| Field | Value |
|-------|-------|
| **Scenario** | 01: Naoki's First Week |
| **Goal** | Naoki finds trustworthy guidance to navigate his first week in Da Nang |
| **Pages** | 5 |
| **Device** | Desktop-Only (1280px+) |
| **Design Fidelity** | Design System Components (from visual-direction.md) |
| **Language** | English (default, no switching) |
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
| 01.1 | Homepage | `C-UX-Scenarios/01-naokis-first-week/01.1-homepage/01.1-homepage.md` | To Do |
| 01.2 | Newcomer Onboarding | `C-UX-Scenarios/01-naokis-first-week/01.2-newcomer-onboarding/01.2-newcomer-onboarding.md` | To Do |
| 01.3 | Area/Neighborhood Guide | `C-UX-Scenarios/01-naokis-first-week/01.3-area-neighborhood-guide/01.3-area-neighborhood-guide.md` | To Do |
| 01.4 | Search/Browse | `C-UX-Scenarios/01-naokis-first-week/01.4-search-browse/01.4-search-browse.md` | To Do |
| 01.5 | Listing Detail | `C-UX-Scenarios/01-naokis-first-week/01.5-listing-detail/01.5-listing-detail.md` | To Do |

---

## Shared Components

| Component | Used In | Status |
|-----------|---------|--------|
| TopNavBar | All pages | To Do |
| SearchBar | 01.1, 01.4 | To Do |
| SenpaiCard | 01.1, 01.2, 01.3, 01.5 | To Do |
| DealCard | 01.1 | To Do |
| ListingCard | 01.4 | To Do |
| SectionHeader | All pages | To Do |
| FairPriceIndicator | 01.4, 01.5 | To Do |
| SenpaiVerifiedBadge | 01.4, 01.5 | To Do |
| DualCurrencyPrice | 01.4, 01.5 | To Do |

---

## Demo Data

- `data/demo-data.json` — Complete demo dataset with:
  - Current user: Naoki Tanaka (work transfer, Hai Chau workplace)
  - 4 areas with details, commute times, rent ranges
  - 6 apartment listings across areas
  - 4 senpai profiles with reviews
  - 4 deals from local businesses
  - 3 community threads
  - 3 listing reviews

---

## Notes

- Desktop-only: no bottom tab nav, use sticky top navigation
- English content only for prototype simplicity
- All prices shown in dual currency (VND + JPY equivalent)
- Fair-price indicators on all listings
- localStorage for checklist persistence and banner dismissal

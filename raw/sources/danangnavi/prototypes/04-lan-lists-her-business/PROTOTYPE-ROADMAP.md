# Scenario 04: Lan Lists Her Business — Prototype Roadmap

## Configuration

| Setting | Value |
|---------|-------|
| Device | Desktop-Only (1440px) |
| Fidelity | Design System (tokens applied) |
| Language | Vietnamese only (business owner UI) |
| Demo Data | Lan — restaurant owner near My Khe Beach |

## Scenario Overview

Lan (38, Vietnamese restaurant owner) creates her business listing on DaNangNavi to reach Japanese customers. All UI in Vietnamese.

## Pages

| # | Page | Route | Status |
|---|------|-------|--------|
| 04.1 | Listing Editor | /business/listings/new | Built |
| 04.2 | Coupon Manager | /business/coupons | Built |
| 04.3 | Business Dashboard | /business/dashboard | Built |

## Build Order

1. **04.1 Listing Editor** — 3-step form (info → photos/menu → preview/publish)
2. **04.2 Coupon Manager** — Coupon creator with Japanese preview
3. **04.3 Business Dashboard** — Analytics dashboard with empty state

## Key Design Patterns

- All Vietnamese UI — no Japanese in business owner interface (except preview cards)
- Auto-translation: Vietnamese input → Japanese preview
- Menu OCR: photo → editable translated table
- Desktop layout: max-width 1200px centered, 2-column where applicable
- Design tokens from D-Design-System/design-tokens.md

## Navigation Flow

```
04.1 Listing Editor → "Tạo Coupon ngay" → 04.2 Coupon Manager → "Đi tới Bảng điều khiển" → 04.3 Dashboard
```

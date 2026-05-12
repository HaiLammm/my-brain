# Filter Chips

**Component ID:** `filter-chips`
**Category:** Interactive — Navigation
**Complexity:** Simple (individual chip) / Moderate (chip group)
**Used on:** 01.1 Homepage, 01.4 Search, 02.2 Thread, 02.3 Events, 03.3 Deals, 04.2 Coupon Manager (6 pages)

---

## Purpose

Horizontally scrollable row of pill-shaped chips for quick filtering or category selection. Familiar East Asian mobile pattern (LINE, Naver).

---

## Variants

| Variant | Selection | Usage |
|---------|-----------|-------|
| `single` | One active at a time | Category browsing, sort options |
| `multi` | Multiple active | Search filters, topic tags |

---

## Properties — Chip (Individual)

| Property | Value |
|----------|-------|
| Font | `text-caption` (14px), Medium |
| Padding | `space-sm` (8px) vertical, `space-md` (12px) horizontal |
| Border radius | `radius-full` (pill) |
| Gap between chips | `space-sm` (8px) |
| Min height | 36px (touch-friendly) |

---

## Properties — Chip Group (Container)

| Property | Value |
|----------|-------|
| Layout | Horizontal scroll, no wrap |
| Overflow | Scroll with hidden scrollbar (CSS) |
| Padding | `space-lg` (16px) horizontal (page edge bleed) |
| Scroll behavior | Smooth snap |

---

## States — Individual Chip

### Inactive
- Background: `color-surface` (#FFFFFF)
- Text: `color-text-primary` (#0D1B2A)
- Border: 1px solid `#E5E7EB`

### Active
- Background: `color-accent` (#2EC4B6 Teal)
- Text: `color-text-inverse` (#FFFFFF)
- Border: none
- **Note:** Always Teal — chips indicate selection state, not CTA action. Specs 02.3 (Events) incorrectly used Coral; corrected to Teal for consistency.

### Hover (desktop)
- Background: `color-surface-hover` (#F5F5F3)
- Transition: `duration-fast`

---

## Content Examples

| Context | Chips |
|---------|-------|
| Homepage categories | レストラン, ビザ, 住居, 医療, 学校 |
| Search filters | エリア, 予算, タイプ, 先輩おすすめ, 日本語OK |
| Event filters | 今週, 週末, ディナー, アウトドア, 初心者歓迎 |
| Deal categories | 近く, フード, スパ, ツアー |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Horizontal scroll, edge-to-edge |
| Desktop | Wrap to multiple rows if space allows |

---

**Last Updated:** 2026-04-08

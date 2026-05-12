# Fair Price Indicator

**Component ID:** `fair-price-indicator`
**Category:** Status — Badge
**Complexity:** Simple
**Used on:** 01.4 Search, 01.5 Listing Detail, 03.1 Guide (3 pages)

---

## Purpose

Color-coded label showing price trustworthiness relative to senpai-reported average price data. Directly addresses the #1 fear of both Naoki and Tomoko personas — being overcharged as foreigners.

---

## Variants

| Variant | Color | Label (JP) | Meaning |
|---------|-------|------------|---------|
| `fair` | `color-success` (#27AE60) | 適正価格 ✓ | Price is fair vs. senpai data |
| `high` | `color-warning` (#F2994A) | やや高め | Slightly above average |
| `caution` | `color-error` (#EB5757) | 要注意 | Significantly above average |

---

## Properties

| Property | Value |
|----------|-------|
| Font | `text-small` (12px), SemiBold |
| Padding | `space-xs` (4px) vertical, `space-sm` (8px) horizontal |
| Border radius | `radius-full` (pill) |
| Background | Variant color at 15% opacity |
| Text color | Variant color at full opacity |

---

## States

- **Default:** Static display
- **Tooltip (desktop):** Hover shows "先輩の平均: ¥XX,XXX" with the reference average price

---

## Data Dependencies

- Requires senpai-reported price data to calculate fairness
- Falls back to hidden (no indicator) if insufficient data points

---

## Responsive

No change across breakpoints.

---

**Last Updated:** 2026-04-08

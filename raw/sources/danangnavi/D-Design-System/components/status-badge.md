# Status Badge

**Component ID:** `status-badge`
**Category:** Status — Badge
**Complexity:** Simple
**Used on:** 04.2 Coupon Manager, 04.3 Dashboard (2 pages)

---

## Purpose

Pill-shaped label indicating the current state of a business entity (listing, coupon). Used in the Vietnamese business owner portal.

---

## Variants

| Variant | Background | Text | Label (VI) |
|---------|-----------|------|------------|
| `active` | `color-success` (#27AE60) at 15% | `color-success` | Đang hoạt động |
| `paused` | `color-warning` (#F2994A) at 15% | `color-warning` | Tạm dừng |
| `expired` | `color-text-secondary` (#6B7280) at 15% | `color-text-secondary` | Hết hạn |

---

## Properties

| Property | Value |
|----------|-------|
| Font | `text-small` (12px), SemiBold |
| Padding | `space-xs` (4px) vertical, `space-sm` (8px) horizontal |
| Border radius | `radius-full` (pill) |
| Icon | Small dot (6px) before text, same color as text |

---

## States

- **Default:** Static display, no interaction

---

## Responsive

No change across breakpoints.

---

**Last Updated:** 2026-04-08

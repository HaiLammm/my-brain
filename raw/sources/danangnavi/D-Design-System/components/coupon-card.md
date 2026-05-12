# Coupon Card

**Component ID:** `coupon-card`
**Category:** Display — Card
**Complexity:** Moderate
**Used on:** 03.3 Deals & Coupons, 04.2 Coupon Manager (2 pages)

---

## Purpose

Card displaying a deal or coupon offer. Consumer-facing variant shows savings and redemption CTA. Business-facing variant shows usage stats and management actions.

---

## Variants

| Variant | Context | Language |
|---------|---------|----------|
| `consumer` | 03.3 Deals page, My Coupons wallet | Japanese UI |
| `business` | 04.2 Coupon Manager, active coupons list | Vietnamese UI |
| `used` | 03.3 My Coupons (Used tab) | Japanese UI, grayed out |

---

## Properties — Variant: `consumer`

| Property | Value |
|----------|-------|
| Layout | Horizontal — photo left (100px), content right |
| Background | `color-surface` (#FFFFFF) |
| Border radius | `radius-md` (12px) |
| Shadow | `shadow-card` |
| Padding | `space-md` (12px) |
| Min height | 120px |

### Content Stack

| # | Element | Properties |
|---|---------|------------|
| 1 | Business photo | 100px × 100px, `radius-sm`, object-fit cover |
| 2 | Deal title | `text-body` (16px), SemiBold, max 2 lines |
| 3 | Business name | `text-caption` (14px), `color-text-secondary` |
| 4 | Savings badge | Coral pill — "50,000₫ OFF (~¥290)", `text-small`, Bold |
| 5 | Distance | `text-small` (12px), "📍 500m" |
| 6 | Expiry | `text-small` (12px), "残り3日" — turns `color-error` when ≤1 day |
| 7 | `save-heart-button` | Top-right corner |
| 8 | CTA button | "クーポンを使う" — `primary-cta-button` (compact), full-width bottom |

---

## Properties — Variant: `business`

| Property | Value |
|----------|-------|
| Layout | Horizontal — content full-width |
| Background | `color-surface` (#FFFFFF) |
| Border radius | `radius-md` (12px) |
| Border left | 3px solid (color matches `status-badge` variant) |
| Padding | `space-lg` (16px) |

### Content Stack

| # | Element | Properties |
|---|---------|------------|
| 1 | Coupon title | `text-body` (16px), SemiBold |
| 2 | `status-badge` | Active/Paused/Expired, inline after title |
| 3 | Discount | "20% giảm giá" or "50,000₫ giảm", `text-caption` |
| 4 | Usage counter | "Đã dùng: 15/100 lượt", `text-small` |
| 5 | Validity dates | "01/04 - 30/04/2026", `text-small` |
| 6 | Actions | Text links: "Sửa · Tạm dừng · Xóa", `color-accent` |

---

## Properties — Variant: `used`

| Property | Value |
|----------|-------|
| Base | Same as `consumer` variant |
| Overlay | Diagonal "使用済み" stamp, 45° rotation, `color-text-secondary` at 40% |
| Opacity | Card content at 60% opacity |
| Interactive | No — tap disabled |

---

## States

### Default
- Shadow: `shadow-card`

### Hover (desktop)
- Shadow: `shadow-card-hover`
- Transition: `duration-fast`

### Expiring Soon (consumer)
- Expiry text: `color-error` (#EB5757)
- Optional: Subtle pulsing border accent

---

## Interactions — Consumer

| Action | Result |
|--------|--------|
| Tap card | Open coupon detail in `modal-bottom-sheet` |
| Tap heart | Toggle save (or `signup-modal`) |
| Tap CTA | Open coupon detail with QR code |

## Interactions — Business

| Action | Result |
|--------|--------|
| Tap "Sửa" | Navigate to coupon edit form |
| Tap "Tạm dừng" | Toggle pause with confirmation |
| Tap "Xóa" | Delete with confirmation dialog |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width, vertical stack |
| Desktop | 2-column grid (consumer), list (business) |

---

**Last Updated:** 2026-04-08

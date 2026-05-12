# Toast Notification

**Component ID:** `toast-notification`
**Category:** Display — Feedback
**Complexity:** Simple
**Used on:** 03.3 Deals, 04.2 Coupon Manager, 05.2 Notifications (3 pages)

---

## Purpose

Brief, auto-dismissing floating message that confirms an in-page action without blocking the user's flow.

---

## Properties

| Property | Value |
|----------|-------|
| Position | Fixed, bottom center, 16px above bottom tab nav |
| Background | `color-primary` (#1B2A4A) at 95% opacity |
| Text color | `color-text-inverse` (#FFFFFF) |
| Font | `text-caption` (14px), Medium |
| Padding | `space-md` (12px) vertical, `space-lg` (16px) horizontal |
| Border radius | `radius-sm` (8px) |
| Shadow | `shadow-modal` |
| Max width | 320px |
| Z-index | Above content, below modals |

---

## Variants

| Variant | Icon | Usage |
|---------|------|-------|
| `success` | ✓ checkmark (white) | Action confirmed |
| `info` | ℹ info icon (white) | Informational |
| `error` | ✕ cross (white) | Action failed |

---

## States

### Enter
- Animation: Slide up + fade in
- Duration: `duration-normal` (300ms)

### Visible
- Duration: 3 seconds auto-dismiss
- Dismissible: Swipe down or tap

### Exit
- Animation: Fade out + slide down
- Duration: `duration-fast` (150ms)

---

## Content Examples

| Action | Toast (JP) |
|--------|-----------|
| Coupon saved | マイクーポンに保存しました ✓ |
| Settings saved | 設定を保存しました ✓ |
| Coupon created | クーポンが作成されました ✓ |
| Error | エラーが発生しました ✕ |

---

## Responsive

No change — always centered at bottom of viewport.

---

**Last Updated:** 2026-04-08

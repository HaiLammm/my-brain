# Save (Heart) Button

**Component ID:** `save-heart-button`
**Category:** Interactive — Button
**Complexity:** Simple
**Used on:** 01.4 Search, 03.3 Deals (2 pages)

---

## Purpose

Allows users to save/favorite listings and coupons for later. Heart icon is universally understood and provides clear visual feedback.

---

## Properties

| Property | Value |
|----------|-------|
| Icon | Heart (Lucide `heart`) |
| Size | 24px icon within 40px touch target |
| Position | Top-right corner of cards, or inline in action bar |
| Border radius | `radius-full` (circle touch target) |

---

## States

### Unsaved
- Icon: Heart outline, 1.5px stroke
- Color: `color-text-secondary` (#6B7280)

### Saved
- Icon: Heart filled
- Color: `color-secondary` (#FF6B4A Coral)
- Animation: Bounce scale (1.0 → 1.3 → 1.0), `duration-normal`

### Hover (desktop)
- Color: `color-secondary` (#FF6B4A) at 60% opacity

---

## Interactions

1. **Tap (authenticated):** Toggle saved state, show `toast-notification`
2. **Tap (unauthenticated):** Trigger `signup-modal`
3. **Animation:** Bounce on save, no animation on unsave

---

## Responsive

No change across breakpoints — always 40px touch target.

---

**Last Updated:** 2026-04-08

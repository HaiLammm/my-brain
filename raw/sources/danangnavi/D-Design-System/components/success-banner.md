# Success Banner

**Component ID:** `success-banner`
**Category:** Display — Feedback
**Complexity:** Simple
**Used on:** 04.2 Coupon Manager, 05.2 Notifications (2 pages)

---

## Purpose

Dismissible top-of-page banner confirming a prior action was successful. Provides continuity between steps in multi-page flows.

---

## Properties

| Property | Value |
|----------|-------|
| Background | `color-success` (#27AE60) at 10% opacity |
| Border-left | 3px solid `color-success` (#27AE60) |
| Text color | `color-text-primary` (#0D1B2A) |
| Font | `text-body` (16px), Regular |
| Icon | ✓ checkmark, `color-success`, before text |
| Padding | `space-md` (12px) vertical, `space-lg` (16px) horizontal |
| Border radius | `radius-sm` (8px) |
| Dismiss | ✕ button, top-right, `color-text-secondary` |
| Position | Full-width, top of main content area (below nav) |

---

## States

### Visible
- Default state on page load
- Auto-dismiss after 10 seconds (optional)

### Dismissing
- Fade out + collapse height
- Duration: `duration-normal` (300ms)

### Dismissed
- Removed from DOM / display: none

---

## Content Examples

| Context | Message (VI) |
|---------|-------------|
| Listing published | ✓ Tin đăng đã được đăng thành công! |
| Account created | ✓ Tài khoản đã được tạo thành công! |
| Coupon created | ✓ Coupon đã được tạo thành công! |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width, edge-to-edge with page padding |
| Desktop | Full-width within content container |

---

**Last Updated:** 2026-04-08

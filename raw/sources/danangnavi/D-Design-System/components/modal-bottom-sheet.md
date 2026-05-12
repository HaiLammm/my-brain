# Modal / Bottom Sheet

**Component ID:** `modal-bottom-sheet`
**Category:** Interactive — Overlay
**Complexity:** Complex
**Used on:** 01.5 Listing Detail (contact form), 03.3 Deals (coupon detail), 05.1 Sign Up (auth modal) (3 pages)

---

## Purpose

Full-screen or partial overlay for focused tasks that require user attention. Slides up from bottom on mobile (bottom sheet), centered card on desktop (modal). Used for forms, detail views, and confirmations.

---

## Variants

| Variant | Height | Context |
|---------|--------|---------|
| `partial` | 60vh, draggable to full | Quick views, coupon detail |
| `full` | 100vh (mobile), centered card (desktop) | Forms, sign up, contact |
| `compact` | Auto-height, max 50vh | Confirmations, small forms |

---

## Properties — Container

| Property | Value |
|----------|-------|
| Background | `color-surface` (#FFFFFF) |
| Border radius | `radius-lg` (16px) top corners (mobile), all corners (desktop) |
| Shadow | `shadow-modal` |
| Backdrop | `color-primary` (#1B2A4A) at 50% opacity |
| Z-index | Modal layer — above everything |

### Header

| Property | Value |
|----------|-------|
| Height | 48px |
| Drag handle | 36px × 4px rounded bar, `#D1D5DB`, centered top (mobile only) |
| Close button | × icon, top-right, 40px touch target |
| Title | `text-h3` (20px, SemiBold), optional, center or left |
| Border bottom | 1px solid `#E5E7EB` |

### Body

| Property | Value |
|----------|-------|
| Padding | `space-xl` (24px) |
| Overflow | Scroll (vertical) |
| Max height | Viewport minus header and footer |

### Footer (optional)

| Property | Value |
|----------|-------|
| Height | 64px |
| Padding | `space-md` (12px) vertical, `space-lg` (16px) horizontal |
| Border top | 1px solid `#E5E7EB` |
| Content | Action buttons (primary + secondary) |

---

## States

### Opening
- Mobile: Slide up from bottom, `duration-normal` (300ms)
- Desktop: Fade in + scale(0.95 → 1.0), `duration-normal`
- Backdrop: Fade in

### Open
- Body scrollable if content overflows
- Background page scroll locked

### Closing
- Reverse of opening animation
- Trigger: × button, backdrop tap, swipe down (mobile), Escape key

### Dragging (partial variant, mobile)
- User drags handle to resize
- Snap points: 60vh, 100vh, dismiss (below 30vh)
- Velocity-based: fast swipe down = dismiss

---

## Interactions

| Action | Result |
|--------|--------|
| Tap backdrop | Close sheet |
| Tap × | Close sheet |
| Swipe down (mobile) | Dismiss if past threshold |
| Drag handle (mobile) | Resize between snap points |
| Escape key (desktop) | Close sheet |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Bottom sheet, full-width, slides up |
| Desktop | Centered card, 480px max-width, backdrop |

---

**Last Updated:** 2026-04-08

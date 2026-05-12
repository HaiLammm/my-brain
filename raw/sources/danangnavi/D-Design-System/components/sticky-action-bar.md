# Sticky Action Bar

**Component ID:** `sticky-action-bar`
**Category:** Navigation — Action Bar
**Complexity:** Moderate
**Used on:** 01.2 Onboarding, 01.5 Listing Detail, 04.2 Coupon Manager (3 pages)

---

## Purpose

Fixed bottom bar on mobile containing key action buttons. Keeps the primary CTA always visible regardless of scroll position. Sits above the `bottom-tab-nav` when both are present.

---

## Properties

| Property | Value |
|----------|-------|
| Position | Fixed bottom (above `bottom-tab-nav` if present) |
| Width | Full-width |
| Height | 64px + safe area inset |
| Background | `color-surface` (#FFFFFF) |
| Border top | 1px solid `#E5E7EB` |
| Shadow | `shadow-sticky` |
| Padding | `space-md` (12px) vertical, `space-lg` (16px) horizontal |
| Z-index | Above content, below modals, above bottom-tab-nav |
| Layout | Flexbox, space-between or center, gap `space-md` |

---

## Variants

### `single-cta`
- One full-width `primary-cta-button`
- Used on: 01.2 Onboarding ("進捗を保存"), 04.2 Coupon Manager ("Tạo Coupon")

### `dual-action`
- Left: price/info display
- Right: primary CTA + optional secondary button
- Used on: 01.5 Listing Detail

| Element | Properties |
|---------|------------|
| Price display | `text-h3` (20px, Bold), left-aligned |
| Primary CTA | `primary-cta-button` (compact), right side |
| Secondary button | Outline button ("♡ 保存"), left of primary |

---

## States

### Default
- Visible, static at bottom

### Hidden (scroll)
- Optional: Hide on scroll down, show on scroll up
- Transition: Slide down/up, `duration-normal` (300ms)

### With bottom-tab-nav
- Positioned above tab nav (bottom: 56px + safe area)

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Fixed bottom bar |
| Desktop | Hidden — CTA buttons inline in content |

---

**Last Updated:** 2026-04-08

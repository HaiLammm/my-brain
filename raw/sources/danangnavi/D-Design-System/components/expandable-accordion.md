# Expandable Accordion

**Component ID:** `expandable-accordion`
**Category:** Interactive — Display
**Complexity:** Simple
**Used on:** 01.2 Newcomer Onboarding, 01.5 Listing Detail, 03.3 Deals (3 pages)

---

## Purpose

Collapsible content section that hides secondary information by default, keeping the page scannable while allowing users to drill into details on demand.

---

## Properties

### Trigger Row

| Property | Value |
|----------|-------|
| Background | `color-surface` (#FFFFFF) or transparent |
| Font | `text-body` (16px), Medium |
| Text color | `color-text-primary` (#0D1B2A) |
| Icon | Chevron (▾/▴), right-aligned, `color-text-secondary` |
| Padding | `space-md` (12px) vertical |
| Border bottom | 1px solid `#E5E7EB` |
| Cursor | Pointer |
| Min height | 48px (touch-friendly) |

### Content Panel

| Property | Value |
|----------|-------|
| Font | `text-body` (16px), Regular |
| Text color | `color-text-primary` (#0D1B2A) |
| Padding | `space-lg` (16px) |
| Background | `color-bg` (#FAFAF8) or transparent |

---

## States

### Collapsed (default)
- Content panel: hidden (height: 0, overflow: hidden)
- Chevron: ▾ pointing down

### Expanded
- Content panel: visible, animated expand
- Chevron: ▴ pointing up, rotated 180°
- Animation: Height transition, `duration-normal` (300ms)

### Hover (desktop)
- Trigger row background: `color-surface-hover` (#F5F5F3)

---

## Content Examples

| Context | Trigger Label (JP) | Content |
|---------|-------------------|---------|
| Senpai tip | 💡 先輩のアドバイス | Quote + advice text |
| Contract guide | 契約時の注意点 ▾ | Checklist of contract checkpoints |
| Coupon terms | 利用条件 ▾ | Terms and conditions text |

---

## Responsive

No change across breakpoints — full-width within its container.

---

**Last Updated:** 2026-04-08

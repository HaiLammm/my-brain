# Segmented Control

**Component ID:** `segmented-control`
**Category:** Interactive — Navigation
**Complexity:** Simple
**Used on:** 03.2 Translation Tools, 05.2 Notifications (2 pages)

---

## Purpose

Horizontal multi-option selector where exactly one segment is active at a time. Used for mode switching or preference selection within a page section.

---

## Properties

| Property | Value |
|----------|-------|
| Background | `#E5E7EB` (light gray) |
| Border radius | `radius-sm` (8px) |
| Padding | 2px (container padding around segments) |
| Height | 40px |
| Width | Full-width or auto |

### Segment (Individual)

| Property | Value |
|----------|-------|
| Font | `text-caption` (14px), Medium |
| Padding | `space-sm` (8px) vertical, `space-md` (12px) horizontal |
| Border radius | 6px (slightly smaller than container) |

---

## States — Individual Segment

### Active
- Background: `color-primary` (#1B2A4A)
- Text: `color-text-inverse` (#FFFFFF)
- Shadow: subtle inner shadow

### Inactive
- Background: transparent
- Text: `color-text-secondary` (#6B7280)

### Hover (desktop, inactive only)
- Background: `#D1D5DB` (slightly darker gray)
- Transition: `duration-fast`

---

## Interactions

- Tap/click switches active segment
- Transition: Sliding background indicator, `duration-normal` (300ms)

---

## Content Examples

| Context | Segments |
|---------|----------|
| Translation mode | 音声 / テキスト / フレーズ帳 |
| Notification frequency | 即時 / 日次 / 週次 |
| View toggle | リスト / カレンダー |

---

## Responsive

No change across breakpoints — scales with container width.

---

**Last Updated:** 2026-04-08

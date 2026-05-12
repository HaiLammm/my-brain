# Search Bar

**Component ID:** `search-bar`
**Category:** Interactive — Input
**Complexity:** Moderate
**Used on:** 01.1 Homepage, 01.4 Search/Browse (2 pages)

---

## Purpose

Prominent search input for discovering listings, guides, and community content. Adapts behavior based on context — hero search on homepage vs. functional search on results page.

---

## Variants

| Variant | Context | Behavior |
|---------|---------|----------|
| `hero` | 01.1 Homepage | Centered in hero section, tap opens search overlay |
| `functional` | 01.4 Search | Full-width, pre-filled from context, real-time filtering |

---

## Properties

| Property | Value |
|----------|-------|
| Height | 48px |
| Background | `color-surface` (#FFFFFF) |
| Border | 1px solid `#E5E7EB` |
| Border radius | `radius-sm` (8px) |
| Shadow | `shadow-card` (hero variant only) |
| Padding | `space-md` (12px) horizontal |
| Font | `text-body` (16px), Regular |
| Placeholder color | `color-text-secondary` (#6B7280) |
| Icon | `search` (Lucide), 20px, left side, `color-text-secondary` |

---

## States

### Empty (default)
- Placeholder text visible
- Search icon left-aligned

### Focused
- Border: 2px solid `color-accent` (#2EC4B6)
- Shadow: `shadow-card-hover`
- Placeholder fades

### Typing
- Text: `color-text-primary` (#0D1B2A)
- Clear button (×) appears right side
- Debounce: 300ms before triggering search (functional variant)

### Loading (functional)
- Small spinner replaces search icon (right side)
- Duration: until results return

---

## Interactions

### Hero Variant (01.1)
| Action | Result |
|--------|--------|
| Tap input | Opens search overlay with suggestions |
| Type in overlay | Real-time suggestion filtering |
| Select suggestion | Navigate to search results page |

### Functional Variant (01.4)
| Action | Result |
|--------|--------|
| Type | Debounced real-time result filtering |
| Tap clear (×) | Reset input + show all results |
| Submit (Enter) | Trigger full search |

---

## Placeholder Content

| Context | Placeholder (JP) |
|---------|-----------------|
| Homepage | ダナンで何を探していますか？ |
| Search page | レストラン、住まい、ガイド... |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width with page padding |
| Desktop (hero) | Max-width 600px, centered |
| Desktop (search) | Full-width within content area |

---

**Last Updated:** 2026-04-08

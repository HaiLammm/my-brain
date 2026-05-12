# Senpai Card / Listing Card

**Component ID:** `senpai-card`
**Category:** Display — Card
**Complexity:** Moderate
**Used on:** 01.1 Homepage (Senpai Picks), 01.4 Search (results), 01.5 Listing Detail (related) (3 pages)

---

## Purpose

Primary content card for listings — apartments, restaurants, services. Shows photo, title, price, senpai verification, and key metadata. The core browsing unit of the platform.

---

## Variants

| Variant | Context | Layout |
|---------|---------|--------|
| `featured` | 01.1 Homepage Senpai Picks | Vertical card, larger photo, senpai avatar overlay |
| `result` | 01.4 Search results | Horizontal card (mobile), vertical (desktop grid) |
| `compact` | Related listings, inline references | Small horizontal card, minimal info |

---

## Properties — Variant: `featured`

| Property | Value |
|----------|-------|
| Width | 280px (horizontal scroll) or grid cell |
| Photo | 4:3 ratio, top, `radius-md` top corners |
| Background | `color-surface` (#FFFFFF) |
| Border radius | `radius-md` (12px) |
| Shadow | `shadow-card` |
| Padding | `space-lg` (16px) below photo |

### Content Stack

| # | Element | Properties |
|---|---------|------------|
| 1 | Photo | 4:3, object-fit cover |
| 2 | `senpai-badge` (verified) | Positioned top-right of photo, overlay |
| 3 | Title | `text-body` (16px), SemiBold, max 2 lines, ellipsis |
| 4 | Star rating | ⭐ + number (e.g., "4.5"), `text-caption`, inline |
| 5 | Senpai avatar + name | 24px avatar + "田中さんのおすすめ", `text-small` |
| 6 | Price | `dual-price-display` (inline variant) |

---

## Properties — Variant: `result`

| Property | Value |
|----------|-------|
| Layout (mobile) | Horizontal — photo left (120px), content right |
| Layout (desktop) | Vertical — photo top, content below (grid) |
| Photo | 1:1 (mobile), 4:3 (desktop) |
| Background | `color-surface` (#FFFFFF) |
| Border radius | `radius-md` (12px) |
| Shadow | `shadow-card` |
| Padding | `space-md` (12px) |

### Content Stack

| # | Element | Properties |
|---|---------|------------|
| 1 | Title | `text-body` (16px), SemiBold, max 2 lines |
| 2 | `senpai-badge` (verified) | Inline after title |
| 3 | `dual-price-display` (inline) | Primary price prominent |
| 4 | `fair-price-indicator` | Inline, after price |
| 5 | Specs row | Room specs ("1LDK · 45㎡"), `text-caption` |
| 6 | Senpai snippet | "「静かで住みやすい」— 田中さん", `text-small`, italic |
| 7 | `save-heart-button` | Top-right corner of card |

---

## Properties — Variant: `compact`

| Property | Value |
|----------|-------|
| Layout | Horizontal — 60px thumbnail + title + price |
| Height | 72px |
| Photo | 60px square, `radius-sm` |
| Content | Title (1 line) + price, vertically stacked |

---

## States

### Default
- Shadow: `shadow-card`

### Hover (desktop)
- Shadow: `shadow-card-hover`
- Transform: `translateY(-2px)`
- Transition: `duration-fast`

### Pressed
- Transform: `scale(0.98)`

---

## Interactions

| Action | Result |
|--------|--------|
| Tap card | Navigate to listing detail page |
| Tap heart | Toggle save (or trigger `signup-modal`) |
| Long press (mobile) | Quick preview (optional future feature) |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile (featured) | Horizontal scroll row, 280px per card |
| Mobile (result) | Horizontal layout, full-width stack |
| Desktop (featured) | 3-column grid |
| Desktop (result) | 3-column vertical card grid |

---

**Last Updated:** 2026-04-08

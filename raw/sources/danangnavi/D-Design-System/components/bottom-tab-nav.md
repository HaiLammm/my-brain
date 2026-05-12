# Bottom Tab Navigation

**Component ID:** `bottom-tab-nav`
**Category:** Navigation — Global
**Complexity:** Moderate
**Used on:** All mobile pages (global component)

---

## Purpose

Primary mobile navigation pattern. Fixed bottom bar with 5 tabs covering core user needs. Familiar to Japanese users from LINE/Naver apps. Hidden on desktop where sticky top nav takes over.

---

## Properties

| Property | Value |
|----------|-------|
| Position | Fixed bottom, full-width |
| Height | 56px + safe area inset (iOS) |
| Background | `color-surface` (#FFFFFF) |
| Border top | 1px solid `#E5E7EB` |
| Shadow | `shadow-sticky` (0 -2px 8px rgba(0,0,0,0.06)) |
| Z-index | Highest — above all content, below modals |
| Layout | 5 equal-width flex items, center-aligned |

### Tab Item

| Property | Value |
|----------|-------|
| Icon | Lucide icons, 24px, 1.5px stroke |
| Label | `text-small` (12px), Regular |
| Gap | `space-xs` (4px) between icon and label |
| Touch target | Full tab width × 56px height |

---

## Tabs

| # | Icon | Label (JP) | Route | Description |
|---|------|-----------|-------|-------------|
| 1 | `home` | ホーム | `/` | Homepage feed |
| 2 | `search` | 検索 | `/search` | Search & browse |
| 3 | `users` | コミュニティ | `/community` | Community hub |
| 4 | `tag` | お得 | `/deals` | Deals & coupons |
| 5 | `user` | プロフィール | `/profile` | User profile |

---

## States

### Inactive Tab
- Icon: `color-text-secondary` (#6B7280), outline style
- Label: `color-text-secondary` (#6B7280)

### Active Tab
- Icon: `color-primary` (#1B2A4A Navy), filled style
- Label: `color-primary` (#1B2A4A Navy)
- Transition: `duration-fast` (150ms)

### With Notification Badge
- Small red dot (8px) positioned top-right of icon
- Used on Community tab for new activity

---

## Interactions

- Tap switches active tab and navigates to route
- Double-tap on active tab scrolls to top
- Maintains scroll position per tab (back-forward cache)

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<768px) | Visible, fixed bottom |
| Tablet (768px+) | Hidden — top nav takes over |
| Desktop (1024px+) | Hidden — sticky top nav with categories |

---

## Variant: Business Portal

Not used — business portal (04.x pages) uses sidebar/breadcrumb navigation in Vietnamese instead.

---

**Last Updated:** 2026-04-08

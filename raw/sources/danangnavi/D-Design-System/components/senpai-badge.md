# Senpai Badge

**Component ID:** `senpai-badge`
**Category:** Status — Badge
**Complexity:** Simple
**Used on:** 01.1 Homepage, 01.4 Search, 01.5 Listing Detail, 02.2 Thread, 02.3 Events, 02.4 Profile, 03.1 Guide (7 pages)

---

## Purpose

Trust indicator showing content or a user has been verified/endorsed by a senpai community member. Core to DaNangNavi's trust model — this badge is the primary signal that differentiates the platform from generic directories.

---

## Variants

| Variant | Context | Display |
|---------|---------|---------|
| `verified` | On cards, listings | "先輩認証済み ✓" — green pill badge |
| `rank-senpai` | On usernames, profile | "先輩" — teal (#2EC4B6) pill badge |
| `rank-contributor` | On profile progression | "コントリビューター" — teal at 60% opacity |
| `rank-active` | On profile progression | "アクティブ" — gray (#9CA3AF) pill badge |
| `rank-newcomer` | On usernames, profile | "新人" — gray/silver (#E5E7EB bg, #6B7280 text) pill badge |

---

## Properties

### Variant: `verified`

| Property | Value |
|----------|-------|
| Background | `color-success` (#27AE60) at 15% opacity |
| Text color | `color-success` (#27AE60) |
| Font | `text-small` (12px), SemiBold |
| Padding | `space-xs` (4px) vertical, `space-sm` (8px) horizontal |
| Border radius | `radius-full` (pill) |
| Icon | ✓ checkmark, before text |
| Content | "先輩認証済み ✓" |

### Variant: `rank-senpai`

| Property | Value |
|----------|-------|
| Background | `color-accent` (#2EC4B6) |
| Text color | `color-text-inverse` (#FFFFFF) |
| Font | `text-small` (12px), Medium |
| Padding | 2px vertical, 4px horizontal |
| Border radius | `radius-sm` (8px) |
| Content | "先輩" |

### Variant: `rank-contributor`

| Property | Value |
|----------|-------|
| Background | `color-accent` (#2EC4B6) at 60% opacity |
| Text color | `color-text-inverse` (#FFFFFF) |
| Font | `text-small` (12px), Medium |
| Padding | 2px vertical, 4px horizontal |
| Border radius | `radius-sm` (8px) |
| Content | "コントリビューター" |

### Variant: `rank-active`

| Property | Value |
|----------|-------|
| Background | `#9CA3AF` (gray) |
| Text color | `color-text-inverse` (#FFFFFF) |
| Font | `text-small` (12px), Medium |
| Padding | 2px vertical, 4px horizontal |
| Border radius | `radius-sm` (8px) |
| Content | "アクティブ" |

### Variant: `rank-newcomer`

| Property | Value |
|----------|-------|
| Background | `#E5E7EB` (light gray) |
| Text color | `color-text-secondary` (#6B7280) |
| Font | `text-small` (12px), Medium |
| Padding | 2px vertical, 4px horizontal |
| Border radius | `radius-sm` (8px) |
| Content | "新人" |

---

## States

- **Default:** Static display, no interaction
- **On cards:** Positioned top-right corner overlay or inline with title
- **On usernames:** Inline after the display name

---

## Responsive

No change across breakpoints — badge is always the same size.

---

**Last Updated:** 2026-04-08

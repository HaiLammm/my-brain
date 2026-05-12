# Empty State

**Component ID:** `empty-state`
**Category:** Display — Feedback
**Complexity:** Simple
**Used on:** 01.4 Search, 03.3 Deals, 04.3 Dashboard (3 pages)

---

## Purpose

Friendly placeholder shown when a list, search, or data section has no content to display. Provides guidance to help the user take action rather than leaving them at a dead end.

---

## Properties

| Property | Value |
|----------|-------|
| Layout | Vertical center stack |
| Illustration | Simple line illustration, 120px height |
| Headline font | `text-h3` (20px), SemiBold |
| Headline color | `color-text-primary` (#0D1B2A) |
| Body font | `text-body` (16px), Regular |
| Body color | `color-text-secondary` (#6B7280) |
| CTA button | `primary-cta-button` (compact variant) |
| Spacing | `space-lg` (16px) between elements |
| Padding | `space-3xl` (48px) vertical |
| Text align | Center |

---

## Variants

| Variant | Context | Illustration |
|---------|---------|-------------|
| `no-results` | Search returns empty | Magnifying glass with "?" |
| `no-data` | Dashboard/list has no items | Empty box or clipboard |
| `no-saved` | Wallet/favorites empty | Empty heart or bookmark |

---

## States

- **Default:** Static display
- **With CTA:** Includes action button (e.g., "フィルターをリセット", "お得情報を探す")
- **With suggestions:** Lists alternative actions as text links

---

## Content Examples

| Context | Headline (JP) | Body (JP) | CTA |
|---------|--------------|-----------|-----|
| Search no results | 結果が見つかりません | フィルターを変更してみてください | フィルターをリセット |
| Empty wallet | まだクーポンがありません | お得情報を探してみましょう | お得情報を見る |
| Dashboard new | データはまだありません | お客様が訪問すると表示されます | — |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width, illustration 100px |
| Desktop | Constrained to 400px max-width, centered |

---

**Last Updated:** 2026-04-08

# Section Header

**Component ID:** `section-header`
**Category:** Layout — Heading
**Complexity:** Simple
**Used on:** 01.1 Homepage, 01.3 Area Guide, 01.4 Search, 01.5 Listing Detail (4+ pages)

---

## Purpose

Consistent heading pattern used to introduce content sections throughout the app. Combines an emoji icon with a Japanese title for scannability and warmth.

---

## Properties

| Property | Value |
|----------|-------|
| HTML tag | `h2` |
| Font | `text-h2` (24px, Bold) |
| Text color | `color-text-primary` (#0D1B2A) |
| Icon | Emoji, before text, `space-sm` (8px) gap |
| Margin top | `space-2xl` (32px) |
| Margin bottom | `space-lg` (16px) |
| Text align | Left |

---

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard section heading with emoji |
| `with-link` | Adds a "すべて見る →" link aligned right |

### With-Link Variant

| Property | Value |
|----------|-------|
| Layout | Flexbox, space-between |
| Link text | "すべて見る →" / "Xem tất cả →" |
| Link color | `color-accent` (#2EC4B6) |
| Link font | `text-caption` (14px, Medium) |

---

## States

- **Default:** Static display
- **With-link hover:** Link underline on desktop hover

---

## Content Examples

| Section | Content |
|---------|---------|
| Senpai Picks | 🌟 先輩のおすすめ |
| Today's Deals | 🎯 今日のお得情報 |
| Community | 💬 コミュニティ |
| Neighborhood | 🏘️ エリアガイド |
| Reviews | ⭐ 先輩レビュー |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width, font 20px |
| Desktop | Full-width, font 24px |

---

**Last Updated:** 2026-04-08

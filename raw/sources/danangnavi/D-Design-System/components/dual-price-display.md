# Dual Price Display

**Component ID:** `dual-price-display`
**Category:** Display — Text
**Complexity:** Simple
**Used on:** 01.3 Area Guide, 01.5 Listing Detail, 03.1 Guide, 03.3 Deals (4 pages)

---

## Purpose

Shows prices in both Vietnamese Dong (VND) and Japanese Yen (JPY) simultaneously. Essential for Japanese users who need a familiar currency reference to evaluate costs.

---

## Variants

| Variant | Usage | Example |
|---------|-------|---------|
| `inline` | Within cards and lists | ₫5,000,000 (~¥28,000) |
| `stacked` | Detail pages, large display | Line 1: ₫5,000,000 / Line 2: ~¥28,000/月 |
| `toggle` | User-switchable primary currency | Toggle control switches which is primary |

---

## Properties

### Variant: `inline`

| Property | Value |
|----------|-------|
| Primary price font | `text-body` (16px), SemiBold |
| Primary price color | `color-text-primary` (#0D1B2A) |
| Secondary price font | `text-caption` (14px), Regular |
| Secondary price color | `color-text-secondary` (#6B7280) |
| Format | `₫{VND} (~¥{JPY})` |
| Separator | Parentheses with tilde (~) for approximate |

### Variant: `stacked`

| Property | Value |
|----------|-------|
| Primary price font | `text-h3` (20px), Bold |
| Secondary price font | `text-caption` (14px), Regular |
| Layout | Vertical stack, `space-xs` (4px) gap |

### Variant: `toggle`

| Property | Value |
|----------|-------|
| Toggle control | Small segmented control (¥ / ₫) |
| Toggle size | `text-small` (12px) |
| Active segment | `color-primary` (#1B2A4A) bg, white text |

---

## States

- **Default:** VND as primary, JPY as secondary (for Japan-based users)
- **Toggled:** JPY as primary, VND as secondary
- **Loading:** Skeleton placeholder while exchange rate loads

---

## Data Dependencies

- Exchange rate: VND/JPY (cached, updated daily)
- Prices always stored in VND, JPY calculated at display time

---

## Responsive

No layout change — font sizes scale with type scale.

---

**Last Updated:** 2026-04-08

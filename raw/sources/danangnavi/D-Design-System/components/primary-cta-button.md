# Primary CTA Button

**Component ID:** `primary-cta-button`
**Category:** Interactive — Button
**Complexity:** Simple
**Used on:** 01.1 Homepage, 01.5 Listing Detail, 03.3 Deals, 04.2 Coupon Manager, 04.3 Dashboard, 05.1 Sign Up, 05.2 Notifications (7+ pages)

---

## Purpose

The primary call-to-action button. Used for the single most important action on a screen — submission, confirmation, or navigation to a key flow.

---

## Variants

| Variant | Usage | Example |
|---------|-------|---------|
| `default` | Standard full-width CTA | "はじめる", "お問い合わせ" |
| `compact` | Inline within cards | "クーポンを使う" |

---

## Properties

| Property | Value |
|----------|-------|
| Background | `color-secondary` (#FF6B4A Coral) |
| Text color | `color-text-inverse` (#FFFFFF) |
| Font | `font-family-ui` Inter/Noto Sans, 16px, SemiBold (600) |
| Padding | `space-md` (12px) vertical, `space-xl` (24px) horizontal |
| Border radius | `radius-sm` (8px) |
| Min height | 48px (touch-friendly) |
| Width | Full-width (default) or auto (compact) |
| Text align | Center |
| Icon | Optional, before or after text |

---

## States

### Default
- Background: `#FF6B4A`
- Text: `#FFFFFF`
- Shadow: none

### Hover (desktop only)
- Background: `#E5593A` (10% darker)
- Shadow: `shadow-card`
- Transition: `duration-fast`

### Active / Pressed
- Background: `#CC4A2E` (20% darker)
- Transform: `scale(0.98)`

### Disabled
- Background: `#CCCCCC`
- Text: `#999999`
- Opacity: 0.6
- Cursor: not-allowed

### Loading
- Spinner: white, 16px, centered
- Text: replaced with spinner or loading text
- Pointer events: none

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width, often in sticky bottom bar |
| Tablet | Full-width or auto based on context |
| Desktop | Auto width, min 200px |

---

## Content Examples

| Context | JP | VI |
|---------|----|----|
| Homepage CTA | はじめる | Bắt đầu |
| Contact | お問い合わせ | Liên hệ |
| Coupon redeem | クーポンを使う | Dùng coupon |
| Sign up | LINEで登録 | Đăng ký bằng LINE |
| Save settings | 保存する | Lưu |

---

**Last Updated:** 2026-04-08

# Signup Modal

**Component ID:** `signup-modal`
**Category:** Interactive — Modal
**Complexity:** Complex
**Used on:** 01.2 Onboarding, 01.4 Search, 01.5 Listing Detail, 05.1 Sign Up (4 pages)

---

## Purpose

Lightweight authentication overlay triggered when an unauthenticated user attempts a protected action (save, contact, bookmark). No page navigation — appears on top of current context so the user doesn't lose their place.

---

## Properties

| Property | Value |
|----------|-------|
| Type | Centered modal overlay |
| Width | 400px (desktop), 90vw (mobile) |
| Max width | 400px |
| Background | `color-surface` (#FFFFFF) |
| Border radius | `radius-lg` (16px) |
| Shadow | `shadow-modal` |
| Backdrop | `color-primary` (#1B2A4A) at 50% opacity |
| Padding | `space-xl` (24px) |
| Z-index | Modal layer — above all content and nav |

---

## Layout (top to bottom)

| # | Element | Properties |
|---|---------|------------|
| 1 | Close button (×) | Top-right, 40px touch target, `color-text-secondary` |
| 2 | Logo mark | DaNangNavi compact icon, centered, 48px |
| 3 | Heading | `text-h3` (20px, SemiBold), centered |
| 4 | LINE Login button | Full-width, 52px height, green (#06C755), LINE logo + text |
| 5 | Social proof | `text-small` (12px), centered, "12,000人が利用中" with people icon |
| 6 | "Or" divider | Horizontal rule with centered "または" label |
| 7 | Email accordion | Collapsed by default, `expandable-accordion` pattern |
| 8 | Privacy note | `text-small` (12px), `color-text-secondary`, centered |

---

## States

### Default (LINE primary)
- LINE button prominent
- Email accordion collapsed
- Privacy note visible

### Email Expanded
- Accordion open showing: email field + password field + submit button
- Inline validation on blur
- Submit button = `primary-cta-button` (compact)

### Loading
- Button shows spinner
- All inputs disabled
- Backdrop click disabled

### Success
- Green checkmark animation (✓)
- "登録完了！" confirmation text
- Auto-redirect after 1.5s back to triggering action

### Error
- Inline error message below relevant field
- Red border on invalid fields
- Button returns to default state

---

## Interactions

| Trigger | Action |
|---------|--------|
| Tap save/contact/bookmark (unauthenticated) | Modal opens with fade + scale animation |
| Tap LINE button | Opens LINE OAuth flow in popup/redirect |
| Tap "メールで登録" | Expands email accordion |
| Tap × or backdrop | Closes modal, returns to page |
| Escape key (desktop) | Closes modal |
| Success | Auto-closes after 1.5s, completes original action |

---

## Content

| Element | JP | VI |
|---------|----|----|
| Heading | アカウントを作成 | Tạo tài khoản |
| LINE button | LINEで登録 | Đăng ký bằng LINE |
| Social proof | 12,000人が利用中 | 12.000 người đang sử dụng |
| Or divider | または | hoặc |
| Email link | メールで登録 | Đăng ký bằng email |
| Privacy note | LINEの投稿権限は求めません | Không yêu cầu quyền đăng bài LINE |

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width with 16px margin, slides up from bottom |
| Desktop | Centered 400px card with backdrop |

---

**Last Updated:** 2026-04-08

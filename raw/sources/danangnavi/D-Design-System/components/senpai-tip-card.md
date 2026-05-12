# Senpai Tip Card

**Component ID:** `senpai-tip-card`
**Category:** Display — Card
**Complexity:** Simple
**Used on:** 01.2 Newcomer Onboarding, 01.3 Area Guide (2 pages)

---

## Purpose

Humanizes guidance at key decision points by showing a real senpai's avatar, name, residence duration, and a direct quote. Builds trust through personal endorsement rather than generic text.

---

## Properties

| Property | Value |
|----------|-------|
| Background | `color-surface` (#FFFFFF) |
| Border | 1px solid `#E5E7EB` |
| Border-left | 3px solid `color-accent` (#2EC4B6) |
| Border radius | `radius-md` (12px) |
| Padding | `space-lg` (16px) |
| Shadow | `shadow-card` |

### Avatar

| Property | Value |
|----------|-------|
| Size | 40px |
| Border radius | `radius-full` (circle) |
| Position | Top-left of card content |

### Name & Duration

| Property | Value |
|----------|-------|
| Name font | `text-caption` (14px), SemiBold |
| Duration font | `text-small` (12px), Regular |
| Duration color | `color-text-secondary` (#6B7280) |
| Format | "田中さん · ダナン在住3年" |

### Quote

| Property | Value |
|----------|-------|
| Font | `text-body` (16px), Regular, Italic |
| Color | `color-text-primary` (#0D1B2A) |
| Prefix | Opening quote mark "「" |
| Suffix | Closing quote mark "」" |

### CTA Link (optional)

| Property | Value |
|----------|-------|
| Font | `text-caption` (14px), Medium |
| Color | `color-accent` (#2EC4B6) |
| Format | "詳しく読む →" |

---

## States

- **Default:** Static display
- **With CTA:** Includes link to full article/guide
- **Card hover (desktop):** `shadow-card-hover`, subtle lift

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width |
| Desktop | Max-width 480px |

---

**Last Updated:** 2026-04-08

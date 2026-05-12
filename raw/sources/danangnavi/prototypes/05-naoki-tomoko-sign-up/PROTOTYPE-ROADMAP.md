# Prototype Roadmap: Scenario 05 — Naoki & Tomoko Sign Up

## Overview

| Field | Value |
|-------|-------|
| **Scenario** | 05: Naoki & Tomoko Sign Up |
| **Goal** | Create account quickly via LINE login, set notification preferences, return to saved listing |
| **Pages** | 2 |
| **Device** | Desktop-First (1280px+) |
| **Design Fidelity** | Design System Components (design-tokens.md) |
| **Language** | English |
| **Created** | 2026-04-08 |

---

## Design Tokens

| Token | Value |
|-------|-------|
| Primary | Navy Blue `#1B2A4A` |
| Secondary | Coral `#FF6B4A` |
| Accent | Teal `#2EC4B6` |
| Background | Warm White `#FAFAF8` |
| Surface | White `#FFFFFF` |
| Text Primary | Dark Navy `#0D1B2A` |
| Text Secondary | Gray `#6B7280` |
| Success | Green `#27AE60` |
| Warning | Amber `#F2994A` |
| Error | Red `#EB5757` |
| LINE Green | `#06C755` |
| Font Headlines | Noto Sans JP Bold |
| Font Body | Noto Sans JP Regular |
| Font UI | Inter / Noto Sans Medium |
| Border Radius | 12-16px |
| Icons | Lucide Icons, line style, 1.5px stroke |

---

## Pages

| # | Page | Spec | Status |
|---|------|------|--------|
| 05.1 | Sign Up / Login | `C-UX-Scenarios/05-naoki-tomoko-sign-up/05.1-sign-up-login/05.1-sign-up-login.md` | Built |
| 05.2 | Notification Center | `C-UX-Scenarios/05-naoki-tomoko-sign-up/05.2-notification-center/05.2-notification-center.md` | Built |

---

## Shared Components

| Component | Used In | Status |
|-----------|---------|--------|
| PrimaryCTAButton | 05.1, 05.2 | To Do |
| ToastNotification | 05.2 | To Do |
| SegmentedControl | 05.2 | To Do |

---

## Demo Data

- `data/demo-data.json` — Complete demo dataset with:
  - Current user: Naoki Tanaka (newcomer, just browsing, not yet registered)
  - Saved listing trigger: apartment from Scenario 01 data
  - Notification categories: 4 categories with defaults (3 ON, 1 OFF)
  - Notification channels: LINE (default ON), Push (OFF), Email (OFF)
  - Social proof: "12,000 users active"

---

## Navigation Flow

```
[Listing Detail page] → tap "Save" → 05.1 Sign Up Modal → LINE login → 05.2 Notification Center → "Save Settings" → [back to saved listing]
```

---

## Notes

- Desktop-first: optimized for 1280px+, modal centered on screen
- 05.1 is a modal overlay (not a full page) — needs a background listing page behind it
- 05.2 can be a standalone page or modal continuation
- English content for prototype (spec uses Japanese)
- LINE login is simulated (click → success animation → redirect)

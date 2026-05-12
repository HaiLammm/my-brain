# Logical View Map — Scenario 05: Naoki & Tomoko Sign Up

**Created:** 2026-04-08
**Status:** Confirmed

---

## Views

| View | Page | Spec Step | Route | States |
|------|------|-----------|-------|--------|
| V1 | Sign Up / Login | 05.1 | Modal overlay (no URL change) | Default modal, Email accordion expanded, LINE auth loading, Success confirmation |
| V2 | Notification Center | 05.2 | `/settings/notifications` | Default (3 ON/1 OFF), Toggled states, Frequency selected, Success toast + redirect |

---

## Build Order

| Order | View | Rationale |
|-------|------|-----------|
| 1 | V1 — Sign Up / Login | Entry point; modal needs background listing page; establishes auth flow |
| 2 | V2 — Notification Center | Redirect target from V1; standalone settings page |

---

## Shared Components Across Views

| Component | V1 | V2 |
|-----------|----|----|
| PrimaryCTAButton | ✓ | ✓ |
| ToastNotification | — | ✓ |
| SegmentedControl | — | ✓ |

---

## Cross-View Links

| From | To | Trigger |
|------|-----|---------|
| V1 (Sign Up) | V2 (Notifications) | Auto-redirect after successful account creation (1.5s delay) |
| V2 (Notifications) | Listing Detail | "Save Settings" or "Set up later" → returns to saved listing |

---

## Notes

- V1 is a modal overlay — requires a simulated listing detail background page
- V1 LINE login is simulated (click → loading → success animation)
- V2 auto-redirect back to listing after save
- Desktop-first: modal 400px centered, notification page 560px max-width centered

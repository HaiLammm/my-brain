# Logical View Map — Scenario 03: Tomoko's Da Nang Discovery

## View Mapping

| View ID | View Name | Step(s) | States | Spec File |
|---------|-----------|---------|--------|-----------|
| V1 | Senpai Article/Guide | 03.1 | Default article view | `03.1-senpai-article-guide/03.1-senpai-article-guide.md` |
| V2 | Translation Tools | 03.2 | Voice, Text, Phrasebook, Camera, Show-to-staff | `03.2-translation-tools/03.2-translation-tools.md` |
| V3 | Deals & Coupons | 03.3 | Browse, Coupon detail modal, My Coupons wallet, Savings summary | `03.3-deals-coupons/03.3-deals-coupons.md` |

## Build Order

| Order | View | Rationale |
|-------|------|-----------|
| 1 | V1 — Senpai Article/Guide | Entry point for the scenario; links to V2 (translation FAB) and V3 (coupon tags) |
| 2 | V3 — Deals & Coupons | V1 coupon tags link here; commerce flow with redemption |
| 3 | V2 — Translation Tools | Standalone tool page; most complex (voice, camera, phrasebook modes) |

## Cross-View Links

| From | To | Trigger |
|------|-----|---------|
| V1 (Article) | V2 (Translation) | Translation FAB button; "Use translation tools" CTA in tips section |
| V1 (Article) | V3 (Deals) | Coupon tag on restaurant cards |
| V2 (Translation) | — | Standalone (accessed via FAB or bottom nav) |
| V3 (Deals) | — | Standalone (accessed via bottom nav or coupon links) |

## Shared Components Across Views

| Component | V1 | V2 | V3 |
|-----------|----|----|-----|
| BottomTabNav | ✓ | ✓ | ✓ |
| SectionHeader | ✓ | — | ✓ |
| FilterChips | ✓ | — | ✓ |
| SenpaiBadge | ✓ | — | — |
| DualCurrencyPrice | ✓ | — | ✓ |
| FairPriceIndicator | ✓ | — | — |
| SenpaiTipCard | ✓ | — | — |
| PrimaryCTAButton | ✓ | ✓ | ✓ |
| ToastNotification | — | ✓ | ✓ |

---

**Created:** 2026-04-08
**Confirmed by:** User

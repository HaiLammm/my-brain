# Story: S3 — Japanese Preview Card + Tips

**View:** V2 — Coupon Manager
**Section:** 3 of 4
**Spec:** 04.2-coupon-manager.md, Section 3 + Section 5

---

## Purpose

Right column: live-updating Japanese coupon preview card + tips sidebar. Preview updates in real-time as user fills the form (S2). Tips provide guidance for effective coupons.

---

## Objects

| # | Object ID | Type | Behavior |
|---|-----------|------|----------|
| 1 | `coupon-jp-label` | p | "Khách Nhật sẽ thấy thế này" |
| 2 | `coupon-jp-card` | div | Coral left border card |
| 3 | `coupon-jp-restaurant` | p | "フォーフォン" |
| 4 | `coupon-jp-discount` | span | "10% OFF" large, live-updating |
| 5 | `coupon-jp-title` | p | JP translated title, live-updating |
| 6 | `coupon-jp-validity` | p | JP date range, live-updating |
| 7 | `coupon-jp-conditions` | p | JP conditions, live-updating |
| 8 | `coupon-jp-usage` | p | "お一人様1回限り" |
| 9 | `coupon-jp-refresh` | button | "Bản dịch tự động" refresh |
| 10 | `coupon-tips-card` | div | Teal bg card |
| 11-14 | tips content | p | 3 tips + social proof |

---

## JavaScript

Listen to `coupon-form-change` event, update JP card fields. Simple translation mapping for demo (Vietnamese title → hardcoded JP equivalent).

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] JP card with coral left border visible
- [ ] Discount badge shows "10% OFF"
- [ ] JP text in font-jp
- [ ] Tips card with teal background
- [ ] 3 tips + social proof stat

### User-Evaluable
- [ ] JP preview feels tangible for Lan
- [ ] Live update is noticeable
- [ ] Tips are actionable

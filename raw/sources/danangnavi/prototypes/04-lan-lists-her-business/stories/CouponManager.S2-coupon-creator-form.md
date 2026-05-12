# Story: S2 — Coupon Creator Form

**View:** V2 — Coupon Manager
**Section:** 2 of 4
**Spec:** 04.2-coupon-manager.md, Section 2: Coupon Creator Form + Section 6: Bottom Actions

---

## Purpose

Full coupon creation form with discount type toggle, title, dates with presets, usage limits, and conditions. Form data drives live JP preview (S3). Submit creates coupon and populates active list (S4).

---

## Objects

| # | Object ID | Type | Behavior |
|---|-----------|------|----------|
| 1 | `coupon-form` | form | Container |
| 2 | `coupon-form-label` | h3 | "Chi tiết coupon" |
| 3 | `coupon-discount-toggle` | div | 2 toggle buttons |
| 4 | `coupon-discount-pct-btn` | button | "Giảm %" active by default |
| 5 | `coupon-discount-fix-btn` | button | "Giảm tiền" |
| 6 | `coupon-input-pct` | input[number] | %, placeholder 10, visible by default |
| 7 | `coupon-input-fixed` | input[number] | VNĐ, placeholder 50000, hidden |
| 8 | `coupon-input-title` | input[text] | Max 60 chars, placeholder |
| 9 | `coupon-title-helper` | p | Auto-translate hint |
| 10 | `coupon-input-start` | input[date] | Default today |
| 11 | `coupon-input-end` | input[date] | Default +30 days |
| 12 | `coupon-preset-1w` | button | "1 tuần" chip |
| 13 | `coupon-preset-1m` | button | "1 tháng" chip, active by default |
| 14 | `coupon-preset-3m` | button | "3 tháng" chip |
| 15 | `coupon-limit-toggle` | div | 2 radio-style options |
| 16 | `coupon-limit-unlimited` | button | "Không giới hạn" |
| 17 | `coupon-limit-limited` | button | "Giới hạn số lần" |
| 18 | `coupon-input-limit` | input[number] | Placeholder 100, hidden by default |
| 19 | `coupon-limit-helper` | p | "Mỗi khách chỉ dùng được 1 lần" |
| 20 | `coupon-textarea-conditions` | textarea | Optional, max 120 |
| 21 | `coupon-btn-create` | button | "Tạo Coupon" coral CTA |

---

## JavaScript Requirements

| Function | Purpose |
|----------|---------|
| `toggleDiscountType(type)` | Switch between pct/fixed, show/hide inputs |
| `selectDatePreset(preset)` | Set end date relative to start: 1w/1m/3m |
| `toggleUsageLimit(type)` | Show/hide limited uses input |
| `handleCreateCoupon()` | Validate, create coupon data, show toast, update S4 list |
| `getCouponFormData()` | Collect all form values for preview + submission |

### Events
- All form inputs dispatch `input` event → triggers JP preview update in S3

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] Discount toggle with 2 buttons, % active by default
- [ ] Percentage input visible, fixed hidden
- [ ] Title input with 60 char limit
- [ ] Date pickers with defaults (today, +30 days)
- [ ] 3 date preset chips
- [ ] Usage limit toggle with 2 options
- [ ] Conditions textarea present
- [ ] "Tạo Coupon" coral button

### User-Evaluable
- [ ] Form is clean and not overwhelming
- [ ] Toggle interactions feel snappy
- [ ] Preset chips save time
- [ ] Vietnamese labels natural

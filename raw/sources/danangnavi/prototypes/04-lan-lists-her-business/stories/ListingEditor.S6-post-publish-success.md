# Story: S6 — Post-Publish Success

**View:** V1 — Listing Editor
**Section:** 6 of 6
**Spec:** 04.1-listing-editor.md, Section 5: Post-Publish Success State

---

## Purpose

Full-screen success overlay after publishing. Celebration moment with animated checkmark, then bridge to Coupon Manager (04.2) or Dashboard (04.3).

---

## Objects

| # | Object ID | Type | Behavior |
|---|-----------|------|----------|
| 1 | `success-overlay` | div | Full-screen white overlay, z-50 (already exists, populate content) |
| 2 | `success-checkmark` | div | Green circle with ✓, 64px, bounce animation |
| 3 | `success-headline` | h2 | "Tin đăng đã được đăng thành công! 🎉" |
| 4 | `success-subtext` | p | "Khách hàng Nhật giờ có thể tìm thấy bạn trên DaNangNavi" |
| 5 | `success-listing-link` | a | "Xem tin đăng →" |
| 6 | `success-coupon-card` | div | Teal left border card with prompt |
| 7 | `success-coupon-btn` | button | "Tạo Coupon ngay →" coral CTA → 04.2 |
| 8 | `success-skip-link` | a | "Bỏ qua, đi đến Bảng điều khiển →" → 04.3 |

---

## Styles

| Element | Styles |
|---------|--------|
| Overlay | fixed inset-0, bg white, z-50, flex center, flex-col |
| Checkmark circle | w-16 h-16, bg green-500, rounded-full, flex center, bounce animation |
| ✓ icon | text white, text-3xl font-bold |
| Headline | text-2xl font-bold text-dark-navy, mt-6, text-center |
| Subtext | text-base text-gray-500, mt-2, text-center |
| Listing link | text-sm text-teal, mt-3, hover underline |
| Coupon card | border-l-4 border-teal, bg teal/5, rounded-lg, p-5, mt-8, max-w-md |
| Coupon card icon | 💡 text-xl |
| Coupon card text | text-base text-dark-navy font-medium |
| Coupon btn | coral CTA, h-12, full-width, mt-3 |
| Skip link | text-sm text-gray-500, mt-3, hover underline, text-center |

### Bounce Animation
```css
@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
```

---

## JavaScript

No new functions needed. `handlePublish()` in S5 already shows the overlay. Navigation links use standard href to 04.2 and 04.3 HTML files.

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] Success overlay covers full screen when visible
- [ ] Green checkmark with bounce animation
- [ ] Headline text correct
- [ ] Coupon CTA card with teal left border
- [ ] "Tạo Coupon ngay" button links to 04.2
- [ ] Skip link links to 04.3

### User-Evaluable
- [ ] Celebration feels rewarding
- [ ] Coupon prompt feels natural, not pushy
- [ ] Skip option is visible but secondary

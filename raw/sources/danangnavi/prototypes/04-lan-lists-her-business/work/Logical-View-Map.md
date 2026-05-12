# Logical View Map — Scenario 04: Lan Lists Her Business

## Views

| View | Name | Step | Route | Complexity |
|------|------|------|-------|------------|
| V1 | Listing Editor | 04.1 | /business/listings/new | High (5 sections, 3 sub-steps) |
| V2 | Coupon Manager | 04.2 | /business/coupons | Medium (form + preview) |
| V3 | Business Dashboard | 04.3 | /business/dashboard | Low (empty state metrics) |

## View States

### V1 — Listing Editor
- State A: Step 1 — Basic Information Form
- State B: Step 2 — Photos & Menu Upload (OCR)
- State C: Step 3 — Preview & Publish (split view)
- State D: Success Overlay (post-publish)

### V2 — Coupon Manager
- State A: Empty (no coupons yet, success banner from listing)
- State B: Form filling with live Japanese preview
- State C: Coupon created (active coupons list populated)

### V3 — Business Dashboard
- State A: First visit (welcome message, empty metrics, activity feed)

## Build Order

1. V1 — Listing Editor
2. V2 — Coupon Manager
3. V3 — Business Dashboard

## Navigation Flow

```
V1 (Listing Editor) → "Tạo Coupon ngay" → V2 (Coupon Manager) → "Đi tới Bảng điều khiển" → V3 (Dashboard)
```

## Configuration

- Device: Desktop-Only (1440px)
- Fidelity: Design System
- Language: Vietnamese only

# Story: S1 — Page Shell & Header (Coupon Manager)

**View:** V2 — Coupon Manager
**Section:** 1 of 4
**Spec:** 04.2-coupon-manager.md, Section 1: Page Header

---

## Purpose

Create new HTML file for Coupon Manager with 2-column layout, breadcrumb, headline, and dismissible success banner from listing publish.

---

## Objects

| # | Object ID | Type | Behavior |
|---|-----------|------|----------|
| 1 | `coupon-page` | body | bg #FAFAF8, font Inter/Noto Sans |
| 2 | `coupon-header` | header | Sticky top, white bg, shadow |
| 3 | `coupon-breadcrumb` | nav | "Doanh nghiệp > Coupon" |
| 4 | `coupon-headline` | h2 | "Tạo Coupon" 24px Bold |
| 5 | `coupon-subtitle` | p | Subtitle text |
| 6 | `coupon-success-banner` | div | Green bg, dismissible |
| 7 | `coupon-layout` | div | 2-col grid 55%/45% |
| 8 | `coupon-left-col` | div | Form column (placeholders) |
| 9 | `coupon-right-col` | div | Sticky preview column (placeholders) |

---

## HTML Structure

```
<body>
  <header> (sticky)
    <div> (max-width 1200px)
      <nav> breadcrumb </nav>
      <h2> Tạo Coupon </h2>
      <p> subtitle </p>
    </div>
  </header>
  <main> (max-width 1200px)
    <div> success banner (dismissible) </div>
    <div> (2-col grid)
      <div> left col — form placeholders </div>
      <div> right col — preview placeholders </div>
    </div>
  </main>
</body>
```

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] Page renders at 1440px
- [ ] Header sticky with breadcrumb
- [ ] 2-column layout visible
- [ ] Success banner visible with dismiss button
- [ ] Headline "Tạo Coupon" present

### User-Evaluable
- [ ] Layout feels balanced
- [ ] Success banner provides good context

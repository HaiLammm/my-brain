# Story: S4 — Step 2 Menu OCR

**View:** V1 — Listing Editor
**Section:** 4 of 6
**Spec:** 04.1-listing-editor.md, Section 3: Step 2 — Photos & Menu Upload (Menu OCR sub-section)

---

## Purpose

Create menu OCR section: user "photographs" their menu, system simulates OCR processing, then shows editable Vietnamese→Japanese translation table. This is the magic moment for business owners. Includes "Tiếp theo" button to advance to Step 3.

---

## Objects

| # | Object ID | Type | Behavior |
|---|-----------|------|----------|
| 1 | `listing-menu-section` | div | Container |
| 2 | `listing-menu-label` | h3 | "Menu / Thực đơn" |
| 3 | `listing-menu-ocr-btn` | button | "📷 Chụp ảnh thực đơn", triggers OCR simulation |
| 4 | `listing-menu-processing` | div | Spinner + text, hidden by default |
| 5 | `listing-menu-table` | table | Editable result table, hidden until OCR done |
| 6 | `listing-menu-row-{n}` | tr | Each menu item row |
| 7 | `listing-menu-confidence-{n}` | span | ✅ or ⚠️ per row |
| 8 | `listing-menu-add-row` | button | "＋ Thêm món" |
| 9 | `listing-menu-edit-note` | p | "Nhấn vào ô để chỉnh sửa" hint |
| 10 | `listing-btn-step2-next` | button | "Tiếp theo →" coral CTA, validates & advances |

---

## HTML Structure

Replace S4 placeholder in step-2-content with:

```
<div id="listing-menu-section">
  <h3> Menu / Thực đơn </h3>
  <button id="listing-menu-ocr-btn"> 📷 Chụp ảnh thực đơn </button>
  <div id="listing-menu-processing" class="hidden"> spinner + "Đang nhận dạng menu..." </div>
  <div id="listing-menu-results" class="hidden">
    <p> edit hint </p>
    <table>
      <thead> Món ăn (VI) | Dịch sang tiếng Nhật | Giá | </thead>
      <tbody id="listing-menu-tbody"> <!-- rows from JS --> </tbody>
    </table>
    <button> ＋ Thêm món </button>
  </div>
  <button id="listing-btn-step2-next"> Tiếp theo → </button>
</div>
```

---

## Styles

| Element | Styles |
|---------|--------|
| Section | bg white, rounded-xl, shadow-card, p-8, max-w-800px |
| OCR button | border 2px coral, text coral, rounded-lg, h-12, px-6, hover bg coral/10 |
| Processing | flex center, gap-3, py-8 |
| Spinner | w-6 h-6, animate-spin, border-2 coral |
| Table | w-full, border-collapse |
| Table header | bg #F9FAFB, text-sm font-semibold, text-left, py-2 px-3 |
| Table cells | py-2 px-3, border-b border-gray-100, text-sm |
| Editable cell | cursor-text, hover bg-gray-50, focus outline teal |
| Confidence ✅ | text green-600 |
| Confidence ⚠️ | text amber-500 |
| Add row | text teal, text-sm, font-medium, hover underline |
| CTA button | same as S2: coral, full-width, h-12, mt-6 |

---

## JavaScript Requirements

| Function | Purpose |
|----------|---------|
| `triggerMenuOCR()` | Shows processing state, waits 3s, loads demo data into table |
| `renderMenuTable(items)` | Renders editable table rows from menu data array |
| `addMenuRow()` | Appends empty editable row |
| `handleStep2Next()` | Validates photos ≥ 3 and menu exists, calls completeStep(2) |

### OCR Simulation Flow
1. Click OCR button → hide button, show processing spinner
2. After 3 seconds → hide spinner, show results table with demo data
3. Table cells are contenteditable for corrections

---

## Demo Data

From `data/demo-data.json` menu array (8 items with name_vi, name_ja, price_vnd, confidence)

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] Menu section visible in step-2-content below photos
- [ ] OCR button visible with coral outline style
- [ ] Clicking OCR button shows spinner
- [ ] After 3s, table appears with 8 rows from demo data
- [ ] Table cells are contenteditable
- [ ] Confidence indicators show ✅ or ⚠️
- [ ] "＋ Thêm món" button visible below table
- [ ] "Tiếp theo →" CTA visible

### User-Evaluable
- [ ] OCR simulation feels like a magic moment
- [ ] Table is easy to scan and edit
- [ ] Confidence indicators build trust
- [ ] Vietnamese→Japanese translation feels tangible

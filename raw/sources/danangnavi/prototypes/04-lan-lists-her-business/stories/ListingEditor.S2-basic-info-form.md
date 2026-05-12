# Story: S2 — Step 1 Basic Info Form

**View:** V1 — Listing Editor
**Section:** 2 of 6
**Spec:** 04.1-listing-editor.md, Section 2: Step 1 — Basic Information Form

---

## Purpose

Create the 7-field Vietnamese form for Step 1 of the listing editor. All labels in Vietnamese, 48px touch-friendly inputs, validation with Vietnamese error messages.

---

## Objects

| # | Object ID | Type | Label | Properties |
|---|-----------|------|-------|------------|
| 1 | `listing-input-name` | text input | Tên doanh nghiệp * | Required, placeholder "VD: Quán Phở Hương" |
| 2 | `listing-select-category` | select dropdown | Danh mục * | Required, 6 options |
| 3 | `listing-input-address` | text input | Địa chỉ * | Required, placeholder "Nhập địa chỉ...", map pin icon |
| 4 | `listing-input-phone` | tel input | Số điện thoại * | Required, pre-filled "0905 123 456" |
| 5 | `listing-input-hours` | custom | Giờ mở cửa * | Required, preset chips + custom fields |
| 6 | `listing-textarea-desc` | textarea | Mô tả ngắn | Optional, max 200, char counter |
| 7 | `listing-input-zalo` | text input | Zalo liên hệ | Optional, placeholder "Số Zalo hoặc link" |
| 8 | `listing-hours-preset-1` | chip button | 8:00 - 22:00 | Pre-fill hours |
| 9 | `listing-hours-preset-2` | chip button | 10:00 - 21:00 | Pre-fill hours |
| 10 | `listing-hours-preset-3` | chip button | Tùy chỉnh | Show custom time inputs |
| 11 | `listing-btn-next-step` | button | Tiếp theo → | Coral CTA, validates, calls completeStep(1) |

---

## HTML Structure

```
<div id="step-1-content">
  <div> (white card, rounded-xl, shadow-card, padding 32px)
    <h3> Thông tin cơ bản </h3>
    <form id="listing-form-step1">
      <div> (field: Tên doanh nghiệp)
        <label> Tên doanh nghiệp <span class="text-red-500">*</span> </label>
        <input id="listing-input-name" />
        <p id="error-name" class="hidden"> error </p>
      </div>
      <div> (field: Danh mục)
        <label> Danh mục <span>*</span> </label>
        <select id="listing-select-category" />
      </div>
      <div> (field: Địa chỉ)
        <label> Địa chỉ <span>*</span> </label>
        <div> (input wrapper with map pin icon)
          <input id="listing-input-address" />
          <svg> map pin </svg>
        </div>
      </div>
      <div> (field: Số điện thoại)
        <label> Số điện thoại <span>*</span> </label>
        <input id="listing-input-phone" type="tel" />
      </div>
      <div> (field: Giờ mở cửa)
        <label> Giờ mở cửa <span>*</span> </label>
        <div> (preset chips row)
          <button> 8:00 - 22:00 </button>
          <button> 10:00 - 21:00 </button>
          <button> Tùy chỉnh </button>
        </div>
        <div> (custom time inputs, hidden by default)
          <input type="time" /> — <input type="time" />
        </div>
      </div>
      <div> (field: Mô tả ngắn)
        <label> Mô tả ngắn </label>
        <textarea id="listing-textarea-desc" maxlength="200" />
        <p> char counter </p>
      </div>
      <div> (field: Zalo liên hệ)
        <label> Zalo liên hệ </label>
        <input id="listing-input-zalo" />
      </div>
      <button id="listing-btn-next-step"> Tiếp theo → </button>
    </form>
  </div>
</div>
```

---

## Styles

| Element | Styles |
|---------|--------|
| Labels | 14px, SemiBold (#0D1B2A) |
| Inputs | height 48px, bg white, border 1px #E5E7EB, radius 8px, padding 0 16px |
| Input focus | border 2px #2EC4B6 |
| Input error | border 1px #EB5757 |
| Error text | 12px #EB5757, below input |
| Field spacing | 24px gap between fields |
| Required asterisk | Red (#EB5757) after label |
| Preset chips | height 36px, border 1px #E5E7EB, radius 8px, hover bg #F5F5F3 |
| Preset chip active | bg #1B2A4A, text white |
| CTA button | bg #FF6B4A, text white, height 48px, radius 8px, full-width, font 16px SemiBold |
| CTA hover | bg #E55A3A |
| Char counter | 12px #6B7280, text-right |

---

## JavaScript Requirements

| Function | Purpose |
|----------|---------|
| `selectHoursPreset(n)` | Highlights preset chip, fills time values, hides/shows custom inputs |
| `updateCharCounter()` | Updates "X/200" counter on textarea input |
| `validateStep1()` | Validates all required fields, shows Vietnamese errors |
| `handleNextStep()` | Validates → stores form data → calls completeStep(1) |

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Tên doanh nghiệp | Not empty | "Vui lòng nhập tên doanh nghiệp" |
| Danh mục | Selected | "Vui lòng chọn danh mục" |
| Địa chỉ | Not empty | "Vui lòng nhập địa chỉ" |
| Số điện thoại | Not empty, digits | "Vui lòng nhập số điện thoại hợp lệ" |
| Giờ mở cửa | Preset selected or custom filled | "Vui lòng chọn giờ mở cửa" |

---

## Demo Data (pre-fill)

From `data/demo-data.json`:
- Phone: "0905 123 456" (pre-filled)
- Other fields empty (user fills them)

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] 7 form fields visible inside step-1-content
- [ ] Required fields marked with red asterisk
- [ ] Category dropdown has 6 options
- [ ] 3 hours preset chips visible
- [ ] CTA button is coral (#FF6B4A)
- [ ] Input height is 48px
- [ ] Phone field pre-filled with demo data

### User-Evaluable
- [ ] Form feels clean and not overwhelming
- [ ] Vietnamese labels read naturally
- [ ] Field order feels logical for a business owner
- [ ] Preset chips feel intuitive for selecting hours

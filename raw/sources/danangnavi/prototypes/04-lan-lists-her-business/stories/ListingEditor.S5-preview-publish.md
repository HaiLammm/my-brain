# Story: S5 — Step 3 Preview & Publish

**View:** V1 — Listing Editor
**Section:** 5 of 6
**Spec:** 04.1-listing-editor.md, Section 4: Step 3 — Preview & Publish

---

## Purpose

Create 2-column split view: left side shows Vietnamese summary of entered data, right side shows a phone mockup of how Japanese customers will see the listing. Publish button triggers success overlay (S6).

---

## Objects

| # | Object ID | Type | Behavior |
|---|-----------|------|----------|
| 1 | `listing-preview-layout` | div | 2-col grid: 55% left, 45% right |
| 2 | `listing-preview-summary` | div | Left column: recap of entered info |
| 3 | `listing-preview-summary-name` | p | Business name from formData |
| 4 | `listing-preview-summary-category` | p | Category |
| 5 | `listing-preview-summary-address` | p | Address |
| 6 | `listing-preview-summary-hours` | p | Opening hours |
| 7 | `listing-preview-summary-photos` | div | Thumbnail strip of uploaded photos |
| 8 | `listing-preview-summary-menu` | div | Menu items count |
| 9 | `listing-preview-label` | p | "Khách hàng Nhật sẽ thấy:" |
| 10 | `listing-preview-phone` | div | Phone mockup frame |
| 11 | `listing-preview-lang` | span | "🇯🇵 日本語プレビュー" |
| 12 | `listing-preview-cover` | img | Cover photo (first uploaded) |
| 13 | `listing-preview-jp-name` | h3 | Business name in Japanese (katakana) |
| 14 | `listing-preview-badge` | span | "新規" (New) badge, teal |
| 15 | `listing-preview-jp-menu` | div | Scrollable JP menu with ¥ prices |
| 16 | `listing-preview-refresh` | button | 🔄 refresh translation |
| 17 | `listing-btn-publish` | button | "Đăng tin ngay" coral CTA |
| 18 | `listing-btn-draft` | a | "Lưu nháp" gray link |
| 19 | `listing-terms-note` | p | Terms text, 12px |

---

## Styles

| Element | Styles |
|---------|--------|
| Split layout | grid grid-cols-[55%_45%] gap-6, max-w-[1000px] mx-auto |
| Left column | bg white, rounded-xl, shadow-card, p-8 |
| Summary labels | text-sm font-semibold text-gray-500 mb-1 |
| Summary values | text-base text-dark-navy mb-4 |
| Right column | sticky top-32 |
| Preview label | text-sm font-medium text-teal mb-2 |
| Phone mockup | border-2 border-gray-300 rounded-[2rem] p-3 bg-white shadow-card, max-w-[320px] mx-auto |
| Phone inner | rounded-[1.5rem] overflow-hidden bg-warm-white |
| Cover photo | w-full h-[160px] object-cover |
| JP name | font-jp text-lg font-bold text-dark-navy px-4 pt-3 |
| New badge | bg-teal text-white text-xs px-2 py-0.5 rounded font-medium |
| JP menu | px-4, text-sm font-jp, max-h-[200px] overflow-y-auto |
| JP menu row | flex justify-between py-1.5 border-b border-gray-100 |
| Refresh btn | text-sm text-teal hover:underline |
| Publish btn | coral CTA, full-width, h-12, mt-6 |
| Draft link | text-sm text-gray-500 text-center block mt-2 hover:underline |
| Terms | text-xs text-gray-400 text-center mt-2 |

---

## JavaScript Requirements

| Function | Purpose |
|----------|---------|
| `renderPreview()` | Populates both summary and JP preview from formData, photos, menuItems |
| `refreshTranslation()` | Simulates re-translation with brief spinner |
| `handlePublish()` | Shows loading on button → 2s delay → shows success overlay (S6) |
| `handleSaveDraft()` | Shows toast "Đã lưu nháp" |

### Auto-render
When step 3 becomes active, call `renderPreview()` to populate from current state.

---

## Demo Data Mapping

| Summary field | Source |
|---------------|--------|
| Name | formData.name or "Quán Phở Hương" fallback |
| Category | formData.category label |
| Address | formData.address or demo address |
| Hours | formData.hoursOpen - formData.hoursClose |
| Photos | photos array thumbnails |
| Menu count | menuItems.length + " món" |
| JP name | "フォーフォン" (from demo-data.json) |
| JP menu | menuItems with name_ja + price as ¥ |

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] 2-column layout visible in step-3-content
- [ ] Left column shows summary fields
- [ ] Phone mockup frame visible on right
- [ ] Japanese text visible in preview (font-jp)
- [ ] "新規" badge visible
- [ ] JP menu list with ¥ prices
- [ ] "Đăng tin ngay" coral button visible
- [ ] "Lưu nháp" link visible

### User-Evaluable
- [ ] Split view feels balanced
- [ ] Phone mockup makes preview tangible
- [ ] Japanese preview gives confidence to Vietnamese business owner
- [ ] Publish button feels like a satisfying final action

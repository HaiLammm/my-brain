# Story: S3 — Step 2 Photos Upload

**View:** V1 — Listing Editor
**Section:** 3 of 6
**Spec:** 04.1-listing-editor.md, Section 3: Step 2 — Photos & Menu Upload (photos sub-section)

---

## Purpose

Create photo upload grid for business photos. 3-column grid with upload slots, cover label on first photo, remove button, max 10 photos. This goes inside step-2-content alongside S4 (Menu OCR).

---

## Objects

| # | Object ID | Type | Label/Behavior |
|---|-----------|------|----------------|
| 1 | `listing-photos-section` | div | Container for photos sub-section |
| 2 | `listing-photos-label` | h3 | "Ảnh doanh nghiệp" |
| 3 | `listing-photos-instruction` | p | "Thêm ít nhất 3 ảnh. Ảnh đầu tiên sẽ là ảnh bìa." |
| 4 | `listing-photos-grid` | div | 3-column grid container |
| 5 | `listing-photo-upload-btn` | button | Dashed border "＋" upload trigger |
| 6 | `listing-photo-input` | input[file] | Hidden file input, accept image/* |
| 7 | `listing-photo-{n}` | div | Photo thumbnail with remove btn |
| 8 | `listing-photo-cover-badge` | span | "Ảnh bìa" on first photo |
| 9 | `listing-photo-remove-{n}` | button | "×" remove per photo |
| 10 | `listing-photos-count` | span | "X/10 ảnh" counter |

---

## HTML Structure

```
<div id="step-2-content">
  <!-- S3: Photos -->
  <div id="listing-photos-section" class="bg-white rounded-xl shadow-card p-8 max-w-[800px] mx-auto mb-6">
    <h3> Ảnh doanh nghiệp </h3>
    <p> Thêm ít nhất 3 ảnh... </p>
    <div id="listing-photos-grid"> (3-col grid)
      <!-- Photo thumbnails rendered by JS -->
      <button> ＋ upload slot </button>
    </div>
    <p> X/10 ảnh </p>
  </div>

  <!-- S4: Menu OCR placeholder -->
  <div> placeholder for S4 </div>
</div>
```

---

## Styles

| Element | Styles |
|---------|--------|
| Section container | bg white, rounded-xl, shadow-card, p-8, max-w-800px, mx-auto |
| Section label | 20px SemiBold, color #0D1B2A |
| Instruction | 14px, color #6B7280, mb-4 |
| Photo grid | grid, grid-cols-3, gap 12px (desktop can show more cols) |
| Upload slot | w-[100px] h-[100px], dashed border 2px #E5E7EB, rounded-lg, flex center, hover border-teal |
| "＋" icon | text 24px, color #6B7280 |
| Photo thumbnail | w-[100px] h-[100px], rounded-lg, object-cover, relative |
| Cover badge | absolute top-1 left-1, bg navy, text white, text-xs, px-2 py-0.5, rounded |
| Remove btn | absolute top-1 right-1, w-5 h-5, bg red-500, text white, rounded-full, text-xs |
| Photo count | 14px, color #6B7280, mt-2 |

---

## JavaScript Requirements

| Function | Purpose |
|----------|---------|
| `triggerPhotoUpload()` | Clicks hidden file input |
| `handlePhotoSelected(event)` | Reads file, creates preview, adds to photos array |
| `removePhoto(index)` | Removes photo from array, re-renders grid |
| `renderPhotosGrid()` | Re-renders entire grid from photos array |

### State

```js
let photos = []; // array of { url: dataURL, name: string }
const MAX_PHOTOS = 10;
const MIN_PHOTOS = 3;
```

### Demo behavior

- Upload uses FileReader to create data URLs for preview
- Simulated photos: clicking upload opens file picker (real functionality)
- Pre-load 5 demo photos using colored placeholder squares for quick testing

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] Photos section visible inside step-2-content
- [ ] "＋" upload button visible with dashed border
- [ ] Grid uses 3-column layout
- [ ] Photo count shows "0/10 ảnh" initially
- [ ] Section has heading "Ảnh doanh nghiệp"

### User-Evaluable
- [ ] Upload flow feels intuitive
- [ ] Cover badge is clearly visible on first photo
- [ ] Remove button is easy to spot but not intrusive
- [ ] Grid layout feels clean

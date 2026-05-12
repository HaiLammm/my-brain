# Story: S1 — Page Shell & Progress Header

**View:** V1 — Listing Editor
**Section:** 1 of 6
**Spec:** 04.1-listing-editor.md, Section 1: Progress Header

---

## Purpose

Create the page layout shell and sticky progress header for the 3-step listing editor. This is the foundation HTML file that all subsequent sections build into.

---

## Objects

| # | Object | HTML | Classes | Behavior |
|---|--------|------|---------|----------|
| 1 | Page background | `<body>` | bg `#FAFAF8`, font-family Inter/Noto Sans | Static |
| 2 | Sticky header | `<header>` | sticky top-0, bg white, shadow `0 -2px 8px rgba(0,0,0,0.06)`, z-50, padding 16px 24px | Stays visible on scroll |
| 3 | Back link | `<a>` | text 14px, color `#6B7280`, hover underline | "← Bảng điều khiển" |
| 4 | Page title | `<h2>` | 24px Bold, color `#0D1B2A` | "Tạo tin đăng mới" |
| 5 | Step 1 circle | `<div>` | 32px circle, bg `#1B2A4A` (active) / `#27AE60` (done) / `#E5E7EB` (upcoming) | Number inside, white text |
| 6 | Step 1 label | `<span>` | 14px, color matches circle state | "Thông tin" |
| 7 | Connector 1→2 | `<div>` | height 2px, flex-grow, bg matches state | Green if step 1 done, gray otherwise |
| 8 | Step 2 circle | `<div>` | Same as Step 1 circle | "2" |
| 9 | Step 2 label | `<span>` | 14px | "Ảnh & Menu" |
| 10 | Connector 2→3 | `<div>` | Same as connector 1→2 | State-dependent color |
| 11 | Step 3 circle | `<div>` | Same | "3" |
| 12 | Step 3 label | `<span>` | 14px | "Xem trước" |
| 13 | Time estimate | `<span>` | 12px, color `#6B7280` | "⏱️ Khoảng 10-15 phút" |
| 14 | Content area | `<main>` | max-width 1200px, margin auto, padding 32px 24px | Container for step content (empty placeholder per step) |
| 15 | Step 1 content | `<div>` | Visible when step=1 | Placeholder "Step 1 content here" |
| 16 | Step 2 content | `<div>` | Visible when step=2, hidden otherwise | Placeholder |
| 17 | Step 3 content | `<div>` | Visible when step=3, hidden otherwise | Placeholder |

---

## HTML Structure

```
<body>
  <header> (sticky)
    <div> (max-width 1200px, centered)
      <div> (top row: back link + title + time estimate)
        <a> ← Bảng điều khiển </a>
        <h2> Tạo tin đăng mới </h2>
        <span> ⏱️ Khoảng 10-15 phút </span>
      </div>
      <div> (step indicator row)
        <div> (step 1: circle + label)
        <div> (connector line)
        <div> (step 2: circle + label)
        <div> (connector line)
        <div> (step 3: circle + label)
      </div>
    </div>
  </header>
  <main> (max-width 1200px, centered)
    <div id="step-1"> ... </div>
    <div id="step-2" hidden> ... </div>
    <div id="step-3" hidden> ... </div>
  </main>
</body>
```

---

## JavaScript Requirements

| Function | Purpose |
|----------|---------|
| `setStep(n)` | Sets active step (1-3), updates circles/connectors/labels, shows/hides content |
| `goToStep(n)` | Click handler — only allows navigation to completed steps (n < currentStep) |
| `completeStep(n)` | Marks step as completed, enables forward navigation |

### State Management

```js
let currentStep = 1;
let completedSteps = [];
```

---

## Design Tokens Applied

| Token | Value | Where |
|-------|-------|-------|
| `color-primary` | `#1B2A4A` | Active step circle |
| `color-success` | `#27AE60` | Completed step circle + connector |
| `color-text-secondary` | `#6B7280` | Upcoming step, time estimate |
| `color-bg` | `#FAFAF8` | Page background |
| `color-surface` | `#FFFFFF` | Header background |
| `shadow-sticky` | `0 -2px 8px rgba(0,0,0,0.06)` | Header shadow |
| `text-h2` | 24px Bold | Page title |
| `text-caption` | 14px | Step labels |
| `text-small` | 12px | Time estimate |
| `radius-full` | 9999px | Step circles |
| `space-lg` | 16px | Header padding |
| `space-xl` | 24px | Content padding |
| `space-2xl` | 32px | Main content top padding |

---

## Demo Data

No external data needed — static UI elements.

---

## Acceptance Criteria

### Agent-Verifiable
- [ ] Page renders at 1440px without horizontal scroll
- [ ] Header is sticky (position: sticky, top: 0)
- [ ] 3 step circles visible with correct numbers (1, 2, 3)
- [ ] Step 1 is active by default (navy circle)
- [ ] Steps 2 and 3 are upcoming (gray)
- [ ] Content area has max-width 1200px and is centered
- [ ] Only step-1 content div is visible on load

### User-Evaluable
- [ ] Step indicator feels clear and scannable
- [ ] Vietnamese text reads naturally
- [ ] Header doesn't feel cramped or too spacious
- [ ] Overall page feels like a professional business tool

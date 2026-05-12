# Story 1.2: Design Token System & Core UI Components

Status: done

## Story

As a developer,
I want a complete design token system in Tailwind CSS 4.x and a library of shared UI components,
So that all pages across the platform have consistent styling and reusable building blocks.

## Acceptance Criteria

1. **Given** Tailwind CSS 4.x is configured
   **When** I inspect `apps/web/app/globals.css`
   **Then** all brand design tokens are defined via `@theme` directive:
   - Brand: Navy `#1B2A4A`, Coral `#FF6B4A`, Teal `#2EC4B6`
   - Surfaces: `#FAFAF8`, `#FFFFFF`, `#F5F5F3`
   - Text: `#0D1B2A`, `#6B7280`, `#FFFFFF`, link `#2EC4B6`
   - Status: success `#27AE60`, warning `#F2994A`, error `#EB5757`, info `#2EC4B6`
   - Typography: Noto Sans JP (primary), Inter (UI), 6-level type scale (32/24/20/16/14/12px)
   - Spacing: 4px to 48px scale (xs/sm/md/lg/xl/2xl/3xl)
   - Border radius: sm 8px, md 12px, lg 16px, full 9999px
   - Shadows: card, card-hover, modal, sticky
   - Animation: fast 150ms, normal 300ms, slow 500ms
   - Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px

2. **Given** the design token system
   **When** I use Tailwind utility classes
   **Then** token values are accessible as `bg-primary`, `text-secondary`, `shadow-card`, etc.

3. **Given** the shared component library at `apps/web/shared/components/`
   **When** I inspect the directory
   **Then** these 13 components exist with correct implementations:
   - `PrimaryCTAButton` — Coral fill, white text, min 48px height, loading/disabled states
   - `SectionHeader` — emoji + h2 title + optional "View all" link
   - `EmptyState` — illustration + headline + body + optional CTA
   - `Toast` — success/info/error variants, auto-dismiss 3s, slide-up animation
   - `Modal` — bottom sheet on mobile (<768px), centered modal on desktop
   - `StickyActionBar` — fixed bottom on mobile, single-cta and dual-action variants
   - `Accordion` — expand/collapse with 300ms height animation, chevron rotation
   - `SaveHeartButton` — toggle heart with bounce animation, onUnauthenticated callback
   - `SegmentedControl` — N segments, Navy active state, sliding indicator
   - `SuccessBanner` — green left-border banner with checkmark, auto-dismiss optional
   - `StatusBadge` — Active/Paused/Expired pill variants
   - `Skeleton` — loading placeholder with shimmer animation
   - `SenpaiBadge` — verified/rank variants (senpai/contributor/active/newcomer)

4. **Given** any shared component
   **When** I render it on different viewports
   **Then** it meets accessibility requirements: min 44px touch targets, proper ARIA attributes

5. **Given** each shared component
   **When** I run the component test suite
   **Then** each component has a passing render test and key interaction tests

## Tasks / Subtasks

- [x] Task 1: Configure Tailwind CSS 4.x design tokens in globals.css (AC: #1, #2)
  - [x] Replace existing `globals.css` with complete `@theme` block containing all design tokens
  - [x] Add `@import` for Google Fonts: Noto Sans JP (400, 600, 700) and Inter (400, 500, 600)
  - [x] Define custom CSS variables for token values not directly mappable to Tailwind utilities
  - [x] Remove dark mode media query (DaNangNavi is light-theme only)
  - [x] Verify tokens work with `bg-primary`, `text-secondary`, `shadow-card` etc.

- [x] Task 2: Create PrimaryCTAButton component (AC: #3, #4, #5)
  - [x] Create `apps/web/shared/components/PrimaryCTAButton.tsx`
  - [x] Props: `children`, `variant` (default|compact), `disabled`, `loading`, `icon`, `iconPosition`, `onClick`, `type`, `className`
  - [x] States: default, hover (-10% darker), active (-20% darker + scale 0.98), disabled (gray, opacity 0.6), loading (spinner)
  - [x] Responsive: full-width mobile, auto-width desktop (min 200px)
  - [x] Write test: `apps/web/shared/components/__tests__/PrimaryCTAButton.test.tsx`

- [x] Task 3: Create SectionHeader component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/SectionHeader.tsx`
  - [x] Props: `emoji`, `title`, `linkText`, `linkHref`, `className`
  - [x] Render as `h2` with emoji prefix, optional right-aligned link
  - [x] Responsive: 20px mobile, 24px desktop
  - [x] Write test

- [x] Task 4: Create EmptyState component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/EmptyState.tsx`
  - [x] Props: `variant` (no-results|no-data|no-saved), `headline`, `body`, `ctaLabel`, `onCtaClick`, `className`
  - [x] Center-stacked layout with illustration placeholder, constrained to 400px on desktop
  - [x] Write test

- [x] Task 5: Create Toast notification system (AC: #3, #5)
  - [x] Create `apps/web/shared/components/Toast.tsx` — individual toast component
  - [x] Create `apps/web/shared/components/ToastProvider.tsx` — context provider with toast queue
  - [x] Create `apps/web/shared/hooks/useToast.ts` — hook returning `showToast(message, variant)`
  - [x] Props: `variant` (success|info|error), `message`, auto-dismiss 3s, swipe/tap to dismiss
  - [x] Position: fixed bottom center, 16px above bottom tab nav area
  - [x] Animations: slide-up + fade-in (300ms enter), fade-out + slide-down (150ms exit)
  - [x] Write test

- [x] Task 6: Create Modal / BottomSheet component (AC: #3, #4, #5)
  - [x] Create `apps/web/shared/components/Modal.tsx`
  - [x] Props: `isOpen`, `onClose`, `title`, `variant` (partial|full|compact), `children`, `footer`
  - [x] Mobile (<768px): bottom sheet with drag handle, slide-up animation, swipe-to-dismiss
  - [x] Desktop (>=768px): centered card (max 480px), fade+scale animation, backdrop click/Escape to close
  - [x] Lock background scroll when open
  - [x] Write test

- [x] Task 7: Create StickyActionBar component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/StickyActionBar.tsx`
  - [x] Props: `variant` (single-cta|dual-action), `children`, `priceDisplay`, `className`
  - [x] Fixed bottom, 64px + safe-area, above bottom-tab-nav z-index
  - [x] Desktop: hidden (CTA inline in content)
  - [x] Write test

- [x] Task 8: Create Accordion component (AC: #3, #4, #5)
  - [x] Create `apps/web/shared/components/Accordion.tsx`
  - [x] Props: `items` array of {trigger, content}, `defaultOpen` (index), `className`
  - [x] Chevron rotation animation, height transition 300ms
  - [x] Min 48px touch target for trigger row
  - [x] Write test

- [x] Task 9: Create SaveHeartButton component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/SaveHeartButton.tsx`
  - [x] Props: `saved`, `onToggle`, `onUnauthenticated`, `className`
  - [x] Heart icon: outline (unsaved), filled coral (saved)
  - [x] Bounce animation on save (scale 1.0 -> 1.3 -> 1.0)
  - [x] 40px touch target
  - [x] Write test

- [x] Task 10: Create SegmentedControl component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/SegmentedControl.tsx`
  - [x] Props: `segments` (label[]), `activeIndex`, `onChange`, `className`
  - [x] Active: Navy background, white text; Inactive: transparent, gray text
  - [x] Sliding background indicator animation 300ms
  - [x] Write test

- [x] Task 11: Create SuccessBanner component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/SuccessBanner.tsx`
  - [x] Props: `message`, `autoDismiss` (boolean, default true), `duration` (default 10s), `onDismiss`
  - [x] Green left-border accent, checkmark icon, dismiss button
  - [x] Fade-out + height-collapse animation on dismiss
  - [x] Write test

- [x] Task 12: Create StatusBadge component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/StatusBadge.tsx`
  - [x] Props: `variant` (active|paused|expired), `className`
  - [x] Pill shape with colored dot prefix, text in Vietnamese
  - [x] Write test

- [x] Task 13: Create Skeleton component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/Skeleton.tsx`
  - [x] Props: `variant` (text|circle|rect|card), `width`, `height`, `className`
  - [x] Shimmer animation using CSS gradient
  - [x] Write test

- [x] Task 14: Create SenpaiBadge component (AC: #3, #5)
  - [x] Create `apps/web/shared/components/SenpaiBadge.tsx`
  - [x] Props: `variant` (verified|rank-senpai|rank-contributor|rank-active|rank-newcomer)
  - [x] Verified: green pill "先輩認証済み ✓"
  - [x] Rank variants: teal/gray pills with Japanese labels
  - [x] Write test

- [x] Task 15: Create barrel export and verify full integration (AC: #2, #3, #5)
  - [x] Create `apps/web/shared/components/index.ts` barrel export for all components
  - [x] Integrate `ToastProvider` into root layout `apps/web/app/layout.tsx`
  - [x] Run full test suite: `pnpm --filter web test`
  - [x] Verify all components render without errors

## Dev Notes

### Architecture Compliance

- **Tailwind CSS 4.x**: Uses `@theme` directive in CSS — NO `tailwind.config.ts` file. Tokens defined via CSS custom properties in `globals.css`
- **Component location**: ALL shared components in `apps/web/shared/components/` (per architecture spec)
- **Naming**: PascalCase component files, camelCase for hooks/utilities
- **No `any` type**: Use `unknown` + type guards if needed
- **No spinners**: Use `Skeleton` component for loading states
- **Test location**: Co-located in `apps/web/shared/components/__tests__/`

### Tailwind CSS 4.x Token Implementation

Tailwind CSS 4.x uses `@theme` in CSS instead of a JS config file. The existing `globals.css` already has `@import "tailwindcss"` and a basic `@theme inline` block. Replace this with the full design token system.

Token mapping pattern:
```css
@theme {
  --color-primary: #1B2A4A;
  --color-secondary: #FF6B4A;
  /* generates: bg-primary, text-primary, border-primary, etc. */
}
```

For fonts, use `next/font/google` to load Noto Sans JP and Inter (performance-optimized), then reference them in the theme.

### Component Implementation Standards

- All interactive components: min 44px touch target (WCAG 2.1 AA)
- All animations use design token durations (150/300/500ms)
- All colors reference design tokens — NO hardcoded hex values in components
- Use `React.forwardRef` for components that wrap native elements
- Use `className` prop with Tailwind merge for style overrides
- Use `tailwind-merge` or `clsx` for conditional class names — install if not already present

### Font Loading Strategy

Use `next/font/google` in `apps/web/app/layout.tsx`:
```tsx
import { Noto_Sans_JP, Inter } from 'next/font/google';
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-noto-sans-jp' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' });
```
Then reference `--font-noto-sans-jp` and `--font-inter` in the `@theme` block.

### Icon Strategy

Use `lucide-react` for icons (Heart, ChevronDown, X, Check, Info, AlertCircle, Loader2). Install if not already present: `pnpm --filter web add lucide-react`.

### Dependencies to Install

```bash
pnpm --filter web add lucide-react clsx tailwind-merge
pnpm --filter web add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Note: Check if testing libraries are already installed from Story 1.1 before adding.

### Previous Story Intelligence (Story 1.1)

**Completed work that this story builds on:**
- Monorepo structure with `apps/web/shared/components/` directory (has `.gitkeep`)
- `globals.css` exists with basic `@theme inline` block — must be replaced
- Vitest configured at `apps/web/vitest.config.ts`
- Root layout at `apps/web/app/layout.tsx` exists — needs font provider additions
- No `tailwind.config.ts` file exists (Tailwind 4.x uses CSS-based config)

**Deferred items from Story 1.1 relevant to this story:**
- `vitest.config.ts` missing setupFiles for jest-dom — FIX in this story when adding component tests
- Route group layout files missing — NOT this story's scope (Story 1.3)

**Dev agent used**: github-copilot/gpt-5.3-codex
**Key learning**: Docker port 5432 conflict on dev machine — not relevant to this story

### Git Intelligence

Recent commits show monorepo initialization is complete. All infrastructure files exist. The codebase is clean with no uncommitted changes. This story adds frontend design system on top of the existing scaffold.

### Project Structure Notes

Files to create/modify:
```
apps/web/app/globals.css                          — MODIFY (replace with full token system)
apps/web/app/layout.tsx                           — MODIFY (add font providers, ToastProvider)
apps/web/shared/components/index.ts               — CREATE
apps/web/shared/components/PrimaryCTAButton.tsx   — CREATE
apps/web/shared/components/SectionHeader.tsx       — CREATE
apps/web/shared/components/EmptyState.tsx          — CREATE
apps/web/shared/components/Toast.tsx               — CREATE
apps/web/shared/components/ToastProvider.tsx       — CREATE
apps/web/shared/components/Modal.tsx               — CREATE
apps/web/shared/components/StickyActionBar.tsx     — CREATE
apps/web/shared/components/Accordion.tsx           — CREATE
apps/web/shared/components/SaveHeartButton.tsx     — CREATE
apps/web/shared/components/SegmentedControl.tsx    — CREATE
apps/web/shared/components/SuccessBanner.tsx       — CREATE
apps/web/shared/components/StatusBadge.tsx         — CREATE
apps/web/shared/components/Skeleton.tsx            — CREATE
apps/web/shared/components/SenpaiBadge.tsx         — CREATE
apps/web/shared/hooks/useToast.ts                  — CREATE
apps/web/shared/components/__tests__/              — CREATE (13 test files)
apps/web/vitest.config.ts                          — MODIFY (add setupFiles for jest-dom)
```

### Anti-Patterns to Avoid

- DO NOT create a `tailwind.config.ts` — Tailwind 4.x uses CSS-based `@theme`
- DO NOT use hardcoded hex color values in component files — always reference token classes
- DO NOT use spinner/loader icons for loading states — use Skeleton component
- DO NOT use `any` type — use proper TypeScript types
- DO NOT use inline styles — use Tailwind utility classes
- DO NOT add next-intl to components in this story — i18n is Story 1.3's scope
- DO NOT create components not in the acceptance criteria list — scope is exactly 13 components + SenpaiBadge

### References

- [Source: D-Design-System/design-tokens.md] — Complete token values
- [Source: D-Design-System/components/primary-cta-button.md] — PrimaryCTAButton spec
- [Source: D-Design-System/components/section-header.md] — SectionHeader spec
- [Source: D-Design-System/components/empty-state.md] — EmptyState spec
- [Source: D-Design-System/components/toast-notification.md] — Toast spec
- [Source: D-Design-System/components/modal-bottom-sheet.md] — Modal spec
- [Source: D-Design-System/components/sticky-action-bar.md] — StickyActionBar spec
- [Source: D-Design-System/components/expandable-accordion.md] — Accordion spec
- [Source: D-Design-System/components/save-heart-button.md] — SaveHeartButton spec
- [Source: D-Design-System/components/segmented-control.md] — SegmentedControl spec
- [Source: D-Design-System/components/success-banner.md] — SuccessBanner spec
- [Source: D-Design-System/components/status-badge.md] — StatusBadge spec
- [Source: D-Design-System/components/senpai-badge.md] — SenpaiBadge spec
- [Source: architecture/implementation-patterns-consistency-rules.md] — Naming and structure conventions
- [Source: architecture/core-architectural-decisions.md#frontend-architecture] — State management, component patterns
- [Source: implementation-artifacts/1-1-monorepo-setup-development-infrastructure.md] — Previous story context

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- jsdom cleanup issue: Tests failed due to DOM not being cleaned up between tests. Fixed by adding `cleanup()` in `vitest.setup.ts`.
- Pre-existing build error: Route group conflict between `(admin)`, `(business)`, `(user)` — not related to this story (Story 1.3 scope).

### Completion Notes List

- Replaced globals.css with full Tailwind 4.x `@theme` design token system (brand colors, surfaces, text, status, typography, spacing, radius, shadows, animation, breakpoints)
- Replaced Geist fonts with Noto Sans JP + Inter via `next/font/google` in layout.tsx
- Created `cn()` utility using clsx + tailwind-merge at `shared/lib/cn.ts`
- Implemented all 13 shared UI components + SenpaiBadge (14 total) with proper TypeScript types, forwardRef where needed, accessibility (ARIA, 44px touch targets), and design token references
- Created Toast notification system with context provider, queue management, and `useToast` hook
- Integrated ToastProvider into root layout
- Created barrel export at `shared/components/index.ts`
- Fixed vitest setup: added `vitest.setup.ts` with jest-dom matchers and automatic cleanup
- Updated vitest.config.ts to include `shared/**/__tests__/**` test pattern and `@` alias
- All 46 tests pass, lint clean (0 errors, 0 warnings)

### File List

- `apps/web/app/globals.css` — MODIFIED (full design token system)
- `apps/web/app/layout.tsx` — MODIFIED (fonts + ToastProvider)
- `apps/web/vitest.config.ts` — MODIFIED (setupFiles, include patterns, alias)
- `apps/web/vitest.setup.ts` — CREATED (jest-dom + cleanup)
- `apps/web/shared/lib/cn.ts` — CREATED (clsx + tailwind-merge utility)
- `apps/web/shared/components/index.ts` — CREATED (barrel export)
- `apps/web/shared/components/PrimaryCTAButton.tsx` — CREATED
- `apps/web/shared/components/SectionHeader.tsx` — CREATED
- `apps/web/shared/components/EmptyState.tsx` — CREATED
- `apps/web/shared/components/Toast.tsx` — CREATED
- `apps/web/shared/components/ToastProvider.tsx` — CREATED
- `apps/web/shared/components/Modal.tsx` — CREATED
- `apps/web/shared/components/StickyActionBar.tsx` — CREATED
- `apps/web/shared/components/Accordion.tsx` — CREATED
- `apps/web/shared/components/SaveHeartButton.tsx` — CREATED
- `apps/web/shared/components/SegmentedControl.tsx` — CREATED
- `apps/web/shared/components/SuccessBanner.tsx` — CREATED
- `apps/web/shared/components/StatusBadge.tsx` — CREATED
- `apps/web/shared/components/Skeleton.tsx` — CREATED
- `apps/web/shared/components/SenpaiBadge.tsx` — CREATED
- `apps/web/shared/hooks/useToast.ts` — CREATED
- `apps/web/shared/components/__tests__/PrimaryCTAButton.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/SectionHeader.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/EmptyState.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/Toast.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/Modal.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/StickyActionBar.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/Accordion.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/SaveHeartButton.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/SegmentedControl.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/SuccessBanner.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/StatusBadge.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/Skeleton.test.tsx` — CREATED
- `apps/web/shared/components/__tests__/SenpaiBadge.test.tsx` — CREATED

### Change Log

- 2026-04-12: Implemented complete design token system and all 14 UI components with 46 passing tests

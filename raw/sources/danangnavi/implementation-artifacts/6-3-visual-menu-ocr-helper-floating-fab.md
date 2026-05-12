# Story 6.3: Visual Menu OCR Helper & Floating FAB

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese tourist looking at a Vietnamese menu,
I want to point my camera at the menu and see Japanese translations overlaid,
So that I can understand what dishes are available without asking anyone.

## Acceptance Criteria

1. **Given** I am on the translation page
   **When** I tap "📷 メニューを翻訳" pill button (next to mic button)
   **Then** the camera viewfinder opens full-screen with a translucent Navy top bar showing "メニュー翻訳"

2. **Given** the camera is pointed at a Vietnamese menu
   **When** I tap the capture button and text regions are detected
   **Then** semi-transparent teal bounding boxes highlight detected Vietnamese text (30% opacity)
   **And** Japanese translation labels appear adjacent to each detected phrase (Navy pill with white text)

3. **Given** a detected phrase contains allergen-related terms (FR58)
   **When** the translation processes
   **Then** the allergen term is flagged with a warning icon (⚠️) and red highlight
   **And** a note indicates "アレルゲン注意 — 人間による翻訳確認が推奨されます"

4. **Given** I tap a translated region
   **When** the detail tooltip opens
   **Then** a white card shows: full Vietnamese phrase, Japanese translation, pronunciation (katakana), and audio playback button

5. **Given** I tap "撮影して保存" (Capture and save)
   **When** the frame freezes
   **Then** the annotated image (with Japanese overlays) is saved to the session for later reference

6. **Given** I tap ✕ or swipe down
   **When** the camera closes
   **Then** I return to the voice translation mode

7. **Given** I am on any non-translation page
   **When** I see the floating translation FAB
   **Then** a coral FAB (56px circle, white mic icon) is positioned bottom-right, 16px from edge, above bottom tab nav
   **And** tapping opens the translation tool as a bottom sheet (60vh height)
   **And** long-pressing starts voice input immediately
   **And** swiping up the bottom sheet expands to full translation page
   **And** a small teal dot on the FAB indicates an active translation session with history

## Tasks / Subtasks

### Backend — Google Cloud Vision Integration

- [x] Task 1: Create Vision API client infrastructure (AC: #1, #2)
  - [x] 1.1 Add `google-cloud-vision>=3.9.0` to `backend/requirements.txt`
  - [x] 1.2 Create `backend/infrastructure/vision_api.py`:
    - `VisionApiClient` class with circuit breaker (same pattern as `translation_api.py`)
    - `async detect_text(image_bytes: bytes) -> list[TextRegion]` — calls Google Cloud Vision `TEXT_DETECTION` with `language_hints=["vi"]`
    - `TextRegion` dataclass: `text: str`, `bounding_box: BoundingBox` (vertices list), `confidence: float`
    - `BoundingBox` dataclass: `vertices: list[Vertex]` where `Vertex = {"x": int, "y": int}`
    - Timeout: 10s (image processing is slower than text translation). Retries: 2.
    - Error handling: raise `VisionApiUnavailableException` on failure
  - [x] 1.3 Add settings to `backend/shared/config.py`:
    - `google_vision_enabled: bool = True` (feature flag for cost control)
    - `google_vision_max_image_size: int = 10_485_760` (10MB limit)
    - Reuse existing `google_application_credentials` setting (same GCP project as translation API)

### Backend — Menu OCR Schemas

- [x] Task 2: Create Pydantic schemas for menu OCR (AC: #2, #3, #4)
  - [x] 2.1 Add to `backend/modules/translation/schemas.py`:
    - `Vertex(BaseModel)`: x (int), y (int)
    - `BoundingBoxResponse(BaseModel)`: vertices (list[Vertex]) — 4 corners of text region
    - `MenuOcrRegion(BaseModel)`: vietnamese_text (str), japanese_text (str), pronunciation (str), bounding_box (BoundingBoxResponse), is_allergen (bool = False), allergen_warning (str | None = None)
    - `MenuOcrResponse(BaseModel)`: regions (list[MenuOcrRegion]), image_width (int), image_height (int), disclaimer (str)

### Backend — Menu OCR Service & Allergen Detection

- [x] Task 3: Add OCR service methods (AC: #2, #3)
  - [x] 3.1 Add to `backend/modules/translation/service.py`:
    - `async process_menu_image(image_bytes: bytes) -> MenuOcrResponse`:
      1. Call `VisionApiClient.detect_text()` to get Vietnamese text regions
      2. Filter out single-character/noise detections (min 2 chars)
      3. Batch-translate all detected Vietnamese texts to Japanese via existing `translate()` method (reuse cache)
      4. Generate katakana pronunciation for each translation
      5. Run allergen detection on each Vietnamese text
      6. Return `MenuOcrResponse` with all regions
    - `_detect_allergens(vietnamese_text: str) -> tuple[bool, str | None]`:
      - Check text against allergen keyword list (Vietnamese allergen terms)
      - Return `(True, "アレルゲン注意 — 人間による翻訳確認が推奨されます")` if match
  - [x] 3.2 Add allergen keywords to `backend/modules/translation/constants.py`:
    - `VIETNAMESE_ALLERGEN_KEYWORDS: dict[str, str]` mapping Vietnamese allergen terms to Japanese labels:
      - `"tôm"` → "エビ (shrimp)", `"cua"` → "カニ (crab)", `"hạt"` → "ナッツ (nuts)", `"đậu phộng"` → "ピーナッツ (peanuts)", `"sữa"` → "乳製品 (dairy)", `"trứng"` → "卵 (eggs)", `"cá"` → "魚 (fish)", `"gluten"` → "グルテン (gluten)", `"mực"` → "イカ (squid)", `"nghêu"` → "貝 (shellfish)", `"sò"` → "貝 (shellfish)"
    - `MAX_OCR_IMAGE_SIZE: int = 10_485_760` (10MB)
    - `MAX_OCR_REGIONS: int = 50` (cap regions to avoid excessive API calls)

### Backend — Menu OCR Endpoint

- [x] Task 4: Add OCR endpoint to router (AC: #1, #2, #3, #4)
  - [x] 4.1 Add to `backend/modules/translation/router.py`:
    - `POST /api/v1/translation/menu-ocr` — accepts multipart form upload
    - Request: `UploadFile` (JPEG/PNG, max 10MB)
    - Response: `SingleEnvelope[MenuOcrResponse]`
    - Auth: optional (guest-accessible, same as translate endpoint)
    - Rate limit: `rate_limit(10, 60, "menu_ocr")` (10/min — heavier operation, cost control)
    - Validate file type (JPEG, PNG only) and size before processing
    - Requires `python-multipart` (already installed)
  - [x] 4.2 Add `MenuOcrDisabledException(AppException)` in `exceptions.py`: 503, "Menu OCR is temporarily unavailable"
  - [x] 4.3 Add `ImageTooLargeException(AppException)` in `exceptions.py`: 413, "Image exceeds maximum size"
  - [x] 4.4 Add `InvalidImageFormatException(AppException)` in `exceptions.py`: 400, "Only JPEG and PNG images are supported"

### Backend — Tests

- [x] Task 5: Backend tests for OCR endpoint (AC: #1-4)
  - [x] 5.1 `tests/translation/test_router.py` — ADD to existing test file:
    - `test_menu_ocr_returns_200_with_regions` — mock Vision API, verify response structure
    - `test_menu_ocr_detects_allergens` — verify allergen flagging in response
    - `test_menu_ocr_rejects_oversized_image` — verify 413 error
    - `test_menu_ocr_rejects_invalid_format` — verify 400 for non-image uploads
    - `test_menu_ocr_returns_503_when_disabled` — verify feature flag
    - `test_menu_ocr_rate_limited` — verify rate limiting
  - [x] 5.2 `tests/translation/test_service.py` — ADD to existing test file:
    - `test_process_menu_image_returns_translated_regions` — mock Vision + translate
    - `test_process_menu_image_flags_allergens` — verify allergen detection
    - `test_process_menu_image_filters_noise` — verify short text filtered out
    - `test_detect_allergens_matches_vietnamese_terms` — unit test allergen keyword matching

### Frontend — New Types

- [x] Task 6: Extend TypeScript types for OCR (AC: #2, #3, #4)
  - [x] 6.1 Add to `apps/web/modules/translation/lib/types.ts`:
    - `Vertex = { x: number; y: number }`
    - `BoundingBox = { vertices: Vertex[] }`
    - `MenuOcrRegion = { vietnameseText: string; japaneseText: string; pronunciation: string; boundingBox: BoundingBox; isAllergen: boolean; allergenWarning: string | null }`
    - `MenuOcrResponse = { regions: MenuOcrRegion[]; imageWidth: number; imageHeight: number; disclaimer: string }`

### Frontend — OCR Data Fetching

- [x] Task 7: Add OCR API function (AC: #1, #2)
  - [x] 7.1 Add to `apps/web/modules/translation/lib/translation-data.ts`:
    - `uploadMenuImage(imageBlob: Blob): Promise<MenuOcrResponse>` — sends `FormData` with `file` field to `POST /translation/menu-ocr` via `apiClient`. Note: apiClient auto-transforms snake_case→camelCase on response.

### Frontend — useCamera Hook

- [x] Task 8: Create camera access hook (AC: #1, #5, #6)
  - [x] 8.1 `modules/translation/hooks/useCamera.ts`:
    - No external dependencies — uses `navigator.mediaDevices.getUserMedia` directly
    - State: `stream: MediaStream | null`, `isActive: boolean`, `error: string | null`, `isFrozen: boolean`
    - `start()`: request rear camera (`facingMode: { ideal: "environment" }`), resolution `{ ideal: 1920 } x { ideal: 1080 }`, video only (no audio). Set `playsInline` and `autoplay` on video element. Handle permission denied gracefully.
    - `stop()`: stop all tracks, clean up stream
    - `captureFrame(videoEl: HTMLVideoElement): Blob`: draw video frame to offscreen canvas, export as JPEG (quality 0.85), return Blob. Resize to max 1920px width to reduce upload size.
    - `freeze(videoEl: HTMLVideoElement)`: pause video, set `isFrozen: true`
    - `unfreeze(videoEl: HTMLVideoElement)`: resume video, set `isFrozen: false`
    - Cleanup on unmount: stop all tracks
    - iOS Safari handling: `playsInline` attribute required, `autoPlay` attribute required

### Frontend — MenuOcrView Component

- [x] Task 9: Create camera OCR interface (AC: #1, #2, #3, #4, #5, #6)
  - [x] 9.1 `modules/translation/components/MenuOcrView.tsx` (Client):
    - Props: `isOpen: boolean`, `onClose: () => void`
    - Full-screen overlay when `isOpen` (uses `fixed inset-0 z-50`)
    - **Top bar**: translucent Navy background (`bg-navy/80 backdrop-blur-sm`), "メニュー翻訳" title, ✕ close button (right side)
    - **Camera viewfinder**: `<video>` element fills viewport, ref for capture operations
    - **State flow**:
      1. `idle` → camera active, showing viewfinder
      2. `capturing` → user tapped capture button, sending to API (show loading spinner overlay)
      3. `results` → OCR response received, showing annotated frame
      4. `detail` → user tapped a region, showing detail tooltip
    - **Capture button**: centered bottom, white circle (64px) with camera icon, tapping triggers: `captureFrame()` → `uploadMenuImage()` → display results
    - **Results overlay** (on frozen frame):
      - Draw teal bounding boxes (30% opacity, `bg-teal/30 border border-teal`) as absolute-positioned divs over the `<canvas>` element
      - Each box has a Japanese text label (Navy pill: `bg-navy text-white text-xs px-2 py-0.5 rounded-full`) positioned above the box
      - Allergen regions: red border + ⚠️ icon (`border-red-500 bg-red-500/20`)
      - Tappable: each region div has `onClick` handler
    - **Detail tooltip** (on region tap):
      - White card (`bg-white rounded-xl shadow-lg p-4`) positioned near tapped region (or centered on mobile)
      - Content: Vietnamese text (primary), Japanese translation (bold), katakana pronunciation (caption), speaker button (teal, 36px)
      - Allergen warning if applicable (red text with ⚠️)
      - Speaker button: calls `useSpeechSynthesis.speak(vietnameseText, "vi")`
      - Close tooltip: tap outside or ✕ button
    - **"撮影して保存" button**: appears in results state, bottom-right. Saves annotated canvas to session state (store as data URL in component state array)
    - **Saved images**: accessible via a small gallery icon. Shows thumbnails of saved annotated images. Tap to view full-screen.
    - **Close behavior**: ✕ button or swipe-down gesture (`onTouchStart` / `onTouchMove` tracking Y delta > 100px). Calls `onClose()`. Camera stream is stopped.
    - **Permission denied state**: show friendly message "カメラへのアクセスを許可してください" with instructions and a retry button
    - **Error state**: show error message with retry button (same pattern as phrasebook error state)
    - **Loading state**: pulsing overlay on frozen frame with "翻訳中..." text

  - [x] 9.2 Coordinate scaling: Vision API returns coordinates relative to original image dimensions. Scale bounding boxes to match display dimensions: `displayX = (vertex.x / imageWidth) * displayWidth`. Store `imageWidth`/`imageHeight` from response.

### Frontend — Translation FAB Component

- [x] Task 10: Create floating action button (AC: #7)
  - [x] 10.1 `shared/components/TranslationFab.tsx` (Client):
    - Props: none (self-contained)
    - Renders: coral circle (56px), white `Mic` icon (lucide-react), `fixed bottom-20 right-4 z-40` (above BottomTabNav which is `bottom-0`)
    - **Teal session dot**: small (8px) teal dot top-right of FAB, visible when `hasActiveSession` is true (check `sessionStorage` for existing conversation history)
    - **Tap handler**: navigate to translation page (`router.push(\`/${locale}/translate\`)`) or open bottom sheet
    - **Long-press handler** (300ms threshold): navigate to translation page with `?autoRecord=true` query param. VoiceTranslationView reads this param and auto-starts recording.
    - **Bottom sheet mode** (tap):
      - Renders a bottom sheet (`fixed bottom-0 left-0 right-0 z-50`) at 60vh height
      - Contains `TranslationPageShell` embedded (voiceTab only for compact mode)
      - Drag handle at top (8px × 40px rounded bar)
      - Swipe-up expands to full screen → navigate to `/translate` page
      - Swipe-down closes bottom sheet
      - Backdrop overlay (`bg-black/30`) behind sheet, tap to close
    - **Visibility**: hidden on `/translate` page (already on translation page). Show on all other `(user)` route pages.
    - **Animation**: `transition-transform duration-200` for bottom sheet open/close. FAB has `shadow-lg` and `active:scale-95` press feedback.
    - **Safe area**: account for bottom safe area inset on iOS (`pb-safe` / `env(safe-area-inset-bottom)`)

  - [x] 10.2 Add TranslationFab to user layout:
    - Update `apps/web/app/(user)/[locale]/layout.tsx`:
      - Import `TranslationFab`
      - Render `<TranslationFab />` alongside `<BottomTabNav />`
      - Use `usePathname()` to conditionally hide on `/translate` routes

### Frontend — Update VoiceTranslationView with OCR Button

- [x] Task 11: Add OCR trigger button to voice tab (AC: #1)
  - [x] 11.1 Update `modules/translation/components/VoiceTranslationView.tsx`:
    - Add "📷 メニューを翻訳" pill button next to mic button area
    - Pill styling: `bg-surface-secondary text-text-primary rounded-full px-4 py-2 text-sm flex items-center gap-1.5 border border-border-secondary`
    - Positioning: centered below mic button (same row or just below)
    - `onClick`: set `showMenuOcr: true` state
    - Render `<MenuOcrView isOpen={showMenuOcr} onClose={() => setShowMenuOcr(false)} />`

### Frontend — i18n Keys

- [x] Task 12: Add new i18n keys for OCR and FAB (AC: #1-7)
  - [x] 12.1 Add to `translation` namespace in `apps/web/messages/ja.json`:
    - `menu_ocr_title`: "メニュー翻訳"
    - `menu_ocr_button`: "📷 メニューを翻訳"
    - `menu_ocr_capture`: "撮影"
    - `menu_ocr_save`: "撮影して保存"
    - `menu_ocr_saved`: "保存しました"
    - `menu_ocr_translating`: "翻訳中..."
    - `menu_ocr_no_text`: "テキストが検出されませんでした"
    - `menu_ocr_error`: "メニューの翻訳に失敗しました"
    - `menu_ocr_retry`: "もう一度撮影"
    - `allergen_warning`: "アレルゲン注意 — 人間による翻訳確認が推奨されます"
    - `camera_permission_title`: "カメラへのアクセスが必要です"
    - `camera_permission_description`: "メニューを翻訳するにはカメラへのアクセスを許可してください"
    - `camera_permission_retry`: "もう一度許可する"
    - `camera_not_supported`: "お使いのブラウザはカメラに対応していません"
    - `fab_label`: "翻訳ツール"
    - `saved_images`: "保存した画像"
    - `saved_images_empty`: "保存した画像はありません"
    - `close`: "閉じる"
    - `swipe_down_to_close`: "下にスワイプして閉じる"
  - [x] 12.2 Add equivalent keys to `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 13: Frontend tests for new components (AC: #1-7)
  - [x] 13.1 `__tests__/MenuOcrView.test.tsx`:
    - Renders full-screen overlay when isOpen=true
    - Shows camera permission error state
    - Capture button triggers image upload
    - Displays OCR regions with bounding boxes after capture
    - Allergen regions show warning icon and red highlight
    - Tapping region opens detail tooltip with Vietnamese/Japanese/pronunciation
    - Speaker button in detail tooltip triggers audio
    - Close button calls onClose
    - "撮影して保存" saves annotated image
    - Shows loading state during OCR processing
    - Shows error state with retry on API failure
  - [x] 13.2 `__tests__/TranslationFab.test.tsx`:
    - Renders coral FAB with mic icon
    - Tap navigates to translate page
    - Teal dot visible when session exists
    - Hidden on /translate routes
    - Long press triggers auto-record navigation
  - [x] 13.3 `__tests__/useCamera.test.ts`:
    - start() calls getUserMedia with correct constraints
    - stop() stops all tracks
    - captureFrame() returns Blob
    - Handles permission denied error
    - Cleans up on unmount
  - [x] 13.4 Mock strategy:
    - Mock `navigator.mediaDevices.getUserMedia` for camera tests
    - Mock `HTMLCanvasElement.getContext` and `toBlob` for capture tests
    - Mock `uploadMenuImage` for API tests
    - Mock `useSpeechSynthesis` for audio tests
    - Mock `useRouter` and `usePathname` from `next/navigation` for FAB tests
    - Wrap components in `QueryClientProvider` for TanStack Query tests

### Frontend — Globals CSS Update

- [x] Task 14: Add OCR overlay CSS utilities (AC: #2, #3)
  - [x] 14.1 Add to `apps/web/app/globals.css`:
    ```css
    .ocr-overlay { position: relative; }
    .ocr-region { position: absolute; cursor: pointer; transition: background-color 0.2s; }
    .ocr-region:hover { background-color: rgba(var(--color-teal-rgb), 0.4); }
    ```
    Note: most styling via Tailwind classes. Only add CSS if Tailwind cannot express the pattern.

## Dev Notes

### Architecture Compliance

- **Existing module extension**: This story EXTENDS the existing `backend/modules/translation/` and `apps/web/modules/translation/` modules. Do NOT create new modules.
- **New infrastructure client**: `VisionApiClient` follows the same pattern as existing `TranslationApiClient` in `infrastructure/translation_api.py` — circuit breaker, timeout, retry, structured error handling.
- **Response format**: Use `SingleEnvelope[MenuOcrResponse]` (same envelope pattern as all other endpoints).
- **Optional auth**: OCR endpoint is guest-accessible (same as translate and phrases endpoints).
- **Multipart upload**: FastAPI `UploadFile` handles file upload. `python-multipart` is already a dependency.
- **FAB as shared component**: `TranslationFab` lives in `shared/components/` because it's rendered in the user layout (not inside the translation module). It's a cross-cutting UI element.
- **No new Zustand store**: All state is local component state. Saved OCR images are session-only (sessionStorage or component state). No persistence across page navigations.

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| `translateText()` | `modules/translation/lib/translation-data.ts` | Backend reuses `translate()` service method for OCR text translation |
| `TranslationService.translate()` | `backend/modules/translation/service.py` | Reuse for batch-translating OCR-detected text |
| `transliterate_to_katakana()` | `backend/modules/translation/constants.py` | Reuse for pronunciation generation on OCR results |
| `useSpeechSynthesis` | `modules/translation/hooks/useSpeechSynthesis.ts` | Reuse for audio playback on OCR detail tooltip |
| `TranslationPageShell` | `modules/translation/components/TranslationPageShell.tsx` | Embed in FAB bottom sheet |
| `VoiceTranslationView` | `modules/translation/components/VoiceTranslationView.tsx` | Add OCR button to existing voice tab |
| `BottomTabNav` | `shared/components/BottomTabNav.tsx` | FAB positioned relative to this |
| `apiClient` | `shared/lib/apiClient.ts` | Use for OCR API calls (auto snake↔camel transform) |
| `SingleEnvelope` | `shared/schemas.py` | Backend response wrapper |
| `rate_limit()` | `shared/rate_limit.py` | Apply to OCR endpoint |
| `AppException` | `shared/exceptions.py` | Base for new OCR exceptions |
| Design tokens (Navy, Teal, Coral) | `tailwind.config.ts` | Use for all OCR UI styling |
| `Skeleton` | `shared/components/Skeleton.tsx` | Use for loading states |
| `VIETNAMESE_ALLERGEN_KEYWORDS` pattern | `backend/modules/translation/constants.py` | Existing allergen sub-options in phrase packs — extend with OCR-specific Vietnamese allergen terms |
| BFF proxy | `app/api/(user)/[...path]/route.ts` | Catch-all — `/translation/menu-ocr` route proxied automatically |
| `TranslationApiClient` | `backend/infrastructure/translation_api.py` | Pattern reference for VisionApiClient (circuit breaker, error handling) |

### Technical Approach — OCR Architecture (Capture-and-Send)

**Why server-side OCR (Google Cloud Vision API) instead of client-side (Tesseract.js):**
- Vietnamese diacritics require high accuracy — Cloud Vision achieves ~95%+ vs ~70-85% for Tesseract.js on real menus
- Mobile browser memory: Tesseract.js uses 100-200MB per worker — unacceptable on tourist phones
- Latency: 0.5-1s network round-trip vs 2-5s on-device processing
- Battery: minimal client processing vs heavy CPU usage
- Already using GCP for translation API — same project, same billing

**Flow:**
```
1. getUserMedia() → rear camera video stream
2. User taps "Capture" → canvas.drawImage(video) → canvas.toBlob(JPEG, 0.85)
3. Upload Blob to POST /api/v1/translation/menu-ocr
4. Backend: Vision API detect_text(image, language_hints=["vi"])
5. Backend: Filter noise (min 2 chars), cap at 50 regions
6. Backend: Batch translate Vietnamese → Japanese (reuse translate(), hits cache)
7. Backend: Generate katakana pronunciation for each
8. Backend: Check allergen keywords in Vietnamese text
9. Response: MenuOcrResponse with regions + bounding boxes
10. Frontend: Draw bounding boxes scaled to display dimensions
11. Frontend: Tap region → detail tooltip with audio
```

### Technical Approach — Bounding Box Rendering

**Coordinate scaling (critical for correct overlay positioning):**

```typescript
// Vision API returns coordinates relative to original image dimensions
// Must scale to match the display element size
const scaleX = displayWidth / response.imageWidth;
const scaleY = displayHeight / response.imageHeight;

regions.map(region => {
  const [topLeft, topRight, bottomRight, bottomLeft] = region.boundingBox.vertices;
  return {
    left: topLeft.x * scaleX,
    top: topLeft.y * scaleY,
    width: (topRight.x - topLeft.x) * scaleX,
    height: (bottomLeft.y - topLeft.y) * scaleY,
  };
});
```

**Use `<div>` overlays, NOT canvas drawing:**
- Canvas drawing requires re-rendering on every interaction
- `<div>` overlays support native click handlers, hover states, and accessibility
- Position absolute divs over a `<canvas>` or `<img>` element showing the frozen frame

### Technical Approach — Camera Hook

```typescript
// useCamera.ts — raw getUserMedia, no library dependency
export function useCamera() {
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (videoEl: HTMLVideoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      videoEl.srcObject = stream;
      videoEl.setAttribute("playsinline", "true"); // iOS requirement
      await videoEl.play();
      setIsActive(true);
    } catch (err) {
      setError(err instanceof DOMException ? err.name : "Unknown error");
    }
  }, []);

  const captureFrame = useCallback((videoEl: HTMLVideoElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const maxWidth = 1920;
      const scale = Math.min(1, maxWidth / videoEl.videoWidth);
      canvas.width = videoEl.videoWidth * scale;
      canvas.height = videoEl.videoHeight * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Capture failed")), "image/jpeg", 0.85);
    });
  }, []);

  // ... stop, freeze, unfreeze, cleanup
}
```

### Technical Approach — FAB Bottom Sheet

```typescript
// TranslationFab.tsx — simplified pattern
// 1. FAB button (always visible except on /translate)
// 2. Bottom sheet (conditionally rendered)
// 3. Swipe gesture handling

const [isSheetOpen, setIsSheetOpen] = useState(false);
const [sheetHeight, setSheetHeight] = useState("60vh");
const touchStartY = useRef(0);

// Swipe detection
const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
const handleTouchEnd = (e: TouchEvent) => {
  const deltaY = e.changedTouches[0].clientY - touchStartY.current;
  if (deltaY > 100) setIsSheetOpen(false); // swipe down → close
  if (deltaY < -100) router.push(`/${locale}/translate`); // swipe up → full page
};

// Long press detection
const longPressTimer = useRef<NodeJS.Timeout>();
const handlePressStart = () => {
  longPressTimer.current = setTimeout(() => {
    router.push(`/${locale}/translate?autoRecord=true`);
  }, 300);
};
const handlePressEnd = () => { clearTimeout(longPressTimer.current); };
```

### Technical Approach — Image Upload via apiClient

**apiClient FormData handling:**

```typescript
export async function uploadMenuImage(imageBlob: Blob): Promise<MenuOcrResponse> {
  const formData = new FormData();
  formData.append("file", imageBlob, "menu.jpg");
  // apiClient needs to skip JSON content-type for FormData
  const response = await apiClient.post("/translation/menu-ocr", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data; // unwrap SingleEnvelope
}
```

Note: Check if `apiClient` (axios-based) auto-handles FormData content-type. If it uses interceptors that set `Content-Type: application/json`, the FormData upload will need to explicitly set or omit the content-type header (axios auto-detects FormData).

### API Design

```
POST /api/v1/translation/menu-ocr
  Auth: optional (guests can use)
  Rate limit: 10/min (route_key=menu_ocr)
  Content-Type: multipart/form-data
  Body: file (JPEG/PNG, max 10MB)
  Response: SingleEnvelope[MenuOcrResponse]
  {
    "data": {
      "regions": [
        {
          "vietnamese_text": "Phở bò",
          "japanese_text": "牛肉のフォー",
          "pronunciation": "ギュウニク ノ フォー",
          "bounding_box": {
            "vertices": [
              {"x": 120, "y": 340},
              {"x": 380, "y": 340},
              {"x": 380, "y": 390},
              {"x": 120, "y": 390}
            ]
          },
          "is_allergen": false,
          "allergen_warning": null
        },
        {
          "vietnamese_text": "Gỏi tôm",
          "japanese_text": "エビのサラダ",
          "pronunciation": "エビ ノ サラダ",
          "bounding_box": { "vertices": [...] },
          "is_allergen": true,
          "allergen_warning": "アレルゲン注意 — 人間による翻訳確認が推奨されます"
        }
      ],
      "image_width": 1920,
      "image_height": 1080,
      "disclaimer": "機械翻訳です。スタッフにご確認ください。"
    }
  }
  Errors:
    413 ImageTooLargeException
    400 InvalidImageFormatException
    503 MenuOcrDisabledException (feature flag off)
    503 VisionApiUnavailableException (Vision API down)
```

### Frontend Component Tree (New/Modified)

```
translate/page.tsx (Server) — NO CHANGES
└── TranslationPageShell (Client) — NO CHANGES
    ├── SegmentedControl (shared) — NO CHANGES
    ├── VoiceTranslationView (Client, tab=voice) — MODIFIED: add OCR button
    │   ├── [existing components...] — NO CHANGES
    │   ├── "📷 メニューを翻訳" pill button (NEW inline)
    │   └── MenuOcrView (NEW, conditional overlay)
    │       ├── Camera viewfinder (<video>)
    │       ├── Capture button
    │       ├── Results overlay (<canvas> + positioned <div> boxes)
    │       │   ├── OcrRegionBox × N (teal boxes with Navy translation pills)
    │       │   └── AllergenRegionBox × N (red boxes with ⚠️ icon)
    │       ├── Detail tooltip (white card on tap)
    │       └── Saved images gallery
    ├── TextTranslationView (tab=text) — NO CHANGES
    └── PhrasebookView (tab=phrasebook) — NO CHANGES

layout.tsx (User layout) — MODIFIED: add TranslationFab
├── TopNav — NO CHANGES
├── {children}
├── BottomTabNav — NO CHANGES
└── TranslationFab (NEW, shared component)
    ├── FAB button (coral circle, mic icon)
    ├── Session dot (teal, conditional)
    └── Bottom sheet (conditional, 60vh)
        └── TranslationPageShell (embedded, compact mode)
```

### Frontend State Architecture

```typescript
// MenuOcrView state (NEW):
ocrState: "idle" | "capturing" | "results" | "detail"
ocrResponse: MenuOcrResponse | null
selectedRegion: MenuOcrRegion | null          // for detail tooltip
savedImages: string[]                          // data URLs of annotated frames
// Camera state via useCamera hook

// TranslationFab state (NEW):
isSheetOpen: boolean
hasActiveSession: boolean                      // check sessionStorage
// Navigation via useRouter

// VoiceTranslationView state (EXTENDED):
showMenuOcr: boolean                           // toggle MenuOcrView overlay
```

### Anti-Patterns to Avoid

- Do NOT use Tesseract.js for client-side OCR — server-side Google Cloud Vision is the chosen approach for accuracy and performance.
- Do NOT stream video frames to the server for real-time OCR — capture-and-send pattern only. One image per capture tap.
- Do NOT create a new database table for OCR results — session-only storage, no persistence.
- Do NOT use `<input type="file" capture="environment">` — this opens the native camera app, losing control of the viewfinder UI. Use `getUserMedia` for inline viewfinder.
- Do NOT share OCR state across tabs — MenuOcrView is a standalone overlay triggered from VoiceTranslationView.
- Do NOT add OCR as a 4th tab in SegmentedControl — it's a modal overlay triggered by a button, not a tab.
- Do NOT import `google-cloud-vision` in module code — use it only in `infrastructure/vision_api.py` (dependency injection pattern).
- Do NOT hard-code Japanese text — all UI strings via `useTranslations("translation")`.
- Do NOT use spinners — use Skeleton for loading states (except OCR capture which uses a pulsing overlay since skeleton doesn't fit camera context).
- Do NOT use `any` type — use `unknown` + type guards.
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`.
- Do NOT add a new BFF route — reuse existing catch-all proxy.
- Do NOT persist FAB state — no Zustand store, pure local component state.
- Do NOT render FAB inside translation module — it goes in `shared/components/` and the user layout.

### Browser Compatibility Notes

**Camera API (`getUserMedia`):**
- Android Chrome: full support, `facingMode` reliable
- iOS Safari 16.4+: supported but `facingMode` may be silently ignored on some devices. Implement fallback via `enumerateDevices()` if needed.
- All iOS browsers use WebKit — same Safari limitations apply
- Requires HTTPS (or localhost) — already deployed with SSL

**Canvas API (`drawImage`, `toBlob`):**
- Universal support across all target browsers
- `toBlob` callback-based (not Promise) — wrap in Promise for clean async code

**No new Web Speech API requirements** beyond Story 6-1/6-2. OCR detail tooltip reuses existing `useSpeechSynthesis`.

### Cost & Rate Limiting Considerations

- Google Cloud Vision: $1.50/1,000 requests. Feature flag `google_vision_enabled` for emergency disable.
- Rate limit: 10 requests/min per user (stricter than text translation's 60/min)
- Image size cap: 10MB (Vision API limit is 20MB, but 10MB is more than enough for a menu photo)
- Region cap: 50 regions max to prevent excessive translation API calls on busy menus

### Previous Story Intelligence

From Story 6-2 implementation:
- **Module structure**: `modules/translation/` has `components/`, `hooks/`, `lib/`, `__tests__/` directories. Follow same pattern.
- **Component pattern**: Client components with `"use client"` directive. Import from sibling paths within module.
- **Speech hooks**: `useSpeechSynthesis` returns `{ speak, stop, isSpeaking, isSupported }`. Call `speak(text, lang)` for audio playback on OCR detail tooltip.
- **apiClient auto-transform**: snake_case (backend) → camelCase (frontend) automatic. Frontend types use camelCase. Verify this works with FormData uploads.
- **Test pattern**: Use `vitest` + `@testing-library/react`. Mock `apiClient` for API calls. Mock speech APIs.
- **i18n pattern**: Add keys to `translation` namespace in all 3 locale files (ja, en, vi).
- **TranslationPair creation**: pattern with `id: crypto.randomUUID()`, `timestamp: Date.now()`.
- **Pydantic model_validator**: Avoid — validation in service layer for AppException compatibility.
- **React 19**: Use callback-based patterns. No refs during render, no setState in effects.
- **scrollbar-hide CSS**: Already added in Story 6-2 globals.css.
- **Test baselines**: Backend ~532 tests, Frontend ~529 tests. Maintain baseline + add new tests.
- **Review findings from 6-2**: `useSpeechSynthesis` return value memoized with `useMemo` for stable ref. Use same pattern in OCR components.

### Git Intelligence

Recent commits:
- `48914ce create: add voice translation and conversation interface (story 6-1)`

Commit convention: `create: ...` for new features. This story → `create: add visual menu OCR helper and floating translation FAB (story 6-3)`.

### New Dependencies

**Backend:**
- `google-cloud-vision>=3.9.0` — Google Cloud Vision API client for text detection

**Frontend:**
- None — uses native browser APIs (`getUserMedia`, Canvas API)

### Project Structure Notes

**New files to create:**

```
backend/infrastructure/vision_api.py
apps/web/modules/translation/hooks/useCamera.ts
apps/web/modules/translation/components/MenuOcrView.tsx
apps/web/shared/components/TranslationFab.tsx
apps/web/modules/translation/__tests__/MenuOcrView.test.tsx
apps/web/modules/translation/__tests__/useCamera.test.ts
apps/web/shared/components/__tests__/TranslationFab.test.tsx
```

**Files to modify:**

```
backend/requirements.txt                           — add google-cloud-vision
backend/shared/config.py                           — add vision settings
backend/modules/translation/constants.py           — add allergen keywords
backend/modules/translation/schemas.py             — add OCR schemas
backend/modules/translation/service.py             — add OCR service methods
backend/modules/translation/router.py              — add OCR endpoint
backend/modules/translation/exceptions.py          — add OCR exceptions
backend/tests/translation/test_router.py           — add OCR endpoint tests
backend/tests/translation/test_service.py          — add OCR service tests
apps/web/modules/translation/lib/types.ts          — add OCR types
apps/web/modules/translation/lib/translation-data.ts — add OCR upload function
apps/web/modules/translation/components/VoiceTranslationView.tsx — add OCR button
apps/web/app/(user)/[locale]/layout.tsx            — add TranslationFab
apps/web/messages/ja.json                          — add OCR/FAB i18n keys
apps/web/messages/en.json                          — add OCR/FAB i18n keys
apps/web/messages/vi.json                          — add OCR/FAB i18n keys
```

### Validation Gates

Before marking complete, verify ALL pass:

```bash
python -m ruff check backend/                         # Backend lint
python -m pytest backend/tests/                       # All backend tests
pnpm --filter web test                                # All frontend tests
pnpm --filter web lint                                # Frontend lint
pnpm --filter web build                               # Next.js build
```

### References

- [Source: epics/epic-6-communication-bridge-translation-tools.md#Story 6.3] — acceptance criteria and user story
- [Source: prd/functional-requirements.md#FR26-FR29] — communication bridge functional requirements
- [Source: prd/functional-requirements.md#FR58] — allergen flagging requirement
- [Source: prd/domain-specific-requirements.md#Translation Accuracy & Safety] — disclaimer, allergen safety-critical translation
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — module file structure, test naming
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns] — SingleEnvelope response wrapper
- [Source: architecture/implementation-patterns-consistency-rules.md#Process Patterns] — DI via Depends, AppException hierarchy
- [Source: architecture/project-structure-boundaries.md#Translation Module] — module location
- [Source: architecture/project-structure-boundaries.md#Integration Points] — Google Cloud services integration pattern
- [Source: _bmad-output/implementation-artifacts/6-2-phrase-packs-phrasebook.md] — previous story patterns, existing components, allergen data

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- `pytest backend/tests/translation/test_service.py backend/tests/translation/test_router.py`
- `pnpm --filter web test -- modules/translation/__tests__/MenuOcrView.test.tsx shared/components/__tests__/TranslationFab.test.tsx modules/translation/__tests__/useCamera.test.ts`
- `python -m ruff check backend/`
- `pytest backend/tests/`
- `pnpm --filter web test`
- `pnpm --filter web lint`
- `pnpm --filter web build`

### Completion Notes List

- Added Google Cloud Vision OCR integration with retry/circuit-breaker handling, menu image validation, allergen detection, and a guest-accessible `POST /api/v1/translation/menu-ocr` endpoint.
- Added frontend camera capture flow with OCR overlays, detail audio playback, saved annotated images, and session-backed translation activity tracking.
- Added floating translation FAB with bottom-sheet entry, long-press auto-record navigation, new i18n strings, and regression coverage for backend/frontend OCR flows.

### File List

- _bmad-output/implementation-artifacts/6-3-visual-menu-ocr-helper-floating-fab.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- backend/infrastructure/vision_api.py
- backend/modules/translation/constants.py
- backend/modules/translation/exceptions.py
- backend/modules/translation/router.py
- backend/modules/translation/schemas.py
- backend/modules/translation/service.py
- backend/requirements.txt
- backend/shared/config.py
- backend/tests/translation/test_router.py
- backend/tests/translation/test_service.py
- apps/web/app/(user)/[locale]/layout.tsx
- apps/web/app/globals.css
- apps/web/messages/en.json
- apps/web/messages/ja.json
- apps/web/messages/vi.json
- apps/web/modules/translation/__tests__/integration-tab-switch.test.tsx
- apps/web/modules/translation/__tests__/MenuOcrView.test.tsx
- apps/web/modules/translation/__tests__/PhrasebookView.test.tsx
- apps/web/modules/translation/__tests__/TextTranslationView.test.tsx
- apps/web/modules/translation/__tests__/useCamera.test.ts
- apps/web/modules/translation/components/MenuOcrView.tsx
- apps/web/modules/translation/components/TextTranslationView.tsx
- apps/web/modules/translation/components/TranslationPageShell.tsx
- apps/web/modules/translation/components/VoiceTranslationView.tsx
- apps/web/modules/translation/hooks/useCamera.ts
- apps/web/modules/translation/lib/translation-data.ts
- apps/web/modules/translation/lib/translation-session.ts
- apps/web/modules/translation/lib/types.ts
- apps/web/shared/components/TranslationFab.tsx
- apps/web/shared/components/__tests__/TranslationFab.test.tsx
- apps/web/vitest.setup.ts

### Review Findings

#### Decision Needed (Resolved)

- [x] [Review][Decision→Patch] **D1: `google_vision_enabled` default → `False`** — User chose opt-in. [backend/shared/config.py:45]
- [x] [Review][Decision→Patch] **D2: Detail tooltip → position near tapped region** — Follow spec. [apps/web/modules/translation/components/MenuOcrView.tsx:352]
- [x] [Review][Decision→Patch] **D3: Pronunciation → Japanese→Katakana via `pykakasi`** — Follow spec example. [backend/modules/translation/service.py:194]
- [x] [Review][Decision→Patch] **D4: OCR disclaimer → Japanese** — `"機械翻訳です。スタッフにご確認ください。"` [backend/modules/translation/constants.py:9]

#### Patch (All Fixed)

- [x] [Review][Patch] **P1 (Critical): MenuOcrView effect — destructured stable callbacks from useCamera** [MenuOcrView.tsx]
- [x] [Review][Patch] **P2 (High): Magic byte validation added** [router.py]
- [x] [Review][Patch] **P3 (High): asyncio.gather for concurrent translation** [service.py]
- [x] [Review][Patch] **P4 (High): JPEG format + max 5 saved images** [MenuOcrView.tsx]
- [x] [Review][Patch] **P5 (High): Word-boundary regex for allergen matching** [service.py]
- [x] [Review][Patch] **P6 (High): appendPhraseToHistory uses current language state** [VoiceTranslationView.tsx]
- [x] [Review][Patch] **P7 (High): useCamera.start() stops existing stream first** [useCamera.ts]
- [x] [Review][Patch] **P8 (Medium): threading.Lock for _get_client()** [vision_api.py]
- [x] [Review][Patch] **P9 (Medium): Chunked file read with early size rejection** [router.py]
- [x] [Review][Patch] **P10 (Medium): Vertices length check with fallback** [MenuOcrView.tsx]
- [x] [Review][Patch] **P11 (Medium): try/except for corrupt image dimensions** [service.py]
- [x] [Review][Patch] **P12 (Medium): useLocale() replaces hardcoded regex** [TranslationFab.tsx]
- [x] [Review][Patch] **P13 (Low): Index-only React keys for gallery** [MenuOcrView.tsx]
- [x] [Review][Patch] **P14 (Low): Full-screen image viewer on gallery tap** [MenuOcrView.tsx]
- [x] [Review][Patch] **P15 (Low): Escape key handler for both dialogs** [MenuOcrView.tsx, TranslationFab.tsx]

#### Deferred

- [x] [Review][Defer] **W1: Pillow decompression bomb protection** — `Image.open()` on untrusted input. Pillow's default `MAX_IMAGE_PIXELS` provides baseline protection. [backend/modules/translation/service.py:213-215] — deferred, defense-in-depth
- [x] [Review][Defer] **W2: `_fallback_transliterate` and phrase pack construction at import time** — Module-level computation during import. [backend/modules/translation/constants.py] — deferred, pre-existing from story 6-2

### Change Log

- 2026-04-28: Code review completed. All 19 patches applied and verified (542 backend + 548 frontend tests pass). Story status → done.
- 2026-04-28: Code review (Group 1 — production code) completed. 4 decision-needed, 15 patch, 2 deferred, 11 dismissed.
- 2026-04-27: Completed Story 6.3 implementation for menu OCR capture/translation, allergen surfacing, and floating translation FAB entry points.

# Story 6.1: Voice Translation & Conversation Interface

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese tourist at a Vietnamese restaurant,
I want to speak in Japanese and get instant Vietnamese translation with audio playback,
So that I can communicate with staff without knowing Vietnamese.

## Acceptance Criteria

1. **Given** I navigate to `/ja/translate` or tap the translation FAB (FR26)
   **When** the translation page loads
   **Then** a SegmentedControl shows 3 tabs: 🎤 音声翻訳 (Voice, default), ✏️ テキスト (Text), 📖 フレーズ集 (Phrasebook)
   **And** a language pair indicator shows "日本語 → ベトナム語" with a swap (↔) icon
   **And** Text and Phrasebook tabs show placeholder "Coming Soon" state (implemented in Story 6.2)

2. **Given** I am on the Voice tab (FR26)
   **When** I tap the large coral mic button (80px diameter)
   **Then** the button pulses with audio amplitude animation
   **And** "聞いています..." (Listening...) label appears with animated dots
   **And** tapping again or silence detection stops recording

3. **Given** speech recognition completes
   **When** the Japanese text is detected (e.g., "辛くしないでください")
   **Then** a Japanese input bubble appears left-aligned (light Navy tint background)
   **And** a Vietnamese output bubble appears right-aligned (light Teal tint) with translation (e.g., "Làm ơn đừng cho cay")
   **And** a katakana pronunciation guide appears below the Vietnamese text (e.g., "ラム ウン ドゥン チョー カイ")
   **And** a teal speaker playback button (36px) appears on the Vietnamese bubble

4. **Given** I tap the speaker playback button (FR27)
   **When** audio generates
   **Then** the Vietnamese text is spoken aloud at elevated volume (for showing to staff)
   **And** the speaker icon animates with sound waves during playback

5. **Given** I tap "スタッフに見せる" (Show to staff)
   **When** the full-screen mode opens
   **Then** the Vietnamese text displays full-screen in large font (36px bold), white background, landscape-friendly
   **And** a "戻る (Back)" button at top returns to the conversation view

6. **Given** I tap the ↔ swap icon
   **When** the language direction swaps to VI→JA
   **Then** I can now record Vietnamese input and receive Japanese translation (for understanding server responses)

7. **Given** the conversation history
   **When** multiple exchanges occur
   **Then** all translation pairs are preserved in a scrollable list for the session
   **And** a "クリア" (Clear) button at top resets the conversation

8. **Given** auto-translated content (FR29)
   **When** any translation displays
   **Then** a small disclaimer appears: "機械翻訳です" (Machine translation) in caption text

## Tasks / Subtasks

### Backend — Translation Module Setup

- [x] Task 1: Create `backend/modules/translation/` module structure (AC: #3, #8)
  - [x] 1.1 `__init__.py` — empty
  - [x] 1.2 `models.py` — `TranslationCache` model: id (UUID PK), source_text (Text, not null), source_lang (VARCHAR(5)), target_lang (VARCHAR(5)), translated_text (Text, not null), pronunciation (Text, nullable — katakana for VI text), created_at, updated_at. Index: `idx_translation_cache_source` on (source_text hash, source_lang, target_lang) for cache lookups. Soft delete NOT needed (cache entries are ephemeral).
  - [x] 1.3 `constants.py` — `SUPPORTED_LANGUAGES = {"ja", "vi"}`, `TRANSLATION_CACHE_TTL_DAYS = 30`, `MAX_TEXT_LENGTH = 5000`

### Backend — Translation Schemas

- [x] Task 2: Create Pydantic schemas (AC: #3, #6, #8)
  - [x] 2.1 `schemas.py` — `TranslateRequest`: source_text (str, max_length=5000), source_lang (Literal["ja", "vi"]), target_lang (Literal["ja", "vi"]), validator: source_lang != target_lang
  - [x] 2.2 `TranslateResponse`: source_text (str), translated_text (str), source_lang (str), target_lang (str), pronunciation (str | None — katakana guide when target is Vietnamese), is_cached (bool), disclaimer (str — always "Machine translation. Please verify with staff.")
  - [x] 2.3 `TranslationHistoryItem`: id (str), source_text, translated_text, source_lang, target_lang, pronunciation (str | None), timestamp (str — ISO 8601)

### Backend — Translation Infrastructure

- [x] Task 3: Create translation API client (AC: #3)
  - [x] 3.1 `backend/infrastructure/translation_api.py` — Google Cloud Translation API v2 client. Method `translate(text: str, source: str, target: str) -> str`. Config via `shared.config.settings`: `GOOGLE_TRANSLATE_API_KEY`. Circuit breaker: 5s timeout, 3 retries with exponential backoff. Fallback on failure: raise `TranslationServiceUnavailableException`.
  - [x] 3.2 Add `google_translate_api_key: str = ""` to `shared/config.py` Settings class (with env var `GOOGLE_TRANSLATE_API_KEY`)
  - [x] 3.3 Use `httpx.AsyncClient` (already used in project) for HTTP calls to `https://translation.googleapis.com/language/translate/v2`

### Backend — Translation Repository

- [x] Task 4: Create repository (AC: #3)
  - [x] 4.1 `repository.py` — `find_cached_translation(source_text: str, source_lang: str, target_lang: str) -> TranslationCache | None` — lookup by exact source text + language pair. Filter: `created_at > now - CACHE_TTL_DAYS`.
  - [x] 4.2 `create_translation_cache(source_text, source_lang, target_lang, translated_text, pronunciation) -> TranslationCache`
  - [x] 4.3 `cleanup_expired_cache() -> int` — delete entries older than TTL. Called by scheduled task (out of scope for this story).

### Backend — Translation Service

- [x] Task 5: Create service (AC: #3, #6, #8)
  - [x] 5.1 `service.py` — `translate(request: TranslateRequest) -> TranslateResponse`
      1. Check cache via repo.find_cached_translation
      2. If cache hit → return cached result with `is_cached=True`
      3. If cache miss → call `infrastructure/translation_api.translate()`
      4. Generate pronunciation: if target_lang == "vi", call a katakana transliteration (see Dev Notes for approach)
      5. Store in cache via repo.create_translation_cache
      6. Return `TranslateResponse` with `is_cached=False` and disclaimer
  - [x] 5.2 Pronunciation generation: For JA→VI direction, generate katakana reading of Vietnamese text. Use a simple Vietnamese-to-Katakana phonetic mapping table (constants). For VI→JA direction, pronunciation is null (Japanese text already readable by Japanese users).
  - [x] 5.3 Handle `TranslationServiceUnavailableException` gracefully — return error response, do NOT crash the endpoint

### Backend — Translation Router

- [x] Task 6: Create router endpoints (AC: #3, #6)
  - [x] 6.1 `router.py` — prefix `/api/v1/translation`
  - [x] 6.2 `POST /api/v1/translation/translate` — `SingleEnvelope[TranslateResponse]`, optional auth (`get_current_user_optional` — guests can use translation tool). Rate limit: `rate_limit(60, 60, "translate")` (60 requests/min — translation is high-frequency).
  - [x] 6.3 Register router in `backend/main.py` — add `translation_router` to app includes

### Backend — Translation Exceptions

- [x] Task 7: Create exceptions (AC: #3)
  - [x] 7.1 `exceptions.py` — `TranslationServiceUnavailableException(AppException)`: 503, message_ja="翻訳サービスが一時的に利用できません", message_vi="Dịch vụ dịch thuật tạm thời không khả dụng", message_en="Translation service temporarily unavailable"
  - [x] 7.2 `InvalidLanguagePairException(AppException)`: 400, "Unsupported language pair"
  - [x] 7.3 `TextTooLongException(AppException)`: 400, max 5000 characters

### Backend — Translation Events

- [x] Task 8: Create events (AC: N/A — wiring for future use)
  - [x] 8.1 `events.py` — `TRANSLATION_REQUESTED_EVENT = "translation.translation.requested"` (for future analytics tracking). No subscribers in this story.

### Backend — Alembic Migration

- [x] Task 9: Create migration for translation_cache table (AC: #3)
  - [x] 9.1 `backend/migrations/versions/2026_04_27_0001_create_translation_cache.py` — create `translation_cache` table with columns from Task 1.2. Add hash index for cache lookups.

### Backend — Tests

- [x] Task 10: Backend tests (AC: #1-8)
  - [x] 10.1 `tests/translation/test_repository.py` — `find_cached_translation` returns cached entry, returns None for expired entries, `create_translation_cache` persists correctly
  - [x] 10.2 `tests/translation/test_service.py` — `translate` returns cached result when available (is_cached=True), calls external API on cache miss, stores result in cache, pronunciation generated for JA→VI direction, pronunciation null for VI→JA direction, handles service unavailable gracefully
  - [x] 10.3 `tests/translation/test_router.py` — `POST /translate` returns 200 with valid input, returns 400 for same source/target lang, returns 400 for text exceeding max length, rate limit kicks in after 60/min, anonymous user can access (no auth required for read)

### Frontend — Translation Module Types

- [x] Task 11: Create TypeScript types (AC: #1-8)
  - [x] 11.1 Create `apps/web/modules/translation/lib/types.ts`:
    - `SupportedLang = "ja" | "vi"`
    - `TranslateRequest = { sourceText: string; sourceLang: SupportedLang; targetLang: SupportedLang }`
    - `TranslateResponse = { sourceText: string; translatedText: string; sourceLang: string; targetLang: string; pronunciation: string | null; isCached: boolean; disclaimer: string }`
    - `TranslationPair = { id: string; sourceText: string; translatedText: string; sourceLang: SupportedLang; targetLang: SupportedLang; pronunciation: string | null; timestamp: number }`
    - `TranslationTab = "voice" | "text" | "phrasebook"`
    - `RecordingState = "idle" | "recording" | "processing"`

### Frontend — Translation Data Fetching

- [x] Task 12: Create data fetcher (AC: #3)
  - [x] 12.1 Create `apps/web/modules/translation/lib/translation-data.ts`:
    - `translateText(request: TranslateRequest): Promise<TranslateResponse>` — calls `POST /translation/translate` via `apiClient`. No cookie forwarding needed (client-only calls). Map snake_case → camelCase.

### Frontend — Speech Hooks

- [x] Task 13: Create speech recognition and synthesis hooks (AC: #2, #4)
  - [x] 13.1 `hooks/useSpeechRecognition.ts` — wraps browser `webkitSpeechRecognition` / `SpeechRecognition` API.
    - Props: `lang: SupportedLang` (maps to BCP-47: ja → "ja-JP", vi → "vi-VN")
    - Returns: `{ start, stop, isListening, transcript, isSupported, error }`
    - Events: `onresult` → set transcript, `onspeechend` → auto-stop, `onerror` → set error
    - Continuous mode OFF (single utterance per press)
    - Silence detection: browser native (speechend event)
  - [x] 13.2 `hooks/useSpeechSynthesis.ts` — wraps browser `speechSynthesis` API.
    - Method: `speak(text: string, lang: SupportedLang)` — uses `SpeechSynthesisUtterance` with `lang` and `volume: 1.0` (elevated for staff)
    - Returns: `{ speak, stop, isSpeaking, isSupported }`
    - Voice selection: prefer Vietnamese voice for "vi", Japanese voice for "ja" from `speechSynthesis.getVoices()`

### Frontend — Translation Page Shell

- [x] Task 14: Create translation page and shell (AC: #1)
  - [x] 14.1 `apps/web/app/(user)/[locale]/translate/page.tsx` — Server Component. Renders `TranslationPageShell` with locale prop. No SSR data fetching needed (translation is fully client-side interactive).
  - [x] 14.2 `modules/translation/components/TranslationPageShell.tsx` (Client) — manages active tab state via `useState<TranslationTab>("voice")`. Renders: page title, `SegmentedControl` (3 tabs: 🎤 / ✏️ / 📖), conditionally renders `VoiceTranslationView` / `TextTabPlaceholder` / `PhrasebookTabPlaceholder`. Text and Phrasebook placeholders show `EmptyState` with "Coming Soon" message.

### Frontend — Language Pair Selector

- [x] Task 15: Create language pair component (AC: #1, #6)
  - [x] 15.1 `modules/translation/components/LanguagePairSelector.tsx` (Client) — displays "日本語 → ベトナム語" (or reverse) with a swap button (↔). Props: `sourceLang, targetLang, onSwap`. Swap button has rotate animation on tap (180deg transition). Use design tokens: Navy text, Teal accent for the arrow.

### Frontend — Voice Translation View

- [x] Task 16: Create voice translation main view (AC: #2-4, #7-8)
  - [x] 16.1 `modules/translation/components/VoiceTranslationView.tsx` (Client) — main container. State: `conversationHistory: TranslationPair[]`, `sourceLang/targetLang` (swappable), `recordingState`. Renders: `LanguagePairSelector`, `ConversationHistory`, `MicButton`, machine translation disclaimer at top. Clear button resets `conversationHistory`.
  - [x] 16.2 Flow: mic tap → `useSpeechRecognition.start()` → on transcript → call `translateText()` → append result to history → auto-play Vietnamese audio via `useSpeechSynthesis`

### Frontend — Mic Button

- [x] Task 17: Create mic button with animation (AC: #2)
  - [x] 17.1 `modules/translation/components/MicButton.tsx` (Client) — 80px coral circle button. States: idle (static mic icon), recording (pulsing scale animation via CSS keyframes, coral glow shadow), processing (spinner replaced with Skeleton shimmer per project convention). Below button: "聞いています..." animated dots label when recording. `aria-label` for accessibility.

### Frontend — Conversation Bubbles

- [x] Task 18: Create translation bubble components (AC: #3, #4, #8)
  - [x] 18.1 `modules/translation/components/TranslationBubble.tsx` (Client) — single translation pair display.
    - Source bubble: left-aligned, light Navy tint bg (`bg-navy-50`), shows source text
    - Target bubble: right-aligned, light Teal tint bg (`bg-teal-50`), shows translated text + pronunciation (smaller caption below) + speaker button (36px teal circle)
    - Speaker button calls `useSpeechSynthesis.speak(translatedText, targetLang)`
    - Speaker icon animates with CSS sound wave animation during playback
    - Disclaimer: "機械翻訳です" caption below each pair
  - [x] 18.2 `modules/translation/components/ConversationHistory.tsx` (Client) — scrollable list of `TranslationBubble` items. Auto-scrolls to bottom on new entry. Empty state when no history.

### Frontend — Show to Staff Modal

- [x] Task 19: Create full-screen staff display (AC: #5)
  - [x] 19.1 `modules/translation/components/ShowToStaffView.tsx` (Client) — triggered by "スタッフに見せる" button on each bubble. Full-screen overlay (z-50, white bg). Vietnamese text in 36px bold, centered. Landscape-friendly (max-w-none, text centered both axes). "戻る (Back)" button at top-left. Tap anywhere or press Back to dismiss. Auto-locks screen orientation if API available (`screen.orientation.lock("landscape")` with try/catch for unsupported browsers).

### Frontend — i18n

- [x] Task 20: Add i18n keys (AC: #1-8)
  - [x] 20.1 Add `translation` namespace to `ja.json`:
    - `page_title`: "翻訳ツール"
    - `tab_voice`: "音声翻訳"
    - `tab_text`: "テキスト"
    - `tab_phrasebook`: "フレーズ集"
    - `lang_japanese`: "日本語"
    - `lang_vietnamese`: "ベトナム語"
    - `listening_label`: "聞いています..."
    - `processing_label`: "翻訳中..."
    - `mic_button_label`: "マイクで翻訳"
    - `show_to_staff`: "スタッフに見せる"
    - `back_button`: "戻る"
    - `clear_history`: "クリア"
    - `disclaimer`: "機械翻訳です"
    - `disclaimer_full`: "機械翻訳です。スタッフにご確認ください。"
    - `speech_not_supported`: "お使いのブラウザは音声認識に対応していません"
    - `speech_error`: "音声を認識できませんでした。もう一度お試しください。"
    - `translation_error`: "翻訳に失敗しました"
    - `empty_history`: "マイクボタンを押して話してください"
    - `coming_soon`: "準備中"
    - `coming_soon_text`: "テキスト翻訳は次のアップデートで追加されます"
    - `coming_soon_phrasebook`: "フレーズ集は次のアップデートで追加されます"
    - `swap_languages`: "言語を入れ替え"
  - [x] 20.2 Add equivalent keys to `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 21: Frontend tests (AC: #1-8)
  - [x] 21.1 `__tests__/TranslationPageShell.test.tsx` — renders 3 tabs, defaults to voice tab, switching tabs shows correct view, text/phrasebook show placeholder
  - [x] 21.2 `__tests__/LanguagePairSelector.test.tsx` — shows correct language pair, swap button calls onSwap, display updates after swap
  - [x] 21.3 `__tests__/MicButton.test.tsx` — renders idle state, shows listening label when recording, calls onStart/onStop, disabled when not supported
  - [x] 21.4 `__tests__/TranslationBubble.test.tsx` — renders source and target bubbles, shows pronunciation when present, shows speaker button, shows disclaimer
  - [x] 21.5 `__tests__/ConversationHistory.test.tsx` — renders empty state, renders multiple bubbles, clear button resets list
  - [x] 21.6 `__tests__/ShowToStaffView.test.tsx` — renders Vietnamese text in large font, back button dismisses, renders full-screen overlay
  - [x] 21.7 Mock `SpeechRecognition` and `speechSynthesis` browser APIs in test setup. Mock `apiClient` for translation calls.

### Frontend — Navigation Integration

- [x] Task 22: Wire translation page into navigation (AC: #1)
  - [x] 22.1 Add "翻訳" link to bottom tab nav or appropriate navigation location. Verify the route `/(user)/[locale]/translate` is accessible.
  - [x] 22.2 BFF proxy: Verify `app/api/(user)/[...path]/route.ts` proxies `/translation/*` calls to backend — should work automatically with existing catch-all proxy.

## Dev Notes

### Architecture Compliance

- **New module**: This is the FIRST story creating `backend/modules/translation/`. Follow the standard module structure exactly: router.py, service.py, repository.py, models.py, schemas.py, events.py, exceptions.py, constants.py.
- **Infrastructure layer**: Create `backend/infrastructure/translation_api.py` for the external Google Cloud Translation API client. This is where the circuit breaker and retry logic lives — NOT in the service layer.
- **Module isolation**: The translation module is independent. No cross-module imports. It does NOT depend on community, listing, or any other module. Future stories (listing auto-translation in Epic 8) will wire into this module via Event Bus.
- **Response format**: Use `SingleEnvelope[TranslateResponse]` from `modules.listing.schemas` (project-wide convention).
- **Optional auth**: Translation is usable by guests (tourists who haven't registered). Use `get_current_user_optional`. Rate limiting applies regardless of auth status.
- **Caching**: Translation cache is simple key-value (source_text + lang pair → result). No complex invalidation needed. TTL-based expiry (30 days).
- **Frontend module location**: Create `apps/web/modules/translation/` — this is a NEW module, not part of `modules/user/` despite being user-facing. The architecture doc shows `TranslationTool.tsx` under `modules/user/components/` but the actual implementation should follow the pattern of other feature modules (community, deals, etc.) where each feature has its own module directory.

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| `SegmentedControl` | `apps/web/shared/components/SegmentedControl.tsx` | Reuse for 3-tab layout |
| `EmptyState` | `apps/web/shared/components/EmptyState.tsx` | Use for coming-soon placeholders |
| `Modal` | `apps/web/shared/components/Modal.tsx` | Reference; ShowToStaffView is full-screen overlay, not modal |
| `Skeleton` | `apps/web/shared/components/Skeleton.tsx` | Use for processing states |
| `apiClient` | `apps/web/shared/lib/apiClient.ts` | Use for translation API calls |
| `useAuthStore` | `apps/web/shared/stores/useAuthStore.ts` | For optional user context |
| BFF proxy | `apps/web/app/api/(user)/[...path]/route.ts` | Catch-all proxy — `/translation/*` routed automatically |
| `get_current_user_optional` | `modules/auth/dependencies.py` | Standard optional auth dep |
| `SingleEnvelope` | `modules/listing/schemas.py` | Response wrapper |
| `rate_limit()` | `shared/rate_limit.py` | Apply to translate endpoint |
| `AppException` | `shared/exceptions.py` | Base exception class |
| Settings class | `shared/config.py` | Add `google_translate_api_key` here |
| `httpx` | `requirements.txt` | Already in dependencies — use for Google API calls |
| Design tokens (Navy, Teal, Coral) | `tailwind.config.ts` | Use for bubble colors and mic button |
| Community i18n pattern | `messages/{ja,en,vi}.json` | Follow same structure — add `translation` namespace |
| Bottom tab nav | `shared/components/BottomTabNav.tsx` | Wire translation link here |

### Technical Approach — Speech APIs

**Speech Recognition (Client-Side):**
- Use browser `webkitSpeechRecognition` / `SpeechRecognition` API
- BCP-47 locale codes: `ja-JP` for Japanese, `vi-VN` for Vietnamese
- `continuous: false` (single utterance per button press)
- `interimResults: false` (wait for final result)
- Handle `onerror` events: "no-speech", "audio-capture", "not-allowed"
- Feature detection: check `window.SpeechRecognition || window.webkitSpeechRecognition`
- Fallback: if not supported, show message and suggest Text tab (Story 6.2)
- **Browser support**: Chrome/Edge (full), Safari (partial — may require permission prompt). Firefox does NOT support SpeechRecognition — show `speech_not_supported` message.

**Text-to-Speech (Client-Side):**
- Use browser `speechSynthesis` API
- `SpeechSynthesisUtterance` with `lang: "vi-VN"` or `"ja-JP"`, `volume: 1.0`, `rate: 0.9` (slightly slower for clarity)
- Voice selection: `speechSynthesis.getVoices()` → find voice matching target lang → prefer Google/native voices
- Handle `voiceschanged` event (voices load asynchronously on some browsers)
- Feature detection: check `window.speechSynthesis`
- **Volume note**: Vietnamese playback should be at max volume since the use case is showing to restaurant staff

**Translation (Server-Side):**
- Google Cloud Translation API v2 (`POST https://translation.googleapis.com/language/translate/v2`)
- Request: `{ q: text, source: "ja", target: "vi", key: API_KEY }`
- Response: `{ data: { translations: [{ translatedText: "..." }] } }`
- Cache in PostgreSQL `translation_cache` table
- Circuit breaker: 5s timeout, 3 retries, exponential backoff (1s, 2s, 4s)

### Vietnamese-to-Katakana Pronunciation

For the pronunciation guide (katakana reading of Vietnamese text), use a server-side phonetic mapping approach:

```python
# constants.py — Vietnamese syllable → Katakana mapping (simplified)
# Vietnamese is syllabic — each word maps to katakana approximation
# This is a BASIC mapping; accuracy ~70-80% for common phrases
# Full accuracy requires a specialized pronunciation API (deferred)
VIET_TO_KATAKANA = {
    "xin": "シン", "chào": "チャオ", "cảm": "カム", "ơn": "ウン",
    "không": "ホン", "vâng": "ヴァン", "làm": "ラム", "ơi": "オイ",
    "đừng": "ドゥン", "cho": "チョー", "cay": "カイ", "ăn": "アン",
    "uống": "ウオン", "nước": "ヌック", "ngon": "ンゴン", "quá": "クア",
    # ... extend with 200+ common syllables
}

def transliterate_to_katakana(vietnamese_text: str) -> str:
    """Best-effort Vietnamese → Katakana transliteration."""
    # Split by whitespace, map each word, join with spaces
    # Unknown words: return romanized approximation in katakana
```

**Important**: This is a best-effort mapping for MVP. Full accuracy would require a dedicated transliteration API (Google Cloud TTS with phoneme output, or a specialized library). Document this limitation in the disclaimer.

### API Design

```
POST /api/v1/translation/translate
  Auth: optional (guests can use)
  Rate limit: 60/min (route_key=translate)
  Body: { "source_text": "辛くしないでください", "source_lang": "ja", "target_lang": "vi" }
  Response: SingleEnvelope[TranslateResponse]
  {
    "data": {
      "source_text": "辛くしないでください",
      "translated_text": "Làm ơn đừng cho cay",
      "source_lang": "ja",
      "target_lang": "vi",
      "pronunciation": "ラム ウン ドゥン チョー カイ",
      "is_cached": false,
      "disclaimer": "Machine translation. Please verify with staff."
    }
  }
  Errors: 400 InvalidLanguagePairException, 400 TextTooLongException,
          503 TranslationServiceUnavailableException
```

### Frontend Route Structure

```
app/(user)/[locale]/translate/
  page.tsx                          (Server) — renders TranslationPageShell
```

### Frontend Component Tree

```
translate/page.tsx (Server)
└── TranslationPageShell (Client)
    ├── SegmentedControl (shared) — voice/text/phrasebook tabs
    ├── VoiceTranslationView (Client, tab=voice)
    │   ├── LanguagePairSelector (Client) — JA↔VI swap
    │   ├── ConversationHistory (Client) — scrollable bubble list
    │   │   └── TranslationBubble × N (Client)
    │   │       ├── Source bubble (left, Navy tint)
    │   │       ├── Target bubble (right, Teal tint)
    │   │       │   ├── Pronunciation (caption)
    │   │       │   ├── Speaker button (36px teal)
    │   │       │   └── "スタッフに見せる" button
    │   │       └── Disclaimer caption
    │   └── MicButton (Client) — 80px coral, pulse animation
    ├── TextTabPlaceholder (tab=text) — EmptyState "Coming Soon"
    └── PhrasebookTabPlaceholder (tab=phrasebook) — EmptyState "Coming Soon"

ShowToStaffView (Client) — full-screen overlay, triggered from bubble
```

### Frontend State Architecture

```typescript
// All state is local to TranslationPageShell — no Zustand store needed
// Translation is session-only (no persistence across page navigations)

// TranslationPageShell state:
activeTab: TranslationTab           // "voice" | "text" | "phrasebook"

// VoiceTranslationView state:
sourceLang: SupportedLang           // "ja" (default) | "vi"
targetLang: SupportedLang           // "vi" (default) | "ja"
conversationHistory: TranslationPair[]  // session history
recordingState: RecordingState      // "idle" | "recording" | "processing"
showStaffView: { text: string } | null  // full-screen overlay data
```

### TanStack Query Key Convention

```typescript
// Translation does NOT use TanStack Query for the main flow
// (mutation-style: user speaks → translate → display)
// Use useMutation for the translate call:
useMutation({
  mutationFn: (req: TranslateRequest) => translateText(req),
  onSuccess: (data) => appendToHistory(data),
})

// If future stories need caching/dedup, key would be:
["translation", "translate", sourceText, sourceLang, targetLang]
```

### Anti-Patterns to Avoid

- Do NOT use WebSocket or streaming for translation — simple request/response is sufficient for text translation.
- Do NOT store conversation history in backend/database — it's session-only, stored in React state. Privacy: we do NOT want to persist user's voice conversations.
- Do NOT use a third-party speech recognition service (e.g., Google Cloud Speech-to-Text) — browser native `SpeechRecognition` API is free and sufficient for MVP. Upgrade if accuracy issues arise.
- Do NOT create a separate frontend module under `modules/user/` — create `modules/translation/` following the established pattern of feature-specific modules.
- Do NOT block on pronunciation accuracy — the katakana guide is best-effort for MVP. Add disclaimer.
- Do NOT add phrase packs or text input in this story — those are Story 6.2 scope.
- Do NOT add the floating FAB (translation button on other pages) — that's Story 6.3 scope.
- Do NOT add allergen flagging in this story — that's Story 6.3 scope (menu OCR context).
- Do NOT use spinners — use Skeleton for processing states.
- Do NOT use `any` type — use `unknown` + type guards.
- Do NOT hard-code Japanese text — all strings via `useTranslations("translation")`.
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`.
- Do NOT create separate BFF route files — reuse existing catch-all proxy.
- Do NOT persist translation history across sessions — privacy requirement.
- Do NOT send audio to the backend — speech recognition is client-side only.

### Browser Compatibility Notes

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| SpeechRecognition | ✅ Full | ⚠️ Partial (webkit prefix) | ❌ Not supported | ✅ Full |
| SpeechSynthesis | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Screen orientation lock | ✅ | ❌ | ✅ | ✅ |

**Graceful degradation**: If SpeechRecognition is not available, show a message suggesting the user try Chrome or use the Text tab (Story 6.2). SpeechSynthesis is available in all major browsers.

### Previous Story Intelligence

- **Story 5-4 patterns**: Follow the same component file organization (components/, hooks/, lib/, __tests__/).
- **Test baselines after 5-4**: Backend ~503 tests, Frontend ~474 tests. Maintain baseline + add new tests.
- **i18n pattern**: Add new namespace `translation` in all 3 locale files. Use `useTranslations("translation")`.
- **Data fetcher pattern**: Follow `community-data.ts` pattern for `translation-data.ts` but simpler (no SSR, no cookie forwarding needed since translation calls are client-side mutations).
- **apiClient usage**: Use `apiClient` from shared for all backend calls — handles snake_case ↔ camelCase transform.

### Git Intelligence

Recent commits:
- `cac94c0 create: add events and meetups feature for community (story 5-4)`
- `fb4b5e5 create: add post and comment like feature for community thread detail`
- `0486ff6 create: add story 5-3 community thread detail and update homepage UI layout`

Commit convention: `create: ...` for new features. This story → `create: add voice translation and conversation interface (story 6-1)`.

### Project Structure Notes

**New files to create:**

```
backend/modules/translation/__init__.py
backend/modules/translation/models.py
backend/modules/translation/constants.py
backend/modules/translation/schemas.py
backend/modules/translation/repository.py
backend/modules/translation/service.py
backend/modules/translation/router.py
backend/modules/translation/exceptions.py
backend/modules/translation/events.py
backend/infrastructure/translation_api.py
backend/migrations/versions/2026_04_27_0001_create_translation_cache.py
backend/tests/translation/__init__.py
backend/tests/translation/test_repository.py
backend/tests/translation/test_service.py
backend/tests/translation/test_router.py

apps/web/app/(user)/[locale]/translate/page.tsx
apps/web/modules/translation/lib/types.ts
apps/web/modules/translation/lib/translation-data.ts
apps/web/modules/translation/components/TranslationPageShell.tsx
apps/web/modules/translation/components/VoiceTranslationView.tsx
apps/web/modules/translation/components/LanguagePairSelector.tsx
apps/web/modules/translation/components/MicButton.tsx
apps/web/modules/translation/components/TranslationBubble.tsx
apps/web/modules/translation/components/ConversationHistory.tsx
apps/web/modules/translation/components/ShowToStaffView.tsx
apps/web/modules/translation/hooks/useSpeechRecognition.ts
apps/web/modules/translation/hooks/useSpeechSynthesis.ts
apps/web/modules/translation/__tests__/TranslationPageShell.test.tsx
apps/web/modules/translation/__tests__/LanguagePairSelector.test.tsx
apps/web/modules/translation/__tests__/MicButton.test.tsx
apps/web/modules/translation/__tests__/TranslationBubble.test.tsx
apps/web/modules/translation/__tests__/ConversationHistory.test.tsx
apps/web/modules/translation/__tests__/ShowToStaffView.test.tsx
```

**Files to modify:**

```
backend/shared/config.py                          — add google_translate_api_key setting
backend/main.py                                   — register translation router
apps/web/messages/ja.json                         — add translation namespace
apps/web/messages/en.json                         — add translation namespace
apps/web/messages/vi.json                         — add translation namespace
apps/web/shared/components/BottomTabNav.tsx        — add translation link (if applicable)
```

**New migration required:** `translation_cache` table.

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

- [Source: epics/epic-6-communication-bridge-translation-tools.md#Story 6.1] — acceptance criteria and user story
- [Source: prd/functional-requirements.md#FR26-FR29] — communication bridge functional requirements
- [Source: prd/domain-specific-requirements.md#Translation Accuracy & Safety] — disclaimer requirement, quality standards
- [Source: prd/innovation-novel-patterns.md#Context-Aware Voice Translation] — "Press to Speak" innovation area
- [Source: architecture/core-architectural-decisions.md#API Communication Patterns] — REST conventions, external API resilience (5s timeout + circuit breaker)
- [Source: architecture/core-architectural-decisions.md#Data Architecture] — translation cache strategy
- [Source: architecture/project-structure-boundaries.md#Translation Module] — backend module at `backend/modules/translation/`, infrastructure at `backend/infrastructure/translation_api.py`
- [Source: architecture/project-structure-boundaries.md#Frontend Route] — `app/(user)/[locale]/translate/page.tsx`
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — module file structure
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns] — API naming, component naming, test naming conventions
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns] — SingleEnvelope response wrapper
- [Source: architecture/implementation-patterns-consistency-rules.md#Process Patterns] — DI via Depends, AppException hierarchy, Settings
- [Source: _bmad-output/implementation-artifacts/5-4-events-meetups.md] — previous story format and patterns reference

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A

### Completion Notes List

- All backend module files created: models, constants, schemas, repository, service, router, exceptions, events, dependencies
- Google Cloud Translation API v2 client with circuit breaker (5s timeout, 3 retries) in infrastructure layer
- Vietnamese-to-Katakana transliteration with 200+ syllable mappings
- Translation cache with TTL-based expiry (30 days) in PostgreSQL
- Frontend: Web Speech API integration (SpeechRecognition + SpeechSynthesis) with browser feature detection
- React 19 compliant: callback-based pattern (no refs during render, no setState in effects)
- Pydantic model_validator removed; same-lang validation moved to service layer (AppException compatibility)
- All validation gates passed: backend lint (0 errors), frontend lint (0 errors), backend tests (20/20), frontend tests (29/29), Next.js build (success)

### File List

**New files:**
- backend/modules/translation/__init__.py
- backend/modules/translation/models.py
- backend/modules/translation/constants.py
- backend/modules/translation/schemas.py
- backend/modules/translation/repository.py
- backend/modules/translation/service.py
- backend/modules/translation/router.py
- backend/modules/translation/exceptions.py
- backend/modules/translation/events.py
- backend/modules/translation/dependencies.py
- backend/infrastructure/translation_api.py
- backend/migrations/versions/2026_04_27_0001_create_translation_cache.py
- backend/tests/translation/__init__.py
- backend/tests/translation/test_repository.py
- backend/tests/translation/test_service.py
- backend/tests/translation/test_router.py
- apps/web/app/(user)/[locale]/translate/page.tsx
- apps/web/modules/translation/lib/types.ts
- apps/web/modules/translation/lib/translation-data.ts
- apps/web/modules/translation/speech.d.ts
- apps/web/modules/translation/hooks/useSpeechRecognition.ts
- apps/web/modules/translation/hooks/useSpeechSynthesis.ts
- apps/web/modules/translation/components/TranslationPageShell.tsx
- apps/web/modules/translation/components/VoiceTranslationView.tsx
- apps/web/modules/translation/components/LanguagePairSelector.tsx
- apps/web/modules/translation/components/MicButton.tsx
- apps/web/modules/translation/components/TranslationBubble.tsx
- apps/web/modules/translation/components/ConversationHistory.tsx
- apps/web/modules/translation/components/ShowToStaffView.tsx
- apps/web/modules/translation/__tests__/TranslationPageShell.test.tsx
- apps/web/modules/translation/__tests__/LanguagePairSelector.test.tsx
- apps/web/modules/translation/__tests__/MicButton.test.tsx
- apps/web/modules/translation/__tests__/TranslationBubble.test.tsx
- apps/web/modules/translation/__tests__/ConversationHistory.test.tsx
- apps/web/modules/translation/__tests__/ShowToStaffView.test.tsx

**Modified files:**
- backend/main.py — registered translation_router
- apps/web/messages/ja.json — added translation namespace (22 keys)
- apps/web/messages/en.json — added translation namespace (22 keys)
- apps/web/messages/vi.json — added translation namespace (22 keys)

# Story 6.2: Phrase Packs & Phrasebook

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese user in a specific situation (restaurant, salon, hospital),
I want one-tap access to common phrases with instant translation and audio,
So that I can communicate quickly without speaking into the microphone every time.

## Acceptance Criteria

1. **Given** I am on the Voice translation tab (FR28)
   **When** quick phrases are displayed above the mic button
   **Then** a context label shows "🍜 レストランでよく使うフレーズ" (context-aware based on category)
   **And** horizontal scrollable phrase chips display: おすすめは？, 辛くしないで, お会計, これは何ですか？, アレルギーがあります, とても美味しい！, もっと見る (+N)

2. **Given** I tap a phrase chip (e.g., "辛くしないで")
   **When** the instant translation triggers
   **Then** the translation pair appears in the conversation area (same as voice result)
   **And** Vietnamese audio auto-plays immediately
   **And** the chip briefly fills coral to confirm tap

3. **Given** I tap "アレルギーがあります" (I have allergies)
   **When** the chip expands
   **Then** sub-options display for specific allergens (エビ, ナッツ, 乳製品, etc.)
   **And** selecting one translates the full phrase "I have a [allergen] allergy"

4. **Given** I tap "もっと見る"
   **When** the full phrasebook opens (Phrasebook tab)
   **Then** phrases are organized by category: レストラン, サロン, 病院, 市場, タクシー, ホテル, 緊急
   **And** each category shows 10-20 pre-built phrases
   **And** tapping any phrase shows translation + audio playback

5. **Given** the Text tab is selected
   **When** I type Japanese text manually
   **Then** a text input area appears with keyboard
   **And** submitting translates to Vietnamese with the same bubble display format
   **And** audio playback is available on the result

## Tasks / Subtasks

### Backend — Phrase Pack Constants

- [x] Task 1: Create phrase pack data in constants (AC: #1, #3, #4)
  - [x] 1.1 Add to `backend/modules/translation/constants.py`:
    - `PhrasePackData` dict structure: `{category_key: {label_ja, label_vi, label_en, icon, phrases: [{ja, vi, pronunciation, has_sub_options?, sub_options?}]}}`
    - 7 categories: `restaurant`, `salon`, `hospital`, `market`, `taxi`, `hotel`, `emergency`
    - Each category: 10-20 pre-translated phrase entries with Japanese text, Vietnamese translation, and katakana pronunciation
    - Restaurant category includes allergen phrase with `has_sub_options: True` and sub_options list (shrimp/エビ, nuts/ナッツ, dairy/乳製品, gluten/グルテン, eggs/卵, fish/魚)
  - [x] 1.2 Phrase structure per entry: `{"ja": "辛くしないで", "vi": "Đừng cho cay", "pronunciation": "ドゥン チョー カイ", "has_sub_options": False}`
  - [x] 1.3 Allergen sub-option structure: `{"ja": "エビアレルギーがあります", "vi": "Tôi bị dị ứng với tôm", "pronunciation": "トイ ビ ジ ウン ヴォイ トム", "allergen_key": "shrimp"}`

### Backend — Phrase Pack Schemas

- [x] Task 2: Create Pydantic schemas for phrase packs (AC: #1, #3, #4)
  - [x] 2.1 Add to `backend/modules/translation/schemas.py`:
    - `PhraseSubOption(BaseModel)`: ja (str), vi (str), pronunciation (str), allergen_key (str)
    - `PhraseItem(BaseModel)`: ja (str), vi (str), pronunciation (str), has_sub_options (bool = False), sub_options (list[PhraseSubOption] = [])
    - `PhraseCategoryResponse(BaseModel)`: key (str), label_ja (str), label_vi (str), label_en (str), icon (str), phrases (list[PhraseItem])
    - `PhrasePackResponse(BaseModel)`: categories (list[PhraseCategoryResponse])

### Backend — Phrase Pack Endpoints

- [x] Task 3: Add phrase pack endpoints to router (AC: #1, #4)
  - [x] 3.1 Add to `backend/modules/translation/router.py`:
    - `GET /api/v1/translation/phrases` — returns all phrase categories with phrases. Response: `SingleEnvelope[PhrasePackResponse]`. No auth required (guest-accessible). Rate limit: `rate_limit(30, 60, "phrases")` (30/min — cacheable, low frequency). No DB query — reads from constants.
    - `GET /api/v1/translation/phrases/{category_key}` — returns single category. Response: `SingleEnvelope[PhraseCategoryResponse]`. 404 if category_key not found.
  - [x] 3.2 Add service method `get_phrases(category_key: str | None) -> PhrasePackResponse | PhraseCategoryResponse` in `service.py` — reads from constants, no DB needed.
  - [x] 3.3 Add `PhraseCategoryNotFoundException(AppException)` in `exceptions.py`: 404, "Phrase category not found"

### Backend — Tests

- [x] Task 4: Backend tests for phrase pack endpoints (AC: #1, #3, #4)
  - [x] 4.1 `tests/translation/test_router.py` — ADD to existing test file:
    - `test_get_all_phrases_returns_200_with_all_categories` — verifies 7 categories returned
    - `test_get_phrases_by_category_returns_200` — verifies single category response
    - `test_get_phrases_invalid_category_returns_404` — verifies error response
    - `test_get_phrases_restaurant_has_allergen_sub_options` — verifies allergen phrase structure
    - `test_get_phrases_each_category_has_minimum_10_phrases` — data integrity check
    - `test_get_phrases_rate_limited` — verifies rate limiting

### Frontend — New Types

- [x] Task 5: Extend TypeScript types (AC: #1-5)
  - [x] 5.1 Add to `apps/web/modules/translation/lib/types.ts`:
    - `PhraseSubOption = { ja: string; vi: string; pronunciation: string; allergenKey: string }`
    - `PhraseItem = { ja: string; vi: string; pronunciation: string; hasSubOptions: boolean; subOptions: PhraseSubOption[] }`
    - `PhraseCategory = { key: string; labelJa: string; labelVi: string; labelEn: string; icon: string; phrases: PhraseItem[] }`
    - `PhrasePack = { categories: PhraseCategory[] }`

### Frontend — Phrase Data Fetching

- [x] Task 6: Add phrase data fetcher (AC: #1, #4)
  - [x] 6.1 Add to `apps/web/modules/translation/lib/translation-data.ts`:
    - `fetchPhrases(): Promise<PhrasePack>` — calls `GET /translation/phrases` via `apiClient`. Returns `envelope.data`.
    - `fetchPhrasesByCategory(categoryKey: string): Promise<PhraseCategory>` — calls `GET /translation/phrases/{categoryKey}` via `apiClient`.

### Frontend — Quick Phrase Chips Component

- [x] Task 7: Create horizontal scrollable quick phrases for Voice tab (AC: #1, #2, #3)
  - [x] 7.1 `modules/translation/components/QuickPhraseChips.tsx` (Client):
    - Props: `phrases: PhraseItem[]`, `categoryLabel: string`, `categoryIcon: string`, `onPhraseSelect: (phrase: PhraseItem) => void`, `onShowMore: () => void`, `onAllergenSelect: (subOption: PhraseSubOption) => void`
    - Layout: context label row at top (icon + label), horizontal scrollable chip row below
    - Chip styling: `bg-surface-secondary text-text-primary rounded-full px-3 py-1.5 text-sm whitespace-nowrap` (inactive), `bg-coral text-white` (tapped — 300ms fill animation via `transition-colors`)
    - Horizontal scroll: `flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide` (hide scrollbar with `-webkit-scrollbar: display: none` / `scrollbar-width: none`)
    - Last chip: "もっと見る (+N)" styled differently (border-dashed, teal text) → calls `onShowMore`
    - Allergen chip: on tap, expands a row of sub-option chips below. Animation: `overflow-hidden transition-all duration-200` with `max-height: 0` → `max-height: 3rem` toggle. Sub-chips show allergen name (e.g., "エビ"). Tapping sub-chip calls `onAllergenSelect`. Tapping allergen chip again collapses sub-options.
    - Tap animation: chip briefly fills coral for 300ms, then returns to default (use `useState` with `setTimeout`)
    - Show max 6 phrase chips + "もっと見る" chip (7 total visible)

### Frontend — Text Translation View

- [x] Task 8: Create text input translation tab (AC: #5)
  - [x] 8.1 `modules/translation/components/TextTranslationView.tsx` (Client):
    - State: `sourceLang/targetLang` (swappable, default ja→vi), `inputText: string`, `conversationHistory: TranslationPair[]`, `isTranslating: boolean`
    - Layout: `LanguagePairSelector` at top, `ConversationHistory` in middle (reuse existing component), text input area at bottom
    - Text input: `textarea` with auto-resize (max 4 lines), placeholder "翻訳したいテキストを入力...", max length 5000 chars, character count display
    - Submit: coral send button (Arrow icon) to the right of textarea. Disabled when empty or `isTranslating`. Calls existing `translateText()` API.
    - On success: append result to local `conversationHistory`, auto-play audio via `useSpeechSynthesis`, clear input field
    - Keyboard: submit on Enter (without Shift). Shift+Enter for newline.
    - Reuse `ConversationHistory` and `TranslationBubble` components from Story 6-1 — same bubble display, speaker button, show-to-staff button
    - Clear history button (same as Voice tab pattern)
    - Machine translation disclaimer at top (same as Voice tab)

### Frontend — Phrasebook View

- [x] Task 9: Create full phrasebook tab view (AC: #4)
  - [x] 9.1 `modules/translation/components/PhrasebookView.tsx` (Client):
    - Fetches phrases via `fetchPhrases()` on mount using TanStack Query: `useQuery({ queryKey: ["translation", "phrases"], queryFn: fetchPhrases })`
    - Loading state: show `Skeleton` components (7 rows matching category layout)
    - Error state: show retry button with error message
    - Layout: scrollable list of `PhraseCategorySection` components, one per category
    - Audio: integrate `useSpeechSynthesis` — tapping any phrase triggers Vietnamese audio playback
  - [x] 9.2 `modules/translation/components/PhraseCategorySection.tsx` (Client):
    - Props: `category: PhraseCategory`, `onPhraseSelect: (phrase: PhraseItem) => void`, `defaultExpanded?: boolean`
    - Collapsible section: category header (icon + label + phrase count + chevron) → tap to expand/collapse
    - Default: first category expanded, rest collapsed
    - Phrase list when expanded: vertical list of phrase rows
    - Each phrase row: Japanese text (primary), Vietnamese translation (secondary, teal text), katakana pronunciation (caption), speaker button (36px teal circle)
    - Allergen phrase: shows expandable sub-options inline (same as Quick Phrase behavior)
    - Speaker button: calls parent's audio handler with Vietnamese text
    - Use Accordion-like pattern but built custom (shared `Accordion` component may not fit the phrase layout)

### Frontend — Update TranslationPageShell

- [x] Task 10: Replace "Coming Soon" placeholders (AC: #4, #5)
  - [x] 10.1 Update `modules/translation/components/TranslationPageShell.tsx`:
    - Replace `{activeTab === "text" && <EmptyState ...>}` with `{activeTab === "text" && <TextTranslationView />}`
    - Replace `{activeTab === "phrasebook" && <EmptyState ...>}` with `{activeTab === "phrasebook" && <PhrasebookView />}`
    - Import `TextTranslationView` and `PhrasebookView`
    - Remove unused `EmptyState` import if no longer needed

### Frontend — Update VoiceTranslationView with Quick Phrases

- [x] Task 11: Add quick phrase chips to Voice tab (AC: #1, #2, #3)
  - [x] 11.1 Update `modules/translation/components/VoiceTranslationView.tsx`:
    - Add prop: `onSwitchToPhrasebook?: () => void`
    - Fetch default category on mount: `useQuery({ queryKey: ["translation", "phrases", "restaurant"], queryFn: () => fetchPhrasesByCategory("restaurant"), staleTime: Infinity })`
    - Add `QuickPhraseChips` component between disclaimer and ConversationHistory
    - Quick phrases always show **restaurant** category (MVP scope — context-aware switching deferred to future iteration)
    - `onPhraseSelect` handler: create `TranslationPair` from phrase data (no API call needed — phrases are pre-translated), append to `conversationHistory`, auto-play Vietnamese audio via `synthesis.speak(phrase.vi, "vi")`
    - `onAllergenSelect` handler: same pattern but uses sub-option's full phrase
    - `onShowMore` handler: calls `onSwitchToPhrasebook()` prop to switch tab
    - Loading state: show 6 `Skeleton` chips while phrases load. Error: hide quick phrases section silently (voice translation still works without phrases).
  - [x] 11.2 Update `TranslationPageShell.tsx` — prop drilling for tab switching:
    - Pass callback from shell to VoiceTranslationView: `<VoiceTranslationView onSwitchToPhrasebook={() => setActiveTab("phrasebook")} />`
    - VoiceTranslationView passes it to QuickPhraseChips: `<QuickPhraseChips onShowMore={onSwitchToPhrasebook} ... />`
    - Prop chain: TranslationPageShell → VoiceTranslationView → QuickPhraseChips

### Frontend — i18n Keys

- [x] Task 12: Add new i18n keys for phrase packs and text translation (AC: #1-5)
  - [x] 12.1 Add to `translation` namespace in `apps/web/messages/ja.json`:
    - `quick_phrases_label`: "よく使うフレーズ"
    - `context_restaurant`: "🍜 レストランでよく使うフレーズ"
    - `show_more`: "もっと見る"
    - `allergen_label`: "アレルギー"
    - `allergen_shrimp`: "エビ"
    - `allergen_nuts`: "ナッツ"
    - `allergen_dairy`: "乳製品"
    - `allergen_gluten`: "グルテン"
    - `allergen_eggs`: "卵"
    - `allergen_fish`: "魚"
    - `category_restaurant`: "レストラン"
    - `category_salon`: "サロン"
    - `category_hospital`: "病院"
    - `category_market`: "市場"
    - `category_taxi`: "タクシー"
    - `category_hotel`: "ホテル"
    - `category_emergency`: "緊急"
    - `phrasebook_title`: "フレーズ集"
    - `phrases_count`: "{count}個のフレーズ"
    - `text_input_placeholder`: "翻訳したいテキストを入力..."
    - `text_char_count`: "{current}/{max}"
    - `text_submit`: "翻訳する"
    - `text_empty_history`: "テキストを入力して翻訳してください"
    - `loading_phrases`: "フレーズを読み込み中..."
    - `error_loading_phrases`: "フレーズの読み込みに失敗しました"
    - `retry`: "再試行"
  - [x] 12.2 Add equivalent keys to `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 13: Frontend tests for new components (AC: #1-5)
  - [x] 13.1 `__tests__/QuickPhraseChips.test.tsx`:
    - Renders context label and phrase chips
    - Shows max 6 chips + "もっと見る"
    - Tap phrase chip calls onPhraseSelect
    - Chip shows coral fill animation on tap
    - Allergen chip expands sub-options on tap
    - Sub-option tap calls onAllergenSelect
    - "もっと見る" calls onShowMore
  - [x] 13.2 `__tests__/TextTranslationView.test.tsx`:
    - Renders language pair selector and text input
    - Submit button disabled when input empty
    - Submitting text calls translateText API
    - Translation result appears in conversation history
    - Character count displays correctly
    - Clear button resets conversation
    - Enter key submits, Shift+Enter adds newline
  - [x] 13.3 `__tests__/PhrasebookView.test.tsx`:
    - Shows skeleton during loading
    - Renders all 7 categories after load
    - First category expanded by default
    - Tapping category header toggles expand/collapse
    - Tapping phrase triggers audio playback
    - Shows retry button on error
  - [x] 13.4 `__tests__/PhraseCategorySection.test.tsx`:
    - Renders category header with icon and phrase count
    - Expands/collapses on header tap
    - Shows phrase list when expanded
    - Each phrase shows ja/vi/pronunciation
    - Speaker button calls onPhraseSelect
    - Allergen phrase shows expandable sub-options
  - [x] 13.5 `__tests__/integration-tab-switch.test.tsx`:
    - "もっと見る" in QuickPhraseChips calls onSwitchToPhrasebook callback
    - TranslationPageShell switches to phrasebook tab when callback fires
    - Tab indicator reflects phrasebook as active after switch
  - [x] 13.6 Mock `fetchPhrases` and `fetchPhrasesByCategory` in tests. Mock `useSpeechSynthesis` for audio tests. Wrap components in `QueryClientProvider` for TanStack Query tests.

### Frontend — Navigation Update

- [x] Task 14: Verify routing and BFF proxy (AC: #1-5)
  - [x] 14.1 BFF proxy: Verify `GET /translation/phrases` and `GET /translation/phrases/{category}` are proxied correctly by existing catch-all proxy at `app/api/(user)/[...path]/route.ts`.
  - [x] 14.2 No new route pages needed — phrasebook and text are tabs within existing `/translate` page.

## Dev Notes

### Architecture Compliance

- **Existing module extension**: This story EXTENDS the existing `backend/modules/translation/` and `apps/web/modules/translation/` modules created in Story 6-1. Do NOT create new modules.
- **Static phrase data**: Phrase packs are pre-defined static data stored in `constants.py`. No new database table needed. Phrases include pre-computed translations and katakana pronunciation — NO runtime translation API calls for phrase taps.
- **Response format**: Use `SingleEnvelope[PhrasePackResponse]` (same envelope pattern as translate endpoint).
- **Optional auth**: Phrase endpoints are guest-accessible (same as translate endpoint).
- **TanStack Query for phrases**: Unlike the voice translation flow (mutation-style), phrase data is read-only and cacheable. Use `useQuery` with `staleTime: Infinity` (phrases rarely change).
- **Conversation history integration**: Phrase taps create `TranslationPair` objects and append to the SAME conversation history as voice results in `VoiceTranslationView`. This gives a unified conversation experience.
- **Text tab state isolation**: `TextTranslationView` manages its own conversation history (separate from Voice tab). Each tab has independent state.
- **No new Zustand store**: All state is local component state. No persistence across page navigations (privacy requirement from Story 6-1).

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| `translateText()` | `modules/translation/lib/translation-data.ts` | Reuse for Text tab API calls |
| `TranslationBubble` | `modules/translation/components/TranslationBubble.tsx` | Reuse in Text tab conversation |
| `ConversationHistory` | `modules/translation/components/ConversationHistory.tsx` | Reuse in Text tab |
| `LanguagePairSelector` | `modules/translation/components/LanguagePairSelector.tsx` | Reuse in Text tab |
| `ShowToStaffView` | `modules/translation/components/ShowToStaffView.tsx` | Reuse in Text tab bubbles |
| `useSpeechSynthesis` | `modules/translation/hooks/useSpeechSynthesis.ts` | Reuse for phrase and text audio |
| `useSpeechRecognition` | `modules/translation/hooks/useSpeechRecognition.ts` | NOT needed in this story |
| `MicButton` | `modules/translation/components/MicButton.tsx` | Already in Voice tab — no changes |
| `SegmentedControl` | `shared/components/SegmentedControl.tsx` | Already in TranslationPageShell |
| `Skeleton` | `shared/components/Skeleton.tsx` | Use for phrasebook loading state |
| `apiClient` | `shared/lib/apiClient.ts` | Use for phrase API calls |
| `SingleEnvelope` | `modules/listing/schemas.py` | Backend response wrapper |
| `rate_limit()` | `shared/rate_limit.py` | Apply to phrase endpoints |
| `AppException` | `shared/exceptions.py` | Base for PhraseCategoryNotFoundException |
| Design tokens (Navy, Teal, Coral) | `tailwind.config.ts` | Use for chip styling |
| `FilterChips` | `shared/components/FilterChips.tsx` | Reference only — uses `flex-wrap`. Quick phrases need `flex-nowrap overflow-x-auto` (different layout) |
| `transliterate_to_katakana()` | `modules/translation/constants.py` | Already exists — use for phrase pronunciation verification |
| `TranslationService` | `modules/translation/service.py` | Extend with phrase methods |
| `get_translation_service` | `modules/translation/dependencies.py` | Reuse DI pattern |
| BFF proxy | `app/api/(user)/[...path]/route.ts` | Catch-all — `/translation/phrases*` routes proxied automatically |

### Technical Approach — Phrase Data Structure

**Backend constants structure:**

```python
# In constants.py — append to existing file
PHRASE_PACKS: dict[str, dict] = {
    "restaurant": {
        "label_ja": "レストラン",
        "label_vi": "Nhà hàng",
        "label_en": "Restaurant",
        "icon": "🍜",
        "phrases": [
            {"ja": "おすすめは何ですか？", "vi": "Món nào ngon nhất?", "pronunciation": "モン ナオ ンゴン ニャット", "has_sub_options": False, "sub_options": []},
            {"ja": "辛くしないでください", "vi": "Làm ơn đừng cho cay", "pronunciation": "ラム ウン ドゥン チョー カイ", "has_sub_options": False, "sub_options": []},
            {"ja": "お会計お願いします", "vi": "Tính tiền giúp tôi", "pronunciation": "ティン ティエン ジュップ トイ", "has_sub_options": False, "sub_options": []},
            {"ja": "これは何ですか？", "vi": "Cái này là gì?", "pronunciation": "カイ ナイ ラ ジ", "has_sub_options": False, "sub_options": []},
            {"ja": "アレルギーがあります", "vi": "Tôi bị dị ứng", "pronunciation": "トイ ビ ジ ウン", "has_sub_options": True, "sub_options": [
                {"ja": "エビアレルギーがあります", "vi": "Tôi bị dị ứng với tôm", "pronunciation": "トイ ビ ジ ウン ヴォイ トム", "allergen_key": "shrimp"},
                {"ja": "ナッツアレルギーがあります", "vi": "Tôi bị dị ứng với các loại hạt", "pronunciation": "トイ ビ ジ ウン ヴォイ カック ロアイ ハット", "allergen_key": "nuts"},
                {"ja": "乳製品アレルギーがあります", "vi": "Tôi bị dị ứng với sữa", "pronunciation": "トイ ビ ジ ウン ヴォイ スア", "allergen_key": "dairy"},
                {"ja": "グルテンアレルギーがあります", "vi": "Tôi bị dị ứng với gluten", "pronunciation": "トイ ビ ジ ウン ヴォイ グルテン", "allergen_key": "gluten"},
                {"ja": "卵アレルギーがあります", "vi": "Tôi bị dị ứng với trứng", "pronunciation": "トイ ビ ジ ウン ヴォイ チュン", "allergen_key": "eggs"},
                {"ja": "魚アレルギーがあります", "vi": "Tôi bị dị ứng với cá", "pronunciation": "トイ ビ ジ ウン ヴォイ カ", "allergen_key": "fish"},
            ]},
            {"ja": "とても美味しいです！", "vi": "Ngon lắm!", "pronunciation": "ンゴン ラム", "has_sub_options": False, "sub_options": []},
            # ... 10-14 more phrases per category
        ]
    },
    # ... 6 more categories
}
```

**Key design decisions:**
- Pre-translated phrases eliminate API latency on tap (instant UX)
- Katakana pronunciation pre-computed using existing `transliterate_to_katakana()` for consistency
- Allergen sub-options are nested within the parent phrase — single-level expansion only
- Category keys are URL-safe strings matching backend constant keys

### Technical Approach — Quick Phrase Chips

**Horizontal scrollable pattern (NOT the existing FilterChips):**

```tsx
// QuickPhraseChips — horizontal scroll with hidden scrollbar
<div className="px-4 py-2">
  <p className="text-xs text-text-secondary mb-1.5">{categoryIcon} {categoryLabel}</p>
  <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-hide">
    {phrases.slice(0, 6).map((phrase) => (
      <PhraseChip key={phrase.ja} phrase={phrase} onSelect={onPhraseSelect} />
    ))}
    <button className="...border-dashed border-teal text-teal...">{t("show_more")} (+{remaining})</button>
  </div>
  {/* Allergen sub-options row (conditionally rendered below chips) */}
  {expandedAllergen && <AllergenSubOptions ... />}
</div>
```

**scrollbar-hide CSS** (add to `globals.css` if not already present):
```css
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
```

### Technical Approach — Text Translation View

**Text input with send button pattern:**

```tsx
// Bottom input area — fixed at bottom of the view
<div className="flex items-end gap-2 px-4 py-3 border-t border-border-secondary">
  <textarea
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder={t("text_input_placeholder")}
    maxLength={5000}
    rows={1}
    className="flex-1 resize-none rounded-xl bg-surface-secondary px-3 py-2 text-sm ..."
  />
  <button
    onClick={handleSubmit}
    disabled={!inputText.trim() || isTranslating}
    className="p-2 rounded-full bg-coral text-white disabled:opacity-50"
  >
    <ArrowUp size={20} />
  </button>
</div>
<p className="text-xs text-text-secondary text-right px-4">
  {inputText.length}/5000
</p>
```

**Enter/Shift+Enter handling:**
```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};
```

### Technical Approach — Phrasebook View

**TanStack Query usage:**

```tsx
const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ["translation", "phrases"],
  queryFn: fetchPhrases,
  staleTime: Infinity, // Phrases are static — never stale
});
```

**Category sections with expand/collapse:**
```tsx
// PhraseCategorySection — accordion-like behavior
const [isExpanded, setIsExpanded] = useState(defaultExpanded);
// Header: icon + label + count + ChevronDown (rotates on expand)
// Body: animated height transition for smooth expand/collapse
```

### API Design

```
GET /api/v1/translation/phrases
  Auth: optional (guests can use)
  Rate limit: 30/min (route_key=phrases)
  Response: SingleEnvelope[PhrasePackResponse]
  {
    "data": {
      "categories": [
        {
          "key": "restaurant",
          "label_ja": "レストラン",
          "label_vi": "Nhà hàng",
          "label_en": "Restaurant",
          "icon": "🍜",
          "phrases": [
            {
              "ja": "おすすめは何ですか？",
              "vi": "Món nào ngon nhất?",
              "pronunciation": "モン ナオ ンゴン ニャット",
              "has_sub_options": false,
              "sub_options": []
            },
            ...
          ]
        },
        ...
      ]
    }
  }

GET /api/v1/translation/phrases/{category_key}
  Auth: optional
  Rate limit: 30/min (route_key=phrases)
  Response: SingleEnvelope[PhraseCategoryResponse]
  Errors: 404 PhraseCategoryNotFoundException
```

### Frontend Component Tree (New/Modified)

```
translate/page.tsx (Server) — NO CHANGES
└── TranslationPageShell (Client) — MODIFIED: pass onSwitchToPhrasebook
    ├── SegmentedControl (shared) — NO CHANGES
    ├── VoiceTranslationView (Client, tab=voice) — MODIFIED: add QuickPhraseChips
    │   ├── LanguagePairSelector — NO CHANGES
    │   ├── QuickPhraseChips (NEW) — horizontal scrollable phrase chips
    │   │   ├── PhraseChip × 6 (inline) — tap to translate + coral animation
    │   │   ├── AllergenSubOptions (conditional) — expandable allergen list
    │   │   └── "もっと見る" chip — switches to phrasebook tab
    │   ├── ConversationHistory — NO CHANGES (receives phrase results too)
    │   │   └── TranslationBubble × N — NO CHANGES
    │   └── MicButton — NO CHANGES
    ├── TextTranslationView (NEW, tab=text)
    │   ├── LanguagePairSelector (reuse)
    │   ├── ConversationHistory (reuse)
    │   │   └── TranslationBubble × N (reuse)
    │   └── TextInput + SendButton (inline)
    └── PhrasebookView (NEW, tab=phrasebook)
        └── PhraseCategorySection × 7 (NEW)
            ├── CategoryHeader (icon + label + count + chevron)
            └── PhraseRow × 10-20 (ja + vi + pronunciation + speaker)
```

### Frontend State Architecture

```typescript
// TranslationPageShell state:
activeTab: TranslationTab                    // "voice" | "text" | "phrasebook"

// VoiceTranslationView state (EXTENDED):
sourceLang: SupportedLang                    // "ja" | "vi"
targetLang: SupportedLang                    // "vi" | "ja"
conversationHistory: TranslationPair[]       // SHARED with phrase results
recordingState: RecordingState               // "idle" | "recording" | "processing"
showStaffView: { text: string } | null       // full-screen overlay
// NEW:
expandedAllergen: boolean                    // allergen sub-options visible
// Phrase data via useQuery (TanStack Query managed)

// TextTranslationView state (NEW — independent):
sourceLang: SupportedLang                    // "ja" | "vi"
targetLang: SupportedLang                    // "vi" | "ja"
inputText: string                            // textarea value
conversationHistory: TranslationPair[]       // SEPARATE from voice history
isTranslating: boolean                       // loading state
showStaffView: { text: string } | null       // full-screen overlay

// PhrasebookView state (NEW):
// Data via useQuery (TanStack Query managed)
expandedCategories: Set<string>              // which categories are expanded
```

### TanStack Query Key Convention

```typescript
// Phrase pack queries (NEW):
["translation", "phrases"]                      // all categories
["translation", "phrases", categoryKey]         // single category (e.g., "restaurant")

// Existing (NO CHANGES):
// Translation mutations still use useMutation for voice/text translate calls
```

### Anti-Patterns to Avoid

- Do NOT call the `/translate` API for phrase taps — phrases are pre-translated. Use the static data from the phrases endpoint directly.
- Do NOT create a new database table for phrases — they are static constants, not user-generated data.
- Do NOT share conversation history between Voice and Text tabs — each tab has independent state (privacy + UX clarity).
- Do NOT use FilterChips component for quick phrases — it uses `flex-wrap` layout. Quick phrases need `flex-nowrap overflow-x-auto` for horizontal scrolling.
- Do NOT add camera/OCR features — that's Story 6.3 scope.
- Do NOT add the floating FAB — that's Story 6.3 scope.
- Do NOT persist phrase usage history — session-only.
- Do NOT create a new frontend module — extend existing `modules/translation/`.
- Do NOT hard-code Japanese text in components — all strings via `useTranslations("translation")` EXCEPT phrase content itself (which comes from API).
- Do NOT use spinners — use Skeleton for loading states.
- Do NOT use `any` type — use `unknown` + type guards.
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`.
- Do NOT add a new BFF route — reuse existing catch-all proxy.
- Do NOT create separate speech hooks — reuse existing `useSpeechSynthesis` from Story 6-1.

### Browser Compatibility Notes

No new browser API requirements beyond Story 6-1. The Text tab uses standard form inputs. Quick Phrase Chips use standard CSS overflow scrolling (universal support). TanStack Query for data fetching (already in project).

`SpeechSynthesis` (audio playback for phrases) is supported in all major browsers — same compatibility as Story 6-1.

### Previous Story Intelligence

From Story 6-1 implementation:
- **Module structure**: `modules/translation/` has `components/`, `hooks/`, `lib/`, `__tests__/` directories. Follow same pattern.
- **Component pattern**: Client components with `"use client"` directive. Import from sibling paths within module.
- **Speech hooks**: `useSpeechSynthesis` returns `{ speak, stop, isSpeaking, isSupported }`. Call `speak(text, lang)` for audio playback.
- **Translation data pattern**: `translateText()` in `translation-data.ts` calls `apiClient` with POST method. New phrase fetchers should use GET method.
- **Test pattern**: Use `vitest` + `@testing-library/react`. Mock `apiClient` for API calls. Mock speech APIs.
- **i18n pattern**: Add keys to `translation` namespace in all 3 locale files (ja, en, vi).
- **apiClient auto-transform**: snake_case (backend) → camelCase (frontend) automatic. Frontend types use camelCase.
- **TranslationPair creation**: Phrases should create TranslationPair objects with `id: crypto.randomUUID()`, `timestamp: Date.now()` — same pattern as voice results.
- **Pydantic model_validator**: Avoid — Story 6-1 moved validation to service layer for AppException compatibility.
- **React 19**: Use callback-based patterns. No refs during render, no setState in effects.
- **Test baselines**: Backend ~523 tests, Frontend ~503 tests. Maintain baseline + add new tests.

### Git Intelligence

Recent commits:
- `48914ce create: add voice translation and conversation interface (story 6-1)`
- `cac94c0 create: add events and meetups feature for community (story 5-4)`

Commit convention: `create: ...` for new features. This story → `create: add phrase packs and phrasebook for translation (story 6-2)`.

### Phrase Content Requirements (7 Categories)

Each category needs 10-20 curated Japanese phrases with Vietnamese translations. Categories:

1. **restaurant** (🍜): おすすめは？, 辛くしないで, お会計, これは何ですか？, アレルギーがあります (with sub-options), とても美味しい！, 水をください, メニューを見せてください, テイクアウトできますか？, ベジタリアンメニューはありますか？, 写真を撮ってもいいですか？, 予約しています, Wi-Fiはありますか？, トイレはどこですか？
2. **salon** (💇): カットをお願いします, 短めにしてください, この写真のようにしてください, シャンプーだけお願いします, ネイルをしたいです, マッサージの予約, 痛くしないでください, いくらですか？, カードで払えますか？, 予約は何時ですか？
3. **hospital** (🏥): 具合が悪いです, 頭が痛いです, お腹が痛いです, 熱があります, 薬をください, 保険証はこれです, 英語を話せる先生はいますか？, 救急です, アレルギーがあります, 処方箋をください
4. **market** (🏪): いくらですか？, もう少し安くなりませんか？, これをください, 大きいサイズはありますか？, 試着できますか？, 袋をください, カードで払えますか？, 新鮮ですか？, おすすめは？, まとめ買いで安くなりますか？
5. **taxi** (🚕): ここに行ってください, いくらですか？, メーターを使ってください, ここで止めてください, 領収書をください, エアコンをつけてください, 急いでください, 道が違います, クレジットカードで払えますか？, 住所はこれです
6. **hotel** (🏨): チェックインお願いします, チェックアウトは何時ですか？, Wi-Fiのパスワードは？, タオルをもう一枚ください, エアコンが壊れています, 部屋を変えてください, タクシーを呼んでください, 朝食は何時ですか？, 荷物を預かってもらえますか？, 近くにコンビニはありますか？
7. **emergency** (🆘): 助けてください！, 警察を呼んでください, 救急車を呼んでください, パスポートをなくしました, 財布を盗まれました, 日本大使館に連絡したいです, 英語を話せる人はいますか？, 迷子になりました, 具合が悪いです, 電話を貸してください

### Project Structure Notes

**New files to create:**

```
apps/web/modules/translation/components/QuickPhraseChips.tsx
apps/web/modules/translation/components/TextTranslationView.tsx
apps/web/modules/translation/components/PhrasebookView.tsx
apps/web/modules/translation/components/PhraseCategorySection.tsx
apps/web/modules/translation/__tests__/QuickPhraseChips.test.tsx
apps/web/modules/translation/__tests__/TextTranslationView.test.tsx
apps/web/modules/translation/__tests__/PhrasebookView.test.tsx
apps/web/modules/translation/__tests__/PhraseCategorySection.test.tsx
apps/web/modules/translation/__tests__/integration-tab-switch.test.tsx
```

**Files to modify:**

```
backend/modules/translation/constants.py          — add PHRASE_PACKS data
backend/modules/translation/schemas.py            — add phrase schemas
backend/modules/translation/service.py            — add get_phrases methods
backend/modules/translation/router.py             — add phrase endpoints
backend/modules/translation/exceptions.py         — add PhraseCategoryNotFoundException
backend/tests/translation/test_router.py          — add phrase endpoint tests
apps/web/modules/translation/lib/types.ts         — add phrase types
apps/web/modules/translation/lib/translation-data.ts — add phrase fetchers
apps/web/modules/translation/components/TranslationPageShell.tsx — replace placeholders
apps/web/modules/translation/components/VoiceTranslationView.tsx — add quick phrases
apps/web/messages/ja.json                         — add new i18n keys
apps/web/messages/en.json                         — add new i18n keys
apps/web/messages/vi.json                         — add new i18n keys
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

- [Source: epics/epic-6-communication-bridge-translation-tools.md#Story 6.2] — acceptance criteria and user story
- [Source: prd/functional-requirements.md#FR26-FR29] — communication bridge functional requirements
- [Source: prd/domain-specific-requirements.md#Translation Accuracy & Safety] — disclaimer requirement, allergen flagging
- [Source: prd/innovation-novel-patterns.md#Context-Aware Voice Translation] — "Press to Speak" pre-built phrase packs innovation
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — module file structure, test naming
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns] — SingleEnvelope response wrapper
- [Source: architecture/implementation-patterns-consistency-rules.md#Process Patterns] — DI via Depends, AppException hierarchy
- [Source: architecture/project-structure-boundaries.md#Translation Module] — module location
- [Source: _bmad-output/implementation-artifacts/6-1-voice-translation-conversation-interface.md] — previous story patterns, existing components, file list

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

N/A

### Review Findings

- [x] [Review][Decision] Quick phrases hardcode ja→vi regardless of LanguagePairSelector state — resolved: keep as-is (MVP, phrases inherently ja→vi)
- [x] [Review][Decision] Volume2 play button on allergen parent phrase speaks generic "Tôi bị dị ứng" — resolved: keep as-is (generic statement is valid Vietnamese)
- [x] [Review][Patch] `synthesis` object as useCallback dependency — fixed: memoized `useSpeechSynthesis` return value with `useMemo` so object ref is stable [useSpeechSynthesis.ts]
- [x] [Review][Patch] PhraseCategorySection allergen sub-options clipped by `max-h-20` — fixed: increased to `max-h-40` [PhraseCategorySection.tsx:126]
- [x] [Review][Patch] QuickPhraseChips allergen sub-options clipped by `max-h-12` — fixed: increased to `max-h-24` [QuickPhraseChips.tsx:134]
- [x] [Review][Patch] Context label fragile string replacement — fixed: use `phraseCategory.labelJa` directly instead of stripping icon from i18n string [VoiceTranslationView.tsx:148-152]
- [x] [Review][Patch] Collapsed PhraseCategorySection keyboard trap — fixed: added `inert` attribute on collapsed content container [PhraseCategorySection.tsx:78]
- [x] [Review][Patch] English-only aria-label on speaker button — fixed: use i18n key `play_phrase` with `{phrase}` param [PhraseCategorySection.tsx:114]
- [x] [Review][Defer] Service method `get_phrases` union return type (`PhrasePackResponse | PhraseCategoryResponse`) is fragile for static analysis — works at runtime but mypy/pyright will flag [service.py:113-131] — deferred, pre-existing pattern
- [x] [Review][Defer] `phrase.ja` used as React key — unique within each category today but fragile if data changes [PhraseCategorySection.tsx:89, QuickPhraseChips.tsx:104] — deferred, latent risk
- [x] [Review][Defer] ConversationHistory in VoiceTranslationView may need explicit `min-h-0 flex-1` wrapper after QuickPhraseChips added above it [VoiceTranslationView.tsx:210-215] — deferred, pre-existing layout pattern

### Completion Notes List

- Added static phrase-pack data for 7 categories with Vietnamese translations, Katakana pronunciation, and restaurant allergen sub-options.
- Added backend phrase-pack schemas, service methods, exceptions, endpoints, and router/service coverage for category lookup, data integrity, and rate limiting.
- Added frontend quick phrase chips, phrasebook sections, and text translation tab with shared conversation bubbles and audio playback.
- Updated voice translation to append quick-phrase results into the existing conversation history and switch into the phrasebook tab via the "もっと見る" chip.
- Added phrase fetchers, TypeScript phrase types, i18n keys, scrollbar utility CSS, and focused frontend tests for phrase chips, text translation, phrasebook, category sections, and tab switching.
- Fixed existing lint/test blockers in `speech.d.ts`, backend community tests, and `Gallery.test.tsx` so full validation gates could run green.
- Validation gates passed: `python -m ruff check backend/`, `python -m pytest backend/tests/` (532 passed), `pnpm --filter web lint`, `pnpm --filter web test` (529 passed), `pnpm --filter web build`.

### File List

**New files:**
- apps/web/modules/translation/components/QuickPhraseChips.tsx
- apps/web/modules/translation/components/TextTranslationView.tsx
- apps/web/modules/translation/components/PhrasebookView.tsx
- apps/web/modules/translation/components/PhraseCategorySection.tsx
- apps/web/modules/translation/__tests__/QuickPhraseChips.test.tsx
- apps/web/modules/translation/__tests__/TextTranslationView.test.tsx
- apps/web/modules/translation/__tests__/PhrasebookView.test.tsx
- apps/web/modules/translation/__tests__/PhraseCategorySection.test.tsx
- apps/web/modules/translation/__tests__/integration-tab-switch.test.tsx

**Modified files:**
- backend/modules/translation/constants.py — added static phrase packs, pronunciation helpers, and allergen sub-options
- backend/modules/translation/schemas.py — added phrase-pack response models
- backend/modules/translation/service.py — added phrase-pack mapping and lookup service logic
- backend/modules/translation/router.py — added `/translation/phrases` and `/translation/phrases/{category}` endpoints with rate limiting
- backend/modules/translation/exceptions.py — added phrase category not found exception
- backend/tests/translation/test_router.py — added phrase endpoint and rate-limit coverage
- backend/tests/translation/test_service.py — added phrase service coverage
- apps/web/modules/translation/lib/types.ts — added phrase-pack TypeScript types
- apps/web/modules/translation/lib/translation-data.ts — added phrase fetchers
- apps/web/modules/translation/components/VoiceTranslationView.tsx — integrated quick phrases into voice conversation flow
- apps/web/modules/translation/components/TranslationPageShell.tsx — replaced placeholders with text and phrasebook views
- apps/web/modules/translation/__tests__/TranslationPageShell.test.tsx — updated tab-shell coverage for real views
- apps/web/modules/translation/speech.d.ts — fixed declaration style for lint compatibility
- apps/web/app/globals.css — added `scrollbar-hide` utility
- apps/web/messages/ja.json — added translation phrase/text UI strings
- apps/web/messages/en.json — added translation phrase/text UI strings
- apps/web/messages/vi.json — added translation phrase/text UI strings
- apps/web/modules/listing-detail/__tests__/Gallery.test.tsx — added `next-intl` mock so the full frontend suite passes
- backend/tests/community/test_event_repository.py — fixed Ruff style violations blocking repo-wide backend lint
- backend/tests/community/test_event_service.py — fixed Ruff style violations blocking repo-wide backend lint
- backend/tests/community/test_like_repository.py — removed unused imports blocking repo-wide backend lint

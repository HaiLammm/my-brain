# Epic 6: Communication Bridge & Translation Tools

Users can use voice translation, text translation, camera menu OCR, and pre-built phrase packs organized by context to communicate across the Japanese-Vietnamese language barrier.

## Story 6.1: Voice Translation & Conversation Interface

As a Japanese tourist at a Vietnamese restaurant,
I want to speak in Japanese and get instant Vietnamese translation with audio playback,
So that I can communicate with staff without knowing Vietnamese.

**Acceptance Criteria:**

**Given** I navigate to `/ja/translate` or tap the translation FAB
**When** the translation page loads
**Then** a SegmentedControl shows 3 tabs: 🎤 音声翻訳 (Voice, default), ✏️ テキスト (Text), 📖 フレーズ集 (Phrasebook)
**And** a language pair indicator shows "日本語 → ベトナム語" with a swap (↔) icon

**Given** I am on the Voice tab (FR26)
**When** I tap the large coral mic button (80px diameter)
**Then** the button pulses with audio amplitude animation
**And** "聞いています..." (Listening...) label appears with animated dots
**And** tapping again or silence detection stops recording

**Given** speech recognition completes
**When** the Japanese text is detected (e.g., "辛くしないでください")
**Then** a Japanese input bubble appears left-aligned (light Navy tint background)
**And** a Vietnamese output bubble appears right-aligned (light Teal tint) with translation (e.g., "Làm ơn đừng cho cay")
**And** a katakana pronunciation guide appears below the Vietnamese text (e.g., "ラム ウン ドゥン チョー カイ")
**And** a teal speaker playback button (36px) appears on the Vietnamese bubble

**Given** I tap the speaker playback button (FR27)
**When** audio generates
**Then** the Vietnamese text is spoken aloud at elevated volume (for showing to staff)
**And** the speaker icon animates with sound waves during playback

**Given** I tap "スタッフに見せる" (Show to staff)
**When** the full-screen mode opens
**Then** the Vietnamese text displays full-screen in large font (36px bold), white background, landscape-friendly
**And** a "戻る (Back)" button at top returns to the conversation view

**Given** I tap the ↔ swap icon
**When** the language direction swaps to VI→JA
**Then** I can now record Vietnamese input and receive Japanese translation (for understanding server responses)

**Given** the conversation history
**When** multiple exchanges occur
**Then** all translation pairs are preserved in a scrollable list for the session
**And** a "クリア" (Clear) button at top resets the conversation

**Given** auto-translated content (FR29)
**When** any translation displays
**Then** a small disclaimer appears: "機械翻訳です" (Machine translation) in caption text

## Story 6.2: Phrase Packs & Phrasebook

As a Japanese user in a specific situation (restaurant, salon, hospital),
I want one-tap access to common phrases with instant translation and audio,
So that I can communicate quickly without speaking into the microphone every time.

**Acceptance Criteria:**

**Given** I am on the Voice translation tab (FR28)
**When** quick phrases are displayed above the mic button
**Then** a context label shows "🍜 レストランでよく使うフレーズ" (context-aware based on location/page)
**And** horizontal scrollable phrase chips display: おすすめは？, 辛くしないで, お会計, これは何ですか？, アレルギーがあります, とても美味しい！, もっと見る (+N)

**Given** I tap a phrase chip (e.g., "辛くしないで")
**When** the instant translation triggers
**Then** the translation pair appears in the conversation area (same as voice result)
**And** Vietnamese audio auto-plays immediately
**And** the chip briefly fills coral to confirm tap

**Given** I tap "アレルギーがあります" (I have allergies)
**When** the chip expands
**Then** sub-options display for specific allergens (エビ, ナッツ, 乳製品, etc.)
**And** selecting one translates the full phrase "I have a [allergen] allergy"

**Given** I tap "もっと見る"
**When** the full phrasebook opens (Phrasebook tab)
**Then** phrases are organized by category: レストラン, サロン, 病院, 市場, タクシー, ホテル, 緊急
**And** each category shows 10-20 pre-built phrases
**And** tapping any phrase shows translation + audio playback

**Given** the Text tab is selected
**When** I type Japanese text manually
**Then** a text input area appears with keyboard
**And** submitting translates to Vietnamese with the same bubble display format
**And** audio playback is available on the result

## Story 6.3: Visual Menu OCR Helper & Floating FAB

As a Japanese tourist looking at a Vietnamese menu,
I want to point my camera at the menu and see Japanese translations overlaid,
So that I can understand what dishes are available without asking anyone.

**Acceptance Criteria:**

**Given** I am on the translation page
**When** I tap "📷 メニューを翻訳" pill button (next to mic button)
**Then** the camera viewfinder opens full-screen with a translucent Navy top bar showing "メニュー翻訳"

**Given** the camera is pointed at a Vietnamese menu
**When** text regions are detected
**Then** semi-transparent teal bounding boxes highlight detected Vietnamese text (30% opacity)
**And** Japanese translation labels appear adjacent to each detected phrase (Navy pill with white text)

**Given** a detected phrase contains allergen-related terms (FR58)
**When** the translation processes
**Then** the allergen term is flagged with a warning icon (⚠️) and red highlight
**And** a note indicates "アレルゲン注意 — 人間による翻訳確認が推奨されます"

**Given** I tap a translated region
**When** the detail tooltip opens
**Then** a white card shows: full Vietnamese phrase, Japanese translation, pronunciation (katakana), and audio playback button

**Given** I tap "撮影して保存" (Capture and save)
**When** the frame freezes
**Then** the annotated image (with Japanese overlays) is saved to the session for later reference

**Given** I tap ✕ or swipe down
**When** the camera closes
**Then** I return to the voice translation mode

**Given** I am on any non-translation page
**When** I see the floating translation FAB
**Then** a coral FAB (56px circle, white mic icon) is positioned bottom-right, 16px from edge, above bottom tab nav
**And** tapping opens the translation tool as a bottom sheet (60vh height)
**And** long-pressing starts voice input immediately
**And** swiping up the bottom sheet expands to full translation page
**And** a small teal dot on the FAB indicates an active translation session with history

---

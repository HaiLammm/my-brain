# Epic 2: Discovery, Search & Listing Experience

Japanese users can browse the homepage with senpai picks and deals, search/filter listings with cross-language support, view detailed listing pages with dual-currency pricing, fair-price indicators, photo galleries, area guides, and save favorites.

## Story 2.1: Listing Data Model & API Foundation

As a developer,
I want the listing data model, seed data, and REST API endpoints,
So that all listing-related pages have a working backend to fetch data from.

**Acceptance Criteria:**

**Given** the backend listing module
**When** the database migrations run
**Then** tables are created: listings, listing_categories, areas, business_hours
**And** each table follows the base model pattern (UUID v4 PK, created_at, updated_at, deleted_at)
**And** listing model includes: title_vi, title_ja, description_vi, description_ja, price_vnd, latitude, longitude, rating_avg, review_count, is_senpai_verified, category_id, area_id

**Given** the seed data script
**When** I run `python scripts/seed-data.py`
**Then** at least 50 demo listings are created across 6 categories (Restaurant, Cafe, Spa, Hotel, Tour, Housing)
**And** at least 5 Da Nang areas are seeded (Hai Chau, Son Tra, Ngu Hanh Son, Lien Chieu, Thanh Khe)
**And** listings have realistic Japanese and Vietnamese content

**Given** the REST API
**When** I call `GET /api/v1/listings`
**Then** paginated results return with standard response wrapper ({data, meta})
**And** query params support: category_id, area_id, sort_by, sort_order, page, per_page
**When** I call `GET /api/v1/listings/{listing_id}`
**Then** full listing detail returns including business hours, area info, and category
**When** I call `GET /api/v1/areas`
**Then** all Da Nang areas return with name_ja, name_vi, description, and listing count

**Given** photo upload handling (FR66)
**When** a photo is uploaded via the media module
**Then** the image is compressed and optimized for web delivery (WebP format, max 1200px width)
**And** the optimized image URL is stored in the media_files table

## Story 2.2: Homepage — Hero, Senpai Picks & Deals

As a Japanese guest visiting for the first time,
I want to see a welcoming homepage with senpai picks and deals,
So that I immediately understand this platform is made for Japanese people in Da Nang and find relevant content.

**Acceptance Criteria:**

**Given** I visit the homepage at `/ja`
**When** the page loads
**Then** Section 1 displays: full-width Da Nang hero image with search bar, tagline "ダナンのすべてが、ここに。", subtitle about senpai experiences, and 6 quick filter chips (レストラン, カフェ, 住まい, ビザ, 病院, 翻訳)
**And** Section 2 displays: coral newcomer welcome banner with "ダナンへようこそ！" headline, first-week description, and "はじめる →" CTA button
**And** the welcome banner can be dismissed (×) and stays dismissed (localStorage)

**Given** the homepage sections below the fold
**When** I scroll down
**Then** Section 3 "先輩のおすすめ" shows 6 senpai pick cards in horizontal scroll (mobile) / 3-column grid (desktop) with photo, title, rating, senpai badge
**And** Section 4 "今日のお得情報" shows 4 deal cards with business photo, deal description, savings in JPY, expiry countdown, and "すべて見る →" link
**And** Section 5 "コミュニティ" shows 3 recent popular threads with preview text, reply count, and today's post count
**And** Section 6 shows a 2×3 icon grid (mobile) / 6-across (desktop) of category quick links

**Given** SEO requirements (FR59-FR60)
**When** the homepage is server-side rendered
**Then** the page includes Japanese-language meta tags, JSON-LD structured data
**And** OpenGraph tags are present for LINE and Twitter social sharing
**And** a sitemap.xml includes the homepage URL

**Given** the welcome banner "はじめる" CTA
**When** I tap it
**Then** I navigate to the Newcomer Onboarding page

## Story 2.3: Search & Browse with Cross-Language Support

As a Japanese user looking for listings,
I want to search and filter listings with Japanese keywords even when data is stored in Vietnamese,
So that I can find relevant results regardless of language.

**Acceptance Criteria:**

**Given** I navigate to the search page `/ja/listings`
**When** the page loads
**Then** a search bar appears with placeholder "何をお探しですか？"
**And** filter chips are shown: エリア, 予算, タイプ, 先輩おすすめ, 日本語OK
**And** results count displays (e.g., "32件の物件")
**And** sort dropdown offers: おすすめ順, Price ↑, Price ↓, Rating, Newest

**Given** I type a Japanese keyword like "フォー" (pho)
**When** the search executes with debounce
**Then** Meilisearch returns Vietnamese listings matching "phở" via cross-language matching (FR65)
**And** results display as listing cards with: photo, senpai badge, title (Japanese), dual price (VND + ¥JPY), fair-price indicator, rating, senpai snippet, save heart

**Given** I tap a filter chip (e.g., エリア)
**When** I select "ソンチャ" (Son Tra)
**Then** results filter to Son Tra area with the chip highlighted in teal
**And** results count updates

**Given** I tap "リスト / 地図" toggle
**When** I switch to map view
**Then** a Da Nang map displays with Navy price pins (e.g., "¥48K") at each listing location
**And** tapping a pin shows a card preview overlay

**Given** no results match my filters (FR71)
**When** the empty state displays
**Then** a friendly illustration appears with "条件に合う物件が見つかりませんでした"
**And** a "フィルターをリセット" CTA resets all filters

**Given** I arrive from the area guide with pre-applied filters
**When** the search page loads
**Then** the search bar and filter chips reflect the pre-applied filters (e.g., area = Son Tra, type = Housing)

## Story 2.4: Listing Detail Page

As a Japanese user evaluating a listing,
I want to see complete details with dual-currency pricing, senpai reviews, and fair-price context,
So that I can make an informed decision about contacting or saving the listing.

**Acceptance Criteria:**

**Given** I tap a listing card from search results
**When** the listing detail page loads at `/ja/listings/[slug]`
**Then** Section 1 displays a full-width photo gallery with swipe (mobile) / grid (desktop), photo counter "1/12", and "先輩認証済み ✓" badge overlay
**And** Section 2 displays listing header: title, large VND price, JPY equivalent in teal, fair-price indicator with senpai average range, quick specs (rooms, size, floor, parking), star rating, save ♡ and share 📤 buttons

**Given** the listing has detailed information
**When** I scroll down
**Then** Section 3 Key Details shows: address (VI + JP phonetic), commute time to workplace, availability date, contract period, deposit, utilities
**And** Section 4 Amenities shows an icon grid (3 columns) with check marks for available amenities
**And** Section 5 Senpai Reviews shows: star breakdown, featured "Most Helpful" review, review cards with avatar + senpai badge + residency duration + date + rating + text + reviewer tags
**And** Section 6 Contract Guidance shows an accordion with checklist items and senpai tips (FR71 edge case: contract guidance for newcomers)
**And** Section 7 Location Map shows an embedded map with listing pin, workplace marker (if set), and nearby POI markers

**Given** the sticky action bar on mobile
**When** I see it at the bottom
**Then** it shows compact price "¥48,000/月" + Coral "お問い合わせ" CTA + Navy outline "♡ 保存" button
**And** tapping "お問い合わせ" opens a contact form overlay with pre-filled bilingual message template
**And** tapping "♡ 保存" saves to favorites or triggers signup modal if unauthenticated (FR53)

**Given** the page content in Japanese (FR63)
**When** listing data is fetched
**Then** all content displays in Japanese (title_ja, description_ja)
**And** dual-currency pricing shows VND primary + JPY in parentheses (UX-DR10)
**And** the page is SSR with Japanese meta tags and JSON-LD structured data (FR59)

## Story 2.5: Area/Neighborhood Guides

As a Japanese newcomer choosing where to live,
I want to browse area guides with local insights and senpai recommendations,
So that I can pick the right neighborhood based on commute, lifestyle, and budget.

**Acceptance Criteria:**

**Given** I navigate to an area guide at `/ja/areas/[area]`
**When** the page loads
**Then** an area overview section shows: area name (Japanese), description, embedded map highlighting the area boundary
**And** a lifestyle info section shows: average rent range (dual currency), commute times to key locations, atmosphere description, safety rating

**Given** the area has senpai-recommended spots
**When** I scroll down
**Then** a "先輩のおすすめスポット" section shows listing cards for top-rated places in this area
**And** each card includes senpai badge, rating, and a short senpai quote

**Given** I want to search within this area
**When** I tap "このエリアで物件を探す" CTA
**Then** I navigate to the search page with area filter pre-applied

**Given** the areas list page at `/ja/areas`
**When** the page loads
**Then** all Da Nang areas display as cards with: name, photo, listing count, average price range
**And** the page is SSR with Japanese meta tags (FR59)

## Story 2.6: Favorites Collection

As a registered user,
I want to save and manage my favorite listings,
So that I can easily return to listings I'm interested in.

**Acceptance Criteria:**

**Given** I am viewing a listing card or listing detail
**When** I tap the ♡ save heart button (FR6)
**Then** the heart fills with animation and the listing is saved to my favorites
**And** a brief toast confirms "保存しました" (Saved)

**Given** I tap the filled ♡ again
**When** the unsave action triggers
**Then** the heart empties with animation and the listing is removed from favorites

**Given** I am not logged in and tap ♡
**When** the save action triggers (FR53)
**Then** the signup modal appears
**And** after successful login, the save action completes automatically

**Given** I navigate to my favorites at `/ja/profile/favorites` (FR7)
**When** the page loads
**Then** my saved listings display as listing cards with all standard info (photo, title, dual price, rating)
**And** I can unsave from this page
**And** if no favorites exist, an empty state shows with "まだ保存した場所がありません" and a "探す" CTA to search

---

# Sprint Change Proposal — Add Epic 10: Journey-Based Discovery

**Date:** 2026-04-19
**Project:** DaNangNavi
**Requested by:** Lem
**Scope Classification:** Major — New epic, fundamental roadmap expansion
**Mode:** Batch review

---

## 1. Issue Summary

### Problem Statement

Phiên brainstorming ngày 2026-04-05 đã chốt **Journey-Based Discovery** (ideas #1, #2, #81) là **Top Breakthrough #1** với ghi chú *"concept hoàn toàn mới không platform nào có"*. Đây là một trong 3 trụ cốt lõi của sản phẩm cùng với Community và Communication. Tuy nhiên, khi breakdown sang epic plan, nhóm tính năng này **đã bị rơi hoàn toàn**:

- Epic 2 chỉ có static map view (price pins cho listings) và commute time hiển thị — **không có Route/Directions**
- Không epic nào xử lý:
  - Tích hợp Google Maps Directions API để vẽ polyline thực
  - Nhập origin→destination và gợi ý listing **dọc tuyến đường** (bán kính 300m từ polyline)
  - Route Personality (ẩm thực / scenic / nhanh nhất)
  - Journey Deals (coupon dọc tuyến)
  - "Trên đường đi" push notification

### Discovery Context

Phát hiện trong buổi review epic planning ngày 2026-04-19 khi user hỏi *"Cac epic, user-story cho viec hien thi map tu api google, ve ra duong di va su dung location data de suggest khach hang cac quan dia danh noi bat tren duong toi do?"*. Grep qua toàn bộ epics cho thấy chỉ có từ khóa "commute time" và "embedded map" mà không có story/AC nào đề cập đến route drawing hay route-aware matching.

### Evidence

- `_bmad-output/brainstorming/brainstorming-session-2026-04-05-1710.md`:
  - Idea #1 Journey-Based Discovery, #2 Route Personality, #3 "Trên đường đi" notification (Tanaka persona)
  - Idea #78 Google Maps = Navigation Only (decision key)
  - Idea #79 Journey Deals (Phase 3 revenue stream)
  - Idea #81 Route-Aware Discovery Engine — *"Routing API (polyline thật) + match listing nội bộ trong bán kính 300m"*
  - Idea #82 Strategic Onboarding Zone — onboard business owner theo 5-10 tuyến đường phổ biến
  - Section "Top 3 Breakthrough" liệt kê Journey-Based Discovery (#1, #2, #81) ở vị trí **số 1**
- Decisions #3 & #5 của user: closed-data, dùng routing API cho polyline thật, match với listing nội bộ — yêu cầu kỹ thuật đã rõ
- Epic 2 hiện tại chỉ cover UX-DR20 (interactive map với price pins) — không phải journey discovery

---

## 2. Impact Analysis

### Epic Impact

| Epic | Impact | Details |
|------|--------|---------|
| **Epic 10 (NEW)** | Created | Journey-Based Discovery — 6 stories |
| Epic 2 | Minor update | UX-DR20 description mở rộng nhắc đến route display; cross-reference Epic 10 từ Story 2.3 map view |
| Epic 7 (Deals) | Dependency | Epic 10 Story 10.6 (Journey Deals) phụ thuộc Epic 7 hoàn tất trước |
| Epic 8 (BO Portal) | Future link | Idea #82 Strategic Onboarding Zone sẽ dùng tuyến đường từ Epic 10 — ghi nhận, không triển khai lần này |
| Epic 1, 3, 4, 5, 6, 9 | No impact | — |

### Story Impact

| Story | Status | Impact |
|-------|--------|--------|
| Epic 2: 2.1–2.4 | done | Không đổi |
| Epic 2: 2.5 | in-progress | Không đổi |
| Epic 2: 2.6 | backlog | Không đổi |
| **Epic 10: 10.1–10.6 (NEW)** | backlog | Thêm mới, schedule **sau Epic 2 hoàn tất** |

### Artifact Conflicts

| Artifact | Section | Change |
|----------|---------|--------|
| `epics/epic-10-journey-based-discovery.md` | toàn file | TẠO MỚI |
| `epics/epic-list.md` | cuối file | Thêm block Epic 10 |
| `epics/index.md` | TOC + epic list | Thêm 6 story Epic 10 |
| `epics/requirements-inventory.md` | FR list + coverage map + UX-DR | Thêm FR75-FR80 + UX-DR47 |
| PRD (nếu có file functional-requirements) | FR section | Thêm FR mới cho journey discovery |
| `architecture/` | solution design | Thêm section Google Maps API integration, PostGIS/Tile38, Directions caching strategy |
| `sprint-status.yaml` | development_status | Thêm 6 entry 10-1…10-6 |

### Technical Impact

- **Frontend:** Google Maps JavaScript API SDK, Directions rendering (polyline), bottom sheet "listings dọc đường", route selector (3 route personalities)
- **Backend:**
  - Module `journey/` mới (router, service, repository, schemas)
  - Geospatial query: match listings trong bán kính N mét từ polyline (cần PostGIS `ST_DWithin` + `ST_MakeLine`, hoặc Tile38)
  - Cache Google Directions response (Redis, 24h TTL) để giảm chi phí API
  - Endpoint `POST /api/v1/journeys/route` nhận origin+destination+personality → trả route + listings along route
- **Infrastructure:**
  - Env vars: `GOOGLE_MAPS_API_KEY`, `GOOGLE_DIRECTIONS_API_KEY` (có thể tách server-side key)
  - PostGIS extension cho Postgres (nếu chưa bật)
  - Budget monitoring cho Google Maps API (cost/1000 requests)
- **Security:** Google Maps JS API key phải restrict theo HTTP referrer + billing alert; server-side Directions key restrict theo IP

### Business Impact

- **Revenue Phase 3** (Journey Deals #79) mở khóa được
- **Onboarding Strategy** (#82) — chiến lược sign-up business owner theo tuyến đường
- **Demo value:** Journey Discovery là USP (unique selling proposition) khi pitch nhà đầu tư — không có platform nào khác có

---

## 3. Recommended Approach

### Chosen Path: **Direct Adjustment — Create New Epic 10**

**Lý do chọn tạo epic mới thay vì nhồi vào Epic 2:**

1. **Epic 2 đang implement dở** (Story 2.5 in-progress, 2.2 & 2.6 backlog). Chèn vào sẽ delay ship Epic 2.
2. **Scope đủ lớn** cho 6 story riêng biệt (~4-6 sprint).
3. **Tech stack mới** (Google Maps, PostGIS, Directions caching) khác hẳn Meilisearch/map tĩnh của Epic 2.
4. **Phụ thuộc Epic 7** (Deals) — cần sequencing rõ ràng, không lẫn lộn.
5. **Tách biệt business logic**: journey là một "mode" khác của discovery, không phải extension của search/browse.

### Sequencing

```
[Đang chạy: Epic 2.5] → [Epic 2.2, 2.6 còn lại] → [Epic 7 Deals] → [Epic 10 Journey Discovery]
```

Epic 10 schedule **sau** Epic 2 hoàn tất (per user decision). Story 10.6 (Journey Deals) **phải** làm sau Epic 7. Stories 10.1–10.5 có thể bắt đầu ngay sau Epic 2 xong.

### Effort Estimate (rough)

| Story | Complexity | Est. |
|---|---|---|
| 10.1 Google Maps Integration & Route API Foundation | M | 3-5 ngày |
| 10.2 Journey Input & Route Display | M | 3-4 ngày |
| 10.3 Route-Aware Listing Matching (PostGIS) | L | 5-7 ngày |
| 10.4 Listings Along Route UI | M | 3-5 ngày |
| 10.5 Route Personality Scoring | L | 5-7 ngày |
| 10.6 Journey Deals Integration | M | 3-4 ngày |
| **Total** | | **~22-32 ngày** (~4-6 sprint) |

### Risk Assessment

| Risk | Mitigation |
|---|---|
| Google Maps API cost spike | Redis cache 24h + daily budget alert + fallback gracefully khi quota vượt |
| PostGIS query performance với nhiều listing | Index `listings(location)` bằng GiST; benchmark với 10K+ listings |
| API key leak | Server-side Directions, JS key restrict theo referrer, rotate định kỳ |
| Route personality scoring algorithm phức tạp | Phase 1 dùng rule-based đơn giản (rating + category weight), Phase 2 mới ML |
| Giá listing dọc route không chính xác (polyline zig-zag) | Dùng buffer polygon (ST_Buffer) thay vì radius từ điểm; unit test với các loại route |

### Non-goals (scope lần này KHÔNG bao gồm)

- Proactive push "trên đường đi" (#3) — để Phase 2 sau Epic 10
- Real-time location tracking liên tục — không cần cho MVP
- Strategic Onboarding Zone (#82) — thuộc Epic 8 sau này
- Route Personality bằng ML model — dùng rule-based

---

## 4. Detailed Change Proposals

### 4.1 NEW FILE: `epics/epic-10-journey-based-discovery.md`

Xem file đính kèm `_bmad-output/planning-artifacts/epics/epic-10-journey-based-discovery.md`. Tóm tắt 6 story:

| Story | Title | Core AC |
|---|---|---|
| 10.1 | Google Maps Integration & Route API Foundation | API key setup, Maps JS SDK integration, backend `journey/` module scaffold, Directions API proxy với Redis cache, PostGIS extension enabled |
| 10.2 | Journey Input & Route Display | Trang `/ja/journey`, input origin/destination (autocomplete Places), render polyline trên Google Map, 3 route alternatives |
| 10.3 | Route-Aware Listing Matching | Endpoint `POST /api/v1/journeys/route` nhận polyline → PostGIS `ST_DWithin` trả listings trong 300m; caching |
| 10.4 | Listings Along Route UI | Bottom sheet hiển thị listings sắp xếp theo thứ tự dọc route, tap → mini card; pin trên map |
| 10.5 | Route Personality Scoring | 3 preset: 食 (ẩm thực), 景 (scenic), 早 (nhanh nhất); re-rank listings theo personality |
| 10.6 | Journey Deals Integration | Hiển thị coupon active từ Epic 7 cho listings dọc route; badge "💰 お得" |

### 4.2 UPDATE: `epics/epic-list.md`

**Thêm vào cuối file (trước dòng `---` cuối):**

```markdown
## Epic 10: Journey-Based Discovery (Google Maps Integration)
Japanese users input origin → destination, see route drawn on Google Maps with internal listings + deals matched along the polyline within 300m buffer, filter by route personality (food / scenic / fastest).
**FRs covered:** FR75, FR76, FR77, FR78, FR79, FR80
**UX-DRs covered:** UX-DR47 (journey input & route map page)
**Architecture:** Google Maps JS API + Directions API (server proxy + Redis cache 24h TTL), PostGIS `ST_DWithin` for polyline buffer matching, new `journey/` backend module
**Dependencies:** Epic 2 (listing data), Epic 7 (Deals for Story 10.6)
**Stories:** 10.1 Google Maps & Route API Foundation, 10.2 Journey Input & Route Display, 10.3 Route-Aware Listing Matching, 10.4 Listings Along Route UI, 10.5 Route Personality Scoring, 10.6 Journey Deals Integration
```

### 4.3 UPDATE: `epics/index.md`

Thêm vào TOC phần "Epic List":
```
    - [Epic 10: Journey-Based Discovery](./epic-list.md#epic-10-journey-based-discovery-google-maps-integration)
```

Và thêm block epic detail ở cuối TOC:
```
  - [Epic 10: Journey-Based Discovery](./epic-10-journey-based-discovery.md)
    - [Story 10.1: Google Maps Integration & Route API Foundation](./epic-10-journey-based-discovery.md#story-101-google-maps-integration-route-api-foundation)
    - [Story 10.2: Journey Input & Route Display](./epic-10-journey-based-discovery.md#story-102-journey-input-route-display)
    - [Story 10.3: Route-Aware Listing Matching](./epic-10-journey-based-discovery.md#story-103-route-aware-listing-matching)
    - [Story 10.4: Listings Along Route UI](./epic-10-journey-based-discovery.md#story-104-listings-along-route-ui)
    - [Story 10.5: Route Personality Scoring](./epic-10-journey-based-discovery.md#story-105-route-personality-scoring)
    - [Story 10.6: Journey Deals Integration](./epic-10-journey-based-discovery.md#story-106-journey-deals-integration)
```

### 4.4 UPDATE: `epics/requirements-inventory.md`

**Thêm FR (cuối block Functional Requirements):**

```
FR75: User can input origin and destination to generate a route (Journey Discovery)
FR76: System displays route polyline on Google Maps with up to 3 alternatives
FR77: System matches and displays internal listings within 300m buffer of the route polyline
FR78: User can filter route by personality (food / scenic / fastest), listings re-rank accordingly
FR79: System displays active deals/coupons for listings along the route
FR80: Route and listing-along-route results are cached to reduce Google Maps API cost
```

**Thêm UX-DR (cuối block UX Design Requirements):**

```
UX-DR47: Journey Discovery page — origin/destination input with Places autocomplete, Google Maps route rendering, route personality toggle (食/景/早), bottom sheet with listings-along-route cards ordered by distance-from-origin (per Brainstorming Ideas #1, #2, #81)
```

**Thêm vào FR Coverage Map:**

```
FR75: Epic 10 - Journey input origin/destination
FR76: Epic 10 - Route polyline rendering
FR77: Epic 10 - Route-aware listing matching
FR78: Epic 10 - Route personality filter
FR79: Epic 10 - Deals along route
FR80: Epic 10 - API response caching
```

### 4.5 UPDATE: Epic 2 — `epic-2-discovery-search-listing-experience.md` (minor)

**Thêm note ở đầu Story 2.3 (sau acceptance criteria section map view):**

```
> **Related:** Journey-Based Discovery (route-aware matching) is covered by Epic 10. Story 2.3 handles location-centric map view with price pins; Epic 10 handles origin→destination route with listings along the polyline.
```

### 4.6 UPDATE: `sprint-status.yaml`

Thêm 6 entry mới status `backlog`, scheduled after Epic 2 completion:

```yaml
- id: 10-1-google-maps-route-api-foundation
  title: Story 10.1 Google Maps Integration & Route API Foundation
  status: backlog
  depends_on: [2-6-favorites-collection]
- id: 10-2-journey-input-route-display
  title: Story 10.2 Journey Input & Route Display
  status: backlog
  depends_on: [10-1-google-maps-route-api-foundation]
- id: 10-3-route-aware-listing-matching
  title: Story 10.3 Route-Aware Listing Matching
  status: backlog
  depends_on: [10-1-google-maps-route-api-foundation]
- id: 10-4-listings-along-route-ui
  title: Story 10.4 Listings Along Route UI
  status: backlog
  depends_on: [10-2-journey-input-route-display, 10-3-route-aware-listing-matching]
- id: 10-5-route-personality-scoring
  title: Story 10.5 Route Personality Scoring
  status: backlog
  depends_on: [10-4-listings-along-route-ui]
- id: 10-6-journey-deals-integration
  title: Story 10.6 Journey Deals Integration
  status: backlog
  depends_on: [10-4-listings-along-route-ui, 7-2-coupon-claim-redemption]
```

---

## 5. Implementation Handoff

### Scope Classification: **Major**

Routed to:
- **Product Manager (John)** — review PRD/FR updates, confirm FR75-FR80 wording
- **Solution Architect (Winston)** — thiết kế chi tiết:
  - Google Maps API key strategy (JS key vs server-side)
  - Directions caching strategy (cache key design, TTL, invalidation)
  - PostGIS setup & query performance (index, EXPLAIN ANALYZE budget)
  - Cost model cho Google Maps API (estimate monthly bill)
- **UX Designer (Sally)** — tạo UX-DR47 spec:
  - Journey input page layout
  - Bottom sheet cho listings along route
  - Route personality toggle visual design
- **Developer (Amelia)** — sau khi architect xong, dev tuần tự từ 10.1

### Success Criteria

1. User có thể nhập origin → destination tại `/ja/journey` và thấy route vẽ trên Google Maps ✅
2. Listings nội bộ trong 300m buffer từ route hiển thị đúng thứ tự dọc tuyến ✅
3. 3 route personality re-rank listings khác nhau ✅
4. Coupon active từ Epic 7 hiển thị badge trên listings dọc route ✅
5. p95 latency endpoint `POST /journeys/route` < 800ms (có cache) ✅
6. Chi phí Google Maps API < $X/tháng (set budget alert) ✅

### Deliverables

- [x] Sprint Change Proposal (file này)
- [x] `epic-10-journey-based-discovery.md` (đi kèm)
- [ ] Updated `epic-list.md`, `index.md`, `requirements-inventory.md`
- [ ] Updated `sprint-status.yaml`
- [ ] Architecture addendum (Winston) — sau approval
- [ ] UX-DR47 spec (Sally) — sau approval

---

## 6. Approval

- [ ] **Lem** (Product Owner) — yes / no / revise
- [ ] Architect review — yes / no
- [ ] UX review — yes / no

**Next action after approval:** Create story files `story-10-1-*.md` qua `/bmad-create-story` khi Epic 2 gần hoàn tất.

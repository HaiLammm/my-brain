---
title: 'Frontend Images Display Fix — attach photos to search + render consistently'
type: 'bugfix'
created: '2026-04-23'
status: 'in-review'
baseline_commit: 'd18d958819ea0875dfffe34e97dc3bf776eb790a'
context:
  - '{project-root}/CLAUDE.md'
  - '{project-root}/apps/web/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** User reports listing photos không hiển thị trên frontend. Full-stack audit xác định: (a) backend `/api/v1/listings/search` không attach photos — `items` luôn có `photos: []` → search results (list view + map popup) không có ảnh dù schema đã khai báo; (b) `MapView` popup không có `<img>` tag kể cả khi photos tồn tại; (c) các surface dùng `ListingCard` hiện render ảnh-hoặc-null không nhất quán (Journey card có "No photo" text, shared card để trống) — dễ bị nhầm là "mất ảnh" khi dữ liệu rỗng.

**Approach:** (1) Inject `MediaService` vào `SearchService`, batch-attach photos cho mọi search path (Meili + DB fallback) theo pattern Favorites/Coupons — luôn attach, không cần flag. (2) Thêm thumbnail vào `MapView` popup. (3) Tạo một `ListingImage` component dùng chung có placeholder SVG khi `photos[]` rỗng hoặc URL lỗi, áp dụng cho shared `ListingCard` + `RouteListingCard`.

## Boundaries & Constraints

**Always:**
- Batch photos qua `MediaService.list_grouped_for_owners()` (single `IN` query) — KHÔNG N+1.
- Search photos attach luôn (không thêm query param `include_photos`) — search list view là surface discovery chính, photos là requirement.
- Reuse `ListingPhotoResponse` schema; không tạo variant mới.
- Frontend path aliases `@/` (theo `apps/web/AGENTS.md`); không dùng `../../`.
- Dùng `next/image` cho mọi ảnh mới (không dùng `<img>`).
- Giữ `photo_limit_per_listing=3` cho search list (đồng bộ listing list), `=1` cho map popup.

**Ask First:**
- Nếu phát hiện database thực tế không có media records → báo lại người dùng (có thể cần seed/upload), KHÔNG tự ý thêm seed script.
- Nếu placeholder design cần branding/asset từ design system mà chưa tồn tại → hỏi trước khi tự vẽ SVG phức tạp.

**Never:**
- Không thay đổi `ListingPhotoResponse` schema hoặc field naming (`photos[]`, `url`, `width`, `height`).
- Không thêm `include_photos` flag vào search endpoint (khác biệt so với listing list, nhưng hợp lý vì search mặc định cần ảnh).
- Không sửa `detail-data.ts:132` (đó là sitemap helper, không cần ảnh).
- Không đụng Favorites / Coupons / Areas guide / Journey / Senpai Picks / Listing Detail / Homepage Deals — đã có ảnh.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Search w/ query, listings có media | `GET /api/v1/listings/search?q=foo` | Mỗi item trả `photos: [{id,url,width,height}, ...]` (≤3), batch 1 query | N/A |
| Search không query (DB fallback) | `GET /api/v1/listings/search` | Cùng shape như trên, cũng attach photos | N/A |
| Search items rỗng | Không có hit | `data: []`, không gọi MediaService | N/A |
| Listing không có photo | Item nào đó không có MediaFile | Item đó trả `photos: []` | N/A |
| Map popup có ảnh | `item.photos[0].url` tồn tại | Render `next/image` thumbnail 96×72, rounded | `onError` → placeholder |
| Map popup không có ảnh | `photos: []` | Render `<ListingImagePlaceholder>` cùng size | N/A |
| ListingCard `photos[]` rỗng | Shared card + RouteCard | Render placeholder SVG với icon, không để trống/text | N/A |
| Image URL 404 | `next/image` onError | Swap sang placeholder | Silent, log client warn |

</frozen-after-approval>

## Code Map

- `backend/modules/search/service.py` — `SearchService` không inject MediaService; `_search_meili` (L95) + `_search_db` (L119) build items không attach photos. **Sửa ở đây.**
- `backend/modules/search/router.py` — wire MediaService khi khởi tạo service.
- `backend/modules/listing/service.py:98-108` — pattern tham chiếu (batch attach).
- `backend/modules/listing/service.py:253-263` — FavoriteService pattern (always-attach, không flag) — mirror.
- `backend/tests/search/test_router.py` — thêm test photos attached.
- `apps/web/modules/search/components/MapView.tsx` — popup thiếu `<img>`; cần thumbnail + placeholder.
- `apps/web/shared/components/ListingCard.tsx:49-56` — render photo nhưng không có fallback.
- `apps/web/modules/journey/components/RouteListingCard.tsx:94-107` — có text "No photo" thay vì placeholder.
- `apps/web/shared/components/ListingImage.tsx` — **MỚI**: wrapper quanh `next/image` + placeholder.
- `apps/web/modules/search/__tests__/MapView.test.tsx` — test thumbnail + fallback.
- `apps/web/shared/components/__tests__/ListingImage.test.tsx` — **MỚI**: test placeholder.

## Tasks & Acceptance

**Execution:**

*Backend (search photos):*
- [x] `backend/modules/search/service.py` — Inject `MediaService` và `photo_limit: int = 3` vào `__init__`. Trong cả `_search_meili` (sau L96) và `_search_db` (sau L120), sau khi có `items`, gọi `media_service.list_grouped_for_owners(owner_type=MediaOwnerType.LISTING, owner_ids=[li.id for li in ordered/listings], limit_per_owner=self.photo_limit)` rồi gán `item.photos = [ListingPhotoResponse.model_validate(p) for p in grouped.get(li.id, [])]`. Import `ListingPhotoResponse`, `MediaOwnerType`, `MediaService`.
- [x] `backend/modules/search/router.py` — Trong dependency (nơi `SearchService(session, redis)` được khởi tạo), inject `MediaService(session)`. Truyền vào constructor.
- [x] `backend/tests/search/test_router.py` — Thêm `test_search_results_include_photos`: seed 2 listings, mỗi listing 2 photos, gọi endpoint (cả path query lẫn empty-q), assert mỗi item `data[i]["photos"]` dài đúng và có `url`. Thêm `test_search_photo_lookup_is_batched` (mock `list_grouped_for_owners`, assert gọi đúng 1 lần với tất cả owner_ids). Mirror pattern `test_list_listings_include_photos_returns_photos_array`.

*Frontend (placeholder + map popup):*
- [x] `apps/web/shared/components/ListingImage.tsx` — **MỚI**. Client component: props `{ photos: {id,url,width,height}[] | undefined, alt: string, className?: string, width: number, height: number, priority?: boolean }`. Nếu `photos?.[0]?.url` tồn tại → render `next/image` với `onError` state swap sang placeholder; nếu không → render placeholder div (icon SVG ảnh + bg `bg-surface-muted`, giữ đúng aspect ratio qua width/height). Placeholder inline SVG đơn giản (icon ảnh neutral gray), **KHÔNG** tạo asset file riêng.
- [x] `apps/web/shared/components/ListingCard.tsx` — Thay block render ảnh hiện tại (L49-56) bằng `<ListingImage photos={listing.photos} alt={listing.titleJa} width={...} height={...} />`. Giữ nguyên layout/sizing.
- [x] `apps/web/modules/journey/components/RouteListingCard.tsx` — Thay block L94-107 bằng `<ListingImage ... />`. **Bỏ** text fallback "No photo".
- [x] `apps/web/modules/search/components/MapView.tsx` — Trong `<Popup>`: thêm `<ListingImage photos={item.photos} alt={item.titleJa} width={120} height={90} />` phía trên `<strong>`. Đảm bảo popup không giãn quá 200px width.
- [x] `apps/web/shared/components/__tests__/ListingImage.test.tsx` — **MỚI**. Test: (a) có photos → render `<img>` với src đúng; (b) `photos` undefined/rỗng → render placeholder (query `[data-testid="listing-image-placeholder"]`); (c) onError → swap sang placeholder.
- [x] `apps/web/modules/search/__tests__/MapView.test.tsx` — **MỚI hoặc update**. Test popup render `ListingImage` với photos từ item. Mock `react-leaflet` components; render stub popup.
- [x] `apps/web/modules/journey/__tests__/RouteListingCard.test.tsx` — Update assertion: không còn text "No photo"; placeholder xuất hiện khi photos rỗng.

**Acceptance Criteria:**
- Given database có listings với media, when user search `q=cafe`, then mỗi item trong response `data[].photos` là array chứa ≤3 photo objects có `url`.
- Given search trả 10 items, when server xử lý response, then chỉ có **1 query** vào media table (batch) — verified qua test mock.
- Given map view, when user click marker, then popup hiển thị thumbnail ảnh (hoặc placeholder) phía trên tiêu đề.
- Given một listing không có photos, when render ở bất kỳ card nào (shared ListingCard, RouteListingCard), then hiển thị placeholder visual (không phải text "No photo", không để trống).
- Given image URL fails to load, when `next/image` fires onError, then placeholder thay thế (client-side).
- Given toàn bộ test suite, when run backend + frontend tests, then **không** có test cũ bị fail (đặc biệt `RouteListingCard.test.tsx` phải được update đồng bộ).

## Verification

**Commands:**
- `cd backend && uv run pytest tests/search tests/listing tests/journey -x` — expected: all pass, bao gồm 2 test search-photos mới.
- `cd apps/web && pnpm test -- ListingImage MapView RouteListingCard ListingCard` — expected: all pass.
- `cd apps/web && pnpm lint` — expected: no new warnings.
- `cd apps/web && pnpm typecheck` — expected: no new errors.

**Manual checks:**
- `cd backend && uv run uvicorn main:app --reload` + `cd apps/web && pnpm dev` → mở `/ja/search?q=<any>` → list view card có ảnh hoặc placeholder; chuyển sang map view → click marker → popup có thumbnail.
- Mở `/ja/journey?from=...&to=...` → route listing panel: không còn text "No photo" ở card nào rỗng.

## Design Notes

`ListingImage` là thin wrapper quanh `next/image` + stateful `onError` swap. Placeholder = single inline SVG (icon ảnh neutral) trong một `<div class="bg-surface-muted flex items-center justify-center">`. Không cần skeleton/blur — đã có placeholder luôn visible. Giữ component dưới ~60 lines.

Ví dụ golden (ListingImage):
```tsx
"use client";
import Image from "next/image";
import { useState } from "react";

export function ListingImage({ photos, alt, width, height, className, priority }: Props) {
  const [failed, setFailed] = useState(false);
  const src = photos?.[0]?.url;
  if (!src || failed) return <Placeholder width={width} height={height} className={className} />;
  return <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} onError={() => setFailed(true)} />;
}
```

Search `SearchService` thay đổi chỉ ở `__init__` + 2 điểm attach sau build items — giữ logic Meili/DB fallback nguyên vẹn.

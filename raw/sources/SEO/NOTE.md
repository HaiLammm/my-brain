# NOTE — Rules tối ưu SEO cho bài viết (コラム)

Mục tiêu: bài `/columns/<slug>/` hiển thị trên Google giống trang chủ — **favicon logo 設**, **tên site**, tiêu đề có brand, mô tả, và **thumbnail**.

Tài liệu này ghi lại các quy tắc **bắt buộc** phải giữ. Vi phạm bất kỳ mục nào trong phần "Rules" đều làm mất thumbnail hoặc rich result.

---

## 1. Rules — structured data

### R1. Mọi URL trong JSON-LD phải TUYỆT ĐỐI
Google **bỏ qua** đường dẫn tương đối trong structured data (khác với `og:image`, được trình duyệt tự resolve). Đây từng là lỗi khiến bài viết không có thumbnail.

- Dùng helper `absoluteUrl()` trong `src/utils/schema.ts`, hoặc `new URL(path, Astro.site).href` ở page.
- Áp dụng cho: `Article.image`, `publisher.logo.url`, `Organization.logo`, `LocalBusiness.image`.

```ts
// ĐÚNG
image: [absoluteUrl(post.image)]   // → https://www.setsubi-pro.net/_astro/xxx.webp
// SAI
image: post.image                  // → /images/SEO/xxx.jpg
```

### R2. `Article.image` là MẢNG, cạnh dài ≥ 1200px
Google khuyến nghị ≥1200px. Ảnh hero hiển thị trên trang giữ 800×450 cho LCP; riêng ảnh dùng cho OG + schema xuất bản 1200×675 (biến `shareImageSrc` trong `src/pages/columns/[...slug].astro`).

**Không phóng to quá kích thước gốc** — helper `sized()` trong file đó tự cắt xuống `min(target, heroMeta.width)`. Ép ảnh 670px lên 1200px chỉ làm file nặng hơn chứ không thêm chi tiết.

### R2b. Ảnh nguồn phải nằm trong `src/assets/images/`, KHÔNG chỉ trong `public/`
`resolveImage()` (`src/utils/imageImports.ts`) chỉ glob `/src/assets/images/**`. Ảnh chỉ có trong `public/` sẽ **không được tối ưu chút nào** — phục vụ nguyên JPEG gốc và JSON-LD trỏ tới file thô.

Quy ước: mỗi ảnh thumbnail tồn tại ở **cả hai** nơi, cùng đường dẫn:
```
public/images/SEO/<slug>/thumbnail.jpg      ← frontmatter trỏ vào đây
src/assets/images/SEO/<slug>/thumbnail.jpg  ← Astro dùng để tối ưu
```

### R2c. ⚠️ 18 bài đang có ảnh nguồn dưới 1200px
Đã tối ưu hết mức có thể, nhưng ảnh gốc quá nhỏ nên **không đạt chuẩn Google**. Cần thay ảnh nguồn ≥1200px (lý tưởng 1920×1080) ở **cả hai** thư mục:

| Rộng (px) | Bài |
|---|---|
| 485 | `waterheater-unsual-odor` |
| 569 | `waterheater-water-leak` |
| 577 | `breaker-keeps-tripping` |
| 578 | `breaker-trip-cannot-reset` |
| 579 | `light-noisy` |
| 580 | `waterheater-unsual-noise` |
| 596 | `power-outlet-no-power` |
| 618 | `power-outlet-spark` |
| 619 | `power-outlet-hot` |
| 664 | `light-dim-suddenly` |
| 670 | `bathtub-cracked-what-to-do` |
| 671 | `bathtub-water-leak`, `light-not-working` |
| 672 | `light-flickering` |
| 673 | `led-not-working`, `light-turn-off-suddenly`, `power-outlet-electrical-leakage` |
| 674 | `waterheater-turn-off-suddenly` |

13 bài còn lại đã đạt đủ 1200×675.

### R3. `publisher` phải có `logo` dạng `ImageObject`
Bắt buộc cho Article rich result. Đã xử lý trong `generateArticle()` qua `buildLogo()`.

### R4. Toàn site phải có `Organization` + `WebSite`
Phát ở `src/layouts/BaseLayout.astro` nên **mọi** trang đều có. Đây là tín hiệu Google dùng để hiện **tên site** thay vì domain trần, và để chọn logo/favicon.

- `Organization` mang `@id` cố định `https://www.setsubi-pro.net/#organization`.
- Bất kỳ node `Organization` nào khác nói về chính công ty (ví dụ `generateAggregateRating` ở `/voice`) **phải dùng lại đúng `@id` đó**, nếu không Google thấy hai thực thể trùng tên trên cùng trang.

### R5. Article phải có `inLanguage: 'ja'` và `isPartOf`
Làm rõ quan hệ bài viết ↔ site. Đã có trong `generateArticle()`.

### R6. Mỗi bài phải có `BreadcrumbList`
Do component `src/components/Breadcrumb.astro` tự phát. Đừng bỏ `<Breadcrumb>` khỏi trang bài.

---

## 2. Rules — thẻ `<head>`

### R7. `max-image-preview:large` là bắt buộc
```html
<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
```
Thiếu dòng này Google **chỉ được phép** hiện thumbnail cỡ nhỏ. Đặt ở `BaseLayout.astro`, áp dụng toàn site — không xoá.

### R8. Bộ favicon khai báo đủ 4 mức
`favicon.ico` (48+32) · `icon-192.png` · `icon-512.png` · `apple-touch-icon.png` (180). Favicon là thuộc tính **cấp domain**: đổi một lần là áp cho mọi trang, kể cả bài viết.

### R9. Separator tiêu đề dùng `｜` (全角), không dùng `|`
Thống nhất toàn site: `{tiêu đề}｜設備プロ`.

### R10. og:image dùng bản 1200×675, không dùng bản hero 800px
`ogImage={shareImageSrc}` chứ không phải `heroImageSrc`.

---

## 3. Rules — nội dung bài (frontmatter)

### R11. Độ dài tiêu đề
Google mobile JP cắt ở **~30–32 ký tự**. Tiêu đề bài nên **≤ 24 ký tự** để còn chỗ cho hậu tố `｜設備プロ` (5 ký tự).

> Hiện trạng: nhiều bài đang 24–37 ký tự → tổng 31–44, phần brand bị cắt. Sửa ở **nguồn sinh bài** `~/Projects/auto_workflow/seo-cockpit/generateWorker.ts`, **không vá từng file markdown**.

### R12. Độ dài mô tả
SERP tiếng Nhật hiển thị **~70–80 ký tự**. Đặt thông tin quan trọng nhất trong 70 ký tự đầu. Hiện nhiều bài 80–112 ký tự nên bị cắt đuôi.

### R13. Frontmatter bắt buộc
`title`, `description`, `publishedDate`, `updatedDate`, `category`, `subcategory`, `image`, `imageAlt`.
`image` phải trỏ tới file thật tồn tại ở **cả** `public/images/SEO/` **và** `src/assets/images/SEO/` (xem R2b), cạnh dài ≥1200px. Thiếu ảnh là mất thumbnail; thiếu bản trong `src/assets` là mất tối ưu.

### R14. `updatedDate` điều khiển `lastmod` trong sitemap
`astro.config.mjs` đọc trực tiếp frontmatter. Sửa bài thì cập nhật `updatedDate`, đừng để ngày giả.

---

## 4. Những gì KHÔNG kiểm soát được bằng code

- **Thời điểm Google hiện favicon/thumbnail** phụ thuộc lịch recrawl. Sau deploy, dùng Search Console → URL Inspection → *Request indexing* cho vài bài đại diện.
- Google **không đảm bảo** hiện thumbnail cho mọi kết quả; markup đúng chỉ là điều kiện cần.
- Tên site (`設備プロ` thay cho `www.setsubi-pro.net`) Google áp ở cấp domain và cần thời gian xác nhận.

---

## 5. Checklist trước khi deploy

```bash
npm run build

# 1. Article.image phải là URL tuyệt đối, dạng mảng
grep -o '"image":\[[^]]*\]' dist/columns/<slug>/index.html

# 2. Ảnh share đúng 1200×675
identify dist/_astro/<hash>.webp

# 3. Có meta robots
grep -o 'max-image-preview[^"]*' dist/columns/<slug>/index.html

# 4. Có đủ node JSON-LD: Organization, WebSite, Article, BreadcrumbList
node -e 'const h=require("fs").readFileSync(process.argv[1],"utf8");
[...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
 .flatMap(b=>[].concat(JSON.parse(b[1].replace(/\\u003c/g,"<"))))
 .forEach(n=>console.log(n["@type"], n["@id"]||""))' dist/columns/<slug>/index.html
```

Sau deploy: kiểm tra URL bài bằng **Google Rich Results Test** và **Schema Markup Validator** — Article phải hợp lệ, không cảnh báo về `image` / `publisher.logo`.

---

## 6. File liên quan

| File | Vai trò |
|---|---|
| `src/layouts/BaseLayout.astro` | `<head>` toàn site: favicon, meta robots, OG/Twitter, JSON-LD `Organization`+`WebSite` |
| `src/utils/schema.ts` | Tất cả generator JSON-LD; `absoluteUrl()`, `buildLogo()`, `ORGANIZATION_ID` |
| `src/utils/siteConfig.ts` | `companyName`, `companyNameKana`, `logoPath`, `siteUrl` |
| `src/utils/imageImports.ts` | `resolveImage()` — chỉ tìm trong `src/assets/images/**` |
| `src/pages/columns/[...slug].astro` | Trang bài: sinh ảnh 800px (hero) + 1200px (share), gọi `generateArticle` |
| `src/components/Breadcrumb.astro` | Breadcrumb hiển thị + `BreadcrumbList` JSON-LD |
| `astro.config.mjs` | Sitemap + `lastmod` theo `updatedDate` |
| `public/robots.txt` | Allow all, chặn `/admin/`, trỏ sitemap |

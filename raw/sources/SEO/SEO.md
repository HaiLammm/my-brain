# SEO.md — Bản đồ SEO setsubi-pro.net: đã làm, cố ý không làm, và chưa làm

Cập nhật: 2026-09-25 · Số liệu đo trên build ngày 2026-09-25

## Kết luận trước, chi tiết sau

**Site sạch về kỹ thuật nhưng không có gì đẩy nó lên hạng.** Phần thực thi (URL, schema, tốc độ,
index) đã làm kỹ và có gác cổng. Phần chiến lược — bản đồ keyword, đo lường, backlink, đối thủ —
chưa từng làm (§8). Làm hết danh sách kỹ thuật ở §10 mà bỏ §8 thì kết quả vẫn không đổi.

**Thứ tự nên làm, từ đòn bẩy cao nhất:**

1. **Đo lường** (§8.3) — chưa có GA4, chưa đo tap-to-call. Không có số thì mọi việc sau đều là đoán,
   và không chứng minh được giá trị của những gì đã làm.
2. **Bản đồ keyword & kiến trúc chủ đề** (§8.1) — quyết định *viết gì* có đòn bẩy lớn hơn *viết chuẩn thế nào*.
3. **Sửa 3 lỗi sự thật đang ship** (§10 mục 1–3) — ảnh preview dưới chuẩn trên 60/73 bài,
   `aggregateRating` tự đăng đang phát ra, gác cổng trailing-slash không chạy tự động.
4. Đối thủ (§8.4) → backlink (§8.2) → vòng đời nội dung (§8.5).

**Quy ước đọc tài liệu này:** `§N` không kèm tên file = mục trong **chính file này**.
Tham chiếu sang tài liệu khác luôn ghi rõ `NOTE.md §N`.

> Nguyên tắc xuyên suốt: **lỗi nội dung sửa ở nguồn sinh bài
> (`~/Projects/auto_workflow/seo-cockpit`, `generateWorker.ts`), không vá từng file markdown.**
> Và **thiếu tín hiệu còn hơn tín hiệu sai** — không bịa `updatedDate`, không bịa tác giả,
> không bịa review.

---

## 1. Hiện trạng bằng số

Mọi số dưới đây đo lại trên build ngày 2026-09-25. **Không có script nào canh các số này** — xem §10 mục 6.

| Chỉ số | Giá trị |
|---|---|
| Bài viết (コラム — dưới đây gọi tắt "bài") | 73 |
| Trang build ra | 128 |
| Sitemap | 126 `<loc>` / 73 `<lastmod>` |
| — vì sao 126 chứ không 128 | `astro.config.mjs:59` loại `/admin/*` và `/404/` khỏi sitemap |
| — vì sao 73 `<lastmod>` | `lastmod` chỉ gắn cho bài (1 bài = 1 mốc), đúng thiết kế `NOTE.md` R14 |
| FAQ collection | 35 mục |
| Testimonial | 17 mục |
| Lighthouse mobile | 99–100 (đo ngoài repo, xem §12) |
| Trang có `FAQPage` | 14 (trang chủ, 2 hub, 9 trang dịch vụ, `/faq/`, 1 bài) |
| Trang có `speakable` | 73 — nhưng hiện không mang lại giá trị, xem §7 |
| Trang có `HowTo` | 1 (`columns/breaker-tripping/`) |
| Bài có ảnh preview đạt ≥1200px | **13/73** — xem §10 mục 1 |
| GBP đã xác minh | 1 (設備プロ, khu vực 関西) — đã gắn vào 大阪営業所 |

---

## 2. Technical SEO

| Hạng mục | Đã làm | Chi tiết |
|---|---|---|
| Một URL canonical duy nhất | non-www → www 301 qua rule `has: host` (`vercel.json:165-175`), mọi URL nội bộ có trailing slash, canonical tuyệt đối | `NOTE.md`: R15–R18, §8.1–8.2 |
| Bản đồ 301 | `vercel.json` giữ 33 redirect slug cũ → mới, tất cả `statusCode: 301`, 10 bản percent-encoded cho URL tiếng Nhật | `NOTE.md` R18 |
| Gác cổng CSP — **tự động** | `scripts/check-csp.mjs` hash mọi inline script và `exit(1)` nếu lệch. Có trong `npm run build` → **thật sự chặn deploy** | `NOTE.md` R19 |
| Gác cổng trailing-slash — **KHÔNG tự động** | `scripts/check-trailing-slash.mjs` chỉ chạy qua `npm run verify` (thủ công). **Không** nằm trong `npm run build`, và không CI nào chạy nó — header của chính script ghi rõ chủ ý đó | `NOTE.md` R15, R16 |
| Sitemap | `@astrojs/sitemap` + `serialize()` gắn `lastmod` thật từ frontmatter từng bài | `NOTE.md`: R14, §9.3 |
| robots.txt | Allow all, chặn `/admin/`, khai báo sitemap và `Llms-txt:` | `public/robots.txt` |
| Security header | HSTS, X-Frame-Options, CSP không có `unsafe-inline` trong `script-src` (2 hash cho astro-island). **Lưu ý:** CSP chỉ áp cho source `/((?!admin).*)` → `/admin/*` không có CSP | `NOTE.md`: R19, §10.4 |
| Core Web Vitals | 58 → 99–100 mobile: bỏ webfont Google (dùng JP system font), ảnh webp qua Astro `<Image>`, cắt React/Swiper khỏi critical path | `NOTE.md` §9.6 |
| Ảnh có width/height | 2.437 thẻ `<img>` trong `dist`, 0 thẻ thiếu `width`/`height` — đã đo | `NOTE.md` §9.5 |
| Ảnh tối ưu — **quy ước, không có gác cổng** | Luật: nguồn phải nằm trong `src/assets/images/`. Thực tế **197 file `.jpg`/`.png` vẫn được serve thô từ `public/images/`** (thư mục 62MB) | `NOTE.md` R2b |
| Redirect 2 hop `http://apex` | **Cố ý giữ** — xem §9 | `NOTE.md` §10.3 |

## 3. Structured data (JSON-LD)

Tất cả phát qua generator trong `src/utils/schema.ts` — **không bao giờ inline JSON-LD trong page**.

| Loại | Ở đâu (đo trên dist) |
|---|---|
| `Organization` + `WebSite` | toàn site (BaseLayout) |
| `LocalBusiness` (`["Plumber","Electrician"]`) | **6 trang**: trang chủ, `/water/`, `/electricity/`, `/company/office/`, và cả `/company/`, `/company/philosophy/`. Ba trang sau phát 3 node mỗi trang — xem §10 mục 4 |
| `Service` | 9 trang dịch vụ — kèm `areaServed` (`schema.ts:355`) |
| `priceRange` | chỉ 1 trang: `/company/office/` (`company/office.astro:19`) |
| `FAQPage` | 14 trang (xem §1) |
| `Article` | 73 bài — có `dateModified`, `mainEntityOfPage`, `isPartOf`, `inLanguage: ja`, `author: Organization`, `image` dạng mảng. **Nhưng chỉ 13/73 ảnh đạt ≥1200px** |
| `BreadcrumbList` | mọi trang có breadcrumb |
| `AggregateRating` + `Review` | **3 trang**: trang chủ, `/voice/`, `/voice/2/`. Gắn vào `Organization`, dựng từ 17 testimonial tự đăng, `ratingValue 5.0`. Phát 17 node `Person`. **Xung đột với luật ở §9** — xem §10 mục 2 |
| `HowTo` | chỉ bài có cụm `**手順N：…**` thật hiển thị (1 bài) |
| `speakable` | 73 bài, `cssSelector: ["#article-title"]` |

Luật: URL trong JSON-LD tuyệt đối, `publisher.logo` là `ImageObject`, node trùng phải có `@id`
(`NOTE.md` R1–R6).

## 4. Nội dung & on-page

- **Meta description**: đo hiện tại — cả 127 trang index được đều có description, **0 trùng lặp**.
  (Con số "82/82 trang" trong `NOTE.md` §9.4 là hiện trạng lúc đợt sửa 8/2026, không phải hôm nay.)
- Độ dài tiêu đề/mô tả có luật `NOTE.md` R11–R12. Separator tiêu đề dùng `｜` toàn角.
- `max-image-preview:large` bắt buộc (`NOTE.md` R7); favicon đủ 4 mức (R8).
- **og:image**: thiết kế là bản 1200×675 (`NOTE.md` R10), nhưng đo thực tế **chỉ 13/128 trang đạt**.
  54 trang dùng `defaultOgImage` = `/images/staff_bg.jpg` ở **1170×520** (thiếu 30px so với ngưỡng
  1200px); 61 trang bài dùng lại ảnh hero 485×274 → 724×410. Xem §10 mục 1.
- **Phân trang**: `/columns/`, `/voice/`, `/case/` dùng self-referencing canonical cho từng trang
  (trang 2 canonical về chính trang 2) — `columns/[...page].astro:39`, `voice/[...page].astro:51`.
  Đây là cách Google khuyến nghị hiện hành; `rel=prev/next` đã bị Google bỏ hỗ trợ từ 2019 nên không cần thêm.
- **hreflang**: có `hreflang="ja"` và `hreflang="x-default"` trỏ về chính canonical
  (`BaseLayout.astro:44-45`). Site đơn ngữ nên đây là khai báo tối thiểu đúng — không thêm locale
  nào khác khi chưa có bản dịch thật.
- **noindex**: `BaseLayout` có prop `noIndex` → phát `noindex, follow` và bỏ luôn canonical cùng
  hreflang (đúng: không nên vừa noindex vừa canonical). Đang dùng ở `404.astro:11`.
  `/admin/analytics` tự khai `noindex, nofollow` riêng.
- Internal linking: trang chủ liên kết tới toàn bộ bài; related posts theo subcategory; mục lục
  H2/H3 đánh số trong mỗi bài; card ca thực tế trỏ về trang dịch vụ.
- Luật viết bài cho tác giả và CMS: `CONTENT_GUIDE.md`.

## 5. Index & phân phối

| Hạng mục | Trạng thái |
|---|---|
| Google Search Console | property `sc-domain:setsubi-pro.net`. Kiểm index qua GSC, không dùng `site:` |
| Sự cố 70/108 trang không index | Đã xử lý 13–14/9/2026: gốc là trailing slash và 3 lỗi ở pipeline sinh bài (link thiếu `/`, slug sai gây 404, `updatedDate` bị dập hàng loạt) — `NOTE.md` §8 |
| IndexNow | GitHub Action `indexnow.yml` chạy sau khi Vercel deploy thành công, diff theo lần deploy trước, ping **Bing, Yandex, Naver, Seznam** (`scripts/indexnow.mjs:2-3` — 4 engine, không có Yep). **Google không dùng IndexNow** — `NOTE.md` §10.1 |
| — giới hạn | `BLOG_FILE_RE` chỉ khớp `src/content/blog/**` → thay đổi ở trang dịch vụ, hub, FAQ **không bao giờ được ping** |
| RSS | `@astrojs/rss` |
| Analytics | Chỉ Vercel Web Analytics (`BaseLayout.astro:62`), có trên 127/128 trang. Không có GA4 — xem §8.3 |

## 6. MEO / Google Business Profile

**Phía website — đã xong** (`NOTE.md` §11.1): schema `LocalBusiness` khớp 2 danh mục GBP, toạ độ
geocode từ API 国土地理院 (`site.ts:111` cho 関東, `:127` cho 大阪; `hyogo` tại `:135` **không** có
toạ độ vì chưa có số nhà — không bịa), `OfficeMap.astro` nhúng Google Maps không cần API key và
không gây CLS, NAP thống nhất lấy từ `REGIONAL_OFFICES` trong `src/config/site.ts`.

GBP đã xác minh cho 関西 được gắn qua CID vào 大阪営業所 (`src/config/site.ts:129`) → schema
`sameAs`/`hasMap` và nút 「Googleマップで見る」 tự trỏ về đó.

**[chủ DN] Phía ngoài website** (`NOTE.md` §11.2, cần tài khoản Google và mã xác minh):
tạo GBP cho 関東営業所; hoàn thiện hồ sơ (mô tả 750 ký tự, từ 10 ảnh thật, danh sách dịch vụ);
**thu review đều đặn** (yếu tố xếp hạng lớn nhất sau khoảng cách); đăng 1 bài mỗi tuần; citation
cùng NAP trên Yahoo!プレイス, Bing Places, Apple Business Connect, iタウンページ, くらしのマーケット.

> Tên GBP phải là `設備プロ` — nhồi từ khoá vào tên là vi phạm, bị suspend. Địa chỉ và điện thoại
> phải **trùng từng ký tự** với `REGIONAL_OFFICES`.

## 7. AIO / GEO (tối ưu cho AI search)

| Hạng mục | Trạng thái |
|---|---|
| `llms.txt` | **Xong, có nợ** — `public/llms.txt` liệt kê dịch vụ, giá, NAP, trang chính. Viết tay: mỗi lần CMS publish bài mới, nội dung lệch khỏi content collection cho tới khi ai đó sửa tay → §10 mục 9 |
| Crawler AI | **Xong** — robots.txt Allow all, không chặn crawler nào |
| `FAQPage` trên bài | **Hạ tầng xong, chưa có dữ liệu** — field `faq` optional trong Zod, render qua `FAQAccordion` (variant `article`), phát `FAQPage` có guard. Mới 1/73 bài có `faq:` → §10 mục 7 |
| Chặn markup rỗng | **Xong** — `generateFAQ` trả `null` khi rỗng (`schema.ts:371`); Zod chặn chuỗi rỗng và toàn khoảng trắng (`content.config.ts:100-101`) → build fail nêu đúng file |
| `speakable` | **Có nhưng chưa mang lại giá trị** — Google chỉ dùng speakable cho nội dung dạng news, và bài chưa có element tóm tắt để trỏ, nên selector duy nhất resolve được là `<h1>`. Chỉ có ý nghĩa sau khi bài có `#article-summary` (§10 mục 8) |
| `HowTo` | **Xong ở mức tối đa hợp lệ** — 1 bài. Google đã ngừng rich result HowTo từ 9/2023; giá trị còn lại là cho Bing và AI hiểu cấu trúc |
| Answer-first | **Chưa làm** — mở bài là văn kể chuyện, không có câu trả lời trực tiếp ở 1–2 câu đầu; 0/73 bài có heading `## まとめ` → §10 mục 8 |

Chi tiết đợt 25/9/2026: `_bmad-output/implementation-artifacts/spec-column-faq-and-speakable-schema.md`.

---

## 8. Trụ cột chưa có — vùng mù của dự án

Các mục §2–§7 kể việc *đã thực thi*. Mục này kể những trụ cột **chưa từng làm**, để sự thiếu vắng
không bị chìm giữa một danh sách toàn mục đã xong. Đây là lý do một site sạch về kỹ thuật vẫn
không lên hạng.

### 8.1 Chiến lược keyword & kiến trúc chủ đề — lỗ hổng lớn nhất

Không tồn tại bản đồ keyword cấp site. Không tài liệu nào trả lời được:

- 73 bài đang nhắm keyword chính nào, bài nào trùng với bài nào (*cannibalization*)?
- Intent từng URL là gì (thông tin, so sánh, giao dịch, điều hướng)?
- Dịch vụ nào chưa có bài chống lưng, cụm chủ đề nào mỏng?
- Cấu trúc *hub-and-spoke* ra sao: hub là `/water/` và `/electricity/`, bài nào là spoke, ma trận
  internal link giữa chúng thế nào?

Dấu vết duy nhất: `docs/seo-01..05-*.md` — 5 bài mẫu **từ tháng 5/2026**, mỗi file có keyword chính,
keyword phụ, meta và slug đề xuất. Giai đoạn đầu có tư duy keyword nhưng dừng ở 5 bài, giờ đã 73.
**5 file này đã cũ, đừng coi là bản đồ hiện hành.**

Hệ quả: quyết định "viết bài gì tiếp" hiện dựa vào cảm tính, và không ai biết bài mới có cạnh tranh
với bài cũ hay không.

Công cụ có sẵn: skill `claude-seo:seo-cluster` (phân cụm bằng SERP overlap, phân loại intent,
thiết kế hub-and-spoke, sinh ma trận internal link) và `claude-seo:seo-plan`.

### 8.2 Off-page (backlink) — trắng hoàn toàn

Cả file này lẫn `NOTE.md` (811 dòng) **không có một chữ nào** về off-page: chưa từng kiểm backlink
profile, chưa có chiến lược xây link, chưa có digital PR. Citation duy nhất được nhắc là citation
local ở §6, phục vụ MEO chứ không phải authority.

Với ngành sửa chữa thiết bị gia dụng ở Nhật, cạnh tranh với các aggregator lớn, đây là trụ cột bỏ
trống hoàn toàn. Skill có sẵn: `claude-seo:seo-backlinks`.

### 8.3 Đo lường — chưa trả lời được "SEO có hiệu quả không?"

`BaseLayout.astro:62` chỉ nhúng Vercel Web Analytics. Grep toàn repo: **không có GA4, không có
gtag, không có dataLayer**. Những gì đang không đo được:

| Không đo được | Vì sao quan trọng ở đây |
|---|---|
| **Conversion** | Với dịch vụ 24h, **tap-to-call là conversion chính**. Số điện thoại không gắn event nào → không biết bài nào tạo ra cuộc gọi |
| Submit form liên hệ | Formspree không báo về analytics |
| Phân bổ kênh | Không tách được organic, Maps, direct. UTM cho GBP đã thiết kế (`NOTE.md` §11.2) nhưng không có GA4 để đọc |
| Baseline GSC | Không lưu mốc impression, click, CTR, vị trí trung bình → không so được trước và sau mỗi đợt sửa |
| Thứ hạng keyword | Không theo dõi |

Vercel Web Analytics chỉ đếm pageview. Dòng "Analytics" ở §5 nghĩa là *đã nhúng*, **không phải đã đo lường**.

> Có sẵn một nửa: `src/pages/admin/analytics.astro` là trang dashboard GA4 đã build, nhưng chỉ có
> hướng dẫn setup GA4 Embed API / Looker Studio với placeholder `GA_CLIENT_ID` / `GA_PROPERTY_ID`.
> Bắt đầu từ đây chứ không dựng lại từ đầu.

Hệ quả: mọi đợt tối ưu từ 5/2026 tới nay chưa có bằng chứng định lượng về hiệu quả — chỉ có bằng
chứng kỹ thuật (Lighthouse, số trang index).

### 8.4 Đối thủ — chưa từng benchmark

Không tài liệu nào so sánh với đối thủ: họ xếp hạng bằng cụm chủ đề nào, sâu bao nhiêu, cấu trúc
dịch vụ và khu vực ra sao, profile backlink thế nào. `claude-seo:seo-competitor-pages` và
`bmad-deep-recon` (loại `competitive`) phục vụ việc này.

### 8.5 Vòng đời nội dung — chưa có nhịp

Chưa có quy trình refresh bài cũ theo hiệu suất, chưa có tiêu chí prune hoặc gộp bài mỏng và trùng
intent. `updatedDate` chỉ đổi khi có sửa thật (đúng `NOTE.md` R14), nhưng không ai định kỳ xem bài
nào nên sửa.

---

## 9. Cố ý không làm — đừng "sửa"

Những thứ trông như lỗi nhưng là quyết định có lý do. Sửa lại là làm hỏng.

| Thứ | Vì sao giữ |
|---|---|
| Redirect 2 hop `http://apex` → `https://apex` → `https://www` | Không gộp được trên Vercel (CDN ép HTTPS trước khi request tới `vercel.json`), và 2 hop là **điều kiện bắt buộc của HSTS preload**. Google theo tới 10 hop nên 2 hop không ảnh hưởng crawl. `NOTE.md` §10.3 |
| Landing page hàng loạt theo thành phố | Doorway page. Chỉ làm trang khu vực khi có nội dung riêng thật. `NOTE.md` §11.3 |
| `Person` cho 監修者 | Bịa chứng chỉ là tín hiệu E-E-A-T giả. `Article.author` giữ `Organization` cho tới khi có người thật đứng tên. (Khác với 17 `Person` trong review — xem §10 mục 2) |
| `style-src 'unsafe-inline'` trong CSP | Hơn 8.100 thuộc tính `style=""` trong dist; thêm hash vào `style-src` khiến browser bỏ qua `unsafe-inline` → vỡ giao diện. `NOTE.md` R19 |
| Webfont Google | Đã bỏ có chủ đích để triệt CLS (story 6.3). Đừng thêm lại |
| Suy "bước" từ văn xuôi để tăng số bài có `HowTo` | Structured data không khớp nội dung hiển thị là vi phạm guideline |
| **[chủ DN]** GBP cho 兵庫営業所 | Chưa có địa chỉ thật. Listing địa chỉ ảo bị suspend |

> Luật gốc ở `NOTE.md` §11.3 nói **không** gắn `aggregateRating` từ review tự đăng. Luật đúng,
> nhưng markup hiện tại **đang vi phạm nó** — xem §10 mục 2.

---

## 10. Việc còn tồn

> Mục này là việc tồn ở **tầng thực thi**. Tầng chiến lược ở §8 có đòn bẩy cao hơn mọi mục dưới đây.

**Sai sự thật đang ship — sửa trước:**

1. **Nâng ảnh preview lên ≥1200px.** Đo được: chỉ 13/73 bài có `Article.image` đạt ngưỡng, 60 bài
   còn lại từ 485×274 đến 724×410; `defaultOgImage` (`/images/staff_bg.jpg`) là 1170×520, thiếu
   30px. Astro không upscale nên phải **thay ảnh nguồn**, không sửa code. Gốc: `NOTE.md` R2c ghi
   "18 bài" — con số thật là 60.
2. **Xử lý `aggregateRating` tự đăng.** 3 trang (trang chủ, `/voice/`, `/voice/2/`) đang phát
   `aggregateRating` 5.0/17 review gắn vào `Organization`, kèm 17 node `Person`. Đây đúng là mẫu
   *self-serving review* mà §9 tuyên bố tránh — chính sách review snippet của Google áp cho
   `Organization` y như `LocalBusiness`. Thêm nữa `/voice/2/` phát lại nguyên payload, nên cùng một
   aggregate xuất hiện trên 3 URL. Quyết định: bỏ khỏi markup, hoặc thu hẹp phạm vi luật ở §9 kèm lý do.
3. **Đưa `check:slashes` vào gác cổng thật.** Hiện chỉ chạy khi người gõ `npm run verify`; không CI
   nào chạy build hay verify (`.github/workflows/` chỉ có `indexnow.yml`). Một deploy có thể ship
   regression trailing-slash mà không gì fail.
4. **Rà `LocalBusiness` trên `/company/` và `/company/philosophy/`** — 2 trang này không có trong
   thiết kế ban đầu và mỗi trang phát 3 node, có vẻ ngoài ý định.

**Hạ tầng đã có, thiếu dữ liệu — nằm ở `seo-cockpit`, không phải repo này:**

7. **Dạy `generateWorker.ts` sinh block `faq`** cho bài mới và backfill 72 bài còn lại. Hạ tầng
   FAQPage đã xong nhưng chưa có dữ liệu để chạy.
8. **Viết lại mở bài theo answer-first** và thêm heading `## まとめ`. Đây là thứ AI engine thật sự
   trích, và là điều kiện để `speakable` có ý nghĩa (`#article-summary`).

**E-E-A-T — điểm yếu lớn nhất còn lại:**

5. Gắn tác giả và người giám sát thật vào bài; tạo trang chứng chỉ nhân viên; hiện số giấy phép
   (電気工事士, 指定給水装置工事事業者…). Có người thật rồi mới gắn `Person`.
6. Thêm trích dẫn nguồn ngoài (nhà sản xuất, số liệu) trong bài.

**Kỹ thuật:**

9. Sinh `public/llms.txt` tự động từ content collection.
10. Viết `scripts/check-jsonld.mjs` và đưa vào `npm run verify`: kiểm mọi `speakable.cssSelector`
    khớp đúng 1 element, số `FAQPage`/`Question` khớp frontmatter, và các số ở §1 không tụt. Hiện
    xoá `id="article-title"` không làm gì fail.
11. Thêm `.sort()` cho mọi `getCollection` không sắp xếp. **Phạm vi rộng hơn một trang:** sau khi
    xoá `node_modules/.astro/data-store.json` và build lại, **19 file HTML cùng `rss.xml` đổi nội
    dung**. Nguồn gồm `[category]/[service].astro:39`, `voice/[...page].astro:16-17,22`,
    `index.astro:29-30,184` (nuôi `Review` JSON-LD), và `.sort()` theo ngày làm đảo bài cùng ngày.
12. Xoá file chết `src/content/config.ts` — nó là schema Astro 4 cũ, định nghĩa lại `services` +
    `testimonials` với `faqEntrySchema` dùng `z.string()` trần không có `.trim().min(1)`. Astro 5
    bỏ qua nó, nên guard ở §7 chỉ đúng nhờ may mắn; ai đó sửa schema vào file này sẽ không có tác dụng.
13. Mở rộng `/company/about/`. **Cảnh báo:** con số "817 ký tự" từ audit không tái tạo được
    (đo text nội dung chính hiện tại ra ~474 ký tự). Hướng đúng, mốc sai.
14. **[chủ DN]** Tạo và xác minh GBP cho 関東営業所; hoàn thiện ảnh, review, bài đăng cho GBP hiện có.
15. **[chủ DN]** Đăng ký くらしのマーケット, ユアマイスター, Yahoo!ロコ.
16. HSTS chưa có `preload`.

Danh sách đầy đủ kèm bằng chứng: `_bmad-output/implementation-artifacts/deferred-work.md`.

---

## 11. Claim không kiểm được từ repo

Những điều tài liệu này (và `NOTE.md`) khẳng định nhưng **không thể xác minh bằng code** — muốn
kiểm phải mở công cụ ngoài. Đừng coi chúng là sự thật đã chốt khi lập kế hoạch:

| Claim | Kiểm ở đâu |
|---|---|
| Lighthouse mobile 99–100, lịch sử 58 → 99 | PageSpeed Insights trên production |
| Trạng thái index, property GSC, sự cố 70/108 trang | Google Search Console |
| GBP đã xác minh, danh mục, khu vực (chỉ CID nằm trong repo) | business.google.com |
| Pipeline `seo-cockpit` và `generateWorker.ts` | `~/Projects/auto_workflow/seo-cockpit` |
| Chuỗi redirect 2 hop `http://apex`, hành vi HTTP thật | `curl -I` trên production |
| Mốc "34.6MB → 0.5MB" trước tối ưu | Không còn nguồn đo lại |
| "CORS wildcard trên HTML" (từ audit 8/9/2026) | **Không có bằng chứng trong repo**: `vercel.json` không có `Access-Control-Allow-Origin`, còn `cms-auth/src/index.js:30` dùng `env.ORIGIN` chứ không phải wildcard. Cần đo lại trên production trước khi hành động |
| Rule `has: host` non-www → www | Có trong `vercel.json:165-175`, nhưng hiệu lực thật phụ thuộc domain settings trên Vercel |

## 12. Tra chi tiết ở đâu

| Cần gì | Đọc |
|---|---|
| Luật bắt buộc R1–R19 + checklist trước deploy | `NOTE.md` §1–§6 |
| Bản đồ file → vai trò | `NOTE.md` §7 |
| Nhật ký sự cố index 70/108 trang | `NOTE.md` §8 |
| Các đợt SEO trước (5–9/2026) và tổng kết theo nhóm lỗi | `NOTE.md` §9 |
| IndexNow, HowTo, CSP | `NOTE.md` §10 |
| MEO / GBP | `NOTE.md` §11 |
| Luật viết bài cho tác giả và CMS | `CONTENT_GUIDE.md` |
| Quy ước code cho AI agent | `_bmad-output/project-context.md` |
| Ledger việc đã hoãn, kèm bằng chứng từng mục | `_bmad-output/implementation-artifacts/deferred-work.md` |
| Audit gốc ngày 8/9/2026 | `setsubi-pro.net-audit/ACTION-PLAN.md` |
| Generator JSON-LD | `src/utils/schema.ts` |
| NAP, office, GBP link | `src/config/site.ts` |
| Redirect map và security header | `vercel.json` |

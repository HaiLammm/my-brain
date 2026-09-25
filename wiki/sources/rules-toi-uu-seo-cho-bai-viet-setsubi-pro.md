---
type: source
title: NOTE — Rules tối ưu SEO cho bài viết (コラム) Setsubi-pro
slug: rules-toi-uu-seo-cho-bai-viet-setsubi-pro
date_added: 2026-08-11
authors:
  - Lương Hải Lâm
source_type: note
importance: 4
confidence: high
tags:
  - seo
  - technical-seo
  - structured-data
  - astro
  - setsubi-pro
raw_paths:
  - raw/sources/SEO/NOTE.md
provenance: replayable
id: sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
created: 2026-08-11
updated: 2026-08-11
year: 2026
ingest_status: finalized
verify_status: findings_pending
findings:
  - {id: 1, reviewer: blind, class: patch, claim: Google mobile tiếng Nhật cắt tiêu đề ở ~30–32 ký tự và mô tả ở ~70–80 ký tự, evidence: "Con số cụ thể về hành vi Google nhưng không có nguồn tham chiếu — chính mục Open questions của entry cũng thừa nhận chưa rõ ngưỡng lấy từ đâu. Google cắt theo pixel, không công bố giới hạn ký tự chính thức.", action: "Ghi rõ đây là quan sát/ngưỡng an toàn nội bộ, hoặc bổ sung nguồn tham chiếu; cân nhắc hạ độ tin cậy của claim này."}
  - {id: 2, reviewer: blind, class: defer, claim: "khác với og:image được trình duyệt tự resolve", evidence: "Diễn đạt chưa chính xác về chủ thể: og:image do các scraper/crawler (Facebook, Slack…) xử lý chứ không phải trình duyệt, và nhiều scraper cũng KHÔNG resolve URL tương đối. Điểm cốt lõi (JSON-LD cần URL tuyệt đối) không bị ảnh hưởng.", action: Đối chiếu cách nguồn gốc diễn đạt; nếu vế so sánh do wiki thêm vào thì sửa chủ thể hoặc bỏ vế so sánh.}
  - {id: 3, reviewer: grounding, class: defer, claim: 18/31 bài có ảnh dưới 1200px, evidence: "Nguồn (R2c) liệt kê bảng 18 bài và nói \"13 bài còn lại đã đạt đủ 1200x675\". Tổng 31 là phép cộng do wiki suy ra, không có trong nguồn. Không đổi so với lần verify trước.", action: Giữ nguyên; xác nhận lại tổng số bài khi có dịp.}
  - {id: 4, reviewer: grounding, class: defer, claim: Kiến trúc SEO do Lâm tự thiết kế (xác nhận 11/08/2026), evidence: "Raw NOTE.md không nêu tác giả; khẳng định quyền tác giả và cạnh authored_by đến từ xác nhận trực tiếp của người dùng ngày 11/08/2026 (entry đã ghi rõ), không phải từ raw.", action: Giữ nguyên — entry đã minh bạch về nguồn xác nhận ngoài tài liệu.}
  - {id: 5, reviewer: grounding, class: dismiss, claim: "Gộp ngưỡng tiêu đề và mô tả dưới cùng nhãn 'Google mobile tiếng Nhật'", evidence: "Raw tách hai ngữ cảnh: R11 nói 'Google mobile JP' cắt tiêu đề ~30–32; R12 nói 'SERP tiếng Nhật' hiển thị ~70–80 ký tự mô tả (không ghi rõ mobile). Entry gộp cả hai dưới một nhãn.", action: Khác biệt diễn đạt nhỏ; nếu muốn chính xác tuyệt đối thì tách riêng ngữ cảnh mô tả.}
  - {id: 6, reviewer: external, class: patch, claim: Google bỏ qua đường dẫn tương đối trong structured data — mọi URL trong JSON-LD phải tuyệt đối, evidence: "Tài liệu Google khuyến nghị URL tuyệt đối nhưng không có trang chính thức nào nói Google 'bỏ qua' URL tương đối trong JSON-LD; một thử nghiệm được ghi lại (sergeyski.com) cho thấy validator của Google resolve URL tương đối theo domain của trang. Phát biểu 'bỏ qua' mạnh hơn bằng chứng hiện có.", action: "Làm mềm claim: 'Google khuyến nghị URL tuyệt đối; hành vi với URL tương đối không được tài liệu hóa và không đáng tin cậy' — giữ quy tắc như một thực hành an toàn, không phải hành vi Google đã tài liệu hóa."}
  - {id: 7, reviewer: external, class: patch, claim: Mô tả bị cắt ở ~70–80 ký tự trên Google mobile tiếng Nhật, evidence: "Các nguồn SEO Nhật hiện hành (lucy.ne.jp, wacul-ai.com, nobilista.com…) báo mobile hiển thị ~50–70 ký tự mô tả (PC ~90–120); ngưỡng ~70–80 của entry cao hơn khoảng phổ biến cho mobile. Với tiêu đề, ~30–32 là ngưỡng an toàn/desktop, mobile có thể hiện tới ~41. Quy tắc tiêu đề ≤24 ký tự vẫn hợp lý.", action: Điều chỉnh ngưỡng mô tả mobile về ~50–70 ký tự (dồn ý chính vào 70 ký tự đầu); ghi chú 30–32 là ngưỡng an toàn xuyên thiết bị.}
  - {id: 8, reviewer: external, class: dismiss, claim: "Thiếu max-image-preview:large thì Google chỉ được phép hiện thumbnail cỡ nhỏ", evidence: "Blind reviewer nghi ngờ phát biểu bị đảo ngược, nhưng kiểm tra web xác nhận claim đúng theo spec robots meta tag của Google và thông báo 2019: 'large' là điều kiện cho preview lớn (đặc biệt Google Discover); không có nguồn nào bác bỏ.", action: Không cần hành động — claim được xác nhận.}
  - {id: 9, reviewer: external, class: dismiss, claim: Mọi node Organization cùng công ty phải dùng một @id cố định, evidence: "Xác nhận là best practice ngành (schemaapp.com…); tìm kiếm phản biện không thấy bằng chứng ngược. Cách diễn đạt 'Google thấy hai thực thể' là suy luận chứ không phải hành vi được Google tài liệu hóa, nhưng không có gì mâu thuẫn.", action: Không cần hành động.}
---

## Summary

Ghi chú kỹ thuật nội bộ liệt kê 16 quy tắc bắt buộc (đánh số R1–R14, thêm R2b và R2c) để bài viết `/columns/<slug>/` của Setsubi-pro hiển thị đầy đủ trên Google: favicon logo, tên site `設備プロ` thay cho domain trần, tiêu đề có brand, mô tả không bị cắt và thumbnail. Các quy tắc chia làm ba nhóm — dữ liệu có cấu trúc (JSON-LD), thẻ `<head>`, và frontmatter bài viết — kèm checklist kiểm tra trước khi deploy và bảng tra file chịu trách nhiệm. Tài liệu cũng ghi rõ phần Google không đảm bảo được bằng code (thời điểm recrawl, quyết định hiện thumbnail, xác nhận tên site) và một nợ kỹ thuật đang tồn: 18 bài có ảnh nguồn dưới 1200px.

## Key claims

- Mọi URL trong JSON-LD phải tuyệt đối — Google khuyến nghị URL tuyệt đối; hành vi với URL tương đối không được tài liệu hóa chính thức và không đáng tin cậy, nên coi đây là thực hành an toàn bắt buộc (độ tin cậy: cao cho quy tắc — rút từ lỗi thực tế đã làm mất thumbnail; riêng cách giải thích "Google bỏ qua URL tương đối" là suy đoán, có thử nghiệm bên ngoài cho thấy validator vẫn resolve được)
- `Article.image` phải là mảng, cạnh dài ≥1200px; ảnh hero giữ 800×450 cho LCP còn ảnh OG/schema xuất bản riêng ở 1200×675 (cao)
- Không phóng ảnh vượt kích thước gốc — chỉ làm file nặng thêm chứ không thêm chi tiết; helper tự cắt xuống `min(target, width gốc)` (cao)
- Ảnh chỉ nằm trong `public/` sẽ không được tối ưu chút nào vì bộ tối ưu chỉ glob `src/assets/images/**`; mỗi thumbnail phải tồn tại ở cả hai nơi với cùng đường dẫn (cao)
- 18/31 bài đang có ảnh nguồn 485–674px, dưới chuẩn Google, cần thay ảnh ≥1200px ở cả hai thư mục (cao — có bảng liệt kê từng bài)
- Mọi node `Organization` nói về cùng công ty phải dùng lại đúng một `@id` cố định, nếu không Google thấy hai thực thể trùng tên trên cùng trang (cao)
- Thiếu `max-image-preview:large` thì Google chỉ được phép hiện thumbnail cỡ nhỏ (cao)
- SERP tiếng Nhật hiển thị tiêu đề ~30–32 ký tự (ngưỡng an toàn xuyên thiết bị; mobile thực tế có thể hiện tới ~41) và mô tả ~50–70 ký tự trên mobile, ~90–120 trên PC (ghi chú gốc nêu ~70–80, cao hơn khoảng các nguồn SEO Nhật hiện hành báo cho mobile); tiêu đề bài nên ≤24 ký tự để còn chỗ cho hậu tố `｜設備プロ` (trung bình — ngưỡng ký tự là quan sát ngành, Google cắt theo pixel và không công bố giới hạn chính thức)
- Tiêu đề quá dài phải sửa ở nguồn sinh bài `generateWorker.ts`, không vá từng file markdown (cao — quyết định quy trình, không phải kỹ thuật)
- `updatedDate` trong frontmatter điều khiển trực tiếp `lastmod` của sitemap nên không được để ngày giả (cao)
- Markup đúng chỉ là điều kiện cần: Google không đảm bảo hiện thumbnail, và tên site áp ở cấp domain cần thời gian xác nhận (trung bình — mô tả hành vi bên ngoài, không kiểm chứng được bằng code)

## Evidence

- Ví dụ đối chiếu đúng/sai cho `Article.image`: `absoluteUrl(post.image)` cho ra `https://www.setsubi-pro.net/_astro/xxx.webp`, còn `post.image` cho ra `/images/SEO/xxx.jpg`
- Bảng 18 bài kèm chiều rộng ảnh thực tế, từ 485px (`waterheater-unsual-odor`) đến 674px (`waterheater-turn-off-suddenly`); 13 bài còn lại đã đạt 1200×675
- Checklist deploy gồm 4 lệnh kiểm tra trên thư mục `dist/`: grep `"image":[...]` phải là URL tuyệt đối dạng mảng, `identify` xác nhận ảnh share 1200×675, grep `max-image-preview`, và một script Node liệt kê `@type`/`@id` của mọi node JSON-LD để xác nhận đủ `Organization`, `WebSite`, `Article`, `BreadcrumbList`
- Bảng 8 file chịu trách nhiệm, từ `BaseLayout.astro` (head toàn site) tới `astro.config.mjs` (sitemap)
- Công cụ kiểm chứng sau deploy: Google Rich Results Test và Schema Markup Validator

## Related concepts

- [[concepts/seo/structured-data-url-tuyet-doi]]
- [[concepts/seo/thumbnail-serp-google]]
- [[concepts/seo/nhan-dang-site-tren-serp]]
- [[concepts/seo/gioi-han-hien-thi-serp-nhat]]
- [[concepts/swe/sua-tai-nguon-sinh]]
- [[concepts/swe/tai-san-ngoai-pipeline-build]]
- [[concepts/ops/chuan-hoa-bang-tai-lieu]] — bộ rules này là một ví dụ: viết tiêu chuẩn ra văn bản trước, sản xuất sau
- [[concepts/seo/mot-url-canonical-duy-nhat]]
- [[concepts/seo/meo-google-business-profile]]

## Related sources

- [[sources/review-seo]]
- [[sources/huong-dan-viet-bai-seo-cho-setsubi-pro]]
- [[sources/ke-hoach-noi-dung-blog-va-seo-cho-setsuki-pro]]
- [[sources/list-keyword-seo-setsubi-pro-thang-8-va-9]] — backlog từ khóa mà các quy tắc này áp lên khi xuất bản
- [[sources/ban-do-seo-setsubi-pro-net]] — bản đồ toàn cảnh 09/2026: đo lại hiện trạng theo các luật ở đây và bổ sung tầng chiến lược

## People

- [[people/luong-hai-lam]]

## Open questions

- 18 bài ảnh nhỏ sẽ thay ảnh nguồn từ đâu — chụp lại, mua stock, hay sinh bằng AI? Ghi chú chỉ nêu yêu cầu ≥1200px (lý tưởng 1920×1080) mà không nói nguồn ảnh.
- Việc sửa độ dài tiêu đề ở `generateWorker.ts` có áp dụng ngược cho 31 bài đã xuất bản không, hay chỉ cho bài sinh mới?
- Ngưỡng ký tự trong ghi chú gốc chưa kèm nguồn tham chiếu. Kiểm chứng web (08/2026): các nguồn SEO Nhật báo tiêu đề an toàn ~28–32 (mobile tới ~41), mô tả mobile ~50–70, PC ~90–120 — ngưỡng mô tả "~70–80" trong NOTE.md nên được cập nhật lại ở nguồn.
- Sau khi thay ảnh, có cách nào đo được Google đã cập nhật thumbnail ngoài việc kiểm tra thủ công trên SERP?

## Notes

Đây là **kiến trúc SEO kỹ thuật do Lâm tự thiết kế** cho Setsubi-pro (xác nhận 11/08/2026) — không phải tài liệu nhận từ khách hàng hay đối tác. Tài liệu là bản ghi lại các quyết định kiến trúc kèm lý do, trong đó nhiều quy tắc sinh ra từ lỗi thực tế đã trả giá (mất thumbnail vì URL tương đối, ảnh không được tối ưu vì đặt sai thư mục).

Ghi chú này là tài liệu vận hành sống, gắn với repo `setsubi-pro` (Astro) và pipeline sinh bài `~/Projects/auto_workflow/seo-cockpit/`. Nội dung mang tính đặc thù triển khai; phần chưng cất được vào wiki là các quy tắc còn đúng ngoài repo — xem sáu khái niệm liên quan ở trên.

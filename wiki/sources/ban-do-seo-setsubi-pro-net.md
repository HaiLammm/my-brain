---
type: source
title: "SEO.md — Bản đồ SEO setsubi-pro.net: đã làm, cố ý không làm, và chưa làm"
authors:
  - Lương Hải Lâm
source_type: note
importance: 4
confidence: high
tags:
  - seo
  - technical-seo
  - geo-aio
  - meo
  - setsubi-pro
raw_paths:
  - raw/sources/SEO/SEO.md
provenance: replayable
id: sources/ban-do-seo-setsubi-pro-net
created: 2026-09-25
updated: 2026-09-25
year: 2026
sources:
  - {provider: pdf, fetched_at: "2026-09-25T09:03:06Z"}
ingest_status: finalized
findings:
  - {id: 1, reviewer: grounding, class: defer, claim: "Frontmatter sources ghi provider: pdf trong khi raw_paths tro toi mot file Markdown cuc bo", evidence: "raw/sources/SEO/SEO.md la file Markdown 334 dong, khong phai PDF. Theo ghi nhan cua nguoi bao tri, build-source.mjs chi chap nhan cac provider slug arxiv/s2/pdf/wikipedia nen khong co gia tri nao khop dung loai tep nay. source_type: note o frontmatter da phan anh dung ban chat tai lieu.", action: Chap nhan pdf nhu gia tri xap xi cho toi khi build-source.mjs ho tro provider cho tep cuc bo. Khong can hanh dong ngay.}
  - {id: 2, reviewer: grounding, class: defer, claim: Cap canh introduces_concept tu sources/ban-do-seo-setsubi-pro-net toi concepts/seo/mot-url-canonical-duy-nhat va concepts/seo/meo-google-business-profile van con trong edges.jsonl, evidence: "SEO.md khong gioi thieu hai khai niem nay lan dau ma trich lai tu NOTE.md: §2 ghi nguon la NOTE.md R15-R18 cho canonical, §6 ghi NOTE.md §11.1 cho MEO/GBP. Loai canh dung hon la mentions hoac uses_concept. Giam nhe: than trang da them ghi chu minh bach rang hai khai niem duoc trich lai va tro ve sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro la trang goc; canh introduces_concept tu trang goc do toi hai concept da duoc them (edges.jsonl dong 3476-3479) cung lien ket nguoc trong hai trang concept. Viec go canh cu bi chan boi cong cu: wiki.mjs khong co lenh xoa canh va README cam sua tay edges.jsonl.", action: "Giu nguyen cho toi khi wiki.mjs co lenh xoa canh. Day la no ky thuat da duoc ghi nhan, khong phai loi noi dung."}
  - {id: 3, reviewer: grounding, class: dismiss, claim: "Quyen tac gia Luong Hai Lam (frontmatter authors, muc People, canh authored_by)", evidence: "raw/sources/SEO/SEO.md van khong neu ten tac gia o bat ky dau — dieu nay da duoc xac nhan lai bang grep. Tuy nhien muc People hien da minh bach dung dieu do: no ghi ro \"Ban than SEO.md khong neu ten tac gia\" va noi ro quyen tac gia den tu xac nhan truc tiep cua nguoi dung ngay 25/09/2026, nhat quan voi xac nhan truoc do cho NOTE.md (11/08/2026). Nguon xac nhan nam ngoai tai lieu da duoc khai bao tuong minh, dung tien le cua entry sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro (finding id 4).", action: Khong can hanh dong.}
  - {id: 4, reviewer: grounding, class: dismiss, claim: "Bon sua doi tu vong kiem chung truoc (F1, F3, F4, F6)", evidence: "Da doi chieu lai tung diem voi raw: (F1) \"liet ke 8 khang dinh\" — dung, bang §11 co dung 8 dong. (F3) \"duoc xep vao nhom chua ket luan: khong tim thay bang chung trong repo, can do lai tren production truoc khi hanh dong\" — khop nguyen van sac thai cua §11 cho dong CORS wildcard. (F4) bullet su co 70/108 trang gio ghi ro lien he voi luat sua o nguon sinh bai la suy luan cua wiki va tai lieu goc khong noi hai dieu do — dung voi nguon. (F6) da them [[concepts/seo/cau-truc-heading-seo]] vao Related concepts kem chu thich \"0/73 bai co heading tom ket ## matome\", khop §7 va §10 muc 8, va canh hai chieu uses_concept/used_in da co san trong edges.jsonl.", action: Khong can hanh dong.}
  - {id: 5, reviewer: grounding, class: dismiss, claim: "Toan bo con so, ten file/script va thuat ngu khai niem trong Summary / Key claims / Evidence / Open questions", evidence: "Kiem lai lan hai, van khop 100% voi SEO.md: 73 bai, 128 trang build, sitemap 126 loc / 73 lastmod, 35 FAQ, 17 testimonial, Lighthouse mobile 99-100 (§1); 13/73 bai dat nguong 1200px va 60/73 bai duoi chuan, defaultOgImage 1170x520 thieu 30px (§1, §3, §4, §10 muc 1); 2.437 the img va 0 the thieu width/height, 197 file anh tho trong public/images/ 62MB (§2); su co 70/108 trang 13-14/9/2026 (§5); aggregateRating 5.0 tu 17 review tren 3 URL (§3, §10 muc 2); IndexNow ping Bing/Yandex/Naver/Seznam va gioi han BLOG_FILE_RE (§5); 0/73 bai co heading matome (§7); 817 ky tu do lai ~474 (§10 muc 13); toa do 国土地理院 va hyogo khong co toa do (§6). Ten check-csp.mjs, check-trailing-slash.mjs, generateWorker.ts, seo-cockpit deu dung. Cac thuat ngu doorway page (§9), answer-first (§7, §10 muc 8), self-serving review (§10 muc 2), gac cong tu dong vs quy uoc (§2) deu co nguyen van trong nguon. Ghi chu moi trong Related concepts (\"§2 dan R15-R18; §6 dan §11.1\") cung khop dung nguon.", action: Khong can hanh dong.}
verify_status: findings_pending
---

## Summary

Bản đồ SEO toàn cảnh của site setsubi-pro.net, đo trên build ngày 25/09/2026. Tài liệu chia mọi hạng mục SEO thành ba nhóm — **đã làm**, **cố ý không làm** và **chưa làm** — thay vì chỉ liệt kê việc tồn, để sự thiếu vắng không bị chìm giữa một danh sách toàn mục đã xong. Luận điểm trung tâm: site đã sạch về mặt kỹ thuật (URL, schema, tốc độ, index) nhưng vẫn không lên hạng, vì toàn bộ tầng chiến lược — bản đồ keyword, đo lường, backlink, đối thủ — chưa từng được làm. Tài liệu cũng tự tách riêng những khẳng định không thể kiểm bằng code, để người đọc không coi chúng là sự thật đã chốt.

## Key claims

- Kỹ thuật sạch không đủ để lên hạng: làm hết danh sách kỹ thuật mà bỏ tầng chiến lược thì kết quả không đổi (độ tin cậy: cao — đây là luận điểm chủ đạo, có bằng chứng nội bộ là site sạch kỹ thuật nhưng chưa có số liệu thứ hạng)
- Thứ tự đòn bẩy giảm dần: đo lường → bản đồ keyword → sửa lỗi sự thật đang ship → đối thủ → backlink → vòng đời nội dung (cao)
- Không có GA4, gtag hay dataLayer trong toàn repo; chỉ có Vercel Web Analytics đếm pageview, nên "đã nhúng analytics" không đồng nghĩa "đã đo lường" (cao)
- Với dịch vụ sửa chữa 24h, **tap-to-call là conversion chính**, nhưng số điện thoại không gắn event nào — không biết bài nào tạo ra cuộc gọi (cao)
- Không tồn tại bản đồ keyword cấp site cho 73 bài: không biết bài nào trùng intent với bài nào, dịch vụ nào chưa có bài chống lưng (cao)
- Off-page hoàn toàn trắng: chưa từng kiểm backlink profile, chưa có chiến lược xây link (cao)
- Ba lỗi sự thật đang ship: 60/73 bài có ảnh preview dưới 1200px, `aggregateRating` 5.0 dựng từ 17 review tự đăng đang phát trên 3 URL, và gác cổng trailing-slash không chạy tự động (cao — đều đo được trên build)
- Một luật không có gác cổng tự động chỉ là quy ước: `check-csp.mjs` nằm trong `npm run build` nên thật sự chặn deploy, còn `check-trailing-slash.mjs` chỉ chạy thủ công nên regression có thể ship (cao)
- Nguyên tắc tín hiệu: **thiếu tín hiệu còn hơn tín hiệu sai** — không bịa `updatedDate`, không bịa tác giả giám sát, không bịa review (cao)
- Lỗi nội dung phải sửa ở nguồn sinh bài (`seo-cockpit`, `generateWorker.ts`), không vá từng file markdown (cao)
- `speakable` phát trên 73 bài nhưng hiện không mang lại giá trị: Google chỉ dùng speakable cho nội dung dạng news, và bài chưa có element tóm tắt để trỏ tới (trung bình — kết luận về hành vi Google không kiểm được từ repo)
- 0/73 bài có heading `## まとめ` và không bài nào mở đầu theo lối answer-first — đây mới là thứ AI engine thật sự trích (cao)
- Một số thứ trông như lỗi nhưng là quyết định có lý do và không được "sửa": redirect 2 hop `http://apex` (điều kiện bắt buộc của HSTS preload), `style-src 'unsafe-inline'`, việc không tạo landing page hàng loạt theo thành phố, việc không gắn `Person` cho 監修者 (cao)

## Evidence

- Bảng hiện trạng bằng số đo lại trên build 25/09/2026: 73 bài, 128 trang build, sitemap 126 `<loc>` / 73 `<lastmod>`, 35 mục FAQ, 17 testimonial, Lighthouse mobile 99–100
- Chỉ **13/73** bài có `Article.image` đạt ngưỡng 1200px; `defaultOgImage` là 1170×520 — thiếu đúng 30px so với ngưỡng
- Core Web Vitals từ 58 lên 99–100 mobile nhờ bỏ webfont Google, chuyển ảnh sang webp qua Astro `<Image>`, cắt React/Swiper khỏi critical path
- 2.437 thẻ `<img>` trong `dist`, 0 thẻ thiếu `width`/`height` — nhưng 197 file ảnh vẫn được serve thô từ `public/images/` (62MB), vì luật ảnh tối ưu chỉ là quy ước, không có gác cổng
- Sự cố 70/108 trang không index (13–14/09/2026) truy về ba lỗi ở pipeline sinh bài cộng với trailing slash (liên hệ với luật "sửa ở nguồn sinh bài" là suy luận của wiki — tài liệu gốc nêu luật ở phần mở đầu và kể sự cố ở §5 nhưng không nối hai điều đó)
- IndexNow chỉ ping Bing, Yandex, Naver, Seznam; Google không dùng IndexNow, và `BLOG_FILE_RE` khiến thay đổi ở trang dịch vụ/hub/FAQ không bao giờ được ping
- Toạ độ GBP lấy từ API 国土地理院; riêng 兵庫 không có toạ độ vì chưa có số nhà — minh họa trực tiếp nguyên tắc không bịa tín hiệu
- Mục "Claim không kiểm được từ repo" liệt kê 8 khẳng định cần công cụ ngoài để xác minh, trong đó một claim từ audit cũ ("CORS wildcard trên HTML") được xếp vào nhóm chưa kết luận: không tìm thấy bằng chứng trong repo, cần đo lại trên production trước khi hành động

## Related concepts

- [[concepts/seo/technical-seo-khong-du-de-len-hang]]
- [[concepts/seo/do-luong-truoc-khi-toi-uu]]
- [[concepts/seo/thieu-tin-hieu-con-hon-tin-hieu-sai]]
- [[concepts/seo/aggregate-rating-tu-dang]]
- [[concepts/seo/answer-first-cho-ai-search]]
- [[concepts/seo/mot-url-canonical-duy-nhat]]
- [[concepts/seo/meo-google-business-profile]]
- [[concepts/seo/doorway-page]]
- [[concepts/swe/gac-cong-tu-dong-vs-quy-uoc]]
- [[concepts/swe/so-ghi-co-y-khong-lam]]
- [[concepts/swe/ssot]] — luật "sửa ở nguồn sinh bài, không vá từng file markdown"
- [[concepts/seo/mo-hinh-pillar-cluster]] — cấu trúc hub-and-spoke mà §8.1 nói là chưa có bản đồ
- [[concepts/seo/gop-tu-khoa-cung-intent-vao-mot-bai]] — rủi ro trùng intent giữa 73 bài
- [[concepts/seo/ma-tran-internal-link-khai-bao-truoc]] — ma trận internal link giữa hub và spoke
- [[concepts/seo/structured-data-url-tuyet-doi]] — luật URL tuyệt đối trong JSON-LD
- [[concepts/seo/cau-truc-heading-seo]] — 0/73 bài có heading tóm kết `## まとめ`

Hai khái niệm [[concepts/seo/mot-url-canonical-duy-nhat]] và [[concepts/seo/meo-google-business-profile]]
được **trích lại** từ `NOTE.md` (§2 dẫn R15–R18; §6 dẫn §11.1) chứ không do tài liệu này giới thiệu lần đầu;
trang gốc của hai luật đó là [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]].

## Related sources

- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — `NOTE.md`, tài liệu luật R1–R19 mà bản đồ này tham chiếu liên tục; bản đồ bổ sung tầng chiến lược mà NOTE.md không có
- [[sources/huong-dan-viet-bai-seo-cho-setsubi-pro]] — luật viết bài ở tầng nội dung, bổ trợ cho tầng kỹ thuật ở đây
- [[sources/keyword-map-setsubi-pro]] — bản đồ keyword đã có cho giai đoạn đầu; §8.1 nói dấu vết keyword dừng ở 5 bài mẫu từ 05/2026
- [[sources/ke-hoach-noi-dung-blog-va-seo-cho-setsuki-pro]] — kế hoạch nội dung cùng site
- [[sources/review-seo]] — bộ tiêu chí chấm nội dung; bản đồ này chấm hạ tầng

## People

- [[people/luong-hai-lam]] — người viết bản đồ và là người thiết kế kiến trúc SEO của site. **Bản thân `SEO.md` không nêu tên tác giả**; quyền tác giả đến từ xác nhận trực tiếp của người dùng (25/09/2026), nhất quán với xác nhận trước đó cho `NOTE.md` (11/08/2026).

## Open questions

- Sau khi có GA4 và đo được tap-to-call, đâu là mốc baseline để so "trước và sau" các đợt tối ưu từ 05/2026?
- Quyết định cuối cho `aggregateRating` tự đăng: bỏ khỏi markup, hay thu hẹp phạm vi luật ở §9 kèm lý do?
- 73 bài hiện nhắm những keyword nào, và có bao nhiêu cặp trùng intent thật sự?
- Các tài liệu được trích nhưng chưa nạp vào wiki: `CONTENT_GUIDE.md`, `_bmad-output/implementation-artifacts/deferred-work.md`, `setsubi-pro.net-audit/ACTION-PLAN.md`, `_bmad-output/project-context.md`
- Con số "817 ký tự" ở mục 13 không tái tạo được (đo lại ra ~474) — mốc nào mới đúng?

## Notes

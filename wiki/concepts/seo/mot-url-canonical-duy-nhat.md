---
type: concept
title: Một URL canonical duy nhất
confidence: unverified
tags:
  - seo
  - technical-seo
  - canonical
id: mot-url-canonical-duy-nhat
created: 2026-09-25
updated: 2026-09-29
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
  - sources/google-seo-starter-guide
related_concepts:
  - concepts/seo/structured-data-url-tuyet-doi
  - concepts/swe/gac-cong-tu-dong-vs-quy-uoc
  - concepts/seo/nhung-thu-khong-nen-toi-uu-seo
---

## Definition

Mỗi trang chỉ nên tồn tại ở đúng một địa chỉ, và mọi biến thể khác phải 301 về đó. Biến thể gồm: có/không `www`, có/không trailing slash, `http`/`https`, và các slug cũ đã đổi tên. Khi một trang có nhiều địa chỉ sống song song, tín hiệu bị chia và máy tìm kiếm có thể bỏ index — đây là nguyên nhân phổ biến nhất của sự cố "trang không được index" dù nội dung không có vấn đề gì.

## Variants

- **Bản đồ 301 giữ lại slug cũ**: mỗi lần đổi slug phải thêm một redirect, kèm bản percent-encoded cho URL không phải ASCII (tiếng Nhật, tiếng Việt).
- **Trailing slash nhất quán cả ở link nội bộ**: canonical đúng nhưng link nội bộ thiếu dấu `/` vẫn tạo ra một vòng redirect cho crawler.
- **Self-referencing canonical cho trang phân trang**: trang 2 canonical về chính trang 2, không về trang 1 — `rel=prev/next` đã bị Google bỏ hỗ trợ từ 2019.
- **noindex thì bỏ canonical**: không nên vừa `noindex` vừa khai canonical, vì hai tín hiệu này xung đột.
- **Chuỗi redirect nhiều hop có khi là cố ý**: 2 hop `http://apex → https://apex → https://www` là điều kiện bắt buộc của HSTS preload, và crawler theo tới 10 hop nên không gây hại.

## Key sources

- [[sources/ban-do-seo-setsubi-pro-net]] — sự cố 70/108 trang không index truy về trailing slash cộng với lỗi sinh link ở pipeline
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — nguồn gốc của luật (R15–R18)

## Đối chiếu với tài liệu Google (29/09/2026)

Tài liệu chính thức [[sources/google-seo-starter-guide]] xác nhận hướng dẫn ở trên, và **nới lỏng mức độ khẩn cấp** ở hai điểm (§Reduce duplicate content; §Things we believe you shouldn't focus on):

- **Nội dung trùng lặp không vi phạm chính sách chống spam** và không gây xử phạt thủ công; cái giá phải trả là trải nghiệm người dùng kém và lãng phí tài nguyên crawl. (Sao chép nội dung của người khác là chuyện khác.)
- **Nếu bạn không tự khai canonical, Google sẽ tự chọn giúp.** Thứ tự Google khuyến nghị khi tự xử lý: đặt **redirect** từ URL không ưu tiên về URL đại diện trước; nếu không redirect được thì mới dùng `rel="canonical"`.

Vì vậy, việc giữ một URL canonical duy nhất ở đây nên được hiểu là **thực hành tốt nên làm**, không phải việc phải xử lý như sự cố khẩn cấp — khác với tình huống đã gặp trên setsubi-pro.net, nơi trailing slash cộng lỗi sinh link khiến 70/108 trang không được index.

## Related concepts

- [[concepts/seo/structured-data-url-tuyet-doi]]
- [[concepts/swe/gac-cong-tu-dong-vs-quy-uoc]]
- [[concepts/seo/nhung-thu-khong-nen-toi-uu-seo]]

## Mentioned in

## Notes

---
type: concept
title: Giới hạn hiển thị tiêu đề và mô tả trên SERP tiếng Nhật
confidence: medium
tags:
  - technical-seo
  - meta-title
  - meta-description
  - tieng-nhat
id: gioi-han-hien-thi-serp-nhat
created: 2026-08-11
updated: 2026-10-01
key_sources:
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
  - sources/google-title-link
related_concepts:
  - concepts/seo/nhan-dang-site-tren-serp
  - concepts/swe/sua-tai-nguon-sinh
---

## Definition

Kết quả tìm kiếm tiếng Nhật trên mobile cắt tiêu đề ở khoảng **30–32 ký tự** và mô tả ở khoảng **70–80 ký tự**. Vì tiêu đề bài thường mang thêm hậu tố thương hiệu (`｜設備プロ` — 5 ký tự), phần tiêu đề thật chỉ nên **≤24 ký tự**; dài hơn thì chính phần brand bị cắt mất — đúng phần đáng lẽ phải hiện. Với mô tả, thông tin quan trọng nhất phải nằm trong 70 ký tự đầu, coi phần sau là bonus có thể mất.

## Vì sao ngưỡng khác tiếng Latin

Theo Google, title link bị cắt **khi cần, thường để vừa bề ngang thiết bị** ([[sources/google-title-link]]). Ký tự kanji/kana chiếm bề ngang gấp đôi chữ Latin, nên cùng một bề ngang chứa ít ký tự tiếng Nhật hơn. Vì vậy ngưỡng "60 ký tự tiêu đề" quen thuộc từ tài liệu SEO tiếng Anh không áp dụng được. Suy luận của wiki: vì tài liệu không đưa ra con số ký tự nào, mọi ngưỡng tính bằng ký tự — kể cả con số 30–32 ở trên — chỉ là ước lượng và có thể khác nhau theo thiết bị.

## Nợ kỹ thuật điển hình

Ghi chú nguồn ghi nhận nhiều bài đang có tiêu đề 24–37 ký tự (tổng 31–44 sau hậu tố) và mô tả 80–112 ký tự — tức đang bị cắt hàng loạt. Cách sửa đúng là vá ở nơi sinh ra tiêu đề, không sửa từng file đầu ra — xem [[concepts/swe/sua-tai-nguon-sinh]].

## Đối chiếu với tài liệu Google (01/10/2026)

Tài liệu chính thức [[sources/google-title-link]] xác nhận cơ chế, nhưng không xác nhận con số:

- Thẻ `<title>` **không có giới hạn độ dài**; title link bị cắt khi cần, thường để vừa bề ngang thiết bị. Tài liệu không đưa ra con số ký tự nào, nên 30–32 ký tự vẫn là quan sát của ngành.
- Google khuyên gắn thương hiệu **ngắn gọn**: đặt tên site ở đầu hoặc cuối tiêu đề, ngăn bằng một dấu như gạch ngang, hai chấm hoặc gạch đứng. Cách đặt hậu tố `｜設備プロ` khớp với khuyến nghị này.
- Với tên site cấp domain, Google **có thể bỏ tên site khỏi title link** nếu nó lặp với tên site đã hiện trên kết quả tìm kiếm.

Suy luận của wiki, chưa kiểm chứng trên SERP thật: nếu setsubi-pro.net đang được Google hiện tên site cấp domain và `｜設備プロ` trùng với tên đó, hậu tố có thể không hiện dù tiêu đề ngắn — khi ấy lý do "dài hơn thì chính phần brand bị cắt" yếu đi. Quy tắc ≤24 ký tự vẫn có ích để phần tiêu đề thật không bị cắt, nhưng lý do nên chuyển từ "bảo vệ hậu tố thương hiệu" sang "giữ trọn phần tiêu đề thật".

## Key sources

- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]]
- [[sources/google-title-link]] — cơ chế cắt theo bề ngang thiết bị, không có giới hạn ký tự chính thức, và khả năng Google bỏ tên site khỏi title link

## Related concepts

- [[concepts/seo/nhan-dang-site-tren-serp]]
- [[concepts/swe/sua-tai-nguon-sinh]]

## Notes

Con số 30–32 và 70–80 ký tự đến từ quan sát nội bộ trong ghi chú nguồn. Ngày 01/10/2026 phần tiêu đề đã được đối chiếu với tài liệu title link của Google: cơ chế cắt theo bề ngang được xác nhận, còn con số thì tài liệu không đưa ra — giữ `confidence: medium`. Phần mô tả chưa đối chiếu với tài liệu Google; trang nguồn [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] đã ghi nhận các nguồn SEO Nhật hiện hành báo mức mobile thấp hơn (~50–70 ký tự).

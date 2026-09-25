---
type: concept
title: Điều kiện để bài viết có thumbnail trên Google
slug: thumbnail-serp-google
date_added: 2026-08-11
confidence: high
tags:
  - technical-seo
  - hinh-anh
  - rich-result
id: concepts/seo/thumbnail-serp-google
created: 2026-08-11
updated: 2026-08-11
key_sources:
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
related_concepts:
  - concepts/seo/structured-data-url-tuyet-doi
  - concepts/swe/tai-san-ngoai-pipeline-build
---

## Definition

Thumbnail trên kết quả tìm kiếm không phải thứ bật lên bằng một thẻ duy nhất, mà là kết quả của bốn điều kiện phải đồng thời đúng: ảnh có cạnh dài ≥1200px, `Article.image` là **mảng** URL tuyệt đối, thẻ `<meta name="robots">` chứa `max-image-preview:large`, và ảnh nguồn thật sự tồn tại trên đĩa ở nơi bộ build tìm thấy. Thiếu bất kỳ điều kiện nào là mất thumbnail; đủ cả bốn cũng chỉ là **điều kiện cần** — Google vẫn tự quyết định có hiện hay không.

## Bốn điều kiện

- **Kích thước**: cạnh dài ≥1200px theo khuyến nghị Google. Không phóng to vượt kích thước gốc — ảnh 670px ép lên 1200px chỉ nặng file chứ không thêm chi tiết.
- **Định dạng schema**: `Article.image` là mảng, giá trị là URL tuyệt đối — xem [[concepts/seo/structured-data-url-tuyet-doi]].
- **Cho phép hiện lớn**: thiếu `max-image-preview:large` thì Google chỉ được phép hiện thumbnail cỡ nhỏ.
- **Ảnh nằm trong pipeline tối ưu**: xem [[concepts/swe/tai-san-ngoai-pipeline-build]].

## Hai bản ảnh cho hai mục đích

Tách rõ ảnh hero hiển thị trên trang (giữ nhỏ, ví dụ 800×450, để tối ưu LCP) khỏi ảnh chia sẻ dùng cho `og:image` và schema (1200×675). Dùng nhầm bản hero cho OG là cách âm thầm đánh mất thumbnail.

## Phần không kiểm soát được

Thời điểm Google hiện thumbnail phụ thuộc lịch recrawl. Sau khi sửa, dùng Search Console → URL Inspection → *Request indexing* cho vài bài đại diện thay vì chờ.

## Key sources

- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]]

## Related concepts

- [[concepts/seo/structured-data-url-tuyet-doi]]
- [[concepts/swe/tai-san-ngoai-pipeline-build]]

## Notes

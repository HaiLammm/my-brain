---
type: concept
title: Google thu thập và lập chỉ mục như thế nào
confidence: high
tags:
  - seo
  - google
  - crawling
  - indexing
id: google-thu-thap-va-lap-chi-muc
created: 2026-09-29
updated: 2026-09-29
key_sources:
  - sources/google-seo-starter-guide
related_concepts:
  - concepts/seo/sitemap
  - concepts/seo/mot-url-canonical-duy-nhat
  - concepts/seo/technical-seo-khong-du-de-len-hang
---

## Definition

Google là máy tìm kiếm tự động: chương trình gọi là **crawler** liên tục khám phá web để tìm trang đưa vào **index**. Phần lớn site xuất hiện trong kết quả tìm kiếm được tìm và thêm vào index **tự động**, không cần chủ site khai báo gì — việc duy nhất phải làm là công bố site lên web. Hiểu đúng tầng này giúp tránh hai phản xạ sai: (a) tưởng phải "đăng ký" với Google mới được lập chỉ mục, và (b) tưởng rằng sạch kỹ thuật sẽ tự động cho thứ hạng — xem [[concepts/seo/technical-seo-khong-du-de-len-hang]].

Crawler khám phá trang mới **chủ yếu qua liên kết** từ những trang nó đã crawl — phần lớn là liên kết từ site khác trỏ tới bạn, xảy ra tự nhiên theo thời gian, hoặc có được nhờ quảng bá — xem [[concepts/seo/quang-ba-website]]. Cách chủ động khai báo duy nhất được tài liệu nhắc tới là sitemap, và nó **không bắt buộc** — xem [[concepts/seo/sitemap]].

## Variants

- **Kiểm tra trước khi làm gì**: tìm `site:tên-miền` trên Google. Có kết quả trỏ về site nghĩa là đã nằm trong index, có thể không cần làm gì cả; không có kết quả thì kiểm tra các yêu cầu kỹ thuật trước.
- **Google phải thấy trang giống như người dùng thấy**: crawler cần truy cập được cùng tài nguyên như trình duyệt, gồm CSS và JavaScript. Chặn hoặc ẩn các thành phần quan trọng có thể khiến Google không hiểu trang, dẫn tới không xuất hiện hoặc xếp hạng kém.
- **Nội dung phụ thuộc vị trí**: nếu trang hiển thị khác nhau theo vị trí người dùng, cần chấp nhận rằng Google nhìn từ vị trí crawler, thường là Mỹ.
- **Chủ động không cho vào index**: Google hỗ trợ nhiều cách chặn một trang, một thư mục, hoặc cả site khỏi kết quả tìm kiếm — dùng khi có phần nội dung không muốn công khai.
- **Cách nhìn từ phía Google**: dùng công cụ kiểm tra URL trong Search Console để xem Google đọc được gì từ một trang cụ thể.

## Key sources

- [[sources/google-seo-starter-guide]] — §How does Google Search work?, §Help Google find your content, §Check if Google can see your page the same way a user does, §Don't want a page in Google's search results?

## Related concepts

- [[concepts/seo/sitemap]]
- [[concepts/seo/quang-ba-website]]
- [[concepts/seo/mot-url-canonical-duy-nhat]]
- [[concepts/seo/technical-seo-khong-du-de-len-hang]]

## Topics

- [[topics/seo]]

## Mentioned in

## Notes

- Trang này là tầng nền mà kho tri thức SEO của wiki trước đây thiếu: các khái niệm cũ mô tả triệu chứng (trang không được index, mất thumbnail) mà không có mô hình Google vận hành phía sau.

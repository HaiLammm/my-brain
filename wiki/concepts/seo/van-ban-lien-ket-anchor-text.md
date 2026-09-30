---
type: concept
title: Chữ trong liên kết (anchor text) và khi nào gắn nofollow
confidence: high
tags:
  - seo
  - on-page
  - lien-ket
id: van-ban-lien-ket-anchor-text
created: 2026-09-29
updated: 2026-09-29
key_sources:
  - sources/google-seo-starter-guide
  - sources/review-seo
related_concepts:
  - concepts/seo/ma-tran-internal-link-khai-bao-truoc
  - concepts/seo/checklist-seo-100-diem
  - concepts/seo/google-thu-thap-va-lap-chi-muc
---

## Definition

Chữ trong liên kết — còn gọi là **anchor text** — là phần chữ nhìn thấy được của một liên kết. Nó cho cả người dùng lẫn Google biết trang đích nói về cái gì trước khi bấm vào. Vì đại đa số trang mới Google tìm thấy là qua liên kết, chữ trong liên kết vừa là công cụ điều hướng vừa là công cụ mô tả: một liên kết nội bộ đặt đúng chữ giúp Google hiểu quan hệ giữa hai trang, thay vì chỉ biết "có một liên kết".

## Variants

- **Anchor mô tả nội dung đích**: chữ trong liên kết nói rõ trang đích chứa gì. Tránh các cụm vô nghĩa kiểu "bấm vào đây", "xem thêm" khi chúng là cách duy nhất để hiểu liên kết dẫn đi đâu.
- **Liên kết nội bộ có chủ đích**: ma trận liên kết nội bộ khai báo trước khi viết là cách biến nguyên tắc này thành kế hoạch — xem [[concepts/seo/ma-tran-internal-link-khai-bao-truoc]].
- **Liên kết ra ngoài có kiểm soát**: chỉ dẫn tới nguồn bạn tin. Nếu vẫn muốn dẫn tới nguồn không đáng tin, gắn `nofollow` hoặc chú thích tương đương để Google không liên kết site bạn với site đó.
- **Nội dung do người dùng đăng**: bình luận, diễn đàn, bài do khách gửi — CMS phải **tự động** gắn `nofollow` cho mọi liên kết người dùng chèn vào, vì bạn không kiểm soát nội dung đó. Việc này cũng làm giảm động cơ spam vào site.
- **Quy ước nội bộ đã có**: bảng chấm 100 điểm của Setsubi-pro đã yêu cầu đánh dấu `nofollow` cho liên kết quảng cáo, affiliate và diễn đàn — trùng hướng với tài liệu Google, xem [[concepts/seo/checklist-seo-100-diem]].

## Key sources

- [[sources/google-seo-starter-guide]] — §Link to relevant resources, §Write good link text, §Link when you need to
- [[sources/review-seo]] — quy tắc nội bộ về `nofollow` cho liên kết quảng cáo và affiliate

## Related concepts

- [[concepts/seo/ma-tran-internal-link-khai-bao-truoc]]
- [[concepts/seo/checklist-seo-100-diem]]
- [[concepts/seo/google-thu-thap-va-lap-chi-muc]]

## Topics

- [[topics/seo]]

## Mentioned in

## Notes

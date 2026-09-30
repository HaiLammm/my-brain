---
type: concept
title: Sổ ghi "cố ý không làm"
confidence: unverified
tags:
  - swe
  - documentation
  - decision-record
id: so-ghi-co-y-khong-lam
created: 2026-09-25
updated: 2026-09-25
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
related_concepts:
  - concepts/swe/gac-cong-tu-dong-vs-quy-uoc
---

## Definition

Một mục riêng trong tài liệu dự án, liệt kê những thứ **trông như lỗi nhưng là quyết định có lý do**, kèm lý do cụ thể và cảnh báo "sửa lại là làm hỏng". Không có mục này, mỗi lần audit hoặc mỗi người mới vào sẽ lại phát hiện "lỗi" đó và lại sửa, rồi lại phá một ràng buộc mà không ai còn nhớ. Đây là bổ ngữ cần thiết cho danh sách việc tồn: việc tồn kể *cái gì còn thiếu*, sổ này kể *cái gì không được chạm*.

## Variants

- **Ghi kèm ràng buộc gây ra quyết định**: ví dụ một chuỗi redirect dư một bước tồn tại vì đó là điều kiện bắt buộc của HSTS preload — nêu ràng buộc thì lý do không bị mất theo thời gian.
- **Tách mục "claim không kiểm được từ nội bộ"**: liệt kê những khẳng định chỉ xác minh được bằng công cụ ngoài, để người lập kế hoạch không coi chúng là sự thật đã chốt.
- **Ghi nhận khi luật và mã đang mâu thuẫn**: nói rõ "luật đúng nhưng hiện trạng đang vi phạm" thay vì im lặng — mâu thuẫn được ghi ra mới có cơ hội được giải quyết.
- **Đánh dấu chủ thể hành động**: gắn nhãn cho các mục chỉ chủ doanh nghiệp làm được (cần tài khoản, cần xác minh danh tính), để chúng không nằm mãi trong hàng đợi của lập trình viên.

## Key sources

- [[sources/ban-do-seo-setsubi-pro-net]] — tài liệu chia ba nhóm đã làm / cố ý không làm / chưa làm, và tự tách một mục riêng cho các claim không kiểm được từ repo

## Related concepts

- [[concepts/swe/gac-cong-tu-dong-vs-quy-uoc]]

## Mentioned in

## Notes

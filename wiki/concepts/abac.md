---
type: concept
title: Kiểm soát Truy cập Dựa trên Thuộc tính (ABAC)
slug: abac
date_added: 2026-05-15
confidence: unverified
id: concepts/abac
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung
related_concepts: []
---
## Definition

Kiểm soát truy cập dựa trên thuộc tính (ABAC) là mô hình phân quyền ra quyết định dựa trên tập thuộc tính của người dùng, tài nguyên, hành động và ngữ cảnh thực thi. Thay vì chỉ nhìn vào vai trò cố định, ABAC cho phép hệ thống diễn đạt các luật như phong ban, khu vực, thời gian, cấp dữ liệu nhạy cảm hay trạng thái phiên làm việc.

## Variants

- **User-centric ABAC**: Quyết định chủ yếu dựa trên hồ sơ người dùng như phòng ban, chức danh hoặc khu vực.
- **Context-aware ABAC**: Thêm điều kiện thời gian, thiết bị, vị trí mạng hoặc mức rủi ro vào chính sách.
- **Policy-engine ABAC**: Tách luật phân quyền ra khỏi ứng dụng và để một policy engine chuyên trách đánh giá.

## Key sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]

## Related concepts

## Mentioned in

## Notes

Trong blueprint này, ABAC được nêu như lựa chọn linh hoạt hơn RBAC khi hệ thống phải diễn tả các điều kiện truy cập động và nhiều ngoại lệ nghiệp vụ.

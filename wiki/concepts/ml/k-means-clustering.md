---
type: concept
title: Phân cụm K-means (K-Means Clustering)
slug: k-means-clustering
date_added: 2026-05-16
confidence: unverified
id: concepts/ml/k-means-clustering
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/practical-statistics-for-data-scientists
related_concepts: []
---

## Definition

Phân cụm K-means (K-means clustering) là thuật toán chia dữ liệu thành K nhóm bằng cách gán mỗi bản ghi vào tâm cụm gần nhất rồi cập nhật lại tâm cụm lặp đi lặp lại. Mục tiêu của nó là làm giảm tổng bình phương khoảng cách trong từng cụm để các nhóm ngày càng cô đặc và dễ phân biệt.

## Variants

- **K-means với nhiều random starts**: giảm rủi ro kẹt ở nghiệm cục bộ xấu.
- **Elbow method**: cách thực dụng để gợi ý số cụm hợp lý.
- **K-means trên dữ liệu đã chuẩn hóa**: gần như luôn cần khi các biến có thang đo khác nhau.

## Key sources

- [[sources/practical-statistics-for-data-scientists]]

## Related concepts

## Mentioned in

## Notes

Sách nhấn mạnh K-means vì tính đơn giản, tốc độ và khả năng mở rộng, dù không phải lúc nào cũng cho cấu trúc cụm dễ diễn giải nhất.

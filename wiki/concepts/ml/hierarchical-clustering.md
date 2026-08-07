---
type: concept
title: Phân cụm phân cấp (Hierarchical Clustering)
slug: hierarchical-clustering
date_added: 2026-05-16
confidence: unverified
id: concepts/ml/hierarchical-clustering
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/practical-statistics-for-data-scientists
related_concepts: []
---

## Definition

Phân cụm phân cấp (hierarchical clustering) là cách gom nhóm dữ liệu theo lịch sử nhập cụm, bắt đầu từ từng điểm riêng lẻ rồi dần dần hợp nhất các cụm gần nhau. Kết quả thường được biểu diễn bằng dendrogram, cho phép nhìn trực quan cấu trúc nhiều tầng của dữ liệu.

## Variants

- **Complete linkage**: đo độ khác biệt giữa hai cụm bằng cặp điểm xa nhất.
- **Single linkage**: đo bằng cặp điểm gần nhất, dễ tạo chuỗi cụm kéo dài.
- **Average linkage / Ward’s method**: các thỏa hiệp phổ biến để có cụm ổn định và gọn hơn.

## Key sources

- [[sources/practical-statistics-for-data-scientists]]

## Related concepts

## Mentioned in

## Notes

So với K-means, phương pháp này dễ diễn giải hơn nhưng tốn tài nguyên hơn và khó mở rộng lên dữ liệu rất lớn.

---
type: concept
title: Phân tích thành phần chính (Principal Components Analysis)
slug: principal-components-analysis
date_added: 2026-05-16
confidence: unverified
id: concepts/ml/principal-components-analysis
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/practical-statistics-for-data-scientists
related_concepts: []
---

## Definition

Phân tích thành phần chính (principal components analysis, PCA) là kỹ thuật giảm chiều biến nhiều chiều thành một số tổ hợp tuyến tính mới sao cho các tổ hợp này giải thích phần lớn phương sai ban đầu. Nó đặc biệt hữu ích khi nhiều biến cùng chuyển động với nhau và thông tin bị lặp lại giữa các cột.

## Variants

- **PCA trên covariance matrix**: giữ nguyên ảnh hưởng tỷ lệ đo của biến.
- **PCA trên correlation matrix**: tương đương chuẩn hóa biến trước khi phân tích.
- **Sử dụng loading và screeplot**: để giải thích ý nghĩa của thành phần và chọn số thành phần cần giữ.

## Key sources

- [[sources/practical-statistics-for-data-scientists]]

## Related concepts

## Mentioned in

## Notes

Sách xem PCA như bản tương đương không giám sát của việc nén tín hiệu trước khi đưa vào mô hình dự báo.

---
type: concept
title: K láng giềng gần nhất (K-Nearest Neighbors)
slug: k-nearest-neighbors
date_added: 2026-05-16
confidence: unverified
id: concepts/k-nearest-neighbors
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/practical-statistics-for-data-scientists
related_concepts: []
---

## Definition

K-nearest neighbors (KNN) là phương pháp dự báo và phân loại dựa trên sự tương tự cục bộ: một bản ghi mới được gán nhãn hoặc giá trị theo những hàng xóm gần nhất của nó trong không gian đặc trưng. Phương pháp này rất trực quan nhưng phụ thuộc mạnh vào chuẩn hóa dữ liệu, thước đo khoảng cách và cách chọn K.

## Variants

- **KNN classification**: dùng đa số phiếu của K hàng xóm gần nhất.
- **KNN regression**: dùng trung bình giá trị của K hàng xóm gần nhất.
- **Feature engineering với KNN**: dùng xác suất hoặc dự đoán của KNN như một feature cho mô hình tầng hai.

## Key sources

- [[sources/practical-statistics-for-data-scientists]]

## Related concepts

## Mentioned in

## Notes

Sách dùng KNN như ví dụ điển hình cho học từ dữ liệu cục bộ thay vì áp một cấu trúc toàn cục lên toàn bộ tập dữ liệu.

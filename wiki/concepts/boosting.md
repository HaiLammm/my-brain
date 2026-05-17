---
type: concept
title: Boosting
slug: boosting
date_added: 2026-05-16
confidence: unverified
id: concepts/boosting
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/practical-statistics-for-data-scientists
related_concepts: []
---

## Definition

Boosting là kỹ thuật ensemble huấn luyện một chuỗi mô hình theo cách mỗi vòng sau tập trung nhiều hơn vào những quan sát mà các vòng trước làm chưa tốt. Với cây quyết định làm base learner, boosting thường tạo ra một trong những mô hình dự báo mạnh nhất, đổi lại là nguy cơ overfitting cao hơn và nhu cầu tuning cẩn thận hơn.

## Variants

- **AdaBoost**: điều chỉnh trọng số quan sát sau mỗi vòng.
- **Gradient boosting**: diễn đạt bài toán như tối ưu một hàm mất mát.
- **Stochastic gradient boosting / XGBoost**: thêm ngẫu nhiên hóa và regularization để tăng hiệu năng và độ ổn định.

## Key sources

- [[sources/practical-statistics-for-data-scientists]]

## Related concepts

## Mentioned in

## Notes

Cuốn sách mô tả boosting như lựa chọn mạnh mẽ nhưng "nhạy tay lái" hơn random forest trong dữ liệu nhiễu.

---
type: concept
title: Regularization
slug: regularization
date_added: 2026-05-16
confidence: unverified
tags:
  - machine-learning
  - overfitting
id: concepts/regularization
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
related_concepts:
  - concepts/ridge-regression
  - concepts/lasso-regression
  - concepts/elastic-net
  - concepts/dropout
  - concepts/batch-normalization
---

## Definition

Regularization là tập kỹ thuật để chống overfitting bằng cách thêm ràng buộc hoặc phạt vào quá trình huấn luyện. Các hình thức phổ biến: L1 (Lasso), L2 (Ridge), Elastic Net, Dropout (neural networks), Early Stopping.

## Variants

- **Ridge Regression (L2)**: phạt tổng bình phương trọng số.
- **Lasso Regression (L1)**: phạt tổng trị tuyệt đối trọng số — có thể đưa trọng số về 0 (feature selection).
- **Elastic Net**: kết hợp L1 + L2.
- **Early Stopping**: dừng huấn luyện khi validation error bắt đầu tăng.

## Key sources

- [[sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow]]

## Related concepts

- [[concepts/linear-regression]]
- [[concepts/dropout]]
- [[concepts/batch-normalization]]

## Topics

- [[topics/machine-learning]]

## Notes

- Khái niệm này nằm trên nền rộng hơn của [[foundations/machine-learning]].

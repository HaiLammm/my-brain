---
type: concept
title: Cross-Validation
confidence: unverified
tags:
  - evaluation
  - machine-learning
id: cross-validation
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
related_concepts:
  - concepts/ml/hypothesis-testing
  - concepts/ml/random-sampling
---

## Definition

Cross-Validation là kỹ thuật đánh giá mô hình bằng cách chia dữ liệu thành nhiều folds, huấn luyện trên k-1 folds và đánh giá trên fold còn lại, lặp lại k lần. K-fold CV cho ước lượng hiệu năng đáng tin cậy hơn so với train/test split đơn thuần.

## Variants

- **k-fold CV**: chia dataset thành k folds, mỗi fold làm test set một lần.
- **Stratified k-fold**: giữ tỉ lệ lớp trong mỗi fold.
- **Leave-One-Out (LOO)**: mỗi mẫu là một fold — tốn kém nhưng hữu ích với dữ liệu nhỏ.

## Key sources

- [[sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow]]

## Related concepts

- [[concepts/ml/hypothesis-testing]]
- [[concepts/ml/confusion-matrix]]

## Topics

- [[topics/machine-learning]]

## Notes

- Khái niệm này nằm trên nền rộng hơn của [[foundations/machine-learning]].

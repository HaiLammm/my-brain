---
type: concept
title: Support Vector Machines (SVM)
confidence: unverified
tags:
  - classification
  - machine-learning
id: support-vector-machines
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
related_concepts:
  - concepts/ml/linear-regression
  - concepts/ml/regularization
  - concepts/ml/kernel-trick
---

## Definition

Support Vector Machine (SVM) là thuật toán học có giám sát mạnh mẽ cho cả classification và regression. SVM tìm siêu phẳng tối ưu để phân tách các lớp với lề (margin) lớn nhất. Kernel trick cho phép SVM xử lý dữ liệu phi tuyến bằng cách ánh xạ ngầm sang không gian đặc trưng cao chiều.

## Variants

- **Linear SVM**: phân tách tuyến tính với soft margin.
- **Polynomial Kernel SVM**: dùng kernel đa thức cho dữ liệu phi tuyến.
- **Gaussian RBF Kernel SVM**: kernel bán kính, phổ biến cho dữ liệu phức tạp.
- **SVM Regression (SVR)**: SVM cho bài toán regression.

## Key sources

- [[sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow]]

## Related concepts

- [[concepts/ml/logistic-regression]]
- [[concepts/ml/regularization]]

## Notes

- Khái niệm này nằm trên nền rộng hơn của [[foundations/machine-learning]].

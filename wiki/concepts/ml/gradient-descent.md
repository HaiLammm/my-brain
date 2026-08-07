---
type: concept
title: Gradient Descent
slug: gradient-descent
date_added: 2026-05-16
confidence: unverified
tags:
  - optimization
  - machine-learning
id: concepts/ml/gradient-descent
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
related_concepts:
  - concepts/ml/linear-regression
  - concepts/ml/backpropagation
---

## Definition

Gradient Descent là thuật toán tối ưu hóa lặp dùng để tìm giá trị tham số tối ưu của mô hình bằng cách di chuyển ngược chiều gradient của hàm cost function. Ba biến thể chính: Batch GD (dùng toàn bộ dữ liệu mỗi bước), Stochastic GD (dùng một mẫu ngẫu nhiên mỗi bước), Mini-batch GD (dùng một batch nhỏ mỗi bước).

## Variants

- **Batch Gradient Descent**: tính gradient trên toàn bộ dataset — chính xác nhưng chậm với dữ liệu lớn.
- **Stochastic Gradient Descent**: một mẫu ngẫu nhiên mỗi bước — nhanh, nhiều noise, có thể thoát local minima.
- **Mini-batch Gradient Descent**: dung hòa giữa batch và stochastic — phổ biến nhất trong Deep Learning.

## Key sources

- [[sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow]]

## Related concepts

- [[concepts/ml/backpropagation]]
- [[concepts/ml/linear-regression]]

## Topics

- [[topics/machine-learning]]

## Notes

- Khái niệm này nằm trên nền rộng hơn của [[foundations/machine-learning]].

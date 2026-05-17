---
type: source
title: Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow
slug: hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
date_added: 2026-05-16
authors:
  - Aurélien Géron
source_type: book
importance: 4
confidence: unverified
tags:
  - machine-learning
  - deep-learning
  - tensorflow
  - keras
  - scikit-learn
  - python
raw_paths:
  - raw/sources/book/Hands-On_Machine_Learning_with_Scikit-Learn-Keras-and-TensorFlow-2nd-Edition-Aurelien-Geron.pdf
id: sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
created: 2026-05-16
updated: 2026-05-16
year: 2019
provenance: replayable
ingest_status: drafted
---

## Summary

Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (ấn bản 2, 2019) là cẩm nang thực hành về Machine Learning và Deep Learning dành cho người đã biết lập trình Python. Sách chia làm hai phần: Phần I dùng Scikit-Learn để dạy các nền tảng ML cổ điển (hồi quy, phân loại, ensemble, giảm chiều, clustering), Phần II dùng TensorFlow và Keras để đi sâu vào Deep Learning (CNN, RNN, NLP với Transformers, autoencoders, GANs, reinforcement learning). Giá trị cốt lõi là cách tiếp cận hands-on — mỗi thuật toán đều có code chạy được kèm dữ liệu thực tế, giúp người học xây trực quan trước khi đào sâu lý thuyết.

## Key claims

- Machine Learning nên được tiếp cận qua các dự án end-to-end: từ framing problem, thu thập và làm sạch dữ liệu, feature engineering, chọn và huấn luyện mô hình, fine-tune hyperparameter, đến deploy và monitor. (độ tin cậy: cao)
- Đa số bài toán thực tế có thể giải quyết tốt bằng các kỹ thuật đơn giản như Random Forest và Ensemble methods; Deep Learning chỉ thực sự cần thiết cho các bài toán phức tạp (image, speech, NLP) khi có đủ dữ liệu và tài nguyên tính toán. (độ tin cậy: cao)
- Gradient Descent và các biến thể (Batch, Stochastic, Mini-batch) là cốt lõi của hầu hết thuật toán huấn luyện mô hình, từ Linear Regression đến Deep Neural Networks. (độ tin cậy: cao)
- Các kỹ thuật regularization (Ridge, Lasso, Elastic Net, Dropout, Early Stopping, Batch Normalization) là không thể thiếu để chống overfitting và đảm bảo khả năng tổng quát hóa. (độ tin cậy: cao)
- Trong Deep Learning, vanishing/exploding gradients là vấn đề trung tâm; Glorot/He initialization, ReLU và các biến thể, Batch Normalization, và Gradient Clipping là giải pháp thực chiến. (độ tin cậy: cao)
- Transfer Learning cho phép tận dụng các mô hình đã huấn luyện sẵn (pretrained) để tiết kiệm thời gian và dữ liệu, đặc biệt hiệu quả trong computer vision và NLP. (độ tin cậy: cao)
- Kiến trúc Transformer (Attention Is All You Need) đã thay đổi cuộc chơi trong NLP, cho phép xử lý sequence hiệu quả hơn RNN truyền thống nhờ cơ chế attention. (độ tin cậy: cao)
- Reinforcement Learning (Q-Learning, Deep Q-Networks, Policy Gradients) là phương pháp mạnh cho các bài toán ra quyết định tuần tự (game, robotics). (độ tin cậy: cao)

## Evidence

- Sách gồm 19 chương + 7 phụ lục, bao phủ toàn bộ pipeline ML từ ý tưởng đến production.
- Phần I (Chương 1–9) dùng Scikit-Learn với các dataset thực tế (MNIST, California housing, Lending Club, v.v.).
- Phần II (Chương 10–19) dùng TensorFlow 2 / Keras với các bài tập từ image classification (CIFAR-10, Fashion MNIST) đến NLP (Shakespeare text generation, machine translation) và RL (OpenAI Gym, Atari).
- Mỗi chương đều có bài tập cuối chương kèm solution trong Appendix A.
- Sách có kèm Jupyter notebooks trên GitHub (github.com/ageron/handson-ml2) để chạy lại toàn bộ code.
- Phiên bản 2 cập nhật TensorFlow 2, bổ sung Transformer, GANs, YOLO, và TF-Agents.

## Related concepts

- [[concepts/linear-regression]]
- [[concepts/logistic-regression]]
- [[concepts/gradient-descent]]
- [[concepts/polynomial-regression]]
- [[concepts/regularization]]
- [[concepts/ridge-regression]]
- [[concepts/lasso-regression]]
- [[concepts/elastic-net]]
- [[concepts/softmax-regression]]
- [[concepts/support-vector-machines]]
- [[concepts/k-nearest-neighbors]]
- [[concepts/decision-tree-models]]
- [[concepts/ensemble-learning]]
- [[concepts/bagging]]
- [[concepts/random-forest]]
- [[concepts/boosting]]
- [[concepts/cross-validation]]
- [[concepts/confusion-matrix]]
- [[concepts/precision-and-recall]]
- [[concepts/dimensionality-reduction]]
- [[concepts/principal-components-analysis]]
- [[concepts/manifold-learning]]
- [[concepts/k-means-clustering]]
- [[concepts/hierarchical-clustering]]
- [[concepts/dbscan]]
- [[concepts/gaussian-mixture-model]]
- [[concepts/anomaly-detection]]
- [[concepts/artificial-neural-networks]]
- [[concepts/backpropagation]]
- [[concepts/keras]]
- [[concepts/tensorflow]]
- [[concepts/transfer-learning]]
- [[concepts/batch-normalization]]
- [[concepts/dropout]]
- [[concepts/convolutional-neural-networks]]
- [[concepts/object-detection]]
- [[concepts/recurrent-neural-networks]]
- [[concepts/natural-language-processing]]
- [[concepts/transformer-architecture]]
- [[concepts/attention-mechanism]]
- [[concepts/autoencoder]]
- [[concepts/generative-adversarial-network]]
- [[concepts/reinforcement-learning]]
- [[concepts/deep-q-learning]]
- [[concepts/feature-engineering]]

## Related sources

- [[sources/practical-statistics-for-data-scientists]] — nền tảng thống kê bổ trợ cho ML

## People

- [[people/aurelien-geron]]

## Open questions

- Sách xuất bản 2019, đã lạc hậu ở những phần nào so với TensorFlow 3.x và các kỹ thuật 2025+?
- Có nên ingest thêm Deep Learning with Python (François Chollet) để bổ sung góc nhìn Keras-first?
- Cần một foundation page cho "machine-learning" để làm terminal node cho các concept ML?
- Nên tạo concept pages riêng cho từng optimizer (Momentum, Adam, RMSProp, AdaGrad) hay gom chung?

## Topics

- [[topics/machine-learning]]

## Notes

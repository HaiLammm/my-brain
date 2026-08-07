---
type: concept
title: Transformer Architecture
slug: transformer-architecture
date_added: 2026-05-16
confidence: unverified
tags:
  - deep-learning
  - nlp
  - attention
  - machine-learning
id: concepts/ml/transformer-architecture
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
related_concepts:
  - concepts/ml/attention-mechanism
  - concepts/ml/natural-language-processing
  - concepts/ml/recurrent-neural-networks
---

## Definition

Transformer là kiến trúc deep learning dựa hoàn toàn trên cơ chế attention (Attention Is All You Need, Vaswani et al. 2017), không dùng RNN hay CNN cho sequence modeling. Gồm encoder (hiểu ngữ cảnh) và decoder (sinh văn bản), sử dụng multi-head self-attention và positional encoding. Là nền tảng của BERT, GPT, và các mô hình ngôn ngữ lớn hiện đại.

## Key sources

- [[sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow]]

## Related concepts

- [[concepts/ml/attention-mechanism]]
- [[concepts/ml/natural-language-processing]]
- [[concepts/ml/recurrent-neural-networks]]

## Topics

- [[topics/machine-learning]]

## Notes

- Khái niệm này nằm trên nền rộng hơn của [[foundations/machine-learning]].

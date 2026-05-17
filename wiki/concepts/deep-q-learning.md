---
type: concept
title: Deep Q-Learning
slug: deep-q-learning
date_added: 2026-05-16
confidence: unverified
tags:
  - rl
  - deep-learning
  - machine-learning
id: concepts/deep-q-learning
created: 2026-05-16
updated: 2026-05-16
key_sources:
  - sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow
related_concepts:
  - concepts/reinforcement-learning
  - concepts/artificial-neural-networks
---

## Definition

Deep Q-Learning (DQN) kết hợp Q-Learning với Deep Neural Networks để xấp xỉ hàm Q (giá trị hành động) trong không gian trạng thái lớn. Các cải tiến: Fixed Q-Value Targets (ổn định huấn luyện), Double DQN (giảm overestimate), Prioritized Experience Replay (học từ các transition quan trọng hơn), Dueling DQN (tách biệt state value và action advantage).

## Key sources

- [[sources/hands-on-machine-learning-with-scikit-learn-keras-and-tensorflow]]

## Related concepts

- [[concepts/reinforcement-learning]]
- [[concepts/artificial-neural-networks]]

## Notes

- Khái niệm này nằm trên nền rộng hơn của [[foundations/machine-learning]].

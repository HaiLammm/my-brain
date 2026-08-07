---
type: concept
title: "Cầu nối văn hóa ba bên (Three-Sided Cultural Bridge)"
slug: three-sided-cultural-bridge
date_added: 2026-05-12
confidence: high
tags:
  - i18n
  - multi-sided-platform
  - cultural-bridge
id: concepts/danangnavi/three-sided-cultural-bridge
created: '2026-05-12'
updated: '2026-05-12'
key_sources:
  - sources/danangnavi-product-requirements-document
related_concepts:
  - concepts/danangnavi/context-aware-voice-translation
  - concepts/danangnavi/closed-data-philosophy

---

## Definition
Mô hình nền tảng ba bên trong đó người dùng Nhật Bản, chủ doanh nghiệp Việt Nam và đội Admin mỗi bên vận hành bằng ngôn ngữ mẹ đẻ của họ. Dịch tự động kết nối cả ba bên: nội dung danh mục được dịch VN→JP cho người dùng, dashboard hoàn toàn bằng tiếng Việt cho chủ doanh nghiệp, admin quản lý đa ngôn ngữ. Đây khác biệt với nền tảng hai bên truyền thống.

## Variants
- **JP↔VN Content Bridge**: Chủ doanh nghiệp viết nội dung bằng tiếng Việt → hệ thống dịch tự động sang tiếng Nhật → chủ doanh nghiệp xem lại bản dịch
- **VN↔JP Communication Bridge**: Người dùng Nhật sử dụng dịch giọng theo ngữ cảnh để giao tiếp với người Việt
- **Admin Multilingual Moderation**: Admin xem cả bản gốc VN và bản dịch JP khi kiểm duyệt nội dung

## Key sources
- [[sources/danangnavi-product-requirements-document]]

## Related concepts
- [[concepts/danangnavi/context-aware-voice-translation]]
- [[concepts/danangnavi/closed-data-philosophy]]

## Mentioned in
_(Chưa có)_

## Notes
Thách thức chính: đảm bảo chất lượng dịch tự động đạt tối thiểu 80% trước khi xuất bản. PRD yêu cầu disclaimer trên mọi nội dung dịch máy và gắn cờ thuật ngữ dị ứng cho dịch lại do con người.
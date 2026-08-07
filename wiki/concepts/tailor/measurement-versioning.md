---
type: concept
title: Measurement Versioning
slug: measurement-versioning
date_added: 2026-05-12
confidence: high
tags:
  - data-model
  - versioning
  - tailor
  - measurements
id: TODO
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-1-implementation-artifacts-tailor-project
related_concepts:
  - concepts/swe/soft-delete
  - concepts/tailor/ao-dai-bespoke
---

## Definition

Measurement Versioning là cách quản lý nhiều bộ số đo cơ thể của cùng một khách hàng theo thời gian, cho phép lưu lịch sử, so sánh thay đổi, và chọn bộ mặc định cho thiết kế mới. Mỗi bộ số đo có ngày đo, người đo, và cờ `is_default`; chỉ một bộ mặc định tại một thời điểm.

## Variants

- **Simple versioning** — Lưu nhiều bộ số đo, đánh dấu default thủ công.
- **Auto-default** — Bộ số đo đầu tiên tự thành mặc định; khi set bộ mới làm default, tự unset bộ cũ.
- **Delta tracking** — Tính toán chênh lệch giữa các lần đo; hữu ích cho theo dõi thay đổi cơ thể.

## Key sources

- [[sources/epic-1-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/soft-delete]]
- [[concepts/tailor/ao-dai-bespoke]]

## Notes

Trong tailor_project, bảng `measurements` lưu 10 chỉ số (Cổ, Vai, Ngực, Eo, Mông, Dài áo, Dài tay, Vòng cổ tay, Chiều cao, Cân nặng) với `is_default` boolean. Logic: bộ đầu tiên auto-set `is_default=True`; khi set bộ khác làm default, unset cái cũ. Số đo dùng thuật ngữ chuyên ngành may Việt Nam (NFR11): Cổ, Vai, Ngực, Eo, Mông, Dài áo, Dài tay, Cổ tay.

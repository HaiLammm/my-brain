---
type: concept
title: Entropy thông tin (Information entropy)
confidence: high
tags:
  - ml
  - information-theory
  - systems
id: entropy-thong-tin
created: 2026-08-08
updated: 2026-08-08
key_sources:
  - sources/an-introduction-to-cybernetics
  - sources/good-regulator-theorem
related_concepts:
  - concepts/systems/do-da-dang
  - concepts/systems/rang-buoc
---

## Definition

Entropy thông tin (Shannon) của một tập xác suất là H = −Σ pᵢ log₂ pᵢ, đạt cực đại log₂(n) khi mọi khả năng đồng xác suất — lúc đó trùng với độ đa dạng đo bằng bit của Ashby. Với nguồn tin là chuỗi Markov, entropy của nguồn là trung bình có trọng số của entropy các cột ma trận chuyển, trọng số theo tỷ lệ cân bằng (ví dụ của Ashby: 0,842 bit/bước, nhỏ hơn 1 bit của đồng xu) (S.9/11–9/12). Ba giả định áp dụng cần nhớ: tập xác suất đầy đủ, nguồn Markovian, đã đạt cân bằng thống kê — thỏa trong kỹ thuật viễn thông nhưng *không đương nhiên* trong sinh học (S.9/13).

## Variants

- **Đo Shannon / đo Wiener** — −Σp log p và +Σp log p chỉ khác cách chọn gốc quy chiếu, không mâu thuẫn (S.9/14)
- **Redundancy** — phần entropy hụt so với cực đại do ràng buộc; cho phép nén (định lý mã hóa: nguồn H bit/phút truyền được qua mọi kênh có dung lượng ≥ H) (S.9/16–9/17)
- **Equivocation** — H₁ − H₂, thước đo đúng của thông tin bị nhiễu phá hủy; tăng dung lượng kênh thêm ≥ equivocation thì truyền không lỗi tùy ý — "thông điệp đáng tin cậy truyền được qua kênh không đáng tin cậy" (S.9/21–9/22)

## Key sources

- [[sources/an-introduction-to-cybernetics]] — Chương 9, tự nhận là "loạt ghi chú bổ sung" cho *Mathematical Theory of Communication* của Shannon; trình bày entropy từ nền độ đa dạng và chuỗi Markov
- [[sources/good-regulator-theorem]] — dùng H(Z) cực tiểu làm tiêu chí "điều tiết thành công"; bổ đề trung tâm dựa trên tính chất mất cân bằng làm giảm entropy

## Related concepts

- [[concepts/systems/do-da-dang]] — entropy là dạng trung bình hóa của độ đa dạng cho nguồn xác suất
- [[concepts/systems/rang-buoc]] — redundancy chính là ràng buộc nhìn từ phía mã hóa

## Mentioned in

## Notes

Ashby nhấn định nghĩa tần suất của xác suất: "Probabilities are frequencies. 'A "probable" event is a frequent event.' (Fisher.)" (S.9/2). Trang này đặt ở domain ml/ vì entropy sẽ tái xuất trong thống kê và machine learning; các nguồn ML tương lai bổ sung vào Key sources.

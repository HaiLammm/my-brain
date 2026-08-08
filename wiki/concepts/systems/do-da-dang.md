---
type: concept
title: Độ đa dạng (Variety)
slug: do-da-dang
date_added: 2026-08-08
confidence: high
tags:
  - systems
  - cybernetics
  - information-theory
id: concepts/systems/do-da-dang
created: 2026-08-08
updated: 2026-08-08
key_sources:
  - sources/an-introduction-to-cybernetics
related_concepts:
  - concepts/systems/rang-buoc
  - concepts/systems/luat-da-dang-can-thiet
  - concepts/ml/entropy-thong-tin
---

## Definition

Độ đa dạng (variety) của một tập là số phần tử *phân biệt được* trong tập đó, hoặc logarit cơ số 2 của số đó (đơn vị bit, để tổ hợp nhân biến thành cộng) (S.7/6–7/7). Nó không phải thuộc tính nội tại của tập: phụ thuộc năng lực phân biệt của người quan sát. Đây là thước đo trung tâm của điều khiển học vì câu hỏi kiểu cybernetics luôn là "tập mọi hành vi khả dĩ là gì?" — thông tin của một thông điệp nằm ở tập nó được rút ra, không phải ở bản thân nó (S.7/2–7/5). Hai định luật vận động quan trọng: phép biến đổi đơn trị không bao giờ làm tăng đa dạng (chỉ hội tụ, không phân kỳ) — hệ cô lập mất dần đa dạng; và thay đổi đầu vào có xu hướng *xóa* thông tin về trạng thái ban đầu (Law of Experience — học sinh cùng trường trở nên giống nhau) (S.7/22–7/25).

## Variants

- **Đo theo số đếm / theo bit** — hai cách tương đương, log2 tiện cho ghép hệ (S.7/7)
- **Đa dạng của vector** — không vượt tổng đa dạng các thành phần; đạt dấu bằng khi các thành phần độc lập (S.7/11–7/12)
- **Đa dạng như thông tin** — khi nguồn là chuỗi Markov, đa dạng trung bình mỗi bước chính là entropy của Shannon; xem [[concepts/ml/entropy-thong-tin]]

## Key sources

- [[sources/an-introduction-to-cybernetics]] — Chương 7 định nghĩa và các định luật; Chương 8 các luật truyền dẫn ("cho đủ thời gian, mọi transducer truyền được lượng đa dạng bất kỳ", S.8/13)

## Related concepts

- [[concepts/systems/rang-buoc]] — ràng buộc là hiệu giữa đa dạng khả dĩ và đa dạng thực tế
- [[concepts/systems/luat-da-dang-can-thiet]] — định luật nói đa dạng chỉ bị tiêu diệt bởi đa dạng
- [[concepts/ml/entropy-thong-tin]] — dạng trung bình có trọng số của đa dạng cho nguồn xác suất

## Mentioned in

## Notes

Ví dụ hai tù binh cùng gửi câu "I am well": cùng một câu chữ nhưng lượng thông tin khác nhau vì tập khả năng bị kiểm duyệt cho phép của mỗi người khác nhau (S.7/2–7/5).

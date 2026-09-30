---
type: concept
title: Máy tất định (Determinate machine)
confidence: high
tags:
  - systems
  - cybernetics
id: may-tat-dinh
created: 2026-08-08
updated: 2026-08-08
key_sources:
  - sources/an-introduction-to-cybernetics
related_concepts:
  - concepts/systems/hop-den
  - concepts/systems/on-dinh-va-can-bang
  - concepts/systems/phan-hoi
---

## Definition

Máy tất định (determinate machine) là cái hành xử như một *phép biến đổi đóng, đơn trị* (closed single-valued transformation): mỗi trạng thái có đúng một trạng thái kế tiếp, và không phép biến đổi nào dẫn ra ngoài tập trạng thái (S.3/1). Trạng thái phức hợp biểu diễn bằng vector; hệ phương trình cho giá trị kế tiếp của từng biến là *biểu diễn chính tắc* (canonical representation); vẽ các chuyển vị thành mũi tên cho *đồ thị động học* (kinematic graph) với các lưu vực (basin), trạng thái dừng và chu trình — mầm mống của khái niệm ổn định (S.2/17, S.3/4–3/7). Quan trọng nhất về mặt triết học: "hệ" không phải là vật (vật chứa vô hạn biến) mà là *danh sách biến do người quan sát chọn*, được điều chỉnh đến khi hành vi trở nên đơn trị (S.3/11).

## Variants

- **Máy có input (transducer)** — máy thực biểu diễn bởi một *tập* phép biến đổi, tham số (parameter) quyết định phép nào được áp; trùng với "transducer" của Shannon (S.4/1–4/4)
- **Máy Markov** — chuyển trạng thái theo ma trận xác suất hằng định; máy tất định là trường hợp riêng với xác suất toàn 0/1 (S.9/2–9/4, S.12/8)
- **Hệ tuyến tính** — trường hợp các hàm trong biểu diễn chính tắc đều tuyến tính (S.3/7)

## Key sources

- [[sources/an-introduction-to-cybernetics]] — Chương 2 xây phép biến đổi (operand → operator → transform, tính đóng, tính đơn trị, lũy thừa); Chương 3 dựng phép song song máy ↔ phép biến đổi; Chương 4 thêm input và ghép nối

## Related concepts

- [[concepts/systems/hop-den]] — biểu diễn chính tắc là cái suy ra được từ protocol quan sát hộp đen
- [[concepts/systems/on-dinh-va-can-bang]] — cân bằng là trạng thái bất động của phép biến đổi, T(x)=x
- [[concepts/systems/phan-hoi]] — ghép hai máy có input hai chiều sinh ra hệ tổng hợp tất định mới

## Mentioned in

## Notes

Câu đắt giá về ranh giới của khoa học: "It is we who decide, ultimately, what we will accept as 'machine-like' and what we will reject" (S.3/11) — khoa học chỉ nhận cái "giống máy", phần còn lại bị gạt là "hỗn loạn".

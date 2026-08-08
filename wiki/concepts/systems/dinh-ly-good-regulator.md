---
type: concept
title: Định lý good regulator (Good regulator theorem)
slug: dinh-ly-good-regulator
date_added: 2026-08-08
confidence: high
tags:
  - systems
  - cybernetics
  - modeling
id: concepts/systems/dinh-ly-good-regulator
created: 2026-08-08
updated: 2026-08-08
key_sources:
  - sources/good-regulator-theorem
related_concepts:
  - concepts/systems/dieu-tiet
  - concepts/systems/hop-den
  - concepts/systems/luat-da-dang-can-thiet
---

## Definition

Định lý good regulator (Conant & Ashby, 1970): **mọi bộ điều tiết của một hệ vừa tối ưu vừa đơn giản tối đa phải là mô hình của hệ đó** — chính xác là: bộ điều tiết tối ưu đơn giản nhất R của reguland S sinh các sự kiện liên hệ với sự kiện của S qua một ánh xạ h: S → R; hành động của bộ điều tiết chỉ là hành động của hệ nhìn qua ánh xạ đó. "Tối ưu" nghĩa là entropy của tập kết cục H(Z) cực tiểu. Hệ quả nổi tiếng nhất: não, trong chừng mực là bộ điều tiết thành công và hiệu quả cho sự sinh tồn, *phải* học bằng cách hình thành mô hình của môi trường — "không còn câu hỏi *liệu* não có mô hình hóa môi trường hay không: nó bắt buộc phải".

## Variants

- **Phát biểu phổ thông vs nội dung chặt** — tóm tắt bài báo nói "isomorphic", nhưng định lý chỉ cho một ánh xạ h (đồng cấu): mô hình có thể *mất thông tin* về hệ; cấu hình điều tiết theo nguyên nhân (fig. 1) cho quan hệ homo-/isomorphism mạnh hơn cấu hình theo sai số (fig. 2)
- **Mô hình biến thiên theo thời gian** — khi thống kê p(S) trôi chậm, bộ điều tiết tốt nhất là mô hình biến thiên theo thời gian của reguland biến thiên
- **Điều kiện áp dụng** — tồn tại phân bố p(S) gần hằng định; các bộ điều tiết tối ưu không phải mô hình vẫn tồn tại nhưng đều "phức tạp không cần thiết"

## Key sources

- [[sources/good-regulator-theorem]] — bài báo gốc: phát biểu, chứng minh qua bổ đề entropy, và bốn nhận xét về phạm vi

## Related concepts

- [[concepts/systems/dieu-tiet]] — định lý là câu trả lời cho câu hỏi "bộ điều tiết tốt phải có cấu trúc gì"
- [[concepts/systems/hop-den]] — "model" được định nghĩa bằng chính bộ máy homo-/isomorphism của lý thuyết máy
- [[concepts/systems/luat-da-dang-can-thiet]] — cặp định lý giới hạn trứ danh của Ashby về bộ điều tiết: một cái chặn *năng lực* (đa dạng), cái này chặn *cấu trúc* (phải là mô hình)

## Mentioned in

## Notes

Với thiết kế hệ thống, định lý đọc như một nguyên lý kiến trúc: mọi cơ chế kiểm soát thành công (autoscaler, circuit breaker, quy trình vận hành, cả mental model của người trực) đều chứa — tường minh hay ngầm — một mô hình của hệ nó kiểm soát; khi hệ trôi, mô hình phải trôi theo. (Suy diễn ứng dụng của wiki, không phải câu chữ của nguồn.)

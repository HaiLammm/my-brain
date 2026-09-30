---
type: concept
title: Điều tiết theo sai số (Error-controlled regulator)
confidence: high
tags:
  - systems
  - cybernetics
id: dieu-tiet-theo-sai-so
created: 2026-08-08
updated: 2026-08-08
key_sources:
  - sources/an-introduction-to-cybernetics
  - sources/good-regulator-theorem
related_concepts:
  - concepts/systems/phan-hoi
  - concepts/systems/dieu-tiet
  - concepts/systems/on-dinh-va-can-bang
---

## Definition

Bộ điều tiết theo sai số (error-controlled regulator) là bộ điều tiết chỉ nhận được thông tin về nhiễu D *qua hiệu ứng thực tế* của nó lên biến thiết yếu E — thông tin đi vòng D → T → E → R, tạo vòng kín (closed loop, servo-mechanism) (S.12/3–12/4). Ashby chứng minh định lý bất toàn của loại này: R giữ E càng hằng định thì càng tự chặn kênh thông tin nuôi chính nó — "the more successful R is in keeping E constant, the more does R block the channel by which it is receiving its necessary information" (S.12/5). Tính liên tục cứu vãn: sai số *nhỏ* được phép xảy ra và cung cấp thông tin để chống sai số *lớn* (S.12/6). Cơ chế phủ quyết là cách hiện thực hóa: xây R sao cho nó phủ quyết mọi cân bằng của hệ ngoài vùng chấp nhận được (S.12/14).

## Variants

- **Liên tục / ngắt quãng** — lồng ấp gas, pH máu (Cannon) so với run vì lạnh: vừa error-control từ E vừa control trực tiếp từ D (S.12/19–12/20)
- **Dò và bám (hunt and stick)** — cách máy Markov tới cân bằng: lang thang ngẫu nhiên, gặp trạng thái cân bằng thì dừng; tên chính xác hơn "trial and error"; kém hiệu quả nhưng dễ chế tạo, ít hỏng — con đường của sinh vật (S.12/11–12/12)
- **Đón đầu từ D** — khi R cảm nhận được D trước khi hiệu ứng tới E, điều tiết có thể hoàn hảo về nguyên tắc; error-control là phương án khi không đón đầu được (S.12/2–12/4)

## Key sources

- [[sources/an-introduction-to-cybernetics]] — Chương 12 trọn vẹn; homeostat như hệ Markov tự khóa (S.12/15); quan hệ đẳng cấu với lý thuyết trò chơi của von Neumann (S.12/22)
- [[sources/good-regulator-theorem]] — xếp điều tiết theo sai số là "nguyên thủy và hạ đẳng": dòng thông tin qua S bảo toàn nên entropy kết cục không thể về 0; điều tiết theo nguyên nhân (lấy tin thẳng từ D) mới có thể hoàn hảo (ví dụ con bò, §3)

## Related concepts

- [[concepts/systems/phan-hoi]] — error-control là ứng dụng trung tâm của phản hồi
- [[concepts/systems/dieu-tiet]] — dạng cụ thể của bài toán điều tiết tổng quát
- [[concepts/systems/on-dinh-va-can-bang]] — cơ chế phủ quyết dựa thẳng trên nguyên lý cân bằng bộ phận–toàn thể

## Mentioned in

## Notes

Đoạn kết chương 12 đáng nhớ: lý thuyết trò chơi và điều khiển học "simply the foundations of the theory of How to get your Own Way" (S.12/22). Bản năng sinh vật là các chiến lược đã thắng qua chọn lọc — "Grow teeth" như nước khai cuộc P—Q4.

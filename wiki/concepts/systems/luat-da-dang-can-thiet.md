---
type: concept
title: Luật đa dạng cần thiết (Law of Requisite Variety)
confidence: high
tags:
  - systems
  - cybernetics
id: luat-da-dang-can-thiet
created: 2026-08-08
updated: 2026-08-08
key_sources:
  - sources/an-introduction-to-cybernetics
related_concepts:
  - concepts/systems/do-da-dang
  - concepts/systems/dieu-tiet
  - concepts/systems/khuech-dai-dieu-tiet
  - concepts/systems/rang-buoc
  - concepts/systems/dinh-ly-good-regulator
---

## Definition

Luật đa dạng cần thiết (Law of Requisite Variety, thường gọi "Ashby's Law"): độ đa dạng của kết cục không thể nhỏ hơn độ đa dạng của nhiễu trừ đi độ đa dạng của bộ điều tiết — V_O ≥ V_D − V_R. Diễn đạt hình ảnh của Ashby: "chỉ đa dạng trong R mới ép xuống được đa dạng do D gây ra; đa dạng mới tiêu diệt được đa dạng" (S.11/7). Luật được chứng minh thuần túy tổ hợp trên bảng kết cục của trò chơi D–R, "không nợ gì thực nghiệm" — độc lập với vật chất, máy móc, công nghệ (S.11/10). Dạng entropy: H(E) ≥ H(D) + H_D(E) − H(R) (S.11/8). Hệ quả sâu nhất: "năng lực điều tiết của R không thể vượt năng lực kênh truyền tin của R" — tương đồng chính xác với Định lý 10 của Shannon về kênh sửa lỗi (S.11/11).

## Variants

- **Dạng đếm / dạng logarit / dạng entropy** — ba cách phát biểu tương đương, entropy dùng khi nhiễu là nguồn xác suất (S.11/5–11/9)
- **Directive correlation (Sommerhoff)** — hệ khái niệm độc lập nhưng tương đương: coenetic variable ↔ D, subsequent occurrence ↔ E (S.11/12)
- **Giới hạn của quyền lực** — nhà độc tài cũng chỉ có năng lực điều tiết của một con người: "quyền kiểm soát của Hitler đúng bằng 1 man-power"; muốn hơn phải qua bộ máy — tức điều tiết theo tầng (S.11/13)

## Key sources

- [[sources/an-introduction-to-cybernetics]] — Chương 11 trọn vẹn; các mục S.11/17–11/21 chứng minh công thức nền bao quát mọi biến thể (nhiễu vector, noise, mục tiêu phức hợp)

## Related concepts

- [[concepts/systems/do-da-dang]] — đại lượng mà luật phát biểu về
- [[concepts/systems/dieu-tiet]] — luật là chặn trên tuyệt đối của mọi bộ điều tiết
- [[concepts/systems/khuech-dai-dieu-tiet]] — luật cấm khuếch đại trực tiếp nhưng cho phép bổ sung theo tầng
- [[concepts/systems/rang-buoc]] — khi không tăng được R, phát hiện ràng buộc trong D là lối thoát duy nhất (S.13/5)
- [[concepts/systems/dinh-ly-good-regulator]] — cặp định lý giới hạn của Ashby về bộ điều tiết: luật này chặn năng lực, định lý kia chặn cấu trúc

## Mentioned in

## Notes

Với thiết kế hệ thống, luật đọc như một nguyên lý ngân sách: mọi cơ chế kiểm soát (giám sát, phê duyệt, dashboard, quy trình) chỉ hấp thụ được đúng lượng bất định mà kênh thông tin và tập hành động của nó cho phép — phần vượt quá sẽ lọt xuống kết cục. (Suy diễn ứng dụng của wiki, không phải câu chữ của nguồn.)

---
type: concept
title: Gác cổng tự động so với quy ước
confidence: unverified
tags:
  - swe
  - ci-cd
  - quality-gate
id: gac-cong-tu-dong-vs-quy-uoc
created: 2026-09-25
updated: 2026-09-25
key_sources:
  - sources/ban-do-seo-setsubi-pro-net
related_concepts:
  - concepts/swe/ssot
---

## Definition

Một luật chỉ thật sự được thi hành khi có script kiểm tra nó và script đó nằm trên đường đi bắt buộc (build hoặc CI) với khả năng làm quy trình thất bại. Mọi thứ còn lại — kể cả script kiểm tra đã viết xong nhưng phải gõ tay mới chạy — chỉ là quy ước, và quy ước sẽ bị vi phạm khi người ta quên hoặc khi người mới vào. Phép thử một câu: *nếu tôi cố tình phá luật này rồi deploy, có gì fail không?*

## Variants

- **Gác cổng thật**: script chạy trong `build`/CI và `exit(1)` khi lệch — vi phạm không thể ship.
- **Gác cổng danh nghĩa**: script tồn tại nhưng chỉ chạy qua một lệnh thủ công, không CI nào gọi. Tệ hơn quy ước thuần vì tạo cảm giác an toàn sai.
- **Quy ước thuần**: luật chỉ nằm trong tài liệu, không có script nào kiểm.
- **Nghịch lý ba mức trong cùng một repo**: cùng một dự án có thể có luật được gác chặt (hash inline script), luật chỉ kiểm thủ công (trailing slash) và luật hoàn toàn không kiểm (nguồn ảnh phải nằm trong thư mục được tối ưu) — không có cách nào biết mức nào là mức nào trừ khi đọc script.

## Key sources

- [[sources/ban-do-seo-setsubi-pro-net]] — mô tả cả ba mức cùng lúc trên một site, kèm hệ quả: 197 file ảnh vẫn serve thô vì luật ảnh chỉ là quy ước

## Related concepts

- [[concepts/swe/ssot]]

## Mentioned in

## Notes

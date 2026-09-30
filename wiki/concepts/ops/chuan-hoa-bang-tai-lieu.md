---
type: concept
title: Chuẩn hóa bằng tài liệu viết trước
confidence: medium
tags:
  - van-hanh
  - chuan-hoa
  - tai-lieu
  - chat-luong
id: chuan-hoa-bang-tai-lieu
created: 2026-09-05
updated: 2026-09-05
provenance: replayable
key_sources:
  - sources/ho-so-cong-ty-wa-craft
  - sources/bo-kich-ban-email-marketing-wa-craft
  - sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro
related_concepts:
  - concepts/ops/chong-thuoc-nhan-hoa
  - concepts/ops/bpo-back-office
  - concepts/swe/ssot
  - concepts/marketing/cue-dive-method
---

## Definition

Cách làm cho một công việc ra kết quả giống nhau bất kể ai làm: **viết cách làm thành tài liệu trước, rồi mới giao việc theo tài liệu đó** — thay vì giao việc rồi để mỗi người tự tìm cách.

Tài liệu ở đây là vật thể vận hành, không phải văn bản trang trí: nó nói rõ đầu vào là gì, làm những bước nào, đầu ra trông ra sao, và trường hợp nào thì dừng lại hỏi. Nó được sửa mỗi khi có lỗi mới, nên nó lớn dần theo số lần vấp.

Hai điều làm cơ chế này khác với "viết hướng dẫn sử dụng":

- **Tài liệu đi trước công việc**, nên nó cũng là công cụ để *thiết kế* quy trình chứ không chỉ để mô tả quy trình đã có.
- **Tài liệu viết bằng ngôn ngữ của người giao việc**, không phải ngôn ngữ của người làm. Trong bối cảnh offshore, đây là chỗ chịu lực: tài liệu tiếng Nhật cho phép khách Nhật kiểm tra được cách làm mà không cần biết đội thực thi nói tiếng gì.

## Variants

- **Manual thao tác** — từng bước cho một việc lặp lại. Dạng cổ điển, dùng cho nhập liệu, xử lý hóa đơn, đối soát.
- **Bộ tiêu chí chấm điểm** — không mô tả cách làm mà mô tả **đầu ra thế nào là đạt**. Phù hợp với việc sáng tạo, nơi không thể quy định từng bước. Wiki đã có hai ví dụ: [[concepts/marketing/cue-dive-method]] chấm tiêu đề email, và bộ rules SEO trong [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]].
- **Checklist trước khi giao** — bản rút gọn dùng ở bước cuối, để bắt lỗi thay vì để hướng dẫn.
- **Tài liệu sinh ra từ lỗi** — mỗi sự cố thêm một dòng. Tài liệu kiểu này ngắn hơn và được đọc nhiều hơn, vì mọi dòng trong đó đều đã trả giá.

## Key sources

- [[sources/ho-so-cong-ty-wa-craft]] — nêu "chuẩn hóa bằng tài liệu tiếng Nhật" là nguyên tắc vận hành đầu tiên, kèm quy trình kiểm tra hai bước
- [[sources/bo-kich-ban-email-marketing-wa-craft]] — một bộ tài liệu viết trước sản xuất: tiêu chí chấm tiêu đề, quy tắc cold email, khung nội dung dựng sẵn cho từng dòng dịch vụ
- [[sources/rules-toi-uu-seo-cho-bai-viet-setsubi-pro]] — cùng lối làm: viết bộ quy tắc ra văn bản rồi mới viết bài

## Related concepts

- [[concepts/ops/chong-thuoc-nhan-hoa]] — mục đích mà cơ chế này phục vụ
- [[concepts/ops/bpo-back-office]] — nơi cơ chế này trở thành điều kiện bán hàng, không chỉ là thói quen tốt
- [[concepts/swe/ssot]] — cùng nguyên tắc ở tầng dữ liệu: một chỗ duy nhất giữ sự thật
- [[concepts/marketing/cue-dive-method]] — một bộ tiêu chí chấm điểm cụ thể

## Mentioned in

_(chưa có trang tổng hợp nào tham chiếu)_

## Notes

**Chỗ cơ chế này hay hỏng.** Tài liệu viết một lần rồi không ai sửa sẽ tụt hậu so với cách làm thật, và khi đó nó tệ hơn không có tài liệu — vì người mới làm theo bản sai còn người cũ làm theo trí nhớ. Dấu hiệu nhận biết: không ai nhớ lần cuối sửa tài liệu là khi nào.

**Một quan sát xuyên nhiều nguồn trong wiki.** Cả ba nguồn liệt kê ở trên đều theo cùng một nếp: **viết ra tiêu chuẩn trước, sản xuất sau**. Ở [[sources/ho-so-cong-ty-wa-craft]] đây là điểm bán; ở bộ kịch bản email và bộ rules SEO đây là thói quen làm việc thực tế của đội. Nếp này lặp đủ nhiều để coi là đặc điểm của tổ chức, không phải trùng hợp.

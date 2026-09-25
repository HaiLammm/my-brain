---
type: concept
title: BPO back-office (thuê ngoài vận hành hậu cần văn phòng)
slug: bpo-back-office
date_added: 2026-09-05
confidence: medium
tags:
  - bpo
  - van-hanh
  - thue-ngoai
  - nhat-ban
id: concepts/ops/bpo-back-office
created: 2026-09-05
updated: 2026-09-06
provenance: replayable
key_sources:
  - sources/ho-so-cong-ty-wa-craft
  - sources/bo-kich-ban-email-marketing-wa-craft
related_concepts:
  - concepts/ops/chong-thuoc-nhan-hoa
  - concepts/ops/chuan-hoa-bang-tai-lieu
  - concepts/marketing/doi-marketing-thue-ngoai
  - concepts/marketing/noi-bo-hoa-nang-luc-marketing
  - concepts/tool-sales/operator-leverage
---

## Definition

**BPO** (Business Process Outsourcing) áp cho **back-office** là việc giao toàn bộ một mảng nghiệp vụ hậu cần — kế toán phụ trợ, hành chính, nhập liệu, xử lý đơn từ, quản lý khách hàng, biên dịch — cho một đơn vị bên ngoài vận hành thay, thay vì tuyển thêm người vào bộ máy của mình.

Điểm phân biệt với thuê nhân sự thời vụ: bên nhận không bán **giờ công** mà bán **hệ vận hành** — quy trình viết sẵn, người thay được nhau, đầu ra có tiêu chuẩn và có báo cáo. Khách trả tiền cho việc *không phải nghĩ về mảng đó nữa*, chứ không phải cho số giờ ai đó ngồi làm.

Trong mô hình offshore Nhật – Việt, thứ khiến khách chọn hay không thường không phải giá mà là **rào ngôn ngữ và rào chất lượng**: khách cần giao việc bằng tiếng Nhật và cần đầu ra không thấp hơn mức họ tự làm.

## Variants

- **BPO theo chức năng** — nhận trọn một chức năng (toàn bộ kế toán phụ trợ, toàn bộ nhập liệu). Chuẩn hóa dễ, phụ thuộc lẫn nhau ít.
- **BPO theo công đoạn** — chỉ nhận khúc quá tải trong một quy trình khách vẫn giữ. Cần hiểu quy trình của khách sâu hơn, nhưng dễ bán hơn vì khách không phải giao đứt.
- **BPO có tự động hóa kèm theo** — bên nhận vừa vận hành vừa thay dần thao tác tay bằng script, RPA hoặc gọi mô hình ngôn ngữ. Khối lượng tăng mà quân số không tăng theo. Đây là hình thái [[sources/ho-so-cong-ty-wa-craft]] mô tả (ChatGPT API / RPA / Python).
- **BPO ngôn ngữ-trung gian** — giá trị chính nằm ở chỗ nhận việc bằng ngôn ngữ khách và trả kết quả bằng ngôn ngữ khách, trong khi người làm dùng ngôn ngữ khác.

## Key sources

- [[sources/wa-craft-dinh-huong-dich-vu-va-chien-luoc-thi-truong-nhat-2026]] — Sheet1!E8:F8 định vị BPO kết hợp nhân sự, công cụ và cải tiến liên tục; đây là định hướng chào bán, chưa phải kết quả thực tế.
- [[sources/ho-so-cong-ty-wa-craft]] — mô tả một mô hình BPO back-office Nhật–Việt hoàn chỉnh: danh mục dịch vụ, hệ vận hành, và cách định vị bằng năng lực tiếng Nhật
- [[sources/bo-kich-ban-email-marketing-wa-craft]] — cách mô hình này được chào ra thị trường Nhật

## Related concepts

- [[concepts/ops/chong-thuoc-nhan-hoa]] — điều kiện để dịch vụ này chạy được; không có nó thì BPO chỉ là cho thuê người
- [[concepts/ops/chuan-hoa-bang-tai-lieu]] — cơ chế bàn giao việc qua biên giới ngôn ngữ
- [[concepts/marketing/doi-marketing-thue-ngoai]] — cùng logic thuê ngoài, áp cho mảng marketing
- [[concepts/marketing/noi-bo-hoa-nang-luc-marketing]] — lựa chọn ngược lại: giữ năng lực trong nhà
- [[concepts/tool-sales/operator-leverage]] — vì sao "vừa vận hành vừa tự động hóa" lại là đòn bẩy chứ không phải thêm việc

## Mentioned in

_(chưa có trang tổng hợp nào tham chiếu)_

## Notes

**Vì sao đáng tách thành khái niệm riêng thay vì để nằm trong trang công ty.** Wiki đã nhắc chữ "BPO" ở ít nhất ba trang mà chưa ở đâu định nghĩa nó, và mô hình này quyết định cách đọc cả cụm tool_sales – kịch bản email – hồ sơ công ty: cỗ máy gửi hàng nghìn form mỗi ngày là để bán **cái này**.

**Ranh giới cần giữ.** BPO back-office không phải outsourcing phát triển phần mềm và cũng không phải dịch vụ tư vấn. Ba thứ này hay bị gộp khi một công ty bán cả ba — như trường hợp [[sources/ho-so-cong-ty-wa-craft]], nơi lĩnh vực 1 là BPO còn lĩnh vực 2 là tư vấn.

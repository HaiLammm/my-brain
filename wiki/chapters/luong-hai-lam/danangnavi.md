---
id: chapters/luong-hai-lam/danangnavi
title: "Chương 4: DaNangNavi — cây cầu ba bên, và cái nút tạm dừng"
type: chapter
created: 2026-08-10
updated: 2026-08-10
book: luong-hai-lam
number: 4
---

## Summary

Từ tháng 04/2026, Lâm bắt tay vào DaNangNavi — nền tảng cộng đồng cho người Nhật sống ở Đà Nẵng. Ý tưởng gốc nằm ở chữ **senpai**: người Nhật đã ở đây nhiều năm chia sẻ lại cho người mới sang, và niềm tin đến từ chỗ đó chứ không phải từ đánh giá ẩn danh hay bài PR.

Về kỹ thuật, đây là thứ tham vọng nhất Lâm từng dựng: 74 yêu cầu chức năng, 46 yêu cầu phi chức năng, 13 module backend, kiến trúc modular monolith với Event Bus và Redis Pub/Sub, tìm kiếm đa ngôn ngữ JP↔VN, 8 dịch vụ ngoài đều có circuit breaker. Tài liệu kiến trúc phủ 100% yêu cầu, kèm 13 quy tắc thực thi và 11 anti-pattern.

Và toàn bộ do một người làm.

Tháng 8/2026, dự án **tạm dừng**. Hướng mới: lên kế hoạch xây web WaCraft và BPO, sau đó là tool sales gửi mail hợp tác doanh nghiệp.

## Key events

1. **Đặt cược vào senpai.** Người mới sang thấy ngay đánh giá của người Nhật thực sự sống ở Đà Nẵng nhiều năm. Từ đó sinh ra vòng bay tự củng cố: nhiều senpai chia sẻ → nội dung tốt hơn → hút người mới → tạo senpai mới. Nguồn: [[sources/danangnavi-product-requirements-document]], [[concepts/danangnavi/senpai-trust-flywheel]].

2. **Cây cầu ba bên.** Người dùng Nhật, chủ doanh nghiệp Việt, và admin — mỗi bên dùng tiếng mẹ đẻ, dịch tự động nối lại. Kèm dịch giọng nói theo ngữ cảnh: gói câu thoại xếp theo tình huống (nhà hàng, tiệm, bệnh viện), không cần gõ, không cần biết ngôn ngữ. Xem [[concepts/danangnavi/three-sided-cultural-bridge]], [[concepts/danangnavi/context-aware-voice-translation]].

3. **Chỉ ảnh chụp bằng camera.** Triết lý dữ liệu khép kín: 100% nội dung tạo nội bộ, ảnh phải qua kiểm tra EXIF để chắc là chụp thật chứ không phải lấy trên mạng. Xem [[concepts/danangnavi/closed-data-philosophy]], [[concepts/danangnavi/camera-only-verification]].

4. **Kiến trúc chọn theo hoàn cảnh, không theo mốt.** Modular monolith được chọn *vì* là solo developer — tránh chi phí vận hành của microservices mà vẫn giữ module tách biệt qua Dependency Injection và Event Bus, để sau này tách ra được nếu cần. Nguồn: [[sources/danangnavi-architecture-decision-document]].

5. **Mười hiểu biết văn hoá thành quyết định kỹ thuật.** Đây là chỗ dự án khác hẳn một bài tập kiến trúc: xử lý lỗi phải lịch sự để giữ *anshinkan* (cảm giác an tâm), dùng skeleton loading thay vòng xoay, tính đến văn hoá coupon, và cả chuyện *honne/tatemae* khi thiết kế thang đánh giá — người Nhật ít khi chê thẳng.

6. **Một câu hỏi trong chính tài liệu.** Phần câu hỏi mở của PRD tự hỏi: *"Cần bao lâu để đạt ngưỡng flywheel (60% nội dung tự tạo) — 3 tháng có thực tế với solo developer?"*

7. **Tháng 8/2026 — tạm dừng.** Chuyển hướng sang WaCraft và BPO, rồi tool sales.

## Characters introduced

- [[characters/luong-hai-lam/luong-hai-lam]] — một mình, xuyên suốt

Cả bộ tài liệu gọi đúng một danh xưng cho đội ngũ: *solo developer*. Không có ai khác trong chương này.

## Themes

- [[themes/luong-hai-lam/quy-mo-mot-minh]] — bằng chứng thứ hai, và là bằng chứng có tính tự-ý-thức: chính tài liệu đã đặt câu hỏi liệu một người có kịp không
- [[themes/luong-hai-lam/khoang-cach-lam-va-noi]] — biến thể nghĩa đen nhất: cả sản phẩm *là* một cỗ máy dịch, giữa hai ngôn ngữ và hai văn hoá

## Open questions

- **Tạm dừng vì lý do gì?** Hết nguồn lực, đổi ưu tiên, hay thị trường ngách quá nhỏ như chính PRD đã lo? Wiki không có gì về quyết định này ngoài sự kiện nó đã xảy ra.
- **Tạm dừng nghĩa là gì?** Code còn đó chờ quay lại, hay khép hẳn? Ba tháng nữa nhìn lại thì "tạm" còn đúng không?
- **Đăng, Thảo, bác Nomoto vào lúc nào?** DaNangNavi nằm trong nhóm dự án có họ đồng hành, nhưng toàn bộ tài liệu đều viết trong bối cảnh một người. Nếu họ vào sau, thì đúng lúc dự án dừng — đó là một nước ngoặt cần ghi.
- ~~WaCraft là gì?~~ **Đã rõ (10/08/2026):** Wa+Craft là tên **công ty** nơi cả nhóm làm việc, do [[characters/luong-hai-lam/nomoto]] đứng tên; "web WaCraft" là trang web của chính công ty đó. Còn treo: **BPO** ở đây là mảng dịch vụ công ty nhận làm, hay tên một sản phẩm riêng? Chưa có nguồn nào trong wiki.

## Notes

**Về cái kết của chương.** Đặt cạnh nhau, hai chi tiết này nói nhiều hơn bất cứ nhận xét nào tôi có thể thêm vào: tài liệu tự hỏi *"3 tháng có thực tế với solo developer không?"*, và bốn tháng sau dự án tạm dừng. Câu hỏi đã có sẵn trong hồ sơ ngay từ đầu.

Đó không phải lời chê. Một người viết ra được câu hỏi đó về chính dự án của mình là người đang nhìn rõ — vấn đề chỉ là nhìn rõ không đủ để làm thay phần việc của bốn người.

**Chương tiếp theo.** Ba việc đang xếp hàng: web WaCraft, BPO, rồi tool sales để gửi mail hợp tác doanh nghiệp. Chỉ tool sales là đã có tư liệu trong wiki ([[sources/tool-sales-architecture-docs]] và 6 khái niệm ở `concepts/tool-sales/`). Hai cái còn lại chưa có gì — cần nạp nguồn trước khi dựng chương.

Đây cũng là chỗ các nhân vật khác bước vào câu chuyện: ba người quản lý, cộng [[characters/luong-hai-lam/nhung]] — người được ghi nhận tham gia cả web WaCraft lẫn web BPO. Nếu vậy, chương 5 sẽ là chương đầu tiên Lâm không làm một mình — và mô-típ [[themes/luong-hai-lam/quy-mo-mot-minh]] sẽ được thử thách đúng nghĩa.

**Một hệ quả của dữ kiện công ty.** Chương này đọc DaNangNavi như dự án cá nhân của một người. Nếu cả nhóm cùng ở Wa+Craft và danh mục dự án là của công ty, thì "solo developer" trong tài liệu có thể không phải *"tôi tự làm dự án riêng"* mà là *"công ty giao cho một người"* — hai nghĩa rất khác nhau về mặt câu chuyện, và nghĩa thứ hai làm [[themes/luong-hai-lam/quy-mo-mot-minh]] nặng hơn chứ không nhẹ đi. Chưa đủ dữ kiện để chốt; ghi lại để không đọc trôi.

Chương dựng từ 2 nguồn và 6 khái niệm đã có trong wiki. Thông tin về việc tạm dừng và hướng đi mới do người dùng cung cấp ngày 10/08/2026, chưa có tài liệu nào chống đỡ.

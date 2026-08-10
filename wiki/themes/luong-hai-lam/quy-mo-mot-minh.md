---
id: themes/luong-hai-lam/quy-mo-mot-minh
title: "Một người làm việc của một đội"
type: theme
created: 2026-08-10
updated: 2026-08-10
book: luong-hai-lam
---

## Description

Mô-típ: dựng đặc tả ở quy mô một đội, rồi thi công một mình — và phần lõi là thứ không tới đích.

Hình thái lặp lại khá chính xác ở cả hai lần: một bộ tài liệu đồ sộ và chỉn chu (hàng trăm yêu cầu, sơ đồ module, báo cáo kiểm định, phủ 100%), một người thực thi, và cuối cùng chính phần mang lý do tồn tại của dự án bị hoãn hoặc dừng — trong khi phần hạ tầng xung quanh thì chạy được.

Điểm cần nói cho công bằng: **tài liệu không phải chỗ sai.** Chính vì có đặc tả tốt mà phần chạy được mới chạy được, và mới biết chính xác cái gì chưa xong. Vấn đề nằm ở tỷ lệ giữa quy mô kế hoạch và số người thi công.

## Evidence

- [[chapters/luong-hai-lam/tailor-project]] — 107 yêu cầu chức năng, 15 epic, ba lần Sprint Change Proposal mở rộng phạm vi, hai báo cáo kiểm định 4.5/5. Ba epic AI (12–14) — đúng phần mang lý do tồn tại của dự án — bị hoãn lại sau khi ra mắt thương mại điện tử.
- [[chapters/luong-hai-lam/danangnavi]] — 74 yêu cầu chức năng, 46 phi chức năng, 13 module, tài liệu kiến trúc phủ 100%, 13 quy tắc thực thi và 11 anti-pattern. Tạm dừng tháng 8/2026.

## Bằng chứng tự thân

Điều làm mô-típ này khác một lời phán đoán từ ngoài: **chính tài liệu đã biết.**

Phần câu hỏi mở của PRD DaNangNavi tự hỏi *"Cần bao lâu để đạt ngưỡng flywheel (60% nội dung tự tạo) — 3 tháng có thực tế với solo developer?"*. Tài liệu kiến trúc cũng tự hỏi liệu ranh giới module có giữ được không khi *"solo developer phải tiết kiệm thời gian và có thể shortcut qua Event Bus"*.

Hai câu hỏi đó không do trang này đặt ra. Chúng nằm sẵn trong hồ sơ, viết bởi chính người sắp gặp vấn đề.

## Đối chứng: chương 5

[[chapters/luong-hai-lam/tool-sales]] đi ngược mô-típ này, và đi ngược một cách có chủ đích.

| | Thái độ với phạm vi | Kết cục phần lõi |
|---|---|---|
| tailor_project | phình ba lần qua Sprint Change Proposal | 3 epic AI bị hoãn |
| DaNangNavi | phủ 100% yêu cầu ngay từ đầu | tạm dừng |
| **tool_sales** | **cắt bớt thành nguyên tắc** | **7 epic / 38 story đã hiện thực** |

Câu quyết định nằm trong chính tài liệu tool_sales: *"Không phải SaaS — một đội, một thị trường, một quy trình. Không đa người thuê, không cổng công khai, không bản di động. **Mỗi tính năng bị loại bỏ là một khoản phức tạp không phải trả.**"*

Và thứ dự án này có mà hai dự án kia không có: **một ràng buộc về nguồn lực viết ngay ở dòng đầu** — 30 người thành 5, 12.000 lượt mỗi ngày. Con số ấy không phải mục tiêu, nó là bộ lọc quyết định cái gì được làm.

Nói cách khác, mô-típ này có thể không phải về việc *một mình thì không đủ*, mà về việc *thiếu ràng buộc thì phạm vi tự phình*. Chương 5 là bằng chứng cho cách đọc thứ hai.

## Related themes

- [[themes/luong-hai-lam/khoang-cach-lam-va-noi]] — hai mô-típ chạm nhau ở chỗ: cả hai đều là chuyện *nhìn thấy rõ nhưng không đổi được kết quả*
- [[themes/luong-hai-lam/ai-khong-duoc-quyet]] — cùng gốc: tự đặt ràng buộc trước khi bắt tay làm

## Notes

**Đây là diễn giải, không phải sự kiện.** Hai bằng chứng đều có nguồn trong wiki; việc gọi tên chúng thành một mô-típ là do trang này đặt ra.

**Phản biện cần giữ.** Hai dự án dừng lại không tự động chứng minh nguyên nhân là quy mô. Có thể là đổi ưu tiên, đổi việc, hoặc đơn giản là học xong thì đi tiếp — dừng một dự án cá nhân không phải thất bại. Chưa có nguồn nào trong wiki nói vì sao tailor_project hoãn phần AI hay vì sao DaNangNavi tạm dừng; đến khi có, mô-típ này vẫn chỉ là một cách đọc hợp lý, không phải kết luận.

**Trang này đã phải sửa một lần.** Bản đầu (10/08/2026) đọc mô-típ là *một mình thì không kham nổi quy mô một đội*. Chương 5 buộc phải nới cách đọc: tool_sales cũng nhiều tham vọng, cũng không có đội lớn, nhưng đi tới đích — khác biệt nằm ở chỗ nó có ràng buộc rõ ngay từ đầu. Giữ lại vết sửa này để sau còn biết trang đã nghĩ sai chỗ nào.

**Điều còn phải phân xử.** WaCraft, BPO và giai đoạn tiếp của tool sales là lúc [[characters/luong-hai-lam/huynh-hai-dang]], [[characters/luong-hai-lam/pham-thi-thanh-thao]] và [[characters/luong-hai-lam/nomoto]] bước vào. Nếu có đội mà phạm vi vẫn phình, thì cách đọc thứ hai đúng: vấn đề là ràng buộc, không phải số người.

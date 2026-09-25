---
id: themes/luong-hai-lam/quy-mo-mot-minh
title: Một người làm việc của một đội
type: theme
created: 2026-08-10
updated: 2026-08-14
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
- [[themes/luong-hai-lam/ranh-gioi-cong-tu]] — nền chung: tổ chức sáu người thì không ai đủ xa ai để công–tư tách bạch

## Notes

**Đây là diễn giải, không phải sự kiện.** Hai bằng chứng đều có nguồn trong wiki; việc gọi tên chúng thành một mô-típ là do trang này đặt ra.

**Phản biện cần giữ.** Hai dự án dừng lại không tự động chứng minh nguyên nhân là quy mô. Có thể là đổi ưu tiên, đổi việc, hoặc đơn giản là học xong thì đi tiếp — dừng một dự án cá nhân không phải thất bại. Chưa có nguồn nào trong wiki nói vì sao tailor_project hoãn phần AI hay vì sao DaNangNavi tạm dừng; đến khi có, mô-típ này vẫn chỉ là một cách đọc hợp lý, không phải kết luận.

**Trang này đã phải sửa một lần.** Bản đầu (10/08/2026) đọc mô-típ là *một mình thì không kham nổi quy mô một đội*. Chương 5 buộc phải nới cách đọc: tool_sales cũng nhiều tham vọng, cũng không có đội lớn, nhưng đi tới đích — khác biệt nằm ở chỗ nó có ràng buộc rõ ngay từ đầu. Giữ lại vết sửa này để sau còn biết trang đã nghĩ sai chỗ nào.

**Điều còn phải phân xử.** WaCraft, BPO và giai đoạn tiếp của tool sales là lúc [[characters/luong-hai-lam/huynh-hai-dang]], [[characters/luong-hai-lam/pham-thi-thanh-thao]], [[characters/luong-hai-lam/nomoto]], [[characters/luong-hai-lam/quan]] và [[characters/luong-hai-lam/nhung]] bước vào. Nếu có đội mà phạm vi vẫn phình, thì cách đọc thứ hai đúng: vấn đề là ràng buộc, không phải số người.

**Câu hỏi quyết định đã có lời đáp (10/08/2026).** Ba dữ kiện đến trong ngày, và dữ kiện thứ ba đóng lại một nhánh phân vân:

1. Cả nhóm cùng làm tại công ty Wa+Craft — "một mình" trong bốn chương đầu **không phải vì công ty không có người**.
2. Lâm là **lead team IT**, không phải nhân viên nhận việc.
3. **Team IT chỉ có mình Lâm.**

Ba câu ghép lại cho một hình ảnh gọn và khá lạnh: **một công ty có ít nhất sáu người, trong đó bộ phận kỹ thuật là một người, và người đó mang chức danh trưởng bộ phận.**

Đây là câu trả lời cho câu hỏi trang này từng đặt ra. Trong ba khả năng đã liệt kê, nhánh đúng là nhánh thứ nhất: *"Lead" là chức danh chứ không phải đội hình.* Hai nhánh kia — "việc riêng ngoài công ty" và "có người mà không giao" — bị loại.

**Điều này làm mô-típ nặng thêm chứ không nhẹ đi.** Trước đó cách đọc là *một người tự nhận việc quá tầm*. Nay phải đọc lại: người đó **không có lựa chọn nào khác**. Không có ai để giao việc, vì không có ai. Toàn bộ phần kỹ thuật của một công ty — tailor_project, DaNangNavi, tool_sales, tool SEO, sắp tới là web WaCraft và web BPO — dồn vào một người, và người đó viết ra những đặc tả quy mô một đội vì đó là cách làm đúng, rồi tự thi công vì không còn cách nào khác.

Điều đó cũng sửa lại cách đọc từng được ghi ở [[chapters/luong-hai-lam/danangnavi]]. Chữ *solo developer* trong tài liệu không phải cách nói khiêm tốn hay lựa chọn cá nhân — nó là **mô tả chính xác cơ cấu tổ chức**.

**Đối chứng vẫn giữ nguyên giá trị.** tool_sales cũng do một người làm và vẫn tới đích, vì có ràng buộc rõ từ dòng đầu. Nên kết luận của trang không đổi: **thứ quyết định không phải số người, mà là có ràng buộc hay không.** Chỉ có điều giờ đã biết vì sao số người luôn là một.

**Phản biện cần giữ.** "Chỉ có mình Lâm" là tình trạng **hiện tại** (10/08/2026) — bạn dùng đúng chữ *hiện tại*. Không có gì đảm bảo team IT lúc làm tailor_project (01–04/2026) cũng chỉ một người. Nếu từng có người rồi mất, thì câu chuyện khác hẳn.

**Một dạng bằng chứng mới, chưa đủ chắc để đưa lên mục Evidence (11/08/2026).** Ba bằng chứng cũ đều nói về việc *xây*. Dữ kiện mới nói về việc *vận hành*: bạn cho biết chính Lâm là người vận hành chiến dịch chào hàng, trong khi bản thiết kế tool_sales viết cho **khoảng năm điều phối viên** ([[chapters/luong-hai-lam/tool-sales]], [[sources/bo-kich-ban-email-marketing-wa-craft]]).

Nếu con số năm ấy thực tế cũng là một, thì mô-típ lặp lại ở một mặt phẳng khác hẳn — và đáng chú ý hơn, vì lần này chính hệ thống được thiết kế để *cần* nhiều người trông. Nhưng bạn chỉ nói Lâm vận hành, không nói Lâm vận hành một mình; giữ ở đây cho tới khi biết đội vận hành có mấy người.

**Câu hỏi tiếp theo, và nó khó hơn câu trước.** Nếu bộ phận kỹ thuật là một người mà phần lớn danh mục dự án là phần mềm, thì hoặc công ty đang tính tuyển thêm, hoặc đang chấp nhận rằng mọi thứ chạy với tốc độ của một người. Chưa dữ kiện nào cho biết là cái nào.

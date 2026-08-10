---
id: chapters/luong-hai-lam/tool-sales
title: "Chương 5: tool_sales — ba mươi người thành năm"
type: chapter
created: 2026-08-10
updated: 2026-08-10
book: luong-hai-lam
number: 5
---

## Summary

tool_sales là hệ thống tự động gửi form liên hệ B2B cho thị trường Nhật. Con số định hình mọi thứ nằm ngay ở đầu bộ tài liệu: **thay 30 nhân sự làm thủ công bằng khoảng 5 điều phối viên vận hành máy, ở mức ~12.000 lượt gửi mỗi ngày.**

Đây là lần đầu trong sách bài toán của Lâm không phải "xây cái gì" mà là "**một người trông được bao nhiêu việc cùng lúc**". Con số 30-thành-5 không phải chỉ tiêu marketing — nó là ràng buộc thiết kế, quyết định cái gì được tự động hoá, cái gì để lại cho người, và giao diện phải trông thế nào.

Và có một câu trong tài liệu đáng đặt cạnh hai chương trước:

> *"Không phải SaaS — một đội, một thị trường, một quy trình. Không đa người thuê, không cổng công khai, không bản di động. Mỗi tính năng bị loại bỏ là một khoản phức tạp không phải trả."*

Sau tailor_project phình ra ba lần và DaNangNavi phủ 100% yêu cầu rồi tạm dừng, đây là dự án đầu tiên mà **việc cắt bớt được viết thành nguyên tắc**.

## Key events

1. **Một con số làm ràng buộc.** 30 → 5, ~12.000 lượt/ngày. Hệ quả trực tiếp: hệ thống không tối ưu cho việc làm thay con người ở mọi khâu, mà tối ưu cho việc một người trông được nhiều việc. Xem [[concepts/tool-sales/operator-leverage]].

2. **Người ở vòng ngoài, không ở vòng trong.** Điều phối viên xử lý ngoại lệ — hàng chờ rà NG, bàn giao CAPTCHA, lead không xác minh được — nhưng không đứng trong đường chạy chính. Không bước nào dừng lại đợi người bấm nút.

3. **Rào chắn pháp lý, không phải tính năng.** Nhiều website Nhật ghi rõ **営業お断り** (từ chối chào hàng), viện dẫn Luật Giao dịch thương mại đặc định. Gửi form tới đó có thể bị **phạt tiền thật**. Bộ dò NG vì vậy chạy **hoàn toàn không dùng LLM** — chỉ khớp từ khoá, regex và bộ lọc dương tính giả — vì cần xác định, kiểm toán được, và chi phí bằng không. Không đường thực thi nào chạm tới bước gửi mà chưa qua cổng này. Xem [[concepts/tool-sales/ng-detection]].

4. **LLM làm thầy, không làm thợ.** Chạy song song bộ luật và LLM trên cùng dữ liệu; khớp thì tăng bộ đếm, lệch thì lấy kết quả LLM sửa lại luật và đặt đếm về không. Đủ vài trăm lần khớp liên tiếp thì tắt hẳn LLM. Chi phí ban đầu là học phí, giảm dần về không. Xem [[concepts/swe/rule-llm-dual-run]].

5. **Vượt ngân sách thì chậm lại, không gãy.** Circuit breaker phân tầng theo tỷ lệ chi tiêu LLM trong ngày: dùng đầy đủ → chỉ dùng cho mẫu mới → rule-only. Xem [[concepts/swe/budget-tiered-circuit-breaker]], [[concepts/swe/graceful-degradation]].

6. **"Không biết" là một câu trả lời hợp lệ.** Sau khi tự động gửi form trên website người khác, làm sao biết nó đã tới? Thang cứu hộ 5 nấc xếp tín hiệu theo độ tin cậy giảm dần; tín hiệu vắng mặt thì **bỏ phiếu trắng chứ không đoán**; đi hết thang mà không kết luận được thì trả về "không xác định" — trạng thái riêng, khác hẳn "thất bại", vì chỉ một trong hai đáng thử lại. Xem [[concepts/swe/rescue-ladder]], [[concepts/tool-sales/submission-verification]].

7. **Ranh giới cứng, không thương lượng.** Frontend không chạm cơ sở dữ liệu. Worker không import package backend. Router không truy vấn DB trực tiếp. Bí mật không nằm trong mã và không đi ra qua API.

8. **Phạm vi đã hiện thực: 7 epic / 38 story.** Bộ tài liệu được sinh bằng deep scan ngày 20/06/2026 và mô tả **mã thực tế đang chạy**, không phải ý định thiết kế. Nguồn: [[sources/tool-sales-architecture-docs]].

## Characters introduced

- [[characters/luong-hai-lam/luong-hai-lam]] — người xây

## Themes

- [[themes/luong-hai-lam/quy-mo-mot-minh]] — **bằng chứng đối chứng**, không phải bằng chứng xác nhận: đây là dự án đầu tiên có phạm vi bị cắt chủ động và đã hiện thực đủ 7 epic
- [[themes/luong-hai-lam/ai-khong-duoc-quyet]] — bằng chứng thứ hai, và là bản rõ nhất: quyết định có hậu quả pháp lý không được giao cho mô hình xác suất

## Open questions

- **Chương này thuộc thì nào?** Tài liệu (20/06/2026) mô tả mã đã chạy với 7 epic hoàn tất, nhưng theo bạn thì tool sales là việc *sắp làm* sau WaCraft và BPO. Đây là giai đoạn hai của cùng hệ thống, hay một bản mới?
- **Năm điều phối viên là ai?** Hệ thống thiết kế cho một đội vận hành. Đăng, Thảo, bác Nomoto có nằm trong số đó không — và ai là người thực sự bấm nút mỗi ngày?
- Ai dùng kết quả? 12.000 lượt gửi/ngày để bán cái gì, cho ai?
- Hai câu hỏi mở từ chính tài liệu vẫn chưa có lời đáp: ngưỡng tốt nghiệp vài trăm lần khớp dựa trên cơ sở nào, và làm sao đo được tỷ lệ NG bỏ sót khi bỏ sót theo định nghĩa là thứ không phát hiện được.

## Notes

**Vì sao tôi không gắn chủ đề [[themes/luong-hai-lam/khoang-cach-lam-va-noi]] vào chương này.** Nó khớp — hiểu form của website lạ rồi điền đúng ô cũng là một dạng dịch. Nhưng chương trước đã ghi nhận rằng mô-típ ấy khớp cả 4/4 dự án, tức tiêu chí quá rộng để phân biệt được gì. Thêm bằng chứng thứ năm chỉ làm nó rỗng thêm. Ghi lại ở đây để lần sau không ai tưởng là bỏ sót.

**Điều đáng chú ý nhất của chương.** Ba dự án, ba thái độ với phạm vi:

- tailor_project — phình ba lần, phần lõi bị hoãn
- DaNangNavi — phủ 100%, tạm dừng
- tool_sales — cắt bớt thành nguyên tắc, 7 epic hoàn tất

Nếu [[themes/luong-hai-lam/quy-mo-mot-minh]] đúng, thì chương này là chỗ mô-típ ấy bị bẻ — và bẻ bằng đúng thứ mà nó thiếu: một ràng buộc rõ về nguồn lực, viết ngay từ dòng đầu tiên của tài liệu.

**Một dấu vết B Productions trong tài liệu (phát hiện 10/08/2026).** Tệp gốc `raw/sources/projects/tool-sales/project-context.md` liệt kê `../auto_b_production/src/auto_b/core/` là **bản tham chiếu để port** — logic điền form, phát hiện form, kiểm tra opt-out, worker pool song song, stealth, bộ selector xác minh CSS, hệ placeholder. Nói cách khác, phần cốt lõi nhất của tool_sales không được nghĩ ra từ số không mà **dựng trên một công cụ sẵn có của B Productions**, công ty cũ của [[characters/luong-hai-lam/quan]] và [[characters/luong-hai-lam/pham-thi-thanh-thao]].

Điều này **không làm nhẹ đi** đánh giá ở trên. Tài liệu ghi rõ "PORT (not import)" — chép ý tưởng, viết lại mã. Nhưng nó bổ sung một lớp cho câu chuyện: khi Lâm cắt phạm vi thành nguyên tắc và hoàn tất 7 epic, một phần lý do có thể là **bài toán đã có lời giải tham khảo**, khác hẳn tailor_project và DaNangNavi nơi mọi thứ phải nghĩ từ đầu. Đây là suy luận, không phải điều tài liệu nói.

Bảng đầy đủ bốn dấu vết B Productions trong wiki nằm ở [[people/quan]].

Chương dựng từ 1 nguồn và 6 khái niệm đã có trong wiki. Thông tin rằng tool sales nằm trong kế hoạch sắp tới do bạn cung cấp ngày 10/08/2026.

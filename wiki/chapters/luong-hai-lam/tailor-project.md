---
id: chapters/luong-hai-lam/tailor-project
title: "Chương 2: tailor_project — dịch cảm xúc thành milimét"
type: chapter
created: 2026-08-10
updated: 2026-08-10
book: luong-hai-lam
number: 2
---

## Summary

Từ tháng 01 đến 04/2026, Lâm xây tailor_project — nền tảng may đo Áo dài bespoke tích hợp AI. Bài toán gốc rất người: khách hàng nói *"em muốn cái áo trông thanh thoát hơn"*, thợ may cần một con số để cắt. Giữa hai đầu ấy là **khoảng cách ngôn ngữ**, và cả dự án là một nỗ lực bắc cầu — dịch tính từ cảm xúc thành sai số hình học tính bằng milimét.

Thứ được xây ra không dừng ở đó. Qua ba lần Sprint Change Proposal, phạm vi phình từ một AI engine thuần túy thành nền tảng thương mại điện tử + đặt lịch + quản lý vận hành hoàn chỉnh: 107 yêu cầu chức năng, 20 yêu cầu phi chức năng, 15 epic. Và một quyết định đáng chú ý ở cuối: **ba epic AI — thứ vốn là lý do dự án tồn tại — bị hoãn lại sau khi ra mắt phần thương mại điện tử.**

Về thời gian, chương này xảy ra **trước** [[chapters/luong-hai-lam/ung-tuyen-tieng-nhat]]. Bốn tháng code ở đây chính là thứ nằm trong bản CV bị chê là chưa biết kể.

## Key events

1. **Đặt tên cho bài toán.** Physical-Emotional Compiler — bộ dịch từ tính từ phong cách sang Geometric Delta. Mục tiêu đo được: sai số ΔG ≤ 1mm, tỷ lệ vừa vặn lần đầu > 90%, thời gian tư vấn giảm từ 60 phút xuống 15. Nguồn: [[sources/tailor-project-prd]].

2. **Chọn kiến trúc trước khi chọn công cụ.** Báo cáo nghiên cứu kỹ thuật ([[sources/technical-research-semantic-to-geometric-translation-architecture]], Lâm viết dưới biệt danh **Lem**) chốt stack LangGraph + pgvector + Pydantic + FastAPI trên nền Modular Monolith với Clean Architecture, và đặt một ranh giới quan trọng: **AI chỉ là thành phần tư vấn, tầng điều khiển xác định mới là nơi thực thi ràng buộc vật lý.**

3. **Ba người không có thật nhưng định hình mọi thứ.** Ba persona — [[people/linh-customer]] (khách), [[people/minh-tailor]] (thợ may), [[people/co-lan-owner]] (chủ tiệm) — mỗi người một dashboard, một luồng công việc. Nguyên tắc Dual-Mode UI sinh ra từ đây: Boutique Mode cho khách (nền ngà, thoáng, serif) và Command Mode cho người trong nghề (trắng, dày đặc, sans-serif). Cùng một hệ thống, hai ngôn ngữ thị giác.

4. **Phạm vi phình ba lần.** Ba Sprint Change Proposal đẩy dự án từ AI Bespoke thành nền tảng đầy đủ. Epic 15 (Status Transition & Business Event Tracking) được thêm vào sau, mang theo nguyên tắc **"Video, Not Snapshot"**: mọi chuyển trạng thái là một sự kiện bất biến, trạng thái hiện tại chỉ là giá trị dẫn xuất. Nguồn: [[sources/epic-breakdown-tailor-project]].

5. **Hoãn phần AI.** Epic 12–14 (AI Style, AI Geometry, AI Guardrails) — đúng ba epic mang lý do tồn tại của dự án — bị dời lại sau khi ra mắt thương mại điện tử. Epic 1–11 và 15 vào MVP.

6. **Những thứ chạy được.** Checkout 3 bước với Authoritative Server Pattern và `SELECT ... FOR UPDATE` chặn race condition; webhook thanh toán idempotent; Pattern Engine sinh 3 mảnh rập từ 10 số đo, hoàn toàn xác định, không dùng AI; 300+ backend test và 500+ frontend test. Nguồn: [[sources/luong-hai-lam-4]].

## Characters introduced

- [[characters/luong-hai-lam/luong-hai-lam]] — người xây; ở chương này làm việc một mình với tài liệu và code, chưa có ai quản lý

Chương này gần như không có nhân vật người. Đối tác đối thoại của Lâm là ba persona không có thật và một chồng tài liệu đặc tả. Chi tiết ấy tự nó nói lên điều gì đó về giai đoạn.

## Themes

- [[themes/luong-hai-lam/khoang-cach-lam-va-noi]] — lần lặp thứ hai của mô-típ, ở tầng khác: cả dự án này *là* một cỗ máy dịch từ cảm xúc sang con số. Lâm giải bài toán khoảng-cách-ngôn-ngữ cho khách hàng và thợ may bốn tháng trước khi phát hiện chính mình mắc đúng bệnh đó với nhà tuyển dụng.
- [[themes/luong-hai-lam/quy-mo-mot-minh]] — bằng chứng đầu tiên: 107 yêu cầu, 15 epic, ba lần mở rộng phạm vi, và ba epic AI mang lý do tồn tại của dự án bị hoãn lại
- [[themes/luong-hai-lam/ai-khong-duoc-quyet]] — bằng chứng đầu tiên: AI là thành phần tư vấn, tầng điều khiển xác định mới thực thi ràng buộc vật lý; Pattern Engine sinh rập hoàn toàn theo công thức

## Open questions

- Dự án dừng ở đâu? Ba epic AI có bao giờ được làm không, hay tailor_project khép lại ở phần thương mại điện tử khi Lâm chuyển sang DaNangNavi (04/2026)?
- Có ai khác tham gia không, hay đúng là một mình?

## Notes

**Về đánh số chương.** Chương này mang số 2 theo thứ tự bạn muốn kể, nhưng về thời gian nó xảy ra trước chương 1 (01–04/2026 so với 05/2026). Đây là hồi tưởng — hợp lệ trong tiểu thuyết, nhưng cần biết trước một hệ quả: tính năng tóm tắt theo tiến độ đọc (`/lumi-reading-plot-recap`) hiểu `number` là dòng thời gian, nên sẽ tóm tắt sai thứ tự. Nếu về sau thấy vướng, đổi `number` là sửa một trường trong frontmatter — rẻ, làm lúc nào cũng được.

Chương dựng từ 4 nguồn đã có trong wiki. Năm nguồn epic artifacts (`sources/epic-1..5-implementation-artifacts-tailor-project`) chưa khai thác — còn nhiều chi tiết thực thi ở đó nếu muốn đào sâu.

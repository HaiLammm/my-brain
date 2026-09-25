---
id: outputs/ho-so-nang-luc-wa-craft
title: "Hồ sơ năng lực WA+CRAFT (サービス紹介資料, 20 trang tiếng Nhật)"
type: output
created: 2026-09-06
updated: 2026-09-06
confidence: medium
covers:
  - sources/ho-so-nang-luc-double-m
  - sources/ho-so-cong-ty-wa-craft
  - sources/tool-sales-architecture-docs
  - sources/bo-kich-ban-email-marketing-wa-craft
  - concepts/ops/bpo-back-office
  - concepts/ops/chuan-hoa-bang-tai-lieu
  - concepts/ops/chong-thuoc-nhan-hoa
  - concepts/marketing/noi-bo-hoa-nang-luc-marketing
  - concepts/tool-sales/sales-form-pipeline
  - concepts/tool-sales/ng-detection
  - concepts/tool-sales/submission-verification
  - concepts/tool-sales/operator-leverage
  - concepts/swe/rescue-ladder
  - concepts/swe/budget-tiered-circuit-breaker
  - concepts/swe/rule-llm-dual-run
  - concepts/swe/checkpoint-before-side-effect
---

# Hồ sơ năng lực WA+CRAFT — サービス紹介資料

Tài liệu bán hàng 20 trang tiếng Nhật cho [[sources/ho-so-cong-ty-wa-craft|WA CRAFT COMPANY LIMITED]], dựng theo khuôn hồ sơ năng lực của [[sources/ho-so-nang-luc-double-m|Double M]], bổ sung hai hệ thống tự phát triển: nền tảng gửi form bán hàng (`tool_sales`) và nền tảng sinh bài SEO (`auto_workflow/seo-cockpit`).

## Tệp thật

| Mục | Giá trị |
|---|---|
| Đường dẫn | `~/Projects/wacraft0307/company-profile.html` |
| Kích thước | ~425 KB (đã nhúng ảnh base64, chạy độc lập không cần thư mục kèm) |
| Ngôn ngữ | Tiếng Nhật toàn bộ |
| Xuất PDF | `google-chrome --headless --no-pdf-header-footer --print-to-pdf=out.pdf file:///.../company-profile.html` → đúng 20 trang A4 ngang; hoặc mở file rồi Ctrl+P |
| Kỹ thuật dàn trang | CSS container queries (`cqw`) nên một bản dùng chung cho màn hình 16:9 và bản in A4 |

Chưa commit vào repo `wacraft0307` (repo này auto-deploy Vercel — commit đồng nghĩa với công khai).

## Vì sao mượn khuôn Double M

Double M là hồ sơ năng lực Nhật đã được kiểm chứng thị trường, có cấu trúc thuyết phục lặp đi lặp lại: **3 nỗi đau → vì sao cách của chúng tôi giải được → vì sao chọn chúng tôi → bảng so sánh → từng dịch vụ (3 lo lắng → 3 giải pháp → 6 lợi ích) → lời chứng → 5 bước → FAQ → 会社概要 → CTA**. Khuôn này quen mắt với người mua Nhật, nên tài liệu không phải "dạy" người đọc cách đọc nó.

## Bản đồ 20 trang

| Trang | Nội dung |
|---|---|
| 1 | Bìa — ảnh team, khẩu hiệu 「手間」を「成果」に変える |
| 2 | Mục lục |
| 3 | 3 nỗi đau: thiếu người / không biết bắt đầu AI từ đâu / lo offshore không thông tiếng Nhật |
| 4 | Vì sao 「日本語 × AI × ベトナム」 giải được |
| 5 | 3 lý do được chọn |
| 6 | Bảng so sánh 4 cột: WA+CRAFT / tự tuyển / offshore BPO thường / freelance |
| 7 | ① BPO — [[concepts/ops/bpo-back-office]] |
| 8 | ② Hỗ trợ bán hàng — form営業オートメーション (tool tự phát triển) |
| 9 | ③ Hỗ trợ nội dung SEO (tool tự phát triển) |
| 10 | ④ Ứng dụng AI · tự động hóa nghiệp vụ |
| 11 | ⑤ Phân tích · chỉnh trang dữ liệu |
| 12 | ⑥ Hỗ trợ tuyển dụng |
| 13 | ⑦ Team building — "đội thứ hai" của khách |
| 14 | 自社導入実績① — tool_sales |
| 15 | 自社導入実績② — nền tảng sinh bài SEO |
| 16 | 5 nguyên tắc vận hành (chỗ đứng tạm của trang お客様の声) |
| 17 | Quy trình 5 bước |
| 18 | FAQ 8 câu |
| 19 | 会社概要 · giới thiệu người đại diện |
| 20 | CTA đóng |

## Đã đổi gì so với khuôn gốc

| Double M | WA+CRAFT | Lý do |
|---|---|---|
| 9 dòng dịch vụ | **7 dòng** | Chính điểm yếu của bản gốc là danh mục quá rộng làm loãng thông điệp (dịch vụ tuyển dụng đứng cạnh "chúng tôi là chuyên gia hội thảo"). 7 dòng khớp 6 dịch vụ trên website hiện tại + dòng SEO mới |
| 1 trang お客様の声 (4 lời chứng có ảnh, tên công ty) | **5 nguyên tắc vận hành** | Chưa có lời chứng khách hàng thật ở bất kỳ nguồn nào. Không bịa |
| Không có trang tự triển khai | **2 trang 自社導入実績** (P14–15) | Đây là điểm khác biệt thật của WA+CRAFT so với BPO thường: [[concepts/marketing/noi-bo-hoa-nang-luc-marketing|làm được cả tự động hóa, không chỉ cấp người]] |
| Ảnh chân dung producer ở P19 | Ảnh team, không ảnh chân dung riêng | Chưa có ảnh chân dung của người đại diện |

## Số liệu dùng và nguồn gốc

Tất cả đều gắn nhãn 自社導入実績 kèm câu miễn trừ 「当社自身の運用に基づく社内実測値および設計値であり、貴社での成果を保証するものではありません」.

### P14 — tool_sales

| Chỉ số | Giá trị | Loại |
|---|---|---|
| Nhân lực vận hành | 30 người thủ công → ~5 người | So sánh thiết kế |
| Lượt gửi/ngày | ~12.000 | Giá trị thiết kế |
| Phán định 営業お断り | Keyword + regex, không giao cho LLM | [[concepts/tool-sales/ng-detection]] |
| Xác minh kết quả gửi | 30+ pattern tự động | [[concepts/tool-sales/submission-verification]] |
| Khi không phán định được | 5 mức phụ trợ → chuyển người | [[concepts/swe/rescue-ladder]] |
| Kiến trúc | Next.js + FastAPI + 4 worker + PostgreSQL, 22 module | [[concepts/tool-sales/sales-form-pipeline]] |

Bốn nguyên tắc thiết kế in ở khối bên phải P14 chính là bốn concept đã có trong wiki: không giao phán định pháp lý cho AI ([[concepts/tool-sales/ng-detection]]), suy giảm dần theo ngân sách ([[concepts/swe/budget-tiered-circuit-breaker]]), luật tốt nghiệp khỏi AI ([[concepts/swe/rule-llm-dual-run]]), ghi điểm dừng trước thao tác không thể hoàn tác ([[concepts/swe/checkpoint-before-side-effect]]).

### P15 — nền tảng sinh bài SEO

| Chỉ số | Trước | Sau |
|---|---|---|
| Thời gian sinh 1 bài | ~10 phút | ~2,4 phút |
| Chi phí AI 1 bài | ~$2,60 | ~$0,18 |
| Kỹ sư tham gia | Mỗi bài | Không cần |
| 50 bài/tuần | — | dưới $10/tuần |

Kèm 3 con số tích lũy: 20 bài hoàn chỉnh, 15 quy tắc viết đã tích lũy, 41 trang tri thức nền.

Nguồn: `~/Projects/auto_workflow/bao-cao.md` và `seo-cockpit/README.md`. **Hai tệp này chưa được nạp vào wiki** — đây là khoảng trống nên lấp nếu còn dùng lại số liệu SEO cockpit.

## Ba điều cố ý không đưa vào

1. **Không có lời chứng khách hàng.** Không nguồn nào có. Trang 16 thay bằng 5 nguyên tắc vận hành, kèm ghi chú trong file: khi có case thật thì thay `<section id="p16">` là khớp lại nguyên mẫu.
2. **Không dùng 500+ 成功事例 / 98% 顧客満足度 / 10+ 経験年数** đang hiển thị trên website. Đây gần như chắc chắn là số mặc định của template Axis Bootstrap — "10+ năm kinh nghiệm" mâu thuẫn với ngày thành lập 03/03/2026.
3. **Không nêu tên site khách** (`setsubi-pro.net`), viết chung là 日本国内の設備修理サービスサイト.

## Ba điểm cần quyết trước khi gửi khách

1. **Tên và chức danh người đại diện lệch nhau.** Hồ sơ pháp lý + chữ ký email: 野本 享彦 / Director. `index.html` của website: 野本 隆彦 / 最高技術責任者（CEO）. Tài liệu dùng bản pháp lý. Xem [[people/nomoto]].
2. **Trang 16** thay khi có lời chứng thật.
3. **Nơi lưu file.** Đang nằm trong repo website (auto-deploy Vercel) — cần chọn: publish thành trang web, hay `.gitignore` để chỉ dùng làm file gửi khách.

## Hình minh họa

- 37 icon SVG tự vẽ trong một sprite (`<symbol id="i-…">`, gọi qua `<use href="#i-…">`), 95 vị trí sử dụng, theo bảng màu thương hiệu navy `#2D3652` / cam `#C05F35`.
- Bố cục minh họa bám cách Double M dùng: illustration lớn mờ lấp đáy các thẻ thưa chữ (P3, P16, P17), icon nhỏ cho từng ô lợi ích (42 ô), vương miện trên cột mình ở bảng so sánh.
- Dải sơ đồ luồng 6 bước ở P14 và P15 — phần thêm ngoài khuôn gốc, vì hai trang này mô tả hệ thống nên sơ đồ nói nhanh hơn bảng số.
- 3 ảnh chụp team thật lấy từ `assets/img/about/hahoangmedia-*.jpg` của website, resize và nhúng base64.

## Nguồn và liên hệ

- Khuôn tài liệu: [[sources/ho-so-nang-luc-double-m]]
- Thông tin công ty, dịch vụ, người đại diện: [[sources/ho-so-cong-ty-wa-craft]], [[people/nomoto]]
- Hệ thống P8/P14: [[sources/tool-sales-architecture-docs]], [[concepts/tool-sales/sales-form-pipeline]], [[concepts/tool-sales/ng-detection]], [[concepts/tool-sales/submission-verification]], [[concepts/tool-sales/operator-leverage]]
- Giọng bán hàng tiếng Nhật: [[sources/bo-kich-ban-email-marketing-wa-craft]]
- Luận điểm vận hành ở P16: [[concepts/ops/chuan-hoa-bang-tai-lieu]], [[concepts/ops/chong-thuoc-nhan-hoa]]
- Chưa có trong wiki: báo cáo `auto_workflow` (nền tảng SEO cockpit)

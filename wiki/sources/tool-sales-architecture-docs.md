---
type: source
title: tool_sales — Bộ tài liệu kiến trúc dự án
authors: []
source_type: note
importance: 3
confidence: high
ingest_status: finalized
tags:
  - tool-sales
  - kien-truc
  - automation
raw_paths:
  - raw/sources/projects/tool-sales/project-overview.md
  - raw/sources/projects/tool-sales/architecture-workers.md
  - raw/sources/projects/tool-sales/architecture-backend.md
  - raw/sources/projects/tool-sales/architecture-frontend.md
  - raw/sources/projects/tool-sales/integration-architecture.md
  - raw/sources/projects/tool-sales/data-models-backend.md
  - raw/sources/projects/tool-sales/api-contracts-backend.md
  - raw/sources/projects/tool-sales/deployment-guide.md
  - raw/sources/projects/tool-sales/development-guide.md
  - raw/sources/projects/tool-sales/project-context.md
id: sources/tool-sales-architecture-docs
created: 2026-08-07
updated: 2026-08-11
year: 2026
provenance: replayable
verify_status: skipped
findings: []
---

## Summary

Bộ tài liệu kiến trúc của `tool_sales` — hệ thống tự động gửi form liên hệ B2B cho thị trường Nhật, thay thế một quy trình thủ công cần 30 nhân sự bằng đường ống tự động do khoảng 5 điều phối viên vận hành, ở mức ~12.000 lượt gửi mỗi ngày. Tài liệu mô tả monorepo ba phần triển khai (frontend Next.js, backend FastAPI, đội worker Python + Playwright) chạy trên một PostgreSQL dùng chung, cùng các quyết định kiến trúc và lý do đằng sau chúng.

Điểm đáng học nhất không phải công nghệ mà là cách hệ thống xử lý **rủi ro pháp lý và tính bất định**: một cổng chặn xác định đặt trước mọi hành động không đảo ngược được, và một loạt cơ chế suy giảm mềm để hệ thống chậm lại thay vì gãy.

## Key claims

- **Quyết định có hậu quả pháp lý không được giao cho mô hình xác suất.** Bộ dò NG (site cấm chào hàng) chạy hoàn toàn bằng so khớp từ khoá và regex, không dùng LLM — vì cần xác định, kiểm toán được, và chi phí bằng không.
- **Worker ghi thẳng vào cơ sở dữ liệu, không có lớp REST callback.** Backend và worker chia sẻ một PostgreSQL; backend đọc trạng thái từ DB rồi đẩy sang frontend qua SSE.
- **Hàng đợi công việc đặt trong DB** với claim bằng `FOR UPDATE SKIP LOCKED`, heartbeat, tiến trình reaper hồi sinh job treo, và fencing token chặn ghi đè từ job đã bị thu hồi.
- **Ghi checkpoint trước hành động phụ**, không phải sau — để lần chạy lại sau sự cố biết mình đã đi tới đâu.
- **Vượt ngân sách thì suy giảm, không dừng.** Circuit breaker phân tầng theo tỷ lệ chi tiêu LLM trong ngày: dùng đầy đủ, chỉ dùng cho mẫu mới, rồi rule-only.
- **Rule học từ LLM rồi tốt nghiệp khỏi nó.** Chạy song song rule và LLM, so sánh kết quả; khớp liên tiếp đủ ngưỡng thì tắt LLM vĩnh viễn.
- **Ranh giới cứng, không thương lượng:** frontend không chạm DB, worker không import package backend, router không truy vấn DB trực tiếp, bí mật không nằm trong mã và không đi ra qua API.

## Evidence

- Chỉ số thành công đặt ra: ~12.000 lượt gửi/ngày với 5 điều phối viên, **dưới 1% NG false negative** (chỉ số tối quan trọng), ≥80% tỷ lệ gửi thành công, điều phối viên làm việc được sau 1 ngày.
- Phạm vi đã hiện thực: 7 epic / 38 story, gồm xác thực và phân quyền, quản lý lead, chiến dịch, discovery + NG, hiểu form, gửi form, xác minh kết quả, cấu hình chống bot, prospecting.
- Ngân sách kết nối chia theo dịch vụ để tổng pool nằm dưới trần mặc định 100 của PostgreSQL: bốn loại worker 10 mỗi loại, reaper 2, backend 20, monitoring 5.
- Thang cứu hộ 5 mức khi xác minh không kết luận được, xếp theo độ mạnh tín hiệu, tín hiệu thiếu thì bỏ phiếu trắng thay vì đoán.

## Related concepts

- [[concepts/tool-sales/ng-detection]]
- [[concepts/tool-sales/sales-form-pipeline]]
- [[concepts/tool-sales/form-understanding]]
- [[concepts/tool-sales/submission-verification]]
- [[concepts/tool-sales/ai-prospecting]]
- [[concepts/tool-sales/operator-leverage]]
- [[concepts/swe/db-backed-job-queue]]
- [[concepts/swe/checkpoint-before-side-effect]]
- [[concepts/swe/budget-tiered-circuit-breaker]]
- [[concepts/swe/rule-llm-dual-run]]
- [[concepts/swe/rescue-ladder]]
- [[concepts/swe/graceful-degradation]]
- [[concepts/swe/pure-core-gated-io]]
- [[concepts/swe/tiered-refresh-cadence]]
- [[concepts/swe/shared-db-no-callback]]
- [[concepts/swe/connection-pool-budget]]
- [[concepts/swe/unicode-normalization-boundary]]

## Related sources

- [[sources/kien-truc-he-thong-lo-trinh-mo-rong-quy-mo-cho-he-thong-hang-trieu-nguoi-dung]]
- [[sources/bo-kich-ban-email-marketing-wa-craft]] — **nội dung mà hệ thống này gửi đi**: kịch bản tiếng Nhật chào dịch vụ thuê ngoài của Wa+Craft, ký tên Director công ty
- [[sources/ho-so-cong-ty-wa-craft]] — hồ sơ công ty vận hành cỗ máy này; dòng "tự động hóa bằng AI (ChatGPT API / RPA / Python)" trong hồ sơ chính là hệ thống được mô tả ở đây

## People

_(không có tác giả cụ thể — tài liệu nội bộ dự án)_

## Open questions

- Ngưỡng tốt nghiệp 200 lần khớp liên tiếp được chọn dựa trên cơ sở nào? Đã có dữ liệu nào cho thấy ngưỡng thấp hơn vẫn an toàn chưa?
- Mục tiêu dưới 1% NG false negative được đo bằng cách nào khi false negative theo định nghĩa là thứ hệ thống không phát hiện được?
- Ràng buộc một tiến trình cho reaper còn giữ được không nếu đội worker mở rộng ra nhiều máy?

## Notes

Bộ tài liệu này được sinh bằng workflow Document Project (deep scan, 2026-06-20) và mô tả **mã thực tế**, không phải ý định thiết kế; nguồn ý định nằm ở `_bmad-output/planning-artifacts/architecture/` trong repo gốc.

**Tài liệu này đã lạc hậu so với mã (đo lại 2026-08-11).** Khảo sát trực tiếp repo `~/Projects/tool_sales` cho thấy hệ thống đi xa hơn ảnh chụp tháng 6 đáng kể — nên khi tra cứu, hãy coi trang này là *bản thiết kế thời điểm 20/06*, không phải trạng thái hiện tại:

| Hạng mục | Tài liệu (20/06/2026) | Đo lại (11/08/2026) |
|---|---|---|
| Migration Alembic | 23 (`0023_prospecting_enrich` là HEAD) | 49 |
| Story Epic 5 (gửi form) | 6 | 43 |
| Tổng story artifact | 38 | 114 |
| Lịch sử commit | — | 435 commit, 18/06 → 10/08/2026 |
| Test | 37 tệp (workers) | 2.928 hàm test / 266 tệp |
| Vận hành thật | chưa có bằng chứng | 14 báo cáo lỗi gửi (07/07 → 05/08), `recordings/` 1,2 GB |

Hai "known gap" mà tài liệu ghi là còn treo — `_submit()` chưa hiện thực browser và LLM analyzer chưa nối — **đã được lấp**: repo có `workers/worker/submission/submit.py` (6.086 dòng) và `workers/worker/form/{llm,claude_analyzer,gpt,fallback_analyzer}.py`.

Lộ trình đọc hiểu và làm chủ hệ thống này: [[outputs/lo-trinh-tu-chu-tool-sales]].

Không sao chép `docs/data/` vào `raw/` — thư mục đó chứa 65 MB CSV danh sách công ty và email thật.

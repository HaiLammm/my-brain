---
id: outputs/lo-trinh-tu-chu-tool-sales
title: "Lộ trình tự chủ tool_sales — từ 'AI làm hộ' sang 'tôi làm được'"
type: output
created: 2026-08-11
updated: 2026-08-11
covers:
  - sources/tool-sales-architecture-docs
  - sources/ho-so-luong-hai-lam
  - concepts/tool-sales/sales-form-pipeline
  - concepts/tool-sales/ng-detection
  - concepts/tool-sales/form-understanding
  - concepts/tool-sales/submission-verification
  - concepts/tool-sales/operator-leverage
  - concepts/swe/db-backed-job-queue
  - concepts/swe/checkpoint-before-side-effect
  - concepts/swe/rescue-ladder
  - concepts/swe/rule-llm-dual-run
  - concepts/swe/budget-tiered-circuit-breaker
  - concepts/swe/pure-core-gated-io
---

## Câu hỏi đặt ra

*"Với những kiến thức tôi đang có, làm thế nào để có thể làm được tool_sales?"* — hỏi ngày 11/08/2026.

Khảo sát repo `~/Projects/tool_sales` cho thấy câu hỏi không phải "xây thế nào". **Hệ thống đã tồn tại và đang chạy thật.** Câu hỏi thật nằm ở chỗ khác: làm sao để quyền tự chủ với nó thuộc về mình.

## Hệ thống thật, đo được (11/08/2026)

| Hạng mục | Con số |
|---|---|
| Code thật (trừ `.venv`, `node_modules`) | ~141.000 dòng — backend 55k / workers 59k / frontend 26k |
| Lịch sử phát triển | 435 commit trong 54 ngày (18/06 → 10/08/2026), ≈ 8 commit/ngày |
| Migration Alembic | 49 revision (tài liệu tháng 6 ghi 23 — đã đi xa hơn gấp đôi) |
| Test có sẵn | 2.928 hàm test / 266 file; 58 file bị chặn bởi `RUN_DB_TESTS` / `RUN_BROWSER_TESTS` |
| Tài liệu story | 114 file trong `_bmad-output/implementation-artifacts/` — riêng Epic 5 (gửi form) có 43 story |
| Điểm nóng nhất | `workers/worker/submission/submit.py` — 6.086 dòng, sửa 54 lần, 119 hàm cấp cao |
| Bằng chứng vận hành | 14 báo cáo `send-failure-analysis-*.html` (07/07 → 05/08), thư mục `recordings/` 1,2 GB |

## Khoảng cách thật

435 commit trong 54 ngày là nhịp của code do AI sinh. Bản tự đánh giá trong [[sources/ho-so-luong-hai-lam]] ghi: *"Python tạm được, chưa hiểu OS tốt; FastAPI cơ bản; asyncio, Celery chưa thực sự giỏi."*

Hệ thống chạy được, nhưng khi nó hỏng theo cách chưa có tiền lệ thì vẫn cần AI để sửa. Đó là khoảng cách lộ trình này nhắm vào — không phải kiến thức để *xây*, mà kiến thức để *làm chủ*.

**Mục tiêu:** ở nhịp 1–2 giờ/ngày trong khoảng 4–5 tháng, đọc hiểu được xương sống hệ thống, tự chẩn đoán lỗi mới, tự mở rộng, không cần AI sinh code hộ.

## Hai quy tắc đã chọn

1. **Giờ học: AI không được sinh code.** AI chỉ làm bốn việc — giải thích khái niệm, ra đề, chấm bài, hỏi vặn. Câu lệnh giữ đúng vai: *"Ra 5 câu hỏi về `job_queue.py` rồi chấm câu trả lời của tôi. Không đưa code, chỉ nói tôi sai ở đâu."*
2. **Ghi chép nằm ở wiki này** — mỗi trạm một trang trong `wiki/reflections/`, viết qua `/lumi-learning-reflect`.

## Ba tài sản khiến việc này khả thi

- **2.928 test = đề bài tự chấm.** Đổi tên một module thuần, tự viết lại, chạy test gốc. Xanh là đạt. Không cần ai chấm.
- **114 story artifact = phần "tại sao".** Mỗi story giải thích một quyết định, đọc trước khi xem code thực hiện nó.
- **435 commit + 14 báo cáo lỗi = bộ đề chẩn đoán có đáp án.** Đọc báo cáo, tự chẩn đoán, rồi mở commit đã sửa nó ra đối chiếu. `test_sendfail_0804_fixes.py`, `_0807`, `_0808` chính là đáp án dạng test.

## Nguyên tắc đọc code

- **Không đọc tuyến tính.** 141k dòng chia cho 1,5 giờ/ngày là hai năm. Đọc theo *đường đi của một lead*, mỗi buổi một trạm.
- **Thứ tự cố định: story → test → code.** Story cho ý định, test cho hợp đồng, code chỉ là cách thực hiện. Đọc code trước là cách chắc chắn nhất để lạc.
- **Trần 300 dòng mỗi buổi.** Vượt trần thì dừng.
- **Mỗi buổi kết thúc bằng một trang viết tay**, không copy code vào. Không viết được nghĩa là chưa hiểu.

---

## Rèn tư duy: dùng repo làm phòng tập

Câu hỏi bổ sung ngày 11/08/2026: *"Tôi dùng việc này để rèn luyện tư duy như thế nào?"* Đây là cách khai thác giá trị lớn hơn cả việc đọc hiểu code.

### Vì sao repo này là phòng tập hiếm

Hầu hết bài tập tư duy đều thiếu một thứ: **đáp án do thực tế chấm, không do người ra đề chấm**. Repo này có đủ ba mảnh của một vòng lặp rèn phán đoán:

1. **Tình huống** — 14 báo cáo thất bại gửi form, ghi rõ triệu chứng trên website thật
2. **Đáp án** — commit và test đã sửa chính những thất bại đó
3. **Khoảng trống ở giữa** — thời gian để bạn dự đoán *trước khi* xem đáp án

Thiếu bước 3 thì đọc code chỉ là tiêu thụ thông tin. Có bước 3 thì mỗi lần đọc là một lần đo phán đoán của mình.

### Năm loại tư duy và bài tập tương ứng trong repo

| Loại tư duy | Bài tập cụ thể |
|---|---|
| **Thấy chi phí của lựa chọn** | [[concepts/tool-sales/ng-detection]] cố tình không dùng LLM. Tự viết lập luận *ngược lại* cho mạnh nhất có thể ("nên dùng LLM vì…"), rồi tìm xem tài liệu chặn nó bằng gì. Rèn khả năng thấy cái giá của mỗi phương án, không chỉ cái lợi. |
| **Suy nghĩ trong bất định** | [[concepts/swe/rescue-ladder]]: xếp tín hiệu theo độ mạnh, tín hiệu vắng mặt thì bỏ phiếu trắng, đi hết thang mà không kết luận thì trả về "không xác định" — một trạng thái riêng, khác "thất bại". Bài tập: trước khi đọc `rescue.py`, tự xếp thang của mình rồi so. |
| **Truy nhân quả** | Từ triệu chứng đến nguyên nhân: chọn một ca trong `send-failure-analysis-*.html`, viết chuỗi giả thuyết và cách kiểm chứng từng cái, *rồi* mở đáp án. |
| **Thấy hiệu ứng bậc hai** | Mỗi lớp phòng thủ thêm vào `submit.py` làm mỗi lượt gửi chậm hơn → giảm sản lượng → phải thêm worker → vượt ngân sách kết nối ([[concepts/swe/db-backed-job-queue]]). Bài tập: với mỗi thay đổi, viết ra ba hệ quả không ai muốn. |
| **Phân biệt cái biết trước và cái phải học bằng thất bại** | Phần cắt gọn thành nguyên tắc (biết trước) so với 43 story Epic 5 bồi dần từ thất bại (không thể biết trước). Bài tập: với mỗi công tắc trong `submit.py`, phán xem nó *có thể* được thiết kế từ đầu hay buộc phải trả giá mới biết. |

### Ba dụng cụ đo

- **Sổ dự đoán.** Trước mỗi lần mở đáp án (commit, test, code), viết: dự đoán + độ tự tin theo phần trăm. Sau đó đối chiếu. Sau khoảng 30 lượt sẽ có dữ liệu về việc mình *thường sai kiểu gì* — tự tin quá mức, bỏ qua trạng thái đồng thời, quên đường thất bại. Đây là cách duy nhất biết tư duy có tiến bộ hay chỉ có cảm giác tiến bộ.
- **Feynman ngược.** Giải thích một cơ chế cho người không biết code. Repo có sẵn thước đo: `docs/ke-hoach-phat-trien-du-an-ban-de-hieu.md` — bản trình bày cho người không chuyên. Viết bản của mình rồi so độ rõ.
- **Đọc code như đọc lập luận.** Mỗi hàm `*_enabled()` là một luận điểm về thế giới ("website Nhật có loại dropdown tự vẽ"). Tập tách ba lớp: đâu là quan sát thật, đâu là suy luận từ quan sát, đâu là phòng xa không có căn cứ.

### Bài tập cao nhất: tìm chỗ hệ thống sai mà chưa ai biết

Không có đáp án, nên đây là chỗ tư duy vượt khỏi tài liệu. Hai câu hỏi wiki đã treo từ tháng 8, lấy ngay từ chính tài liệu dự án:

- Mục tiêu **dưới 1% NG bỏ sót** đo bằng cách nào, khi bỏ sót theo định nghĩa là thứ hệ thống không phát hiện được?
- Ngưỡng **200 lần khớp liên tiếp** để tắt LLM ([[concepts/swe/rule-llm-dual-run]]) dựa trên cơ sở nào? Có dữ liệu nào cho thấy ngưỡng thấp hơn vẫn an toàn?

Tự đưa ra một cách đo khả thi cho câu thứ nhất là dấu hiệu rõ nhất rằng phán đoán đã đứng độc lập.

### Sợi chung với những thứ khác đang học

[[concepts/tarot/shadow-work-tarot]] và thang cứu hộ ở trên **cùng một bài toán về hình thức**: xếp tín hiệu yếu theo độ tin cậy, phân biệt quan sát với phóng chiếu, và biết dừng ở "chưa kết luận được" thay vì đoán cho xong. Cấu trúc tư duy giống nhau, chất liệu khác nhau — nên luyện ở bên nào cũng chuyển được sang bên kia.

---

## Giai đoạn 0 — Dựng bàn làm việc (≈1 tuần)

**Mốc:** stack chạy bằng tay mình, `make test` xanh, biết mỗi container làm gì.

- [ ] Đọc `Makefile` (34 target), `docker-compose.yml` (13 service), `docker-compose.override.yml`
- [ ] Đọc `.env.example` — 23 KB, tài liệu quý nhất repo: mỗi biến là một quyết định vận hành có thật
- [ ] Chạy `make up` → `make migrate` → `make up-workers` → `make ps` → `make logs SVC=worker-submission` → `make psql`
- [ ] `make monitoring`, xem hai dashboard `pipeline-overview` và `worker-health`
- [ ] `make test`; tìm hiểu 58 file test bị chặn ra sao và vì sao

**Kiểm chứng:** viết một trang, không mở lại file — mỗi service làm gì, tắt cái nào thì cái gì dừng, `RUN_DB_TESTS` và `RUN_BROWSER_TESTS` mở thêm những gì.

## Giai đoạn 1 — Đi hết một lead (≈5–7 tuần, xương sống)

**Mốc:** tự vẽ được bản đồ 7 trạm, giải thích được đầu vào/đầu ra từng trạm. Mỗi trạm 2–4 buổi, theo thứ tự: story → test → code.

| # | Trạm | Code chính | Test làm đề | Story |
|---|---|---|---|---|
| 1 | Nhập lead | `backend/app/routers/leads.py` → `services/lead_service.py` → `repositories/lead_repo.py` | `backend/tests/routers/test_leads.py` | 2-1 … 2-5 |
| 2 | Hàng đợi việc | `workers/worker/job_queue.py`, `base.py`, `reaper.py` | `test_job_queue.py`, `test_base.py`, `test_reaper.py` | 3-1 |
| 3 | Dò tìm form | `workers/worker/discovery.py` (1.870 dòng — chia 6 buổi) | `test_discovery*.py` (9 file) | 3-3, 3-6 … 3-9 |
| 4 | Cổng NG (pháp lý) | `workers/worker/ng/keyword_scanner.py`, `jp_normalize.py`, đối chiếu `scrape_ng3.py` + `ng_golden_vectors.json` | `test_ng_scanner.py`, `test_jp_normalize.py` | 3-2, 3-4, 3-5 |
| 5 | Hiểu form | `workers/worker/form/{parser,compare,breaker,state,llm}.py` | `test_form_parser.py`, `test_compare.py`, `test_breaker.py`, `test_form_state.py` | 4-1 … 4-8 |
| 6 | Gửi form | `workers/worker/submission/{worker,form_fill,checkpoint,rate_limiter}.py` — chưa vào `submit.py` | `test_submission_form_fill.py`, `test_submission_checkpoint.py` | 5-1 … 5-6 |
| 7 | Xác minh | `workers/worker/verification/{verify,css_patterns,rescue}.py` | `test_verification_verify.py`, `test_verification_rescue.py` | 5-7 |

**Kiểm chứng mỗi trạm:** một trang trong `wiki/reflections/` + trả lời ba câu *"nếu xoá X thì hệ thống sai thế nào, sai ở đâu, ai phát hiện ra?"* Ví dụ: xoá `FOR UPDATE SKIP LOCKED` ([[concepts/swe/db-backed-job-queue]]), xoá heartbeat, ghi checkpoint sau thay vì trước ([[concepts/swe/checkpoint-before-side-effect]]), bỏ `ON CONFLICT DO NOTHING` trên `ng_flags` ([[concepts/tool-sales/ng-detection]]).

## Giai đoạn 2 — Lấp nền, bằng chính code của mình (đan xen, +3–4 tuần)

Bốn mảng đúng chỗ bản tự đánh giá ghi là yếu:

- **asyncio** — event loop, task, `gather`, cancellation, timeout, semaphore; học trên `worker/base.py`: vòng lặp lấy việc và heartbeat chạy song song trên hai session, tắt êm
- **SQLAlchemy 2.0 async + asyncpg** — `worker/db.py`, `db_tables.py`, `backend/app/core/database.py`; vì sao worker sao lại schema bằng Core thay vì import model backend
- **Postgres đồng thời** — mở hai `psql` cạnh nhau, tự tay dựng lại `FOR UPDATE SKIP LOCKED`, MVCC, `ON CONFLICT`, functional unique index, `REFRESH MATERIALIZED VIEW CONCURRENTLY`, và ngân sách kết nối ~67/100
- **Playwright + hệ điều hành** — locator, auto-wait, frame, timeout; rồi giới hạn RAM/CPU container (commit `3b20c2f` "ram-diet", `worker/browser.py`)

**Kiểm chứng — viết lại từ số 0, test gốc làm đề.** Đổi tên file gốc, tự viết lại, chạy test có sẵn:

- [ ] `submission/retry_policy.py` → `test_submission_retry_policy.py`
- [ ] `jp_normalize.py` → `test_jp_normalize.py`
- [ ] `submission/rate_limiter.py` → `test_submission_rate_limiter.py`
- [ ] `verification/{verify,rescue}.py` → `test_verification_verify.py`, `test_verification_rescue.py` (xem [[concepts/swe/rescue-ladder]])
- [ ] `form/{breaker,compare,confidence}.py` → `test_breaker.py`, `test_compare.py`, `test_confidence.py` (xem [[concepts/swe/rule-llm-dual-run]], [[concepts/swe/budget-tiered-circuit-breaker]])
- [ ] `job_queue.py` → `test_job_queue.py` — khó nhất, cần `RUN_DB_TESTS`

Sáu module xanh là bằng chứng khách quan đầu tiên rằng phần lõi thuần đã thuộc về mình. Đây cũng là chỗ [[concepts/swe/pure-core-gated-io]] trả lãi: các module này thuần, test được không cần DB hay browser.

## Giai đoạn 3 — `submit.py`: 6.086 dòng, đọc sao cho không phát điên (≈3–4 tuần)

**Phát hiện quan trọng:** trong 119 hàm cấp cao của `submit.py`, phần lớn là hàm `*_enabled()` đọc công tắc tính năng — `llm_rescue_enabled`, `readback_refill_enabled`, `consent_sweep_enabled`, `custom_dropdown_enabled`, `dead_click_recovery_enabled`… File này **không phải một thuật toán khó, mà là một chồng lớp phòng thủ**, mỗi lớp sinh ra từ một lần gửi thất bại trên website Nhật thật.

- Đọc theo **cặp công tắc ↔ story**: `5-10` llm rescue, `5-22` readback refill, `5-33` format variant refill, `5-34` verdict taxonomy, `5-35` consent cookie dismiss, `5-37` custom dropdown, `5-40` silent advance click, `5-41` captcha solver robustness…
- Đọc 14 báo cáo `send-failure-analysis-*.html` **theo thứ tự thời gian** (0708 → 0804): mỗi báo cáo là một loạt thất bại, mỗi story 5-x tiếp theo là câu trả lời. Đây là lịch sử học của hệ thống.

**Kiểm chứng (bài giá trị nhất của cả lộ trình):** chọn một ca thất bại trong `send-failure-analysis-gr42-0804.html`. Trước khi mở code, viết ra: thất bại ở lớp nào, công tắc nào chi phối, phán quyết nào bị gán, nên sửa gì. Rồi mở `test_sendfail_0804_fixes.py` và commit `db13c1b` (0804+0807) / `6e8d884` (0808) ra đối chiếu. Lặp với `0807`, `0808`. Ba lần liên tiếp khớp đáp án là đạt.

## Giai đoạn 4 — Ba bài thi tự chủ (≈2–3 tuần)

- [ ] **Sửa một lỗi thật, một mình.** Tự sửa hoàn toàn bằng tay, tự viết test bắt được nó.
- [ ] **Một story dọc xuyên năm lớp.** Alembic migration → model → repository → service → router → frontend hook + UI → test cả hai đầu; tôn trọng mọi quy tắc trong `_bmad-output/project-context.md`.
- [ ] **Giải thích không nhìn code.** Vẽ lại kiến trúc và bảo vệ 10 quyết định — mỗi cái đã có trang wiki để đối chiếu: NG không dùng LLM, chia chung DB không callback, ghi checkpoint trước tác động, fencing token, chạy song song rule–LLM rồi tốt nghiệp, ngắt mạch theo ngân sách, thang cứu hộ, dấu vết NG bất biến, ngân sách kết nối, lõi thuần cổng vào ra.

## Giai đoạn 5 — Trực máy (≈1–2 tuần)

**Mốc:** một tuần trông hệ thống không hỏi ai.

- [ ] Grafana/Loki: viết query lọc theo `job_id`, `lead_id`, `rescue_level`, `selector_matched`
- [ ] `worker_controls` + `worker_scheduler.py` (640 dòng): bật/tắt/hẹn giờ worker, nhả máy khi rỗi, chỉnh lệch sau reboot
- [ ] Reaper trong sự cố DB (`pool_pre_ping`, guarded reap pass — commit `506eeac`)
- [ ] Hàng đợi CAPTCHA: khi nào máy tự giải, khi nào chuyển người
- [ ] Rate limit theo campaign, WAL archiving/PITR

**Kiểm chứng:** chạy thật một campaign nhỏ (vài chục lead) từ nhập lead tới xác minh, tự đọc KPI, tự giải thích mọi mã lỗi xuất hiện — liên hệ [[concepts/tool-sales/operator-leverage]]: người ở vòng ngoài, không ở vòng trong.

---

## Năm bằng chứng của "đã tự chủ"

Xếp theo độ khó tăng dần. Không bằng chứng nào dựa vào cảm giác "tôi thấy hiểu rồi":

1. `make test` xanh khi tự chạy, giải thích được 58 file test bị chặn mở thêm những gì
2. Sáu module thuần viết lại từ số 0, pass test gốc, không sửa test
3. Ba lần liên tiếp chẩn đoán ca thất bại khớp với commit/test đáp án
4. Một story dọc merge được, kèm test tự viết, không vi phạm quy tắc trong `project-context.md`
5. Một tuần trực máy: campaign thật chạy, mọi mã lỗi giải thích được

## Ràng buộc trung thực

Lộ trình này **không** dẫn tới chỗ đọc thuộc 141k dòng — mục tiêu đó vô nghĩa. Nó dẫn tới: nắm chắc xương sống pipeline và toàn bộ phần lõi thuần, đọc được bất kỳ chỗ nào còn lại khi cần, tự chẩn đoán được lỗi mới.

Phần dễ bỏ nhất là giai đoạn 2 (nền asyncio và Postgres) vì nó không cho cảm giác tiến bộ ngay. Bỏ nó thì giai đoạn 3 không đọc nổi.

## Nguồn và liên hệ

- [[sources/tool-sales-architecture-docs]] — bộ tài liệu kiến trúc (bản deep scan 20/06/2026; các con số ở trang này đo lại ngày 11/08/2026)
- [[sources/ho-so-luong-hai-lam]] — bản tự đánh giá năng lực làm điểm khởi đầu
- [[concepts/tool-sales/sales-form-pipeline]] — sáu trạm của đường ống, tương ứng giai đoạn 1
- [[chapters/luong-hai-lam/tool-sales]] — chương sách về cùng dự án, ở lớp câu chuyện

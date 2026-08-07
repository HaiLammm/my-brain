# Báo cáo Tổng hợp Planning — Sales Automation Tool (tool_sales)

> **Tài liệu:** Báo cáo tổng hợp kế hoạch & triển khai dự án
> **Ngày lập:** 2026-06-20
> **Người lập:** Lem (qua BMad Method v6.8.0)
> **Phạm vi:** Toàn bộ hành trình từ Vision → PRD → Architecture → Epics & Stories → Sprint → Kết quả triển khai
> **Nguồn dữ liệu:** `_bmad-output/planning-artifacts/` (PRD, Architecture, Epics, Readiness Report) + `_bmad-output/implementation-artifacts/sprint-status.yaml`

---

## 1. Tóm tắt điều hành

**Sales Automation Tool** là công cụ nội bộ thay thế quy trình outreach thủ công vốn cần **30 nhân sự**, bằng một pipeline tự động đạt cùng sản lượng **~12.000 lượt submit form liên hệ/ngày** chỉ với **5 operator**. Hệ thống được xây lại trên stack hiện đại, sở hữu hoàn toàn (Next.js + FastAPI + Playwright) và bổ sung năng lực cốt lõi **NG Detection** — tự động nhận diện website Nhật cấm liên hệ thương mại, bảo vệ đội ngũ khỏi rủi ro phạt theo luật chống chèo kéo của Nhật.

| Chỉ số | Giá trị |
|--------|---------|
| Tổng số Functional Requirements (FR) | **46** (FR-1 → FR-49, khuyết 39/40/41) |
| Non-Functional Requirements (NFR) | **14** |
| Số Epic | **7** |
| Số Story | **41** |
| Trạng thái triển khai | **7/7 epic = done · 41/41 story = done** |
| Implementation Readiness | **READY** (đánh giá 2026-06-18) |
| Architecture Validation | **✅ Coherence · Coverage · Readiness đều PASS** |

**Kết luận:** Toàn bộ phạm vi MVP đã được lập kế hoạch đầy đủ, kiểm tra mức độ sẵn sàng (READY), và triển khai hoàn tất qua 7 epic. Các hạng mục ngoài MVP (Email Outreach, Response Tracking, Advanced Analytics, Scheduler…) được hoãn có chủ đích sang Phase 2.

---

## 2. Vision & Bài toán

Đây **không phải sản phẩm SaaS**. Mọi quyết định thiết kế tối ưu cho **một đội, một thị trường (Nhật Bản), một quy trình**:

```
Import leads → Discovery (tìm form) → NG Screening → Form Understanding → Submit → Verify
```

- **Tận dụng n8n có sẵn** cho orchestration — không cần tự xây scheduler/workflow engine.
- **Trạng thái mục tiêu:** vận hành 2–3 người đạt sản lượng của đội 30 người thủ công, có **tuân thủ pháp lý tích hợp sẵn** và **khả năng quan sát đầy đủ** mọi bước pipeline.
- Tham chiếu tool gốc: `sales-tool.vinasaver.vn`.

### Đối tượng sử dụng

| Vai trò | Jobs To Be Done chính |
|---------|----------------------|
| **Operator** (vd. Thao, ~2.400 submit/ngày) | Xử lý outreach khối lượng lớn; review NG bằng screenshot; xử lý CAPTCHA hand-off |
| **Admin** (vd. Lem) | Giám sát throughput, success rate, breakdown lỗi, sức khỏe worker |

**Non-users (v1):** khách hàng/đối tác bên ngoài, người dùng mobile, đội ngoài nhóm outreach Nhật.

---

## 3. Phạm vi MVP & Non-Goals

### 3.1 Trong phạm vi (In Scope)

Authentication & RBAC · Dashboard (live status, alerts, today's stats, worker health) · Our Information (sender profile + placeholder groups) · Lead Management (CSV/Google Sheets import, CRUD, search/filter, status workflow) · Campaign Management (CRUD, rate limit, retry) · Discovery + NG Detection · Form Understanding (dual-run AI) · Campaign Submission (auto-fill, CAPTCHA, hand-off) · Verification · Anti-Bot/CAPTCHA Config · Workers (4 loại, n8n webhook) · Prospecting (Crawl/Scrape/Enrich CSV) · Basic KPI.

### 3.2 Ngoài phạm vi MVP (→ Phase 2)

Email Outreach (M365 Graph) · Response Tracking & Nurturing · Advanced Analytics · Scheduler tự động (n8n) · Lead/Form Review queue chuyên dụng · Time Tracking & Operator KPI · Notifications (Slack) · Proxy rotation · Database Backup tự động · Audit Log.

### 3.3 Non-Goals (ranh giới cứng)

Không phải SaaS · Không phải CRM · Không phải công cụ sinh nội dung (chỉ template + placeholder) · Không thân thiện mobile · Không phải nền tảng automation đa dụng (pipeline cố định) · Không mở rộng thị trường ở v1 (logic đặc thù Nhật).

### 3.4 Success Metrics

| ID | Chỉ số | Mục tiêu |
|----|--------|----------|
| **SM-1** | Throughput/ngày | ~12.000 submit/ngày với 5 operator |
| **SM-2** | NG false negative rate | **< 1%** (chỉ số tối quan trọng — bỏ sót NG = rủi ro phạt) |
| **SM-3** | Submission success rate | ≥ 80% |
| **SM-4** | Onboarding operator mới | productive trong 1 ngày làm việc |
| **SM-5** | Uptime giờ hành chính | > 99% (9:00–18:00 JST, T2–T6) |
| **SM-C1** | NG false positive (counter-metric) | không vượt 20% |
| **SM-C2** | Chi phí giải CAPTCHA/ngày (counter-metric) | theo dõi, không tối ưu rẻ bằng mọi giá |

---

## 4. Kiến trúc Giải pháp

### 4.1 Quyết định cốt lõi (chặn triển khai nếu thiếu)

| Lĩnh vực | Lựa chọn | Lý do |
|----------|----------|-------|
| ORM | **SQLAlchemy 2.0 (async)** | Cần truy vấn phức tạp: `SELECT FOR UPDATE SKIP LOCKED` cho job queue, aggregation cho dashboard |
| Auth | **JWT + httpOnly cookies**, bcrypt | Stateless; worker tự xác thực API; session 8h |
| Job queue | **DB-based + `SKIP LOCKED`** + heartbeat/reaper (reset job kẹt sau 5 phút) | Không cần message queue ngoài |
| Worker ↔ Backend | **Cập nhật DB trực tiếp** (không có lớp REST callback) | Loại bỏ vấn đề idempotency; SSE đẩy thay đổi lên frontend |
| Real-time | **SSE** (tiered refresh) | Alert zone (real-time) · status zone (TanStack Query 10–15s) · history zone (materialized view 1–5 phút) |

### 4.2 Hai quyết định đặc trưng của dự án

- **NG Detection — function-based, KHÔNG dùng LLM:** 36 keyword exact + 17 regex + 7 false-positive filter (tham chiếu `scrape_ng3.py`). Chi phí API = 0, dưới 1ms/trang. Đây là tính năng nhạy cảm pháp lý nhất → loại bỏ phụ thuộc LLM một cách có chủ đích.
- **Form Understanding — dual-run validation → graduation:** LLM và rule-based chạy song song trên mọi form; nếu khác nhau → cập nhật rule theo LLM, reset bộ đếm; nếu khớp → tăng `consecutive_match_count`. Khi đạt **200 lần khớp liên tiếp** → tự động tắt LLM (chỉ còn rule-based, chi phí về $0). Có **LLM circuit breaker 3 tầng** (ngưỡng $50/ngày) trong giai đoạn calibration.

### 4.3 Stack & ranh giới

- **Frontend:** Next.js 16.2 + shadcn/ui + TanStack Query (server state) + Zustand (UI state) + React Hook Form + Zod. Hook `useSSE()` riêng cho alert zone.
- **Backend:** FastAPI + SQLAlchemy 2.0 async + Alembic + Pydantic. Kiến trúc phân lớp **Router → Service → Repository**; error envelope chuẩn `{code, message, detail}`; OpenAPI auto-gen.
- **Workers:** Playwright, chia container theo loại (Discovery, Form Understanding, Submission, Prospecting), chia sẻ model SQLAlchemy với backend.
- **Hạ tầng:** Docker Compose (limit tài nguyên/ container) · GitHub Actions CI + manual deploy · Structured JSON logs → Grafana/Loki · WAL archiving + PITR (remote) cho backup (yêu cầu vì NG record có ý nghĩa pháp lý) · 2 môi trường: dev (local) + production (server), không staging.

**Luồng dữ liệu nội bộ:**
```
Frontend → REST API → Backend (router → service → repository → DB)
                                   ↓
                             Job Queue (DB)
                                   ↓
                   Workers (poll → process → update DB)
                                   ↓
                        Backend SSE → Frontend Dashboard
```

---

## 5. Kế hoạch theo Epics & Stories

| Epic | Tên | FRs | Story | Trạng thái |
|------|-----|-----|-------|-----------|
| **1** | Foundation & Access | FR-1,2,3 | 6 | ✅ done |
| **2** | Lead Management & Sender Profile | FR-8→14 | 7 | ✅ done |
| **3** | Discovery & NG Detection | FR-19→23 | 5 | ✅ done |
| **4** | Form Understanding | FR-24,25,26 | 5 | ✅ done |
| **5** | Campaign Submission Pipeline | FR-15→18, 27→35 | 7 | ✅ done |
| **6** | Dashboard, Workers & KPI | FR-4→7, 36→38, 47→49 | 6 | ✅ done |
| **7** | Prospecting | FR-42→46 | 5 | ✅ done |

**Logic phân rã:** Epic 1 dựng "walking skeleton" + hạ tầng (DB, FastAPI core, Next.js shell, Docker, CI). Epic 3 giới thiệu hạ tầng worker dùng chung (job queue, base class, checkpoint) tái sử dụng cho mọi worker sau. Epic 5 là engine throughput cốt lõi (chạy campaign → submit → verify). Epic 6 thêm khả năng quan sát real-time **sau khi** pipeline đã sinh dữ liệu. Epic 7 thêm loại worker thứ 4 (Prospecting) nạp công ty mới vào Lead Management.

### Chi tiết story theo epic

- **Epic 1:** 1.1 Greenfield scaffold · 1.2 Backend core (config/logging/error/migrations) · 1.3 User login · 1.4 App shell & design system · 1.5 RBAC · 1.6 User management (admin)
- **Epic 2:** 2.1 Lead list/search/filter · 2.2 Lead detail & CRUD · 2.3 CSV import · 2.4 Google Sheets import · 2.5 Lead status workflow · 2.6 Our Information fields & groups · 2.7 Placeholder system
- **Epic 3:** 3.1 Worker infra (job queue/base/reaper) · 3.2 NG detection engine · 3.3 Discovery crawl worker · 3.4 NG screenshot capture · 3.5 NG review queue
- **Epic 4:** 4.1 JP normalization & rule-based parser · 4.2 LLM form analysis & circuit breaker · 4.3 Dual-run validation & graduation · 4.4 Platform & CAPTCHA detection · 4.5 Form understanding status UI
- **Epic 5:** 5.1 Campaign CRUD & lifecycle · 5.2 Rate limiting & retry · 5.3 Anti-bot/stealth/CAPTCHA config · 5.4 Form auto-fill · 5.5 CAPTCHA solving & hand-off queue · 5.6 Submission execution & checkpoint · 5.7 Verification (CSS/timing/rescue)
- **Epic 6:** 6.1 SSE infra & tiered refresh · 6.2 Materialized views & KPI metrics · 6.3 Dashboard (live status/alerts/stats) · 6.4 Worker monitoring & management · 6.5 n8n webhook integration · 6.6 Monitoring stack (Grafana/Loki)
- **Epic 7:** 7.1 Prospecting worker & Claude CLI verification · 7.2 AI crawl mode · 7.3 Prompt template system & test prompt · 7.4 Scrape mode · 7.5 Enrich CSV mode

---

## 6. Tiến độ & Kết quả Triển khai

- **Sprint plan:** sinh ngày 2026-06-18, cập nhật gần nhất 2026-06-20, tracking qua file-system (`sprint-status.yaml`).
- **Kết quả:** **toàn bộ 7 epic và 41 story đều ở trạng thái `done`**. Retrospective của cả 7 epic ở trạng thái `optional` (chưa chạy — xem mục Bước tiếp theo).
- **Quy trình mỗi story (BMad cycle):** create-story → (validate) → dev-story → code-review (adversarial) → done. Các epic 7.4/7.5 gần nhất đóng với verdict **APPROVE-WITH-NITS**.

### Hạng mục hoãn (Deferred Work) — đã ghi nhận, chưa chặn MVP

Theo dõi trong `implementation-artifacts/deferred-work.md`. Các nhóm đáng chú ý:

| Chủ đề | Mô tả ngắn | Khi nào xử lý |
|--------|------------|---------------|
| Mã hóa credential at-rest | Google OAuth `refresh_token`/`client_secret` và Our Info field đang lưu plaintext (chỉ Admin ghi, không trả qua API) | Trước khi mở rộng quyền truy cập / nếu threat model gồm DB-at-rest |
| Bảo mật `NEXT_PUBLIC_API_BASE_URL` build-time | Cần truyền qua build `ARG` vào builder stage Next.js | Khi frontend gọi backend thật |
| Idempotency `attempts` / job fencing | Thiếu unique key `(campaign_id, lead_id)`; reaper có thể double-process | Khi cần đúng-một-attempt-row / worker chạy lâu |
| Wiring Playwright thật cho Submission/Verification | `_submit` và DOM-polling verification là follow-up của 5.6/5.7 | Khi tích hợp browser thật |
| ReDoS guard cho regex admin nhập | `re.compile()` thành công nhưng pattern backtracking có thể treo | Trong worker sandbox/timeout |
| Default DB creds + published port 5432 | Tiện cho dev; cần harden cho host chia sẻ/production | Trước khi lên host chia sẻ |
| CI "passes" chưa demo thực | CI well-formed nhưng chưa chạy trên host có Docker | Khi push lên CI host |

---

## 7. NFRs, Ràng buộc & Rủi ro

### 7.1 Non-Functional Requirements (14)

- **Performance:** NFR-1 12K/8h shift (~25 submit/phút) · NFR-2 dashboard ≤5s · NFR-3 search ≤2s/100K lead · NFR-4 import 1K lead ≤10s
- **Security:** NFR-5 bcrypt · NFR-6 auth mọi endpoint (trừ login) · NFR-7 mã hóa API key · NFR-8 không log PII ở frontend
- **Reliability:** NFR-9 crash recovery · NFR-10 in-flight survive restart · NFR-11 connection pooling
- **Observability:** NFR-12 JSON logs stdout · NFR-13 job status queryable
- **Legal (guardrail cứng):** **NFR-14** — NG là cổng bắt buộc, **không thể tắt/bypass**, mọi quyết định NG được ghi nhận (ai + timestamp)

### 7.2 Ràng buộc pháp lý (Legal Compliance)

- NG Detection là **stage bắt buộc**, không phải tính năng tùy chọn.
- Danh sách NG pattern **Admin chỉnh sửa được** để phản ứng pattern pháp lý mới.
- **Safe-by-default:** mọi tín hiệu nghi ngờ (kể cả low-confidence) đều dừng pipeline cho lead đó. **False positive chấp nhận được; false negative thì không.**

### 7.3 Chi phí

- **NG Detection:** 0 LLM call → không chi phí AI.
- **Form Understanding:** ~12.000 LLM call/ngày trong giai đoạn calibration, **tự về $0** sau khi graduation (200 match liên tiếp). Trần $50/ngày với circuit breaker. Giai đoạn calibration dự kiến 1–4 tuần.
- **CAPTCHA:** ~$1–3 / 1.000 lượt giải, ước $12–36/ngày ở full throughput nếu mọi site có CAPTCHA (phụ thuộc tỷ lệ CAPTCHA thực tế của thị trường Nhật).

### 7.4 Rủi ro mở & giả định cần xác nhận

- Tỷ lệ CAPTCHA thực tế của thị trường Nhật **chưa biết** → ảnh hưởng chi phí.
- Baseline success rate 80% (SM-3) cần đo lại từ tool gốc để hiệu chỉnh.
- Nếu site mục tiêu bắt đầu chặn IP server → **Proxy** (đang ở Phase 2) có thể phải fast-track.
- Giả định không thuộc nghĩa vụ GDPR/APPI vì chỉ xử lý dữ liệu cấp công ty — cần xác nhận pháp lý nếu email lead là địa chỉ cá nhân.

---

## 8. Bài học & Bước tiếp theo

### 8.1 Điểm mạnh trong cách lập kế hoạch

- Quy trình BMad đầy đủ: **PRD validate → Architecture validate → Epics → Readiness READY → Sprint → Dev cycle có adversarial code-review** cho từng story.
- Hai quyết định kiến trúc giảm rủi ro & chi phí một cách có chủ đích: NG **function-based** (loại bỏ LLM khỏi feature pháp lý) và Form Understanding **dual-run → graduation** (tự triệt tiêu chi phí LLM).
- Phân rã epic theo **giá trị giao được sớm** (walking skeleton trước, observability sau khi có dữ liệu).

### 8.2 Khuyến nghị bước tiếp theo (BMad)

1. **Retrospective (skill `bmad-retrospective`)** — cả 7 epic đang `optional`; nên chạy retro epic cuối (Epic 7) hoặc retro toàn dự án để chốt bài học chính thức.
2. **Xử lý Deferred Work** — ưu tiên các hạng mục bảo mật trước production: mã hóa credential at-rest, harden DB creds/port, build `ARG` cho `NEXT_PUBLIC_*`, wiring Playwright thật + idempotency `attempts`.
3. **Chứng minh CI thực** — push branch lên host có Docker để chạy `.github/workflows/ci.yml`.
4. **Phase 2 backlog** — Email Outreach (M365 Graph), Response Tracking & Nurturing, Advanced Analytics, Scheduler (n8n), Proxy rotation, Audit Log, DB backup tự động.

---

## Phụ lục — Vị trí Artifact nguồn

| Artifact | Đường dẫn |
|----------|-----------|
| PRD | `_bmad-output/planning-artifacts/prds/prd-tool_sales-2026-06-17/` |
| Architecture | `_bmad-output/planning-artifacts/architecture/` |
| Epics & Stories | `_bmad-output/planning-artifacts/epics.md` |
| Implementation Readiness | `_bmad-output/planning-artifacts/implementation-readiness-report-2026-06-18.md` |
| Sprint Status | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| Story files (41) | `_bmad-output/implementation-artifacts/<epic>-<story>-*.md` |
| Deferred Work | `_bmad-output/implementation-artifacts/deferred-work.md` |
| Tài liệu brownfield (kiến trúc/code) | `docs/architecture-*.md`, `docs/project-overview.md`, … |

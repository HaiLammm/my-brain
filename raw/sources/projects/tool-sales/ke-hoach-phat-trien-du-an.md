# Kế hoạch Phát triển Dự án — Sales Automation Tool (`tool_sales`)

> **Loại tài liệu:** BẢN THẢO SƠ BỘ (Draft v0.1) — Kế hoạch triển khai
> **Kỳ triển khai:** 18/06/2026 → 02/07/2026 (15 ngày lịch · 11 ngày làm việc)
> **Người lập:** Project Manager
> **Ngày lập:** 22/06/2026
> **Trạng thái:** Chờ rà soát & phê duyệt

---

## 0. Cách đọc tài liệu này

Đây là **bản thảo sơ bộ** phục vụ thống nhất phạm vi, mục tiêu và lịch triển khai cho kỳ phát triển **18/06 → 02/07/2026**. Tài liệu trình bày dự án dưới góc nhìn **lập kế hoạch triển khai từ đầu**: liệt kê đầy đủ các hạng mục cần hoàn thành, ước lượng công sức cho từng phần và phân bổ lên dòng thời gian. Các con số ước lượng là **cơ sở để thảo luận**, sẽ được tinh chỉnh sau buổi rà soát cùng đội kỹ thuật.

---

## 1. Tổng quan dự án

### 1.1. Bài toán & mục tiêu

**Sales Automation Tool** là công cụ nội bộ tự động hóa hoạt động outreach B2B khối lượng lớn tới **thị trường Nhật Bản** thông qua **form liên hệ trên website**. Mục tiêu: thay thế quy trình thủ công vốn cần **30 nhân sự** bằng một pipeline tự động đạt **~12.000 lượt submit form/ngày** chỉ với **~5 operator**.

Đây **không phải sản phẩm SaaS**. Mọi quyết định tối ưu cho **một đội, một thị trường (Nhật), một quy trình cố định** — không đa người thuê (multi-tenant), không cổng công khai, không hỗ trợ mobile.

### 1.2. Tính năng định danh — NG Detection (cổng pháp lý bắt buộc)

Nhiều website Nhật cấm rõ ràng việc chào mời thương mại (vd. "営業お断り", tham chiếu 特定商取引法). Gửi form tới các site "NG" này có thể bị **phạt thật theo luật**. Do đó NG Detection là **một lá chắn pháp lý, không phải một tính năng tùy chọn**:

- **Dựa trên hàm, KHÔNG dùng LLM** — đối chiếu chính xác từ khóa tiếng Nhật + regex + bộ lọc dương tính giả (port từ `scrape_ng3.py`): **36 keyword + 17 regex + 7 false-positive filter**. Dưới 1ms/trang, chi phí API = 0.
- **Cổng bắt buộc trong pipeline** — không một luồng nào chạm tới bước Submission mà chưa qua NG screening.
- **Vết kiểm toán bất biến** — phương thức/pattern/đoạn khớp được ghi lại và không bao giờ chỉnh sửa (bản ghi pháp lý), kèm ảnh chụp màn hình và hàng đợi review thủ công không chặn.
- **An toàn theo mặc định** — mọi tín hiệu nghi ngờ đều dừng lead đó. *Dương tính giả chấp nhận được; âm tính giả thì không.* Mục tiêu: **< 1% âm tính giả** (chỉ số tối quan trọng).

### 1.3. Pipeline tổng thể

```
Import leads → Discovery (tìm form) → NG Screening → Form Understanding → Submission → Verification
   (CSV/Sheets/        (crawl)         (zero-LLM,      (rule + LLM         (auto-fill +    (xác nhận
    AI prospecting)                     cổng pháp lý)    dual-run)           CAPTCHA)        gửi thành công)
```

### 1.4. Kiến trúc & công nghệ

Hệ thống là **monorepo gồm 3 phần triển khai độc lập** + stack quan sát (observability), tất cả trên **một cơ sở dữ liệu PostgreSQL**.

| Phần | Công nghệ | Vai trò |
|------|-----------|---------|
| **frontend** | Next.js 16.2, React 19, TanStack Query, Zustand, shadcn/ui | Dashboard cho operator (REST + SSE) |
| **backend** | FastAPI, SQLAlchemy 2.0 async, Alembic, Pydantic v2 | API, auth, job queue, KPI, SSE |
| **workers** | Python 3.12, Playwright (Chromium), asyncpg | Discovery, Form Understanding, Submission, Prospecting + reaper |

**Quyết định kiến trúc đặc trưng:**
- **Worker ↔ Backend giao tiếp qua cập nhật DB trực tiếp** — không có lớp REST callback. Backend đọc trạng thái job từ DB và đẩy thay đổi lên frontend qua SSE.
- **Job queue dựa trên DB** — `SELECT FOR UPDATE SKIP LOCKED` + heartbeat + reaper (reset job kẹt sau 5 phút). Không cần message queue ngoài.
- **Auth:** JWT + httpOnly cookies, bcrypt, session 8 giờ. Worker tự xác thực.
- **Hạ tầng:** Docker Compose (13 service), GitHub Actions CI, log JSON có cấu trúc → Grafana/Loki, WAL archiving + PITR cho backup.

### 1.5. Đối tượng sử dụng

| Vai trò | Công việc chính (Jobs To Be Done) |
|---------|-----------------------------------|
| **Operator** (vd. ~2.400 submit/ngày/người) | Xử lý outreach khối lượng lớn; review NG bằng screenshot; xử lý CAPTCHA hand-off |
| **Admin** | Giám sát throughput, success rate, breakdown lỗi, sức khỏe worker; cấu hình hệ thống |

---

## 2. Mục tiêu & Phạm vi kỳ triển khai

### 2.1. Mục tiêu kỳ 18/06 → 02/07/2026

Hoàn thành **toàn bộ phạm vi MVP** — 7 epic — đạt trạng thái pipeline chạy được đầu-cuối: từ Import lead → Discovery → NG → Form Understanding → Submission → Verification, có Dashboard quan sát real-time và năng lực Prospecting nạp lead mới.

### 2.2. Trong phạm vi (In Scope) — MVP

Authentication & RBAC · Dashboard (live status, alerts, today's stats, worker health) · Our Information (sender profile + nhóm placeholder) · Lead Management (import CSV/Google Sheets, CRUD, search/filter, status workflow) · Campaign Management (CRUD, rate limit, retry) · Discovery + NG Detection · Form Understanding (dual-run AI) · Campaign Submission (auto-fill, CAPTCHA, hand-off) · Verification · Anti-Bot/CAPTCHA Config · Workers (4 loại + reaper, n8n webhook) · Prospecting (Crawl/Scrape/Enrich CSV) · Basic KPI.

### 2.3. Ngoài phạm vi MVP (→ Phase 2)

Email Outreach (M365 Graph) · Response Tracking & Nurturing · Advanced Analytics · Scheduler tự động (n8n) · Lead/Form Review queue chuyên dụng · Time Tracking & Operator KPI · Notifications (Slack) · Proxy rotation · Database Backup tự động · Audit Log đầy đủ.

### 2.4. Ranh giới cứng (Non-Goals)

Không phải SaaS · Không phải CRM · Không phải công cụ sinh nội dung (chỉ template + placeholder) · Không thân thiện mobile · Pipeline cố định (không phải nền tảng automation đa dụng) · Không mở rộng thị trường ở v1 (logic đặc thù Nhật).

### 2.5. Tiêu chí thành công (Success Metrics)

| ID | Chỉ số | Mục tiêu |
|----|--------|----------|
| **SM-1** | Throughput/ngày | ~12.000 submit/ngày với 5 operator |
| **SM-2** | Tỷ lệ NG âm tính giả | **< 1%** (tối quan trọng — bỏ sót NG = rủi ro phạt) |
| **SM-3** | Tỷ lệ submit thành công | ≥ 80% |
| **SM-4** | Onboarding operator mới | Thành thạo trong 1 ngày làm việc |
| **SM-5** | Uptime giờ hành chính | > 99% (9:00–18:00 JST, T2–T6) |
| **SM-C1** | NG dương tính giả (đối trọng) | Không vượt 20% |
| **SM-C2** | Chi phí giải CAPTCHA/ngày (đối trọng) | Theo dõi, không tối ưu rẻ bằng mọi giá |

**Quy mô yêu cầu:** 46 Functional Requirements (FR) · 14 Non-Functional Requirements (NFR) · 7 Epic · 42 Story.

---

## 3. Các hạng mục cần hoàn thành (Epics & Tính năng)

Bảy epic được phân rã theo nguyên tắc **giao giá trị sớm**: dựng "walking skeleton" + hạ tầng trước, bổ sung khả năng quan sát real-time sau khi pipeline đã sinh dữ liệu.

| # | Epic | FR | Story | Mô tả ngắn |
|---|------|-----|-------|------------|
| **1** | Foundation & Access | FR-1,2,3 | 6 | Móng hệ thống: scaffold, backend core, auth, RBAC, quản lý user |
| **2** | Lead Management & Sender Profile | FR-8→14 | 7 | Quản lý lead (import, CRUD, status) + hồ sơ người gửi + placeholder |
| **3** | Discovery & NG Detection | FR-19→23 | 5 | Hạ tầng worker + engine NG (cổng pháp lý) + crawl + screenshot + review |
| **4** | Form Understanding | FR-24,25,26 | 5 | Hiểu form: rule-based + LLM dual-run → graduation + CAPTCHA detection |
| **5** | Campaign Submission Pipeline | FR-15→18, 27→35 | 7 | Engine cốt lõi: campaign, rate limit, auto-fill, CAPTCHA, submit, verify |
| **6** | Dashboard, Workers & KPI | FR-4→7, 36→38, 47→49 | 6 | Quan sát real-time: SSE, KPI, dashboard, monitoring, n8n |
| **7** | Prospecting | FR-42→46 | 6 | Worker thứ 4: AI crawl/scrape/enrich nạp công ty mới vào Lead Management |

### 3.1. Epic 1 — Foundation & Access *(6 story)*

Dựng nền móng chạy được đầu-cuối (walking skeleton) + hạ tầng dùng chung cho mọi epic sau.

- **1.1** Greenfield scaffold & local run (monorepo, Docker Compose, CI)
- **1.2** Backend core: config / logging / error envelope `{code, message, detail}` / migrations
- **1.3** User login (JWT + httpOnly cookie, session 8h)
- **1.4** App shell & design system (Next.js shell, shadcn/ui)
- **1.5** Role-Based Access Control (Operator / Admin)
- **1.6** User management (admin)

### 3.2. Epic 2 — Lead Management & Sender Profile *(7 story)*

- **2.1** Lead list / search / filter (≤2s trên 100K lead)
- **2.2** Lead detail & CRUD
- **2.3** CSV import (1K lead ≤10s)
- **2.4** Google Sheets import (OAuth2 connection)
- **2.5** Lead status workflow
- **2.6** Our Information — fields & groups (hồ sơ người gửi)
- **2.7** Placeholder system (template động cho nội dung gửi)

### 3.3. Epic 3 — Discovery & NG Detection *(5 story)*

Giới thiệu **hạ tầng worker dùng chung** (tái sử dụng cho mọi worker sau) + engine pháp lý NG.

- **3.1** Worker infrastructure: job queue (`SKIP LOCKED`) / base class / reaper / checkpoint
- **3.2** NG Detection engine (zero-LLM, port `scrape_ng3.py`)
- **3.3** Discovery crawl worker (tìm form liên hệ)
- **3.4** NG screenshot capture (bằng chứng)
- **3.5** NG review queue (review thủ công không chặn)

### 3.4. Epic 4 — Form Understanding *(5 story)*

- **4.1** Chuẩn hóa tiếng Nhật & rule-based form parser
- **4.2** LLM form analysis + circuit breaker 3 tầng (trần $50/ngày)
- **4.3** Dual-run validation & graduation (200 match liên tiếp → tắt LLM, chi phí về $0)
- **4.4** Platform & CAPTCHA detection
- **4.5** Form Understanding status UI

### 3.5. Epic 5 — Campaign Submission Pipeline *(7 story)* — **Engine cốt lõi**

Phần phức tạp và giá trị cao nhất: thực thi campaign → submit → verify.

- **5.1** Campaign CRUD & lifecycle
- **5.2** Rate limiting & retry policy
- **5.3** Anti-bot / stealth / CAPTCHA service configuration
- **5.4** Form auto-fill (Playwright)
- **5.5** CAPTCHA solving & human hand-off queue
- **5.6** Submission execution & checkpoint (checkpoint-before-side-effect)
- **5.7** Verification (CSS patterns + timing + rescue ladder)

### 3.6. Epic 6 — Dashboard, Workers & KPI *(6 story)*

- **6.1** SSE infrastructure & tiered refresh (alert zone real-time · status zone 10–15s · history zone 1–5 phút)
- **6.2** Materialized views & KPI metrics
- **6.3** Dashboard (live status / alerts / today's stats)
- **6.4** Worker monitoring & management
- **6.5** n8n webhook integration
- **6.6** Monitoring stack (Grafana / Loki / Promtail)

### 3.7. Epic 7 — Prospecting *(6 story)*

Worker thứ 4 — nạp công ty mới vào Lead Management.

- **7.1** Prospecting worker & Claude CLI verification
- **7.2** AI crawl mode
- **7.3** Prompt template system & test prompt
- **7.4** Scrape mode
- **7.5** Enrich CSV mode
- **7.6** Deterministic site scraper & enrich

---

## 4. Ước lượng công sức & Lịch triển khai

### 4.1. Phương pháp ước lượng & giả định

- **Đơn vị:** Story Points (SP, thang Fibonacci) cho mỗi epic, quy đổi ra **ngày-công** (person-days) để phân bổ lịch. Quy ước: 1 ngày-công ≈ 2–2,5 SP ở velocity người.
- **Mô hình phát triển:** Dự án áp dụng **phát triển có AI hỗ trợ** (BMad Method + Claude Code, phát triển song song nhiều story qua isolated git worktrees, kèm adversarial code-review tự động cho từng story). Mô hình này **nén đáng kể thời gian** so với phát triển thủ công, cho phép khung 11 ngày làm việc khả thi.
- **Quy trình mỗi story (chu trình BMad):** create-story → (validate) → dev-story → code-review (đối kháng) → done.
- **Giả định nguồn lực:** 2–3 kỹ sư điều phối nhiều luồng story song song + AI. Theo mô hình truyền thống, khối lượng tương đương cần đội ~6–7 kỹ sư × 11 ngày.

### 4.2. Bảng ước lượng theo Epic

| Epic | Story | Story Points | Ngày-công | Độ phức tạp | Phụ thuộc |
|------|-------|:---:|:---:|---|---|
| 1 — Foundation & Access | 6 | 21 | 8 | Cao (móng) | — |
| 2 — Lead Management | 7 | 21 | 9 | Trung bình (CRUD-heavy) | Epic 1 |
| 3 — Discovery & NG | 5 | 26 | 11 | Cao (worker infra + pháp lý) | Epic 1, 2 |
| 4 — Form Understanding | 5 | 21 | 10 | Cao (AI dual-run) | Epic 3 |
| 5 — Submission Pipeline | 7 | 34 | 14 | **Rất cao** (Playwright) | Epic 4 |
| 6 — Dashboard & KPI | 6 | 21 | 9 | Trung bình–cao | Epic 5 (dữ liệu) |
| 7 — Prospecting | 6 | 21 | 9 | Trung bình | Epic 1, 2 |
| **Tổng** | **42** | **165** | **70** | | |

> **Ổn định hóa & sẵn sàng vận hành** (xen kẽ cuối kỳ, ~6–8 ngày-công, không tính trong 70 ở trên): wiring Playwright thật cho Submission/Verification, mã hóa credential at-rest, idempotency `attempts` / job fencing, ReDoS guard cho regex admin, chứng minh CI chạy thật, QA E2E (Playwright).

### 4.3. Phân chặng triển khai

Lịch chia 3 chặng theo dòng thời gian thực tế của kỳ, các epic chạy **song song nhiều luồng** theo phụ thuộc:

#### Chặng 1 — Khởi động & Nền tảng · 18–19/06 (T5–T6, 2 ngày)
- **Epic 1 — Foundation & Access** (trọng tâm): scaffold monorepo, backend core, Docker Compose, CI, auth/login, RBAC.
- **Cột mốc M1 (19/06):** Walking skeleton chạy được — đăng nhập, app shell, CI xanh.

#### Chặng 2 — Dữ liệu & Pipeline khám phá · 22–26/06 (T2–T6, 5 ngày)
- **Epic 1** hoàn tất (user management).
- **Epic 2 — Lead Management & Sender Profile** (luồng frontend/backend).
- **Epic 3 — Discovery & NG Detection** (luồng workers — dựng hạ tầng worker + engine NG).
- **Epic 7 — Prospecting** khởi động song song (worker thứ 4, nạp lead).
- **Epic 4 — Form Understanding** khởi động.
- **Cột mốc M2 (26/06):** Lead vào được hệ thống; Discovery + NG hoạt động; engine NG đạt mục tiêu < 1% âm tính giả trên bộ mẫu.

#### Chặng 3 — Engine gửi, Quan sát & Sẵn sàng vận hành · 29/06–02/07 (T2–T5, 4 ngày)
- **Epic 4 — Form Understanding** hoàn tất (dual-run + graduation).
- **Epic 5 — Campaign Submission Pipeline** (engine cốt lõi: auto-fill, CAPTCHA, submit, verify).
- **Epic 6 — Dashboard, Workers & KPI** (quan sát real-time sau khi có dữ liệu pipeline).
- **Epic 7 — Prospecting** hoàn tất (gồm 7.6 deterministic scraper).
- **Ổn định hóa:** wiring Playwright thật, security hardening, idempotency, QA E2E, CI thật.
- **Cột mốc M3 (02/07):** Pipeline chạy đầu-cuối; Dashboard quan sát đầy đủ; sẵn sàng nghiệm thu MVP.

### 4.4. Bảng Gantt theo tuần

Ký hiệu: ● = trọng tâm/triển khai chính · ○ = khởi động hoặc hoàn tất · — = chưa/đã xong

| Epic | C1: 18–19/06 | C2: 22–26/06 | C3: 29/06–02/07 |
|------|:---:|:---:|:---:|
| 1 — Foundation & Access | ● | ○ | — |
| 2 — Lead Management | — | ● | — |
| 3 — Discovery & NG | — | ● | ○ |
| 4 — Form Understanding | — | ○ | ● |
| 5 — Submission Pipeline | — | — | ● |
| 6 — Dashboard & KPI | — | — | ● |
| 7 — Prospecting | — | ○ | ● |
| Ổn định hóa & Go-live | — | — | ● |

### 4.5. Cột mốc chính

| Mốc | Ngày | Tiêu chí đạt |
|-----|------|--------------|
| **M1 — Walking skeleton** | 19/06 | Đăng nhập + app shell + CI xanh; Docker Compose chạy được |
| **M2 — Lead + Discovery/NG** | 26/06 | Import lead; Discovery tìm form; NG screening đạt < 1% âm tính giả (bộ mẫu) |
| **M3 — MVP đầu-cuối** | 02/07 | Pipeline Import→...→Verify chạy thật; Dashboard real-time; sẵn sàng nghiệm thu |

---

## 5. Tổ chức & Phân công (đề xuất)

Mô hình **nhiều luồng song song** (parallel tracks), mỗi luồng sở hữu một isolated worktree theo `WORKTREE_RULES.md`:

| Luồng | Phạm vi chính | Epic phụ trách |
|-------|---------------|----------------|
| **A — Backend/Infra & Pipeline core** | FastAPI core, DB/migrations, job queue, submission engine | 1 (core), 3 (infra), 4, 5 |
| **B — Frontend & UX** | App shell, lead UI, dashboard, các status UI | 1 (shell), 2, 6 (UI) |
| **C — Workers & Data** | NG engine, discovery, prospecting, submission workers | 3, 7, 5 (workers) |
| **D — Observability & QA** | Monitoring stack, SSE, hardening, E2E, go-live | 6, ổn định hóa |

> Quy tắc bắt buộc khi phát triển song song: worktree cô lập, **không** `git add -A`, alembic **merge** (không đánh số lại) — chi tiết trong `WORKTREE_RULES.md`.

---

## 6. Rủi ro, Phụ thuộc & Giả định cần xác nhận

| # | Rủi ro / Giả định | Ảnh hưởng | Giảm thiểu |
|---|-------------------|-----------|------------|
| R1 | **Khung 11 ngày rất nén** cho 7 epic / 42 story | Trễ tiến độ nếu velocity không đạt | Song song hóa qua worktree + AI-assisted; ưu tiên Epic 5 (đường găng) |
| R2 | **Wiring Playwright thật** cho Submit/Verify là phần khó & rủi ro nhất | SM-1, SM-3 không đo được nếu chưa chạy browser thật | Đưa vào chặng 3 + buffer ổn định hóa; có sẵn injectable seam |
| R3 | **Tỷ lệ CAPTCHA thực tế** của thị trường Nhật chưa biết | Ảnh hưởng chi phí (SM-C2) & throughput | Theo dõi qua circuit breaker; đo thực tế trong calibration |
| R4 | **Baseline success rate 80%** (SM-3) chưa được xác nhận | Đặt sai kỳ vọng | Đo lại từ tool gốc `sales-tool.vinasaver.vn` |
| R5 | Site mục tiêu **chặn IP server** | Throughput sụt | Proxy rotation (Phase 2) có thể phải fast-track |
| R6 | **Bảo mật trước production:** credential plaintext, DB creds mặc định, CI chưa chạy thật | Rủi ro lộ dữ liệu khi go-live | Hạng mục ổn định hóa chặng 3; bắt buộc trước production |
| R7 | Giả định **không thuộc nghĩa vụ GDPR/APPI** (chỉ xử lý dữ liệu cấp công ty) | Rủi ro pháp lý nếu sai | Xác nhận pháp lý nếu email lead là địa chỉ cá nhân |

**Đường găng (critical path):** Epic 1 → Epic 3 → Epic 4 → Epic 5. Trễ bất kỳ epic nào trên đường này đều đẩy lùi M3.

---

## 7. Tiêu chí hoàn thành & Quy trình chất lượng

### 7.1. Definition of Done (mỗi story)

- Code hoàn thành theo acceptance criteria + đã qua **adversarial code-review** (verdict APPROVE / APPROVE-WITH-NITS).
- Unit/integration test pass; migration up/down validate được.
- Không vi phạm các guardrail cứng (đặc biệt **NFR-14**: NG là cổng bắt buộc, không thể tắt/bypass, mọi quyết định NG được ghi nhận ai + timestamp).
- Deferred work (nếu có) được ghi nhận tường minh, không chặn MVP.

### 7.2. Definition of Done (kỳ triển khai)

- 7/7 epic đạt `done`; pipeline chạy đầu-cuối với dữ liệu thật.
- Dashboard quan sát real-time hoạt động.
- Các hạng mục bảo mật chặn-production đã đóng (hoặc có kế hoạch rõ ràng + được chấp thuận rủi ro).
- CI chạy thật trên host có Docker (xanh).
- Retrospective kỳ được thực hiện.

### 7.3. Non-Functional Requirements then chốt (14 NFR)

- **Performance:** NFR-1 12K/ca 8h (~25 submit/phút) · NFR-2 dashboard ≤5s · NFR-3 search ≤2s/100K lead · NFR-4 import 1K lead ≤10s.
- **Security:** NFR-5 bcrypt · NFR-6 auth mọi endpoint (trừ login) · NFR-7 mã hóa API key · NFR-8 không log PII ở frontend.
- **Reliability:** NFR-9 crash recovery · NFR-10 in-flight survive restart · NFR-11 connection pooling.
- **Observability:** NFR-12 JSON logs stdout · NFR-13 job status queryable.
- **Legal (guardrail cứng):** **NFR-14** — NG là cổng bắt buộc, không thể tắt/bypass.

---

## 8. Bước tiếp theo

1. **Rà soát bản thảo này** cùng đội kỹ thuật — chốt ước lượng & phân công.
2. **Xác nhận giả định** R3, R4, R7 (CAPTCHA rate, baseline success, nghĩa vụ pháp lý).
3. **Sinh sprint plan chi tiết** (story-level) từ kế hoạch đã chốt.
4. **Khởi động Chặng 1** (Epic 1 — Foundation) ngày 18/06.

---

## Phụ lục — Vị trí tài liệu nguồn

| Artifact | Đường dẫn |
|----------|-----------|
| Tổng quan dự án (brownfield) | `docs/project-overview.md`, `docs/index.md` |
| Báo cáo tổng hợp planning | `docs/bao-cao-planning.md` |
| Kiến trúc | `docs/architecture-*.md`, `_bmad-output/planning-artifacts/architecture/` |
| Epics & Stories | `_bmad-output/planning-artifacts/epics.md` |
| Sprint Status | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| Deferred Work | `_bmad-output/implementation-artifacts/deferred-work.md` |
| Quy tắc phát triển song song | `WORKTREE_RULES.md` |

---

> *Bản thảo sơ bộ — các con số ước lượng và lịch trình sẽ được tinh chỉnh sau buổi rà soát cùng đội kỹ thuật.*

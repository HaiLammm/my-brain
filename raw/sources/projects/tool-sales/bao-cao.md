# Sales Automation Tool — Báo cáo dự án

Ngày: 17/06/2026 | Phiên bản: 1.0 | Tác giả: Lem

---

## 1. Các module chính

Hệ thống gồm 22 modules, chia thành 2 giai đoạn triển khai:

### 1.1 MVP — Phase 1 (12 modules)

| # | Module | Mô tả |
|---|--------|-------|
| 1 | Authentication & Authorization | Đăng nhập, phân quyền theo role (Admin / Operator) |
| 2 | Dashboard | Trạng thái live: campaigns, workers, task backlog, cảnh báo cần chú ý, thống kê hôm nay, recent activity |
| 3 | Our Information | Quản lý thông tin người gửi dạng key-value, chia theo Groups (General, JP Market). Placeholder: [_company_name], [o_name], [o_email] |
| 4 | Leads | Import (CSV / Google Sheets), CRUD, tìm kiếm, lọc. Mỗi lead gồm: company_name, fqdn, email, address, country, industry, review, status |
| 5 | Campaigns | Tạo / quản lý campaigns. Cấu hình: Name, Status (Draft/Active/Paused), Outreach channel (Contact form / Email), Rate limits, Retry policy (Exponential), Schedule |
| 6 | Discovery + NG Detection | Crawl website tìm contact form (cấu hình: crawl depth, source DB/URL, stop-after-first). Đồng thời scan tín hiệu NG (keyword + AI), chụp screenshot trang NG, đánh dấu status NG, đưa vào hàng đợi nhân viên verify |
| 7 | Form Understanding | AI phân tích cấu trúc form: các trường, loại input, validation, platform detection, confidence score |
| 8 | Campaign Submission | Tự động điền form với dữ liệu từ Our Information + Lead data, giải CAPTCHA, submit |
| 9 | Verification | CSS selector patterns phát hiện success/error (30+ patterns). Timing: Verify window 12,000ms, Poll interval 750ms, Post-submit settle 1,500ms. Rescue: Form-disappeared, Field-reset, Vision tie-breaker, Network ground-truth |
| 10 | Anti-Bot / CAPTCHA | 3 chế độ: Human hand-off, Automated solver, Hybrid. Hỗ trợ: reCAPTCHA, hCaptcha, Turnstile (2Captcha, Anti-Captcha, CapSolver), Image-text (OCR). Stealth: typing delay 50ms, headless mode, user-agent override |
| 11 | Workers | 4 background workers: Prospecting, Discovery, Form Understanding, Campaign Submission. Hiển thị: status, active/waiting, failures 24h, recent jobs |
| 12 | Basic KPI | Tổng gửi / thành công / thất bại (theo error code 400, 404, 503...), số link NG, số email phản hồi |

### 1.2 Phase 2 (10 modules)

| # | Module | Mô tả |
|---|--------|-------|
| 13 | Prospecting (AI) | Tìm công ty tự động qua BaseConnect / web crawl. 3 tab: Crawl, Scrape, Enrich CSV. Prompt template với {{url}}, {{count}}, {{keywords}}. Orchestrate qua n8n |
| 14 | Email Outreach | Kết nối Microsoft 365 Graph API (Tenant ID, Client ID, Secret, Mailbox). Email templates với placeholders: Lead (company, domain, country, email), Our Info, JP Market (address_jp, furigana), System (Today, Year) |
| 15 | Response Tracking & Nurturing | Theo dõi email reply qua cùng mailbox Graph API. AI phân loại (tiềm năng / hẹn gặp / từ chối). Nhân viên confirm hoặc tự đánh dấu. Lập lịch email follow-up tự động đến khi chốt đơn hoặc từ chối thẳng thừng |
| 16 | Advanced Analytics | Bộ lọc: thời gian / campaign / country / channel / proxy. KPI: Total Attempts, Success Rate, Captcha-Blocked Rate, Avg Duration. 4 tab: Executive, Operational, Technical, Trend |
| 17 | Scheduler | Lên lịch chạy tự động cho 4 loại worker qua n8n. Cấu hình: Campaign, Leads, Frequency, Next/Last Run |
| 18 | Lead Review / Form Review | Lead Review: duyệt leads (Verify / Exclude / Archive), filter status/date. Form Review: duyệt form đã crawl (Captcha, Platform, Confidence, Parsed date) |
| 19 | Time Tracking & Operator KPI | Login/logout tracking, giờ làm việc theo user/ngày/tuần/tháng/năm. Per-operator: Submitted, Failed, Handed Off, Cancelled, Total, Success Rate, Active Time, Sessions |
| 20 | Notifications | Slack webhook. Events: starts / succeeds / fails or is cancelled. Covers: Campaign Submission, Discovery, Form Understanding scheduled runs |
| 21 | Proxies + Database Backup | Proxies: Label, Protocol, Host:Port, Status, rotation. DB Backup: auto daily, keep last N, manual trigger, status tracking |
| 22 | Audit Log | Ghi log toàn bộ hành động: Time, Action, Actor, Entity, Target, Outcome, Details. Filter: action/entity/actor/date |

---

## 2. Kiến trúc hệ thống

### 2.1 Thành phần

| Thành phần | Công nghệ | Chi tiết |
|------------|-----------|----------|
| Frontend | Next.js + shadcn/ui | Dashboard, Forms, Review pages, Settings |
| Backend API | FastAPI (Python) | Authentication, CRUD, KPI aggregation, Settings management |
| Workers | Playwright (Python) | Discovery crawl, NG Detection scan + screenshot, Form Understanding (AI), Campaign Submission (fill + CAPTCHA + submit) |
| Orchestrator | n8n (instance đang chạy) | Job scheduling, Prospecting workflows (BaseConnect/Indeed), Event routing, Notifications |
| Database | PostgreSQL | Leads, Campaigns, Attempts, Forms, Users, NGFlags, OurInfo, AuditLog, Settings |
| CAPTCHA Solving | 2Captcha, Anti-Captcha, CapSolver | reCAPTCHA v2/v3, hCaptcha, Turnstile (sitekey-based). OCR cho image-text. Fallback: human hand-off |
| Email | Microsoft 365 Graph API | Gửi email outreach (Phase 1 manual, Phase 2 tích hợp). Đọc inbox replies (Phase 2) |
| Notifications | Slack Webhooks | Thông báo sự kiện: run start/success/fail |
| Deployment | Docker Compose | Self-hosted trên server riêng. Mỗi service 1 container: frontend, backend, workers, n8n, postgres |

### 2.2 Giao tiếp giữa các thành phần

| Kết nối | Protocol | Mục đích |
|---------|----------|----------|
| Frontend ↔ Backend | REST API (JSON) | CRUD operations, KPI queries, settings |
| Backend → Workers | Task queue / DB polling | Dispatch crawl, form fill, submission jobs |
| Workers → Backend | REST API callback | Report job status, results, errors |
| n8n → Backend | REST API / Webhooks | Trigger scheduled jobs, prospecting results |
| Backend → n8n | Webhook triggers | Event notifications for workflow orchestration |
| Workers → CAPTCHA APIs | HTTPS | Submit CAPTCHA challenge, poll for solution |
| Backend → PostgreSQL | SQLAlchemy ORM | All persistent data operations |
| Backend → Slack | HTTPS (webhook) | Send notifications on events |
| Backend → Graph API | HTTPS (OAuth2) | Send/read emails (Phase 2) |

### 2.3 Data Model — Core Entities

| Entity | Core Fields | Relationships |
|--------|-------------|---------------|
| User | id, email, name, role (admin/operator), password_hash, is_active | Has many Attempts |
| Lead | id, company_name, fqdn, email, address, country, industry, review, status (new/verified/ng/excluded/archived) | Belongs to Campaign(s), has many Forms, Attempts, NGFlags |
| Campaign | id, name, status (draft/active/paused/completed), channel, rate_limit, retry_policy, schedule | Has many Leads, Attempts |
| Form | id, lead_id, page_url, fields_json, captcha_type, platform, confidence, status | Belongs to Lead |
| Attempt | id, lead_id, campaign_id, operator_id, channel, status, error_code, duration, submitted_at | Belongs to Lead, Campaign, User |
| NGFlag | id, lead_id, detected_by (keyword/ai), matched_pattern, screenshot_path, note, status (pending/confirmed/overridden), reviewed_by | Belongs to Lead |
| OurInfo | id, name, value, group (General/JP Market) | Standalone |
| AuditLog | id, timestamp, actor_id, action, entity, target, outcome, details | Belongs to User |

---

## 3. Tổng quan kiến trúc

### 3.1 Sơ đồ hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser)                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend: Next.js + shadcn/ui                  │
│                                                             │
│  Dashboard │ Leads │ Campaigns │ Review │ Settings │ KPI   │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend: FastAPI (Python)                      │
│                                                             │
│  Auth │ Lead CRUD │ Campaign Mgmt │ KPI │ Settings │ Audit │
├─────────────────────────────────────────────────────────────┤
│              Task Dispatcher                                │
└───────┬──────────────────┬──────────────────┬──────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌───────────────┐  ┌───────────────────┐
│  Workers     │  │  n8n          │  │  PostgreSQL       │
│  (Playwright)│  │  (Orchestrator)│  │                   │
│              │  │               │  │  Users, Leads,    │
│  • Discovery │  │  • Scheduling │  │  Campaigns, Forms,│
│  • NG Detect │  │  • Prospecting│  │  Attempts, NGFlags│
│  • Form AI   │  │  • Event route│  │  OurInfo, Audit   │
│  • Submission│  │  • Notify     │  │                   │
└──────┬───────┘  └───────────────┘  └───────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│                                                             │
│  CAPTCHA APIs          │  MS Graph API    │  Slack Webhook  │
│  (2Captcha, CapSolver) │  (Email send/    │  (Notifications)│
│                        │   read inbox)    │                 │
└─────────────────────────────────────────────────────────────┘

Deployment: Docker Compose — mỗi thành phần 1 container
Host: Self-hosted server
```

### 3.2 Pipeline chính

| Bước | Tên | Thực hiện bởi | Output |
|------|-----|---------------|--------|
| 1 | Import Leads | CSV / Google Sheets / BaseConnect (n8n) | Leads (status: new) |
| 2 | Lead Review | Nhân viên duyệt (Phase 2: batch actions) | Leads (status: verified) |
| 3 | Discovery | Playwright crawl website, tìm contact page | Forms (page_url, status: found) |
| 4 | NG Detection | Keyword scan + AI scan (tích hợp trong Discovery) | NGFlags (screenshot, status: pending) hoặc tiếp tục pipeline |
| 5 | Form Understanding | AI phân tích cấu trúc form | Forms (fields_json, platform, confidence) |
| 6 | Form Review | Nhân viên duyệt form (Phase 2: dedicated queue) | Forms (status: approved) |
| 7 | Campaign Submission | Auto-fill + CAPTCHA solve + submit | Attempts (status: submitted) |
| 8 | Verification | CSS pattern matching, timing, rescue | Attempts (status: success/failed + error_code) |

### 3.3 NG Detection Flow

| Bước | Hành động | Chi tiết |
|------|-----------|----------|
| 1 | Discovery crawl bắt đầu | Playwright truy cập website công ty |
| 2 | Keyword scan | Regex match HTML với danh sách NG patterns (team đã có sẵn) |
| 3 | AI scan (nếu cần) | LLM đánh giá ngữ cảnh khi tín hiệu không rõ ràng |
| 4a | Không phát hiện NG | Tiếp tục pipeline → Form Understanding |
| 4b | Phát hiện NG | Chụp screenshot, đánh dấu status NG, dừng pipeline cho lead này |
| 5 | NG Review Queue | Nhân viên xem screenshot + URL + pattern matched + note |
| 6a | Confirm NG | Chặn vĩnh viễn, không gửi form |
| 6b | Override | Mở lại lead, tiếp tục pipeline tại Form Understanding |
| 6c | Skip | Bỏ qua, review sau (non-blocking) |

### 3.4 Quyết định kỹ thuật quan trọng

| Quyết định | Lý do |
|------------|-------|
| FastAPI tách riêng Next.js | Frontend và backend là services độc lập, giao tiếp qua REST API. Cho phép scale/deploy riêng, team FE và BE làm việc song song |
| Playwright cho browser automation | Đã chứng minh hiệu quả trong BaseConnect scraper (find_url_auto_b). Hỗ trợ tốt headless mode, screenshot, stealth |
| n8n làm orchestrator | Instance đang chạy sẵn. Tránh build custom scheduler/workflow engine. Cung cấp visual workflow editor miễn phí cho operators |
| PostgreSQL | Nhất quán với tool tham chiếu. Đã kiểm chứng cho workload ~12,000 records/ngày |
| Docker Compose self-hosted | Kiểm soát hoàn toàn infrastructure. Tiết kiệm chi phí cloud. Dễ backup và migrate |
| NG Detection tích hợp Discovery | Không tách riêng bước scan NG. Tiết kiệm tài nguyên crawl (1 lần truy cập = vừa tìm form vừa scan NG) |
| Safe-by-default cho NG | Nghi ngờ → dừng. False positive chỉ delay, false negative gây rủi ro pháp lý. Ưu tiên an toàn |
| Non-blocking NG review | Nhân viên verify khi rảnh. Pipeline vẫn chạy cho các lead khác. Không block toàn bộ hệ thống |

# API Contracts — Backend (`backend/`)

> Part: **backend** · FastAPI · Deep scan. All paths are prefixed **`/api`**. Interactive docs (Swagger/OpenAPI) auto-generated at **`/docs`**.

## Conventions

- **Envelope (success):** `{ "data": <payload>, "meta": {} }`. Lists add pagination: `meta: { total, page, per_page }`.
- **Envelope (error):** `{ "error": { "code", "message", "detail" } }`. Validation (422) nests under `detail.errors`.
- **Auth dependencies:** `get_current_user` = any authenticated user (operator/admin); `require_admin` = admin only; `require_operator_or_admin` = either explicit role; `require_webhook_secret` = `X-Webhook-Token` header (n8n). Session is a **httpOnly JWT cookie** (`access_token`), not an `Authorization` header.
- **Public endpoints (no auth):** `/api/health`, `/api/auth/login`, `/api/auth/logout`.
- **JSON fields:** `snake_case`. Dates ISO 8601. `null` (never `""`). Booleans `true`/`false`.

## Auth & Identity

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/health` | public | Liveness probe (Docker healthcheck) |
| POST | `/auth/login` | public | Issue session JWT cookie (`LoginRequest` → `UserOut`) |
| POST | `/auth/logout` | public | Clear session cookie (idempotent) |
| GET | `/auth/me` | user | Hydrate session / detect expiry |

## Users (admin)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/users` | admin | List users |
| POST | `/users` | admin | Create user (`email, password, role`) → 201 |
| PATCH | `/users/{user_id}` | admin | Update `role` / `is_active` |

## Leads

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/leads` | user | List/search/filter (`q, status, country, created_after/before, sort, order, page, per_page∈{25,50,100}`) |
| GET | `/leads/{lead_id}` | user | Lead detail (404 if missing) |
| POST | `/leads` | user | Create (201; 409 on duplicate `fqdn`) |
| PATCH | `/leads/{lead_id}` | user | Update (**status field rejected** — use status endpoint; 409 dup fqdn, 400 empty patch) |
| DELETE | `/leads/{lead_id}` | user | Hard delete → 204 |
| POST | `/leads/import-preview` | user | Parse CSV + preview columns (no commit) |
| POST | `/leads/import` | user | Bulk insert (dedup by fqdn per row) → `ImportSummary` |

> Lead status changes go through the status workflow service. Allowed: `new→{verified,ng,excluded}`, `verified→archived`, `ng→verified`, `excluded→new`, `archived→∅`.

## Our Information & Placeholders

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET/POST | `/our-info/groups` | user | List / create sender-profile groups |
| GET/POST | `/our-info` | user | List fields (`?group_id`) / create field |
| PATCH/DELETE | `/our-info/{field_id}` | user | Update / delete field |
| POST | `/placeholders/preview` | user | Resolve `[_lead_field]` + `[o_our_field]` placeholders for a template + `lead_id` |

## NG Detection — patterns, flags, review

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET/POST | `/ng-patterns` | admin | List / create patterns (`keyword`/`regex`/`false_positive`) |
| PATCH/DELETE | `/ng-patterns/{id}` | admin | Update / delete pattern |
| GET | `/ng-flags` | user | List flags (`?lead_id&status&page&per_page`) |
| GET | `/ng-flags/{flag_id}` | user | Flag detail (immutable audit fields) |
| PATCH | `/ng-flags/{flag_id}` | user | Review — `confirm` / `override` / `skip` |
| GET | `/ng-flags/{flag_id}/screenshot` | user | Serve evidence image (404 if purged) |

## Discovery

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/discovery/tasks` | user | Create crawl task (`source_type, lead_ids|urls, depth, stop_after_first, respect_robots`); enqueues discovery jobs |
| GET | `/discovery/tasks` | user | List tasks (paginated) |
| GET | `/discovery/tasks/{task_id}` | user | Task detail + progress counters |

## Form Understanding

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/form-understanding/status` | user | Dual-run state + LLM breaker tier + agreement rate |
| POST | `/form-understanding/re-enable` | admin | Re-enable LLM (resets `consecutive_match_count`) |

## Campaigns (CRUD + lifecycle)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/campaigns` | user | List (`?status,sort,order,page,per_page`) |
| GET | `/campaigns/{id}` | user | Detail |
| POST | `/campaigns` | user | Create (201, `draft`) |
| PATCH | `/campaigns/{id}` | user | Update (400 if not `draft`) |
| DELETE | `/campaigns/{id}` | user | Delete (400 if `running`) → 204 |
| POST | `/campaigns/{id}/start` | user | `draft→running`; enqueues submission jobs; SSE publish |
| POST | `/campaigns/{id}/pause` | user | `running→paused`; SSE publish |
| POST | `/campaigns/{id}/resume` | user | `paused→running`; SSE publish |
| POST | `/campaigns/{id}/complete` | user | `→completed`; POSTs n8n completion webhook if configured |

## Anti-Bot & CAPTCHA

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/anti-bot/settings` | admin | Stealth params + CAPTCHA type→provider mapping + provider config status (**never keys**) |
| PUT | `/anti-bot/settings` | admin | Update settings |
| PUT | `/anti-bot/solvers/{provider}/key` | admin | Set solver key (`2captcha`/`anti_captcha`/`capsolver`) — write-only |
| DELETE | `/anti-bot/solvers/{provider}/key` | admin | Clear solver key |
| GET | `/captcha-handoffs` | user | Operator hand-off queue |
| POST | `/captcha-handoffs/{id}/solution` | user | Submit solution (**never logged**) |
| POST | `/captcha-handoffs/expire` | user | Sweep stale hand-offs (→ `expired`) |

## KPI & Dashboard

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/kpi/submissions` | user | From materialized view `mv_submission_metrics` (`?campaign_id,date_from,date_to`) |
| GET | `/kpi/ng` | user | Real-time NG counts (pending/confirmed/overridden/skipped) |
| GET/PUT | `/kpi/replies[/{campaign_id}]` | user | List / upsert manual reply counts |
| GET | `/dashboard` | user | Operator home snapshot (live campaigns, attention counts, JST today stats) |

## Workers (monitoring & control)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/workers` | user | Per-type status (`desired_state, last_seen_at`, recent counts) |
| GET | `/workers/{worker_type}/jobs` | user | Recent 50 jobs |
| POST | `/workers/{worker_type}/{action}` | user | Control `start`/`stop`/`restart` (sets `worker_controls.desired_state`) |

## Prospecting (Epic 7)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/prospecting/verify-cli` | operator/admin | Health-check the Claude CLI binary (20s timeout) |
| POST | `/prospecting/crawls` | operator/admin | Create crawl task (`url, count, keywords, scheduled_for, template_id`) |
| GET | `/prospecting/crawls` | operator/admin | List crawl tasks |
| GET | `/prospecting/crawls/{task_id}` | operator/admin | Crawl task detail |
| POST | `/prospecting/scrapes` | operator/admin | Create scrape task (adds `pages` pagination) |
| POST | `/prospecting/enriches` | operator/admin | Create enrich task (CSV upload + `import_requested`) |
| GET/POST | `/prospecting/templates` | list: op/admin · create: admin | Prompt templates |
| PATCH/DELETE | `/prospecting/templates/{id}` | admin | Update / delete (default template protected) |
| GET/POST | `/prospecting/saved-urls` | operator/admin | List / save reusable URLs |
| DELETE | `/prospecting/saved-urls/{id}` | operator/admin | Delete saved URL |

## Integrations & Webhooks & SSE

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/integrations/google` | admin | Google OAuth2 status (never secret) |
| PUT | `/integrations/google` | admin | Store Google creds (write-only) |
| POST | `/webhooks/n8n/campaigns/{id}/start` | webhook secret | Start campaign via n8n |
| POST | `/webhooks/n8n/campaigns/{id}/pause` | webhook secret | Pause campaign via n8n |
| GET | `/webhooks/n8n/campaigns/{id}/status` | webhook secret | Campaign status for n8n |
| GET | `/sse/events` | user | `text/event-stream` — alert zone (`campaign.progress`, …); keep-alive comments |

## Internal Error Codes

Beyond HTTP status, domain logic emits canonical internal codes inside the error envelope (and on `attempts.error_code`):

`not_found` · `bad_request` · `unauthorized` · `forbidden` · `conflict` · `field_unmapped` · `captcha_timeout` · `verification_inconclusive` · `verification_failed` · plus HTTP-derived submission codes (`http_404`, `http_503`, …).

See also: [Data Models](./data-models-backend.md) · [Backend Architecture](./architecture-backend.md) · [Integration Architecture](./integration-architecture.md).

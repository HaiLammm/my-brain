# Hướng dẫn: Bật Claude CLI cho Prospecting khi chạy bằng Docker (local dev)

> Bối cảnh: Epic 7 — Prospecting. Tính năng *"Verify Claude CLI"* (Story 7.1) và các
> chế độ crawl/scrape/enrich (Story 7.2–7.5) cần binary `claude` chạy được **bên trong
> container**. Image `backend` và `worker-prospecting` (`python:3.12-slim`) cố tình
> **không** đóng gói sẵn `claude`, nên ở môi trường Docker sẽ gặp 2 lỗi liên tiếp.
> Tài liệu này ghi lại toàn bộ chẩn đoán + cách fix đã áp dụng cho local dev.

---

## 1. Triệu chứng ban đầu

1. Card **"Verify Claude CLI"** báo đỏ:
   > `claude` not found — install the Claude CLI and ensure it is on PATH, or set
   > `PROSPECTING_CLAUDE_BIN` to its absolute path
2. Sau khi qua bước 1, **crawl thật fail tức thì (0s, status `failed`, 0 companies)**.

---

## 2. Chẩn đoán

### Lỗi #1 — `claude` not found (nút Verify)

- Nút Verify gọi `POST /api/prospecting/verify-cli` → `verify_claude_cli()`
  (`backend/app/services/prospecting_service.py:89`) chạy `claude --version` bằng
  subprocess. Không tìm thấy binary → `FileNotFoundError` → dòng đỏ trên.
- **Nguyên nhân gốc:** stack chạy bằng Docker. `claude` chỉ cài trên **host**
  (`~/.local/bin/claude`), container có filesystem riêng nên không thấy.
  Kiểm chứng: `docker exec tool_sales-backend-1 which claude` → không có; biến
  `PROSPECTING_CLAUDE_BIN` rỗng; trong container cũng không có Node.
- Đây đúng là trạng thái mà comment ở `docker-compose.yml:167-171` đã mô tả sẵn.

### Lỗi #2 — bypass-permissions bị chặn dưới root (crawl thật)

Log `docker logs tool_sales-worker-prospecting-1`:

```
`/opt/claude/claude` exited 1:
--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons
```

- Runner gọi `claude -p --permission-mode bypassPermissions <prompt>`
  (`workers/worker/prospecting/runner.py:62`) — bắt buộc để claude tự fetch web ở
  chế độ non-interactive `-p`.
- **Nguyên nhân gốc:** container worker chạy bằng **root**, mà Claude Code từ chối
  mọi chế độ bypass-permissions khi chạy dưới root.
- Ngoài ra container chưa có **auth** (`ANTHROPIC_API_KEY` lẫn credentials), nên kể
  cả qua được root-guard thì crawl vẫn fail ở bước xác thực.

---

## 3. Giải pháp đã áp dụng

Tất cả gói gọn trong **`docker-compose.override.yml`** (Docker tự merge với
`docker-compose.yml`) + một thư mục credentials cô lập. File override đã được thêm
vào `.gitignore` vì chứa đường dẫn máy cụ thể → **không commit**.

### 3.1. Đưa binary `claude` của host vào container

Binary host là **native ELF tự đóng gói** (không cần Node), tương thích glibc với
`python:3.12-slim` → mount read-only là chạy được. Đã kiểm chứng:
`docker exec tool_sales-backend-1 /opt/claude/claude --version` → `2.1.185 (Claude Code)`.

Áp dụng cho **cả** `backend` (để nút Verify xanh — chỉ chạy `--version`, không cần
auth) và `worker-prospecting` (crawl thật):

```yaml
volumes:
  - /home/luonghailam/.local/bin/claude:/opt/claude/claude:ro
environment:
  PROSPECTING_CLAUDE_BIN: /opt/claude/claude
```

> Mount qua **symlink** `~/.local/bin/claude` để Docker tự resolve sang version mới
> mỗi khi claude tự update (khi container được tạo lại).

### 3.2. Vượt root-guard cho worker — `IS_SANDBOX=1`

```yaml
environment:
  IS_SANDBOX: "1"
```

Báo cho Claude Code biết đây là môi trường sandbox → cho phép bypass-permissions
dưới root. Chấp nhận được vì worker là container cô lập (local dev).

> ⚠️ Đây là việc **nới một cơ chế bảo mật**. Safety classifier của Claude Code chặn
> không cho tự động apply — **người dùng phải tự chạy lệnh recreate** (xem mục 4),
> hoặc thêm Bash permission rule.

### 3.3. Auth — credentials subscription cô lập

Để worker **không** ghi đè vào phiên Claude đang dùng trên host (`~/.claude`), tạo một
bản copy credentials riêng:

```
~/.claude-worker/
├── .credentials.json        # copy từ ~/.claude/.credentials.json
└── .claude.json             # flag tối thiểu, tránh prompt onboarding ở chế độ -p
```

Nội dung `.claude.json`:

```json
{
  "hasCompletedOnboarding": true,
  "bypassPermissionsModeAccepted": true,
  "hasTrustDialogAccepted": true,
  "hasAcknowledgedCostThreshold": true
}
```

Trỏ claude vào thư mục này bằng `CLAUDE_CONFIG_DIR` (biến chuẩn của Claude Code,
đã xác nhận có trong binary):

```yaml
volumes:
  - /home/luonghailam/.claude-worker:/claude-config
environment:
  CLAUDE_CONFIG_DIR: /claude-config
```

### 3.4. File override hoàn chỉnh

`docker-compose.override.yml`:

```yaml
services:
  backend:
    volumes:
      - /home/luonghailam/.local/bin/claude:/opt/claude/claude:ro
    environment:
      PROSPECTING_CLAUDE_BIN: /opt/claude/claude

  worker-prospecting:
    volumes:
      - /home/luonghailam/.local/bin/claude:/opt/claude/claude:ro
      - /home/luonghailam/.claude-worker:/claude-config
    environment:
      PROSPECTING_CLAUDE_BIN: /opt/claude/claude
      IS_SANDBOX: "1"
      CLAUDE_CONFIG_DIR: /claude-config
```

---

## 4. Các bước áp dụng (tái lập từ đầu)

```bash
cd /home/luonghailam/Projects/tool_sales

# (1) Thư mục credentials cô lập cho worker
mkdir -p ~/.claude-worker
cp ~/.claude/.credentials.json ~/.claude-worker/.credentials.json
chmod 700 ~/.claude-worker && chmod 600 ~/.claude-worker/.credentials.json
# rồi tạo ~/.claude-worker/.claude.json với nội dung ở mục 3.3

# (2) Tạo docker-compose.override.yml với nội dung ở mục 3.4
#     và thêm dòng `docker-compose.override.yml` vào .gitignore

# (3) Kiểm tra config merge hợp lệ
docker compose config | grep -E "IS_SANDBOX|CLAUDE_CONFIG_DIR|PROSPECTING_CLAUDE_BIN"

# (4) Apply — tạo lại 2 service (không rebuild image)
docker compose up -d backend worker-prospecting
```

> Bước (4) với `worker-prospecting` có `IS_SANDBOX=1` cần **bạn tự chạy** (classifier
> chặn AI tự thực thi).

---

## 5. Kiểm chứng

```bash
# Binary thấy trong container?
docker exec tool_sales-backend-1 /opt/claude/claude --version          # → 2.1.185 (Claude Code)
docker exec tool_sales-worker-prospecting-1 /opt/claude/claude --version

# Nút "Verify Claude CLI" trên UI → phải chuyển XANH (báo version 2.1.185)

# Sau khi bấm crawl lại → đọc log worker để xác nhận/iterate
docker logs --since 10m tool_sales-worker-prospecting-1 | grep prospecting_crawl
```

Nếu còn lỗi, gần như sẽ nằm ở bước auth/onboarding của claude → chỉnh `.claude.json`
hoặc credentials trong `~/.claude-worker/` rồi `docker compose up -d worker-prospecting`.

---

## 6. Lưu ý bảo mật & production

- **`IS_SANDBOX=1`** nới guard bảo mật của Claude Code → chỉ dùng cho local dev /
  container cô lập, không bật bừa ở môi trường chia sẻ.
- **Credentials subscription cho worker tự động** có thể vi phạm điều khoản của
  Anthropic. Production nên chuyển sang **`ANTHROPIC_API_KEY`**: bỏ mount credentials +
  `CLAUDE_CONFIG_DIR`, chỉ cần đặt `ANTHROPIC_API_KEY=...` trong `.env`.
- Cách "đúng chuẩn" cho production là **cài thẳng `claude` vào image** (sửa
  `backend/Dockerfile` và `workers/Dockerfile`) thay vì bind-mount từ host, kèm
  `ANTHROPIC_API_KEY`. Khi đó bỏ hẳn override này.
- File `~/.claude-worker/` và `docker-compose.override.yml` là **local-only**, không
  commit. Container chạy root nên file claude ghi ra trong `~/.claude-worker/` có thể
  thuộc sở hữu `root` trên host (cần `sudo` nếu muốn dọn).

---

## 7. Rollback

```bash
rm docker-compose.override.yml
rm -rf ~/.claude-worker
docker compose up -d backend worker-prospecting   # trở về image gốc (Verify lại đỏ)
```

---

## Tham chiếu nhanh (file/đường dẫn)

| Thành phần | Vị trí |
|---|---|
| Story | `_bmad-output/implementation-artifacts/7-1-prospecting-worker-claude-cli-verification.md` |
| Logic verify | `backend/app/services/prospecting_service.py:89` (`verify_claude_cli`) |
| Endpoint | `backend/app/routers/prospecting.py:43` (`POST /api/prospecting/verify-cli`) |
| Config knobs | `backend/app/core/config.py:105-127` (`PROSPECTING_CLAUDE_BIN`, timeout) |
| Runner crawl | `workers/worker/prospecting/runner.py:62` (`-p --permission-mode bypassPermissions`) |
| Override (local) | `docker-compose.override.yml` (gitignored) |
| Credentials (local) | `~/.claude-worker/` |

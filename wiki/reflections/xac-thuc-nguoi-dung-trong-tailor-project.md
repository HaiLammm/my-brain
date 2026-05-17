---
id: reflection-xac-thuc-nguoi-dung-trong-tailor-project
title: "Hiểu biết của tôi về xác thực người dùng trong Tailor_project"
type: reflection
created: 2026-05-14
updated: 2026-05-15
related_concepts:
  - auth-js-v5
  - otp-authentication
  - rbac
related_sources:
  - tailor-project-prd
  - epic-1-implementation-artifacts-tailor-project
evolution_count: 4
---

## Current understanding

access_token su dung truy van nhu binh thuong va dinh kem thong tin dua tren jwt da duoc ma hoa , session se dong goi tat ca thong tin gui di va luu lai phien dang nhap cho toi khi het han hoac dang xuat 2.vi hacker co the dung curl de gui truy van truc tiep 3.O trang login 

## Evolution

### 2026-05-14 — Hiểu sơ bộ về role
Bạn xem xác thực người dùng là cách để phân role, xác minh người dùng và biết họ có thể làm gì trong hệ thống. Bạn cũng hình dung hệ thống có các role như user, tailor và owner gắn với từng người dùng.

### 2026-05-14 — Làm rõ role và quyền
Bạn làm rõ hơn rằng role được lưu trong entity user và được gán sau khi đăng nhập thành công. Bạn cũng phân biệt phạm vi hành động của user, tailor và owner theo các chức năng chính trong Tailor_project.

### 2026-05-14 — Phân biệt xác thực và phân quyền
Bạn bổ sung thêm luồng lấy role từ PostgreSQL, đưa role vào JWT và access token khi đăng nhập. Bạn cũng tách bạch rõ xác thực là biết người dùng là ai, còn phân quyền là giới hạn họ được phép làm gì; với user/customer thì không được xem doanh thu hay quản lý vận hành quán.

### 2026-05-15 — Token, session và điểm chặn quyền
Bạn bổ sung cách bạn đang hiểu sự khác nhau giữa access token và session, lý do không thể tin frontend vì hacker có thể gửi truy vấn trực tiếp, và bạn hiện hình dung điểm kiểm tra nằm ở trang login.

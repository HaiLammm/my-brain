---
type: source
title: "Làm Chủ Dòng Lệnh Linux: Sổ Tay Phân Loại Cho Người Mới Bắt Đầu"
slug: linux-command-mastery
date_added: 2026-05-11
authors:
  - Ubuntu Server Documentation
source_type: book
importance: 3
confidence: high
tags:
  - linux
  - command-line
  - cli
  - vim
  - system-admin
  - networking
---

## Summary

Tài liệu hướng dẫn toàn diện về dòng lệnh Linux dành cho người mới, bao gồm các nhóm lệnh cơ bản (file, system, text), trình soạn thảo VIM, networking và các bí quyết tăng năng suất. Linux là "xương sống" của hạ tầng Internet toàn cầu, và việc thành thạo CLI là bước chiến lược để quản trị máy chủ từ xa hiệu quả.

---

## 1. Giới thiệu: Tư duy Dòng lệnh và Linux

### Tại sao phải học CLI?

- Linux không chỉ là hệ điều hành đơn thuần mà là "xương sống" của hạ tầng Internet toàn cầu
- Mang lại khả năng mở rộng kinh tế và kỹ thuật vượt trội cho mọi trung tâm dữ liệu
- Học CLI thay vì GUI giúp làm chủ hệ thống tinh vi và quản trị máy chủ từ xa hiệu quả

### VIM là gì?

VIM (VI improved) là phiên bản cải tiến của trình soạn thảo văn bản VI truyền thống. Đây là công cụ cho phép thao tác hoàn toàn trên bàn phím để di chuyển, chỉnh sửa và quản lý tệp tin với tốc độ cực nhanh mà không cần chạm vào chuột.

---

## 2. Nhóm lệnh Thao tác Tệp tin và Thư mục

| Lệnh | Mô tả | Giá trị cốt lõi |
|------|--------|----------------|
| pwd | Hiển thị đường dẫn thư mục hiện tại | Định vị chính xác vị trí trong cây phân cấp hệ thống |
| ls | Liệt kê nội dung bên trong thư mục | Kiểm tra nhanh các thực thể (tệp/thư mục) hiện hữu |
| cd | Thay đổi thư mục làm việc | "Di chuyển" linh hoạt giữa các tầng dữ liệu |
| mkdir | Tạo thư mục mới | Thiết lập cấu trúc lưu trữ logic và khoa học |
| rm | Xóa tệp tin hoặc thư mục | Giải phóng tài nguyên và dọn dẹp hệ thống |
| cp | Sao chép tệp tin hoặc thư mục | Nhân bản dữ liệu để lưu trữ hoặc thử nghiệm an toàn |
| mv | Di chuyển hoặc đổi tên tệp tin | Tái cấu trúc vị trí hoặc định danh lại dữ liệu |
| touch | Tạo tệp tin trống hoặc cập nhật thời gian | Khởi tạo nhanh một tệp tin mới để bắt đầu làm việc |

### Phím tắt điều hướng VIM (trong terminal)

- **Thao tác cơ bản**: h (trái), j (xuống), k (lên), l (phải)
- **Di chuyển theo từ**: 
  - w: nhảy tới đầu từ tiếp theo
  - b: lùi lại đầu từ trước
  - e: nhảy tới cuối từ hiện tại
- **Case-sensitive**: 
  - Phím thường (w, b, e) dừng ở ký tự đặc biệt (dấu phẩy, dấu chấm)
  - Phím hoa (W, B, E) nhảy qua toàn bộ cụm từ cho đến khi gặp khoảng trắng
- **Định vị nhanh**: 0 (về đầu dòng), $ (đến cuối dòng), gg (về đầu tệp), G (xuống cuối tệp)

---

## 3. Nhóm lệnh Quản lý Hệ thống, Người dùng và Quyền hạn

Trong Linux, quản trị quyền truy cập là "chốt chặn" quan trọng nhất để đảm bảo an ninh.

### Quản lý người dùng và danh tính

| Lệnh | Mô tả |
|------|-------|
| whoami | Xác nhận danh tính người dùng hiện tại |
| useradd | Thêm tài khoản người dùng mới (lệnh nhị phân nguyên bản) |
| userdel | Xóa tài khoản người dùng khỏi hệ thống |
| passwd | Thiết lập hoặc thay đổi mật khẩu người dùng |

### Kiểm soát quyền hạn

| Lệnh | Mô tả |
|------|-------|
| chmod | Điều chỉnh quyền đọc/ghi/thực thi (Read/Write/Execute) |
| chown | Chuyển giao quyền sở hữu tệp tin hoặc thư mục |
| sudo | Thực thi lệnh với đặc quyền tối cao của siêu người dùng (superuser) |

### Giám sát trạng thái hệ thống

| Lệnh | Mô tả |
|------|-------|
| uptime | Kiểm tra thời gian hệ thống đã vận hành liên tục |
| df | Thống kê không gian đĩa cứng (Disk Free) |
| free | Theo dõi tình trạng bộ nhớ RAM và Swap |

### Phân tích sâu: useradd vs adduser

- **useradd**: lệnh nhị phân hệ thống (binary) gốc
- **adduser**: Perl script thân thiện hơn, sử dụng useradd bên dưới để tự động hóa các bước như tạo thư mục Home hay cài đặt shell mặc định

---

## 4. Nhóm lệnh Xử lý Văn bản và Luồng dữ liệu

Sức mạnh thực sự của Linux nằm ở khả năng kết nối các lệnh đơn lẻ thành một quy trình xử lý dữ liệu khổng lồ.

| Lệnh | Mục đích chính | Độ phức tạp | Ví dụ thực tế |
|------|---------------|-------------|---------------|
| grep | Tìm kiếm theo khuôn mẫu (pattern) | Thấp | Lọc các dòng chứa từ "error" trong tệp log |
| sed | Chỉnh sửa luồng văn bản (Stream Editor) | Trung bình | Thay thế hàng loạt từ cũ thành từ mới trong cấu hình |
| awk | Xử lý dữ liệu và trích xuất báo cáo | Cao | Trích xuất và tính toán giá trị từ cột thứ 2 của tệp CSV |

### Pipe (|) - "Cây cầu" thần kỳ trong Linux

Cho phép lấy đầu ra của lệnh này làm đầu vào cho lệnh kia.

**Ví dụ**: `cat log.txt | grep "Critical"` — đọc tệp và lọc ngay lập tức các cảnh báo nghiêm trọng.

### Các lệnh xem nhanh

| Lệnh | Mô tả |
|------|-------|
| cat | Xem toàn bộ nội dung tệp |
| head | Xem phần đầu tệp |
| tail | Xem phần cuối tệp (theo dõi log thời gian thực) |
| less | Đọc văn bản theo trang |

---

## 5. Chuyên đề VIM: Làm chủ trình soạn thảo

### Bước 1: Chế độ và Thao tác cơ bản

| Chế độ | Phím | Mô tả |
|--------|------|-------|
| Normal Mode | Esc | Chế độ mặc định để di chuyển và ra lệnh |
| Insert Mode | i | Bắt đầu nhập văn bản |
| Visual Mode | v | Bôi đen, lựa chọn vùng văn bản để sao chép hoặc xóa |
| Command Mode | : | Nhập lệnh lưu/thoát (:w lưu, :q thoát, :wq! hoặc ZZ lưu và thoát) |

### Bước 2: Kỹ thuật nâng cao cho Workflow chuyên nghiệp

#### 1. Buffer (Bộ nhớ tạm)
VIM lưu các tệp đang mở vào Buffer.

| Lệnh | Mô tả |
|------|-------|
| :ls | Xem danh sách buffer |
| :bn | Chuyển sang tệp kế tiếp (Next) |
| :bp | Về tệp trước (Previous) |
| :bd | Đóng một buffer (Delete) |

#### 2. Tab (Quản lý không gian)
| Lệnh | Mô tả |
|------|-------|
| :tabedit [tên_file] | Mở tab mới |
| :tabn | Chuyển sang tab kế tiếp |
| :tabp | Về tab trước |

#### 3. Split (Chia màn hình)
| Lệnh | Mô tả |
|------|-------|
| :vsplit | Chia màn hình dọc |
| :split | Chia màn hình ngang |
| Ctrl + w + phím điều hướng | Nhảy giữa các cửa sổ |

### Register - "Clipboard" đa dạng

Sử dụng dấu nháy kép kèm tên chữ cái để lưu nhiều đoạn text khác nhau:

| Thao tác | Ví dụ | Mô tả |
|----------|-------|-------|
| Lưu | "ayw | Lưu một từ vào Register 'a' |
| Dán | "ap | Dán nội dung từ Register 'a' |
| Phạm vi | "a đến "z | Lưu trữ hàng chục đoạn mã khác nhau cùng lúc |

### Bước 3: Tự động hóa với Macro và Tùy chỉnh

#### Macro (Phím q)
1. Nhấn `q` kèm một chữ cái để bắt đầu ghi
2. Thực hiện chuỗi hành động
3. Nhấn `q` lần nữa để dừng
4. Dùng `@` kèm chữ cái để lặp lại tự động

#### Cấu hình .vimrc
Tệp tin linh hồn của VIM cho phép cá nhân hóa môi trường làm việc:

```vim
set number          " Hiện số dòng
set tabstop=4       " Đặt tab = 4 spaces
```

#### Công cụ hỗ trợ
- **NerdTree**: Hiển thị cây thư mục (nhấn `m` để mở Menu tạo/xóa/đổi tên file)
- **Vim Bootstrap**: Khởi tạo file cấu hình chuyên nghiệp nhanh chóng

---

## 6. Nhóm lệnh Mạng và Bảo mật

### Ngũ hổ tướng trong quản trị mạng

| Lệnh | Mô tả |
|------|-------|
| ping | Kiểm tra thông suốt kết nối giữa máy của bạn và đích đến |
| ip / ifconfig | Công cụ "vạn năng" để xem địa chỉ IP và cấu hình các giao diện mạng |
| ssh | Giao thức kết nối mã hóa, điều khiển máy chủ từ xa an toàn |
| curl | Truyền tải dữ liệu qua HTTP, FTP... (thường dùng để kiểm tra API) |
| wget | Trình tải tệp tin mạnh mẽ từ Internet, hỗ trợ chạy ngầm và tải lại khi mất kết nối |

### Security Insight

- **iptables**: tường lửa canh gác cổng mạng
- **chmod**: kiểm soát chặt chẽ quyền truy cập để đảm bảo không ai xâm nhập trái phép vào dữ liệu nhạy cảm

---

## 7. Bí quyết tăng năng suất

### Mapping (Tạo Shortcut) trong VIM

Biến lệnh dài thành phím tắt thông qua Leader Key:

```vim
map <Leader>t :NERDTree<CR>
```

> Lưu ý: Thêm `<CR>` (Carriage Return) ở cuối để VIM tự động thực thi lệnh mà không cần xác nhận.

### Aliases

Đặt tên ngắn cho câu lệnh dài trong shell:

```bash
alias update='sudo apt update && sudo apt upgrade'
```

### Quản lý tiến trình (Process)

| Lệnh | Mô tả |
|------|-------|
| ps | Chụp ảnh các tiến trình đang vận hành |
| top | Bảng điều khiển tài nguyên (CPU, RAM) theo thời gian thực |
| kill | Gửi tín hiệu buộc dừng tiến trình lỗi hoặc tiêu tốn tài nguyên quá mức |

---

## 8. Phụ lục: Bảng tra cứu nhanh (Cheat Sheet) A-Z

| Lệnh | Mô tả |
|------|-------|
| alias | Thay thế lệnh dài bằng từ khóa ngắn tùy chỉnh |
| cat | Hiển thị toàn bộ nội dung tệp tin ra màn hình |
| cd | Thay đổi thư mục làm việc hiện hành |
| chmod | Thay đổi quyền truy cập của tệp tin/thư mục |
| cp | Sao chép tệp tin hoặc thư mục sang vị trí mới |
| df | Thống kê dung lượng đĩa cứng còn trống và đã dùng |
| find | Tìm kiếm tệp tin dựa trên tên, kích thước, thời gian |
| free | Hiển thị trạng thái bộ nhớ RAM của hệ thống |
| grep | Tìm kiếm chuỗi văn bản theo khuôn mẫu cụ thể |
| history | Liệt kê danh sách các lệnh đã thực thi trước đó |
| kill | Gửi tín hiệu kết thúc một tiến trình đang chạy |
| ls | Liệt kê các tệp và thư mục con bên trong |
| mkdir | Khởi tạo thư mục mới trong hệ thống |
| mv | Di chuyển hoặc đổi tên tệp tin/thư mục |
| pwd | In ra đường dẫn đầy đủ của thư mục hiện tại |
| rm | Xóa vĩnh viễn tệp tin hoặc thư mục |
| sudo | Chạy lệnh với quyền quản trị viên cao nhất |
| top | Theo dõi các tiến trình hệ thống theo thời gian thực |
| touch | Tạo tệp tin mới hoặc cập nhật mốc thời gian |
| whoami | Xác nhận tên người dùng hiện đang đăng nhập |

---

## Lời kết

Hành trình làm chủ Linux không phải là cuộc đua tiếp thu lý thuyết, mà là quá trình rèn luyện để các ngón tay của bạn "ghi nhớ" dòng lệnh như một bản năng. Đừng sợ hãi trước màn hình đen huyền bí của Terminal. Hãy thực hành mỗi ngày, sai và sửa, bạn sẽ thấy mình đang nắm giữ chìa khóa vạn năng để mở cánh cửa vào thế giới công nghệ hiện đại.
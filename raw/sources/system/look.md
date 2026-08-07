# Huong dan su dung Look tren Linux Mint

## 1. Look la gi

`Look` la launcher dieu khien bang ban phim. Ban co the dung no de:

- mo app, file, thu muc
- tim nhanh theo ten, duong dan, regex
- xem va tim clipboard history
- tinh toan ngay trong launcher
- dich nhanh bang web
- chay command nhu `/calc`, `/kill`, `/shell`, `/sys`, `/pomo`

Phan lon thao tac cua `Look` la local-first. Chi mot so tac vu can mang, chu yeu la:

- `t"` de dich
- `Ctrl+Enter` de tim Google

## 2. Mo, an, thoat

Phim tat chinh tren Linux Mint:

- `Alt+Space`: mo/an cua so Look
- `Esc`: an Look hoac thoat khoi mot mode hien tai
- `Alt+Shift+Q`: thoat han app
- `Ctrl+H`: mo man hinh help

Neu `Alt+Space` bi xung dot voi desktop environment, hay kiem tra shortcut cua he thong cua ban.

## 3. Luong su dung co ban

1. Nhan `Alt+Space` de mo Look.
2. Go tu khoa can tim.
3. Dung `Tab` / `Shift+Tab` hoac `Up` / `Down` de doi ket qua dang chon.
4. Nhan `Enter` de mo ket qua.
5. Nhan `Esc` de an launcher.

Mac dinh Look tim trong:

- app da cai
- file va thu muc trong cac duong dan duoc index
- mot so muc he thong duoc app biet san

## 4. Tim kiem co ban

Ban co the go truc tiep:

- ten app: `firefox`, `code`, `telegram`
- ten file: `report`, `meeting-notes`
- ten thu muc: `Downloads`, `Projects`
- truy van giong duong dan: `work/client/readme`

Meo:

- truy van kieu duong dan se uu tien ket qua theo path
- mot so thu muc home pho bien nhu `Desktop`, `Documents`, `Downloads`, `Pictures`, `Videos`, `Music` duoc uu tien nhanh khi ban go dau ten

## 5. Prefix tim kiem

Look ho tro cac prefix sau:

| Cu phap | Y nghia | Vi du |
| --- | --- | --- |
| `a"` | chi tim app | `a"chrome` |
| `f"` | chi tim file | `f"invoice` |
| `d"` | chi tim folder | `d"project` |
| `r"` | tim theo regex, khong phan biet hoa thuong | `r"^doc.*2026` |
| `c"` | tim clipboard history | `c"meeting` |
| `t"` | dich nhanh bang web | `t"xin chao` |

Luu y:

- o ban Linux hien tai, `t"` la prefix dich ma ban nen dung
- che do dich chi chay khi ban nhan `Enter`, khong tu dong dich trong luc dang go

## 6. Thao tac voi ket qua tim kiem

Khi dang o man hinh tim kiem chinh:

- `Enter`: mo ket qua dang chon
- `Ctrl+Enter`: tim query hien tai tren Google
- `Ctrl+F`: mo thu muc chua item trong file manager
- `Ctrl+C`: copy item dang chon vao clipboard
- `Ctrl+P`: pick / unpick item
- `Ctrl+Shift+P`: xoa toan bo picked items

### Copy va pick khac nhau nhu the nao

- `Ctrl+C` phu hop khi ban muon copy nhanh 1 item
- `Ctrl+P` phu hop khi ban muon chon nhieu file/folder mot luc

Khi co item duoc pick, panel ben phai se hien danh sach da pick. Ban co the:

- tiep tuc pick them item khac
- bo tung item
- clear tat ca

### Ghi chu cho Linux Mint

Clipboard van ban hoat dong binh thuong khong can cai them goi.

Neu ban muon copy file/folder de paste vao file manager, co the can them tool he thong:

- X11: `xclip`
- Wayland: `wl-clipboard`

Vi du cai tren Mint:

```bash
sudo apt-get install -y xclip
```

Hoac neu ban dang dung Wayland:

```bash
sudo apt-get install -y wl-clipboard
```

## 7. Clipboard history

Dung prefix `c"` de vao che do clipboard history.

Vi du:

- `c"error`
- `c"meeting`
- `c"https`

Trong che do nay:

- `Enter`: copy lai noi dung dang chon vao clipboard
- `Delete`: xoa muc dang chon khoi lich su
- `Esc`: thoat clipboard mode va xoa query

## 8. Dich nhanh

Dung prefix `t"`.

Vi du:

- `t"hello`
- `t"xin chao`
- `t"how are you`

Cach dung:

1. Mo Look.
2. Go `t"...`.
3. Nhan `Enter` de gui request dich.
4. Xem ket qua tren panel dich.

Ban Linux hien tai hien thi luong dich web, va co the mo ket qua ra browser.

## 9. Command mode

Command mode la noi Look chay cac command thay vi tim file/app.

Co 2 cach vao:

- `Ctrl+/`
- go truc tiep `:cmd` tu man hinh chinh

Vi du:

- `:calc 2+2`
- `:kill :3000`
- `:kill chrome`
- `:shell ls -la`
- `:sys`
- `:pomo`

Trong command mode:

- `Tab` / `Shift+Tab`: doi command
- `Ctrl+1`: `/calc`
- `Ctrl+2`: `/pomo`
- `Ctrl+3`: `/kill`
- `Ctrl+4`: `/shell`
- `Ctrl+5`: `/sys`
- `Esc`: quay lai man hinh tim kiem chinh

### 9.1 `/calc`

Dung de tinh nhanh.

- co preview khi ban dang go
- `Enter` de tinh / xac nhan ket qua

Vi du:

- `2^10`
- `sqrt(2)`
- `4!`
- `200*15%`
- `2*pi`

### 9.2 `/pomo`

Day la Pomodoro timer.

Ban co the:

- tao session focus va break
- chay timer theo danh sach session
- chon folder nhac nen
- play/pause nhac ngay trong panel

Phim trong `/pomo`:

- `Space`: start / pause
- `R`: reset ve trang thai idle
- `P`: play / pause nhac

Ghi chu:

- sau mot thoi gian ngan khong thao tac, panel co the fade thanh dong ho standby
- bat ky input nao cung co the dua panel tro lai

### 9.3 `/kill`

Dung de kill process.

Ban co the:

- tim theo ten process
- tim process dang chiem port

Vi du:

- `:kill chrome`
- `:kill :3000`

Trong `/kill`:

- `Up` / `Down`: chon process
- `Enter`: vao buoc xac nhan kill
- `Y`: dong y kill
- `N`: huy
- `Esc`: quay lai hoac dong xac nhan neu dang o buoc confirm

### 9.4 `/shell`

Dung de chay lenh shell.

Vi du:

- `:shell pwd`
- `:shell ls -la`
- `:shell git status`

Luu y: command nay se chay tren may cua ban, vi vay chi dung voi lenh ban tin tuong.

### 9.5 `/sys`

Dung de xem thong tin he thong, vi du:

- thong tin OS
- CPU
- RAM
- disk
- uptime

## 10. Settings

Mo settings bang:

- `Ctrl+Shift+,`

Settings gom 3 tab lon:

- `Appearance`
- `Advanced`
- `Shortcuts`

### Appearance

Ban co the chinh:

- theme
- tint color
- blur opacity
- blur style
- font name
- font size
- font color
- border

Theme co san:

- Catppuccin
- Tokyo Night
- Rose Pine
- Gruvbox
- Dracula
- Kanagawa
- Custom

### Advanced

Ban co the chinh:

- background image
- cach hien anh nen
- do sau index file
- gioi han so file index
- lazy indexing
- log level backend
- launch at login

### Shortcuts

Day la bang cheat sheet ngay trong app, rat huu ich khi ban quen phim tat.

### Save Config va reload config

- nut `Save Config` se ghi thay doi hien tai vao file config
- sau khi save, thay doi duoc ap dung ngay
- `Ctrl+Shift+;` chu yeu dung khi ban sua file `.look.config` bang tay

## 11. File cau hinh

Mac dinh Look doc file:

```text
~/.look.config
```

Neu muon doi duong dan config:

```bash
LOOK_CONFIG_PATH=/duong-dan/khac/.look.config cargo tauri dev
```

Mau config co ich:

```text
file_scan_roots=Desktop,Documents,Downloads
file_scan_extra_roots=/home/<ban>/Projects,/home/<ban>/Notes
file_scan_depth=4
file_scan_limit=8000
lazy_indexing_enabled=true
skip_dir_names=node_modules,target,build,dist,.git,vendor,out,coverage,tmp,cache,venv
ui_theme=tokyo-night
```

Y nghia nhanh:

- `file_scan_roots`: root mac dinh de quet
- `file_scan_extra_roots`: them thu muc muon index
- `file_scan_depth`: do sau scan
- `file_scan_limit`: so luong item toi da
- `lazy_indexing_enabled`: chi refresh index khi co thay doi
- `skip_dir_names`: bo qua thu muc on ao nhu `node_modules`, `.git`
- `ui_theme`: theme giao dien

Neu ban muon Look tim thay thu muc du an ngoai `Desktop`, `Documents`, `Downloads`, hay them no vao `file_scan_extra_roots`.

## 12. Workflow goi y hang ngay

### Mo nhanh du an

1. `Alt+Space`
2. Go `project` hoac `d"project`
3. `Enter`

### Mo file ghi chu

1. `Alt+Space`
2. Go `f"meeting`
3. `Enter`

### Tim lai do vua copy

1. `Alt+Space`
2. Go `c"docker`
3. `Enter` de copy lai

### Kill server dang chiem port

1. `Alt+Space`
2. Go `:kill :3000`
3. `Enter`
4. `Y`

### Tinh nhanh

1. `Alt+Space`
2. Go `2^10`
3. hoac `Ctrl+/` roi vao `/calc`

## 13. Meo va troubleshooting nhanh

### Alt+Space khong mo Look

- kiem tra shortcut he thong co dang chiem `Alt+Space` khong
- neu ban dung Wayland, hotkey global co the phu thuoc compositor

### Khong thay file/thu muc moi

- mo `Settings > Advanced`
- tang `file_scan_depth` hoac `file_scan_limit`
- them duong dan vao `file_scan_extra_roots`
- sau khi sua tay `.look.config`, nhan `Ctrl+Shift+;`

### Copy file roi paste vao file manager khong duoc

- cai `xclip` neu ban dung X11
- cai `wl-clipboard` neu ban dung Wayland

### Ban quen phim tat

- nhan `Ctrl+H` de mo help
- hoac vao `Settings > Shortcuts`

## 14. Lenh nen thu ngay

```text
firefox
f"invoice
d"projects
r"^readme
c"meeting
t"xin chao
:calc 2*pi
:kill :3000
:shell pwd
:sys
:pomo
```

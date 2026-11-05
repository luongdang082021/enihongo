# Hướng dẫn cho agent

Tóm tắt: quy tắc để AI agent (Claude hoặc khác) làm việc đúng hướng trong repo enihongo.

Trạng thái: đang dùng. Cập nhật: 2026-11-05.

## Đọc trước

1. [`../context/project-context.md`](../context/project-context.md)
2. [`../planning/decisions.md`](../planning/decisions.md) (đừng đề xuất lại hướng đã gác)
3. Tài liệu của phần đang sửa (`content/` hoặc `product/`)

## Nguyên tắc

- Site là trang tĩnh trên GitHub Pages. Không thêm backend, tài khoản, bảng xếp hạng hay dịch vụ trả phí khi chưa có quyết định mới trong `decisions.md`.
- Giữ trang nhẹ. Không thêm thư viện hay font ngoài khi chưa kiểm tra [`../planning/performance-budget.md`](../planning/performance-budget.md).
- Không sao chép giáo trình in hay nội dung có bản quyền ([`../content/content-guidelines.md`](../content/content-guidelines.md)).
- Giao diện và giải thích bằng tiếng Việt. Chữ Nhật trong bài giai đoạn đầu chỉ dùng hiragana.
- Không đưa khóa bí mật, token hay dữ liệu cá nhân vào repo.
- Mở rộng dựa trên cái đã có: engine quiz và dữ liệu của Dojo dùng chung cho bài học, không viết lại.

## Quy trình làm việc

1. Đọc tài liệu liên quan, nêu giả định nếu thiếu thông tin.
2. Thay đổi nhỏ, tách theo mục đích. Một commit làm một việc.
3. Kiểm tra trước khi commit (xem bên dưới).
4. Nếu thay đổi ảnh hưởng hướng đi, thêm dòng vào `decisions.md`; nếu đổi hành vi game, cập nhật `product/hiragana-dojo-spec.md`.
5. Commit và push lên `main`; GitHub Pages tự cập nhật.

## Kiểm tra trước khi commit

- Mở được trang ở chiều rộng khoảng 400 px, cả chế độ sáng và tối, không cuộn ngang.
- Với thay đổi trong `index.html`: kiểm tra cú pháp script bằng `node --check` trên phần script đã tách, và chạy mô phỏng câu hỏi (xem đặc tả Dojo).
- Link tương đối trong tài liệu còn hoạt động.
- Kích thước file đổi nhiều thì đo lại theo skill `perf-audit`.

## Quy ước commit

Thông điệp ngắn, thể mệnh lệnh, một dòng tiêu đề (ví dụ `Add lesson template and course outline`). Phần thân giải thích lý do nếu không hiển nhiên.

## Việc agent không tự làm

- Bật cài đặt GitHub Pages hay đổi cài đặt repo (người dùng làm).
- Chốt các quyết định đang "Chờ chốt" trong `decisions.md`.
- Xuất bản bài học chưa qua người duyệt tiếng Nhật.

## Skill dùng lại

Xem [`../skills/`](../skills/).

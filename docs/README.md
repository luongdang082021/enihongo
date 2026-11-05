# Tài liệu dự án enihongo

Mục lục và quy ước cho thư mục `docs/`. Cập nhật lần cuối: 2026-11-05.

## Bản đồ thư mục

| Thư mục | Chứa gì | Đọc khi |
|---|---|---|
| [`context/`](context/) | Bối cảnh dự án, đối tượng người học, thuật ngữ | Mới vào dự án |
| [`planning/`](planning/) | Lộ trình, cấu trúc site, ngân sách hiệu năng, tăng trưởng, nhật ký quyết định | Lập kế hoạch, chọn hướng |
| [`planning/archive/`](planning/archive/) | Đề xuất đã gác lại, giữ để tham khảo | Muốn xem lại ý tưởng cũ |
| [`content/`](content/) | Dàn bài khóa học, mẫu bài học, quy ước viết nội dung, các khóa sắp ra mắt | Viết hoặc duyệt bài |
| [`product/`](product/) | Đặc tả sản phẩm đang chạy (Hiragana Dojo) | Sửa game, thêm dạng câu hỏi |
| [`agents/`](agents/) | Hướng dẫn cho AI agent làm việc trong repo | Giao việc cho Claude hoặc agent khác |
| [`skills/`](skills/) | Skill dạng `SKILL.md` dùng lại được | Lặp lại một quy trình |

## Quy ước

- Tên file: chữ thường, nối bằng dấu gạch ngang (`information-architecture.md`).
- Mỗi tài liệu mở đầu bằng một dòng tóm tắt, rồi `Trạng thái` (nháp / đang dùng / đã gác) và ngày cập nhật.
- Quyết định quan trọng ghi vào [`planning/decisions.md`](planning/decisions.md) với mã `D-xxx`, không sửa lại quyết định cũ mà thêm dòng mới ghi đè.
- Ngôn ngữ: tiếng Việt cho tài liệu và giao diện; từ khóa kỹ thuật giữ tiếng Anh.
- Không đưa khóa bí mật, token hay dữ liệu cá nhân vào repo.

# enihongo
this is static web for learning Japanese

## Hiragana Dojo

Dojo: game quiz 20 câu mỗi lượt, chọn khóa (Hiragana, Katakana) để trộn chữ và từ vựng. Câu sai được hỏi lại ở dạng khác, chữ hay sai được ưu tiên ở lượt sau (xem `docs/product/hiragana-dojo-spec.md`).

Các dạng câu hỏi: chữ ↔ romaji, gõ romaji, nối cặp, âm ghép, soạn từ bằng ô chữ, điền chữ thiếu, đếm nhịp.
Điểm cao nhất lưu trong `localStorage` của trình duyệt.

### Chạy local

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

### Deploy GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, thư mục `/ (root)`.

## Tài liệu

Kế hoạch, nội dung, đặc tả và hướng dẫn cho agent nằm trong [`docs/`](docs/README.md).

| Cần gì | Xem |
|---|---|
| Bối cảnh và ràng buộc | [`docs/context/project-context.md`](docs/context/project-context.md) |
| Lộ trình | [`docs/planning/roadmap.md`](docs/planning/roadmap.md) |
| Cấu trúc site và khóa học | [`docs/planning/information-architecture.md`](docs/planning/information-architecture.md) |
| Quyết định | [`docs/planning/decisions.md`](docs/planning/decisions.md) |
| Dàn bài khóa Hiragana | [`docs/content/hiragana-course-outline.md`](docs/content/hiragana-course-outline.md) |
| Đặc tả game | [`docs/product/hiragana-dojo-spec.md`](docs/product/hiragana-dojo-spec.md) |
| Hướng dẫn cho agent | [`docs/agents/agent-guidelines.md`](docs/agents/agent-guidelines.md) |

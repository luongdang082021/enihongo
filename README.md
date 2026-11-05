# enihongo
this is static web for learning Japanese

## Hiragana Dojo

Game quiz hiragana, 5 hiệp × 20 câu (`index.html`, không cần build):

1. Chữ cơ bản
2. Âm đục và bán đục
3. Âm ghép
4. Trường âm và âm ngắt
5. Tổng hợp

Các dạng câu hỏi: chữ ↔ romaji, gõ romaji, nối cặp, tìm chữ khác nhóm, dấu ゛ ゜, âm ghép, điền chữ thiếu, đếm nhịp.
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

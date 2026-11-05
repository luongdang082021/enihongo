# Lộ trình

Tóm tắt: bốn giai đoạn đi từ khung trang đến mở rộng; giai đoạn 0 (game) đã xong.

Trạng thái: đang dùng. Cập nhật: 2026-11-05.

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| 0. Game | Hiragana Dojo chạy độc lập, deploy lên GitHub Pages | Xong (2026-11-05) |
| 1. Khung trang | Thiết kế giao diện, trang chủ, lưới khóa học có thẻ khóa, pipeline build và deploy, chuyển Dojo về `/luyen-tap/hiragana-dojo` | Chưa bắt đầu |
| 2. Khóa Hiragana | 14 bài, flashcard, mini quiz, thanh tiến độ | Chưa bắt đầu |
| 3. Hoàn thiện | SEO, analytics nhẹ, PWA offline, đo hiệu năng | Chưa bắt đầu |
| 4. Mở rộng | Thứ tự nét, âm thanh phát âm | Chưa bắt đầu |

## Giai đoạn 1: việc cần làm

- [ ] Chốt cách dựng trang (xem D-005 trong [`decisions.md`](decisions.md))
- [ ] Chốt đường dẫn gốc (D-006)
- [ ] Hệ thống thiết kế: màu, font, khoảng cách, chế độ sáng và tối
- [ ] Trang chủ và `/khoa-hoc/`
- [ ] Thẻ khóa "Sắp ra mắt" cho 5 khóa chưa mở
- [ ] Tự host font đã cắt gọn
- [ ] Tách engine quiz thành module dùng chung (dữ liệu chữ và từ ra file riêng)
- [ ] Đưa bộ kiểm tra mô phỏng câu hỏi vào `tools/`
- [ ] Đo Lighthouse làm mốc ban đầu

## Giai đoạn 2: việc cần làm

- [ ] Mẫu bài học ([`../content/lesson-template.md`](../content/lesson-template.md)) và 3 bài mẫu để duyệt phong cách
- [ ] Viết nốt các bài còn lại theo [`../content/hiragana-course-outline.md`](../content/hiragana-course-outline.md)
- [ ] Flashcard lặp lại ngắt quãng đơn giản, lưu bằng `localStorage`
- [ ] Mini quiz 10 câu cho mỗi bài
- [ ] Tiến độ học và nút xuất/nhập JSON

## Giai đoạn 3 và 4

Xem [`growth-and-seo.md`](growth-and-seo.md) và [`performance-budget.md`](performance-budget.md). Thứ tự nét viết cần kiểm tra giấy phép nguồn dữ liệu trước khi dùng.

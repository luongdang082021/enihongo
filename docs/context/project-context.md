# Bối cảnh dự án

Tóm tắt: enihongo là website tĩnh miễn phí giúp người Việt học tiếng Nhật từ con số 0, chạy trên GitHub Pages.

Trạng thái: đang dùng. Cập nhật: 2026-11-05.

## Mục tiêu

- Chia sẻ miễn phí để thu hút thêm người học.
- Phân cấp khóa học. Hiện chỉ mở khóa cơ bản (bảng chữ cái hiragana); các khóa khác khóa lại và hiển thị "Sắp ra mắt".
- Trải nghiệm nhẹ và nhanh trên điện thoại thường và mạng yếu.

## Đối tượng người học

- Người Việt mới bắt đầu, chưa biết bảng chữ cái.
- Giải thích bằng tiếng Việt, chữ Nhật trong bài chỉ dùng hiragana ở giai đoạn đầu.
- Dùng chủ yếu trên điện thoại, nên giao diện ưu tiên màn hình hẹp (khoảng 400 px).

## Hiện trạng

- Có: game quiz Hiragana Dojo (5 hiệp × 20 câu), một file `index.html` chạy độc lập. Đặc tả ở [`../product/hiragana-dojo-spec.md`](../product/hiragana-dojo-spec.md).
- Đã deploy bằng GitHub Pages từ nhánh `main`, thư mục gốc.
- Chưa có: trang chủ, danh sách khóa, bài học, tiến độ học.

## Ràng buộc

| Ràng buộc | Hệ quả |
|---|---|
| Chỉ hosting tĩnh (GitHub Pages) | Không có backend, không có bảng xếp hạng dùng chung, không có tài khoản |
| Miễn phí | Không dùng dịch vụ trả phí; phụ thuộc bên ngoài càng ít càng tốt |
| Trang nhẹ | Theo [`../planning/performance-budget.md`](../planning/performance-budget.md) |
| Nội dung công khai | Tự biên soạn, không sao chép giáo trình in |
| GitHub Pages không đổi được header cache | Dùng tên file có hash, có thể thêm service worker |

## Liên kết

- Lộ trình: [`../planning/roadmap.md`](../planning/roadmap.md)
- Cấu trúc site: [`../planning/information-architecture.md`](../planning/information-architecture.md)
- Nhật ký quyết định: [`../planning/decisions.md`](../planning/decisions.md)

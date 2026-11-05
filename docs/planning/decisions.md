# Nhật ký quyết định

Tóm tắt: các quyết định đã chốt và đang chờ chốt, theo thứ tự thời gian.

Trạng thái: đang dùng. Cập nhật: 2026-11-05.

Quy ước: không sửa quyết định cũ; nếu đổi hướng thì thêm dòng mới và ghi "thay thế D-xxx".

| Mã | Ngày | Quyết định | Trạng thái |
|---|---|---|---|
| D-001 | 2026-11-05 | Site là trang tĩnh, deploy bằng GitHub Pages từ nhánh `main`, thư mục gốc | Đã chốt |
| D-002 | 2026-11-05 | Bỏ bảng xếp hạng và backend ở giai đoạn này. Đề xuất cũ giữ ở [`archive/leaderboard-proposal.md`](archive/leaderboard-proposal.md) | Đã chốt |
| D-003 | 2026-11-05 | Chiến lược: miễn phí, chia sẻ rộng, phân cấp khóa học; chỉ mở khóa cơ bản, các khóa khác "Sắp ra mắt" | Đã chốt |
| D-004 | 2026-11-05 | Nội dung tự biên soạn, không sao chép giáo trình in | Đã chốt |
| D-005 | 2026-11-05 | Cách dựng trang: Eleventy 3 + GitHub Actions (không dùng HTML viết tay) | Đã chốt (2026-11-05) |
| D-006 | 2026-11-05 | Đường dẫn: giữ `luongdang082021.github.io/enihongo/`, chưa mua tên miền | Đã chốt (2026-11-05, theo giả định; đổi được sau bằng biến `PATH_PREFIX`) |
| D-007 | 2026-11-05 | Thẻ "Sắp ra mắt" dẫn tới đâu: repo GitHub (Star/Watch), Google Form, hoặc không dẫn | Chờ chốt |
| D-008 | 2026-11-05 | Giai đoạn 1: dựng khung và 3 bài mẫu (bài 1–3) để duyệt, rồi mới viết các bài còn lại | Đã chốt (2026-11-05) |
| D-009 | 2026-11-05 | Tiến độ học lưu bằng `localStorage`, có xuất/nhập JSON; không có tài khoản | Đề xuất |
| D-010 | 2026-11-05 | Analytics: chọn GoatCounter hoặc Cloudflare Web Analytics | Chờ chốt |

## Ghi chú cho D-002

Nếu sau này cần bảng xếp hạng: dùng ID ngẫu nhiên và mã khôi phục thay cho device fingerprint (fingerprint không ổn định, dễ trùng và có thể là dữ liệu cá nhân cần xin đồng ý). Lưu ý này chỉ để tham khảo, không phải kế hoạch hiện tại.

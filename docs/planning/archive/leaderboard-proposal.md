# Đề xuất bảng xếp hạng (đã gác)

Tóm tắt: phương án lưu bảng xếp hạng người chơi với backend bên ngoài; gác lại theo D-002.

Trạng thái: đã gác, không triển khai. Cập nhật: 2026-11-05.

## Vì sao gác

Chiến lược hiện tại là trang tĩnh thuần túy, miễn phí, tập trung vào khóa học. Bảng xếp hạng dùng chung cần backend, khiến vận hành và bảo trì phức tạp hơn.

## Nội dung đề xuất

- Backend: Supabase (Postgres + RLS + hàm RPC) được ưu tiên; thay thế: Cloudflare Worker + D1, Firebase Firestore. Gói miễn phí của Supabase có thể tạm dừng project khi lâu không dùng (cần kiểm tra điều khoản hiện tại).
- Định danh: `playerId` và `secret` ngẫu nhiên lưu trong `localStorage`, server chỉ lưu hash của secret; mã khôi phục để vào lại trên thiết bị khác; đổi tên cần secret.
- Không dùng device fingerprint để xác thực: không ổn định, dễ trùng, có thể là dữ liệu cá nhân.
- Dữ liệu: `players`, `scores` (mỗi người mỗi hiệp một dòng), view bảng xếp hạng tổng và theo hiệp. Chặn ghi trực tiếp, chỉ ghi qua RPC.
- Giao diện: hai cột trên desktop, hai tab trên điện thoại.
- Gian lận: mức A (kiểm tra ngưỡng, giới hạn tần suất) hoặc mức B (server phát seed và chấm lại), vì game chạy hoàn toàn ở trình duyệt nên điểm có thể bị giả.

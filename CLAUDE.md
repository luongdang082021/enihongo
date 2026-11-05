# enihongo

Website tĩnh miễn phí để người Việt học tiếng Nhật, chạy trên GitHub Pages (nhánh `main`, thư mục gốc).

Tài liệu đầy đủ nằm trong [`docs/`](docs/README.md). Trước khi làm việc, đọc:

- [`docs/agents/agent-guidelines.md`](docs/agents/agent-guidelines.md): quy tắc làm việc
- [`docs/context/project-context.md`](docs/context/project-context.md): bối cảnh và ràng buộc
- [`docs/planning/decisions.md`](docs/planning/decisions.md): quyết định đã chốt và đang chờ

Tóm tắt các điểm quan trọng:

- Trang tĩnh, không backend; giữ trang nhẹ ([`docs/planning/performance-budget.md`](docs/planning/performance-budget.md)).
- Giao diện và giải thích bằng tiếng Việt; chữ Nhật giai đoạn đầu chỉ dùng hiragana.
- Nội dung tự biên soạn, không sao chép giáo trình in.
- Mã nguồn trong `src/`, dựng bằng Eleventy (`npm run build:local`, `npm test`, `npm run size`), triển khai bằng GitHub Actions. `index.html` ở gốc repo là bản game cũ, giữ tạm tới khi Pages chuyển sang Actions. Dojo ở `src/luyen-tap/index.njk` ([`docs/product/hiragana-dojo-spec.md`](docs/product/hiragana-dojo-spec.md)).

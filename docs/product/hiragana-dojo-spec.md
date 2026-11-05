# Đặc tả Hiragana Dojo

Tóm tắt: game quiz hiragana 5 hiệp × 20 câu, một file `index.html` chạy độc lập, không backend.

Trạng thái: đang chạy (commit `d5eef0b`, 2026-11-05). Cập nhật: 2026-11-05.

## Các hiệp

| Hiệp | Nội dung | Cơ cấu 20 câu |
|---|---|---|
| 一 | Chữ cơ bản | k2r 7, r2k 6, type 3, odd 2, match 2 |
| 二 | Âm đục và bán đục | k2r 6, r2k 5, type 3, odd 2, match 1, voice 3 |
| 三 | Âm ghép | k2r 4, r2k 4, type 3, odd 2, match 1, size 3, wk2r 2, wtype 1 |
| 四 | Trường âm và âm ngắt | wk2r 6, wr2k 4, wtype 3, fill 4, mora 3 |
| 五 | Tổng hợp | k2r 3, r2k 3, type 3, wk2r 3, wr2k 2, wtype 2, fill 1, mora 1, odd 1, match 1 |

Thứ tự câu được xáo trộn; câu đầu luôn là `k2r` hoặc `wk2r` (dễ nhất).

## Dạng câu hỏi

| Mã | Tên | Cách chơi |
|---|---|---|
| k2r | Chữ → romaji | Nhìn chữ, chọn romaji (4 lựa chọn) |
| r2k | Romaji → chữ | Nhìn romaji, chọn chữ |
| type | Gõ romaji | Gõ cách đọc của chữ |
| match | Nối cặp | Nối 4 chữ với 4 cách đọc; đúng khi không nối sai lần nào |
| odd | Tìm chữ khác nhóm | Chọn chữ không thuộc hàng được liệt kê |
| voice | Dấu ゛ ゜ | Thêm hoặc bỏ dấu để ra chữ đúng |
| size | Âm ghép | Chọn đúng きょ (1 nhịp) giữa きょ, きよ, きゃ, しょ |
| wk2r | Từ → romaji | Chọn romaji đúng, đáp án sai là biến thể cố ý (thiếu hoặc thừa trường âm, âm ngắt) |
| wr2k | Romaji → từ | Chọn cách viết hiragana đúng |
| wtype | Gõ cả từ | Gõ romaji của từ |
| fill | Điền chữ thiếu | Điền っ hoặc nguyên âm kéo dài còn thiếu |
| mora | Đếm nhịp | Đếm số nhịp; đáp án nhiễu gồm cả số ký tự (bẫy với âm ghép) |

## Tính điểm

- Mỗi câu đúng: 100 điểm + thưởng tốc độ tối đa 50 (giảm dần tuyến tính theo thời gian, ngưỡng 10 giây cho câu chọn, 15 giây cho gõ chữ, 20 giây cho gõ từ, 25 giây cho nối cặp) + thưởng chuỗi `min(chuỗi, 10) × 5`.
- Sao theo tỷ lệ đúng: từ 95% được 3 sao, từ 80% được 2 sao, từ 60% được 1 sao.
- Điểm cao nhất mỗi hiệp lưu trong `localStorage`, khóa `hiragana-dojo-best`, dạng `{ "0": { "score": n, "stars": n }, … }`.
- Chế độ "luyện lại câu sai" không lưu kỷ lục.

## Quy tắc dữ liệu

- Chữ ぢ và づ có cách đọc trùng じ và ず, nên bị loại khỏi `r2k`, `odd`, `match` và không làm đáp án nhiễu cạnh じ, ず. Ở `voice` bỏ các chữ gốc ち và つ.
- Từ vựng chia theo nhịp (mora). Romaji tính từ dãy nhịp: っ làm đôi phụ âm kế tiếp (nếu sau là "ch" thì thêm "t": ví dụ いっちょ).
- Phát hiện trường âm: う sau âm kết thúc bằng u hoặc o, い sau i hoặc e, あ sau a, え sau e, お sau o. Ví dụ かいしゃ có い nhưng không phải trường âm.
- Dữ liệu từ: 20 từ trường âm, 19 từ âm ngắt, 17 từ âm ghép.
- Đáp án sai của từ do 6 phép biến đổi: bỏ っ, thêm っ, bỏ trường âm, thêm trường âm, đổi う↔お hoặc い↔え, đổi một chữ dễ nhầm.

## Nhập liệu romaji

Hàm chuẩn hóa chấp nhận kiểu gõ si, ti, tu, hu, zi, sya, tya, zya, jya, cya; bỏ khoảng trắng, dấu nháy và gạch ngang. Chữ を chấp nhận thêm "o", ん chấp nhận thêm "nn". Trường âm phải gõ theo chữ kana (おう là "ou", không chấp nhận "oo").

## Bàn phím và hành vi

- Phím 1 đến 4 chọn đáp án, Enter sang câu tiếp.
- Đúng ở các dạng ngắn (k2r, r2k, odd, voice, size, type, match): tự sang câu sau sau 1,3 giây. Các dạng có từ vựng chờ người chơi bấm tiếp để kịp đọc nghĩa.
- Chế độ sáng và tối theo hệ thống.

## Cấu trúc mã

Mã chia module trong `src/js/`: `dojo-mix.js` (kế hoạch câu hỏi cho chế độ tự chọn), `quiz-core.js` (dữ liệu chữ và từ, bộ sinh câu hỏi, không đụng DOM nên chạy được trong Node), `quiz-ui.js` (`mountQuiz`, giao diện chơi và kết quả dùng chung), `dojo.js` (menu 5 hiệp), `lesson.js` (flashcard, mini quiz, hoàn thành bài), `progress.js` (localStorage `enihongo:v1`, xuất/nhập JSON). Kiểm tra mô phỏng: `npm test` (`tools/check-quiz.mjs`).

## Dojo tự chọn (D-014)

Tab "Tự chọn bài" ở `/luyen-tap/`:

- Đơn vị chọn là khóa học: mỗi khóa có ô "Cả khóa" (hiện trạng thái một phần khi chỉ chọn vài bài), mở ra là danh sách bài để chọn riêng. Ngoài ra có chip chủ đề (nhãn `tags` của bài, tên ở `src/_data/topics.json`) cắt ngang các khóa; nút "Các bài đã học", "Chọn tất cả", "Bỏ chọn". Trộn được nhiều khóa, bài và chủ đề.
- Kho nội dung là `data/dojo-pool.json`, sinh khi build từ front matter các bài (bộ lọc `dojoPool`, mỗi bài có `course` lấy từ dữ liệu thư mục của khóa), tải khi mở tab. Từ có `quiz: false` bị loại.
- `src/js/dojo-mix.js` gom chữ và từ rồi lập kế hoạch đúng 20 câu: có cả chữ và từ thì trộn cả hai; chỉ chữ hoặc chỉ từ thì dùng dạng phù hợp; có chữ đục thì thêm `voice`, có chữ ghép thì thêm `size`.
- Điểm cao lưu trong `dojo` của `enihongo:v1`, khóa `m` + mã băm của tập bài đã chọn; 5 hiệp cố định giữ khóa `0` đến `4`.
- `?bai=<id>[,<id>]` chọn sẵn bài; trang bài học có liên kết "Luyện thêm bài này trong Dojo".
- Chưa làm: ưu tiên chữ trả lời sai ở lượt sau, Katakana và Kanji (chờ khóa tương ứng).

## Kiểm tra mô phỏng

Mỗi lần sửa bộ sinh câu hỏi, chạy mô phỏng 300 lượt cho cả 5 hiệp và xác nhận:

- Mỗi hiệp đúng 20 câu, câu đầu là `k2r` hoặc `wk2r`.
- Câu chọn có đúng 4 lựa chọn, không trùng, có chứa đáp án.
- Sau chuẩn hóa romaji, các lựa chọn vẫn khác nhau.
- Câu `match` có 4 cặp với romaji khác nhau.
- Câu `odd` không có hai lựa chọn cùng cách đọc.

Bộ kiểm tra này chưa nằm trong repo; kế hoạch đưa vào `tools/` ở giai đoạn 1.

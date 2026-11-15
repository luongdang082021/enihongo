# Đặc tả Dojo

Tóm tắt: game quiz 20 câu mỗi lượt cho mọi khóa chữ (Hiragana, Katakana). Chọn khóa, Dojo trộn chữ và từ của khóa, câu sai được hỏi lại ở dạng khác. Chạy trên trình duyệt, không backend.

Trạng thái: đang chạy. Cập nhật: 2026-11-13 (D-021: bỏ 5 hiệp cố định, thêm soạn từ bằng ô chữ, câu nhắc lại, kho từ vựng bổ sung).

Tên file giữ nguyên `hiragana-dojo-spec.md` để các liên kết cũ không hỏng; nội dung nay là đặc tả Dojo chung (D-014).

## Cách chơi

- `/luyen-tap/` (và `/en/practice/`) chỉ có một màn chọn: mỗi khóa học một ô chọn, mặc định chọn hết, rồi bấm "Bắt đầu 20 câu". Không còn tab và 5 hiệp Hiragana cố định (D-021).
- Phạm vi là **khóa học** (D-014): Dojo lấy toàn bộ chữ và từ của khóa, cộng kho từ vựng bổ sung của khóa. Chọn nhiều khóa thì trộn.
- `?khoa=<id>` chọn sẵn một khóa; trang bài học có liên kết "Luyện cả khóa trong Dojo".

## Dạng câu hỏi

| Mã | Tên | Cách chơi |
|---|---|---|
| k2r | Chữ → romaji | Nhìn chữ, chọn romaji (4 lựa chọn) |
| r2k | Romaji → chữ | Nhìn romaji, chọn chữ |
| type | Gõ romaji | Gõ cách đọc của chữ |
| match | Nối cặp | Nối 4 chữ với 4 cách đọc; đúng khi không nối sai lần nào |
| odd | Tìm chữ khác nhóm | Chọn chữ không thuộc hàng được liệt kê (chỉ còn dùng khi cần, Dojo không rút) |
| size | Âm ghép | Chọn đúng きょ (1 nhịp) giữa きょ, きよ, きゃ, しょ |
| wk2r | Từ → romaji | Chọn romaji đúng, đáp án sai là biến thể cố ý (thiếu hoặc thừa trường âm, âm ngắt) |
| wr2k | Romaji → từ | Chọn cách viết đúng của từ |
| wtype | Gõ cả từ | Gõ romaji của từ |
| fill | Điền chữ thiếu | Điền っ/ッ hoặc nguyên âm kéo dài còn thiếu |
| mora | Đếm nhịp | Đếm số nhịp; đáp án nhiễu gồm cả số ký tự (bẫy với âm ghép) |
| compose | Soạn từ bằng ô chữ | Thấy romaji (và nghĩa), chạm các ô chữ theo đúng thứ tự để viết từ |
| wk2m | Từ → nghĩa | Thấy từ kana, chọn nghĩa đúng (D-022, khóa có nghĩa từ) |
| wm2k | Nghĩa → từ | Thấy nghĩa, chọn từ kana đúng |
| order | Sắp xếp câu | Thấy nghĩa của câu, chạm các từ theo đúng thứ tự (dùng chung giao diện ô chữ, ô rộng; có thể có một trợ từ thừa) |
| particle | Điền trợ từ | Câu bị khuyết một trợ từ (は が を に で へ と も の か), chọn 1 trong 4 |
| sk2m | Câu → nghĩa | Thấy câu kana và romaji, chọn nghĩa đúng (cần từ 4 câu trở lên) |

Câu hỏi nhắc lại của câu (`src.s`) chuyển giữa `order`, `particle`, `sk2m`; của từ có thêm `wk2m`, `wm2k`.

Đã bỏ dạng `voice` (thêm hoặc bỏ dấu ゛ ゜) vì quá đơn giản (D-021). Các bài đục âm trong khóa dùng `compose` thay thế.

### Soạn từ bằng ô chữ (`compose`)

- Số ô trống bằng số nhịp của đáp án. Ô chữ gồm các nhịp cần dùng và 2 đến 3 ô thừa; ô thừa lấy từ chính các phép biến đổi lỗi (chữ dễ nhầm, đục âm, thiếu hoặc thừa trường âm, ッ), không trùng ô cần dùng.
- Mỗi nhịp là một ô: きゃ là một ô, っ/ッ và ー là ô riêng.
- Chạm ô để đặt, chạm ô đã đặt hoặc "Gỡ chữ" (phím Backspace) để gỡ. Nút Kiểm tra bật khi đã đủ ô. Chấm đúng khi chuỗi kana khớp đáp án.
- Có từ thì ra từ (kèm nghĩa); chỉ có chữ thì ghép 2 đến 3 chữ ngẫu nhiên thành âm tiết vô nghĩa, không dùng ん, を (tránh nhập nhằng cách đọc).

## Chọn câu hỏi (ngẫu nhiên có kiểm soát)

`dojoSession(chars, words, {weak})` trong `quiz-core.js`:

- Mỗi lượt 20 câu. Mỗi vị trí chọn dạng câu theo **trọng số ngẫu nhiên** trong các dạng hợp với nội dung đang có (chỉ chữ, chỉ từ, hay cả hai), có giới hạn số câu mỗi dạng (match 1, mora 2, size và fill 3, compose 5…) và không để ba câu cùng dạng liền nhau. Câu đầu luôn là `k2r` hoặc `wk2r` (dễ nhất).
- Chữ và từ rút không lặp trong một lượt (hết thì rút lại). Xác suất rút tỉ lệ `1 + điểm yếu`.
- Nội dung: chữ của khóa + từ của các bài + kho từ vựng bổ sung (`src/_data/vocab.js`, khoảng 265 từ Hiragana và 125 từ Katakana).

## Câu nhắc lại

- Khi trả lời sai, Dojo chèn một câu **cùng chữ hoặc từ nhưng dạng khác** sau 1 đến 3 câu. Nếu lại sai thì nhắc thêm một lần nữa (tối đa 2 lần mỗi câu gốc, tối đa 10 câu nhắc lại mỗi lượt).
- Câu nhắc lại có nhãn "Nhắc lại", chỉ cộng điểm; **không tính vào số câu và sao** (sao theo 20 câu gốc).
- Nối cặp sai: nhắc lại đúng những chữ nối nhầm. Từ sai: đổi giữa nhận mặt (wr2k, wk2r), gõ, soạn từ, đếm nhịp, điền chữ.
- "Luyện lại câu sai" ở màn kết quả không sinh câu nhắc lại và không lưu kỷ lục.

## Chữ hay sai (giữa các lượt)

- `enihongo:v1.weak` là bảng `{ kana: điểm }`, điểm 1 đến 6: sai +2, đúng −1 (về 0 thì xóa). Câu nhắc lại cũng được tính.
- Lượt sau, chữ và từ có điểm cao được rút nhiều hơn. Kiểm tra mô phỏng: chữ ぬ có điểm 6 xuất hiện trong khoảng 55 đến 60% lượt, so với khoảng 10% khi không có điểm.
- Dữ liệu nằm trong tệp xuất/nhập tiến độ.

## Tính điểm

- Mỗi câu đúng: 100 điểm + thưởng tốc độ tối đa 50 (giảm dần tuyến tính theo thời gian, ngưỡng 10 giây cho câu chọn, 15 giây cho gõ chữ, 20 giây cho gõ từ, 25 giây cho nối cặp, 40 giây cho soạn từ) + thưởng chuỗi `min(chuỗi, 10) × 5`.
- Sao theo tỷ lệ đúng của 20 câu gốc: từ 95% được 3 sao, từ 80% được 2 sao, từ 60% được 1 sao.
- Điểm cao lưu trong `dojo` của `enihongo:v1`, khóa `m` + mã băm của tập khóa đã chọn. Các khóa `0` đến `4` của 5 hiệp cũ còn trong dữ liệu người dùng nhưng không còn dùng.

## Quy tắc dữ liệu

- Chữ ぢ và づ có cách đọc trùng じ và ず, nên bị loại khỏi `r2k`, `odd`, `match`, ô chữ và không làm đáp án nhiễu cạnh じ, ず. Kho từ vựng bổ sung không dùng ぢ づ ヂ ヅ ヲ.
- Từ vựng chia theo nhịp (mora). Romaji tính từ dãy nhịp: っ làm đôi phụ âm kế tiếp (nếu sau là "ch" thì thêm "t"), ー lặp nguyên âm trước.
- Phát hiện trường âm: う sau âm kết thúc bằng u hoặc o, い sau i hoặc e, あ sau a, え sau e, お sau o. Ví dụ かいしゃ có い nhưng không phải trường âm.
- Đáp án sai của từ do 6 phép biến đổi: bỏ っ, thêm っ, bỏ trường âm, thêm trường âm, đổi う↔お hoặc い↔え, đổi một chữ dễ nhầm.
- Kho từ vựng bổ sung: `src/_data/vocab.js`, mỗi từ `kana:nghĩa Việt:nghĩa Anh`, tự biên soạn (D-004). Romaji sinh tự động. `tools/check-quiz.mjs` kiểm tra chỉ dùng chữ của khóa, sinh được romaji, đủ hai nghĩa, không trùng. Bộ lọc `dojoPool` gắn kho này vào `data/dojo-pool.json` như một "bài" chỉ có từ của mỗi khóa.

## Nhập liệu romaji

Hàm chuẩn hóa chấp nhận kiểu gõ si, ti, tu, hu, zi, sya, tya, zya, jya, cya; bỏ khoảng trắng, dấu nháy và gạch ngang. Chữ を chấp nhận thêm "o", ん chấp nhận thêm "nn". Trường âm phải gõ theo chữ kana (おう là "ou", không chấp nhận "oo").

## Bàn phím và hành vi

- Phím 1 đến 4 chọn đáp án, Enter sang câu tiếp, Backspace gỡ ô chữ cuối ở câu soạn từ.
- Đúng ở các dạng ngắn (k2r, r2k, odd, size, type, match): tự sang câu sau sau 1,3 giây. Các dạng có từ vựng chờ người chơi bấm tiếp để kịp đọc nghĩa.
- Chế độ sáng và tối theo hệ thống.

## Cấu trúc mã

`src/js/`: `quiz-core.js` (dữ liệu chữ và từ, bộ sinh câu hỏi, `buildLesson` cho mini quiz, `dojoSession` cho Dojo; không đụng DOM nên chạy được trong Node), `quiz-ui.js` (`mountQuiz`, giao diện chơi, ô chữ, câu nhắc lại, kết quả), `dojo.js` (màn chọn khóa), `dojo-mix.js` (gom chữ và từ, khóa điểm cao), `lesson.js` (flashcard, mini quiz, hoàn thành bài), `progress.js` (`localStorage` `enihongo:v1`, xuất/nhập JSON, bảng `weak`).

## Kiểm tra

`npm test` (`tools/check-quiz.mjs`, `tools/check-i18n.mjs`) mô phỏng: 20 câu hợp lệ cho mọi tập khóa, câu đầu dễ, không ba câu cùng dạng liền nhau, ô chữ đủ và có ô thừa, mỗi câu sai có câu nhắc lại cùng chữ khác dạng (tối đa hai lần), chữ hay sai được ưu tiên, kho từ vựng hợp lệ, và câu hỏi tiếng Anh không lẫn tiếng Việt. Trên trình duyệt: `tools/e2e-dojo.py` (cần `npm run build:local` và `python3 -m http.server 8123` trong `_site`).

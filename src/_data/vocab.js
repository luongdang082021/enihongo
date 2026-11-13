/* Kho từ vựng bổ sung cho Dojo, tự biên soạn. Mỗi từ: kana:nghĩa tiếng Việt:nghĩa tiếng Anh.
   Chỉ dùng chữ của chính khóa đó (Hiragana hoặc Katakana). Không dùng ぢ づ ヂ ヅ ヲ để tránh nhập nhằng cách đọc.
   Romaji được sinh tự động từ kana (tools/check-quiz.mjs kiểm tra mọi từ). */
const parse = (s) =>
  s.split('|').map((x) => {
    const [kana, vi, en] = x.split(':');
    return { kana: kana.trim(), vi: vi.trim(), en: en.trim(), quiz: true };
  });

const hiragana = [
  // gia đình, con người
  'あに:anh trai (của mình):my older brother|あね:chị gái (của mình):my older sister|いもうと:em gái:younger sister|おとうと:em trai:younger brother|ちち:bố (của mình):my father|はは:mẹ (của mình):my mother|こども:trẻ con:child|ともだち:bạn bè:friend|ひと:người:person|おとこ:đàn ông, nam:man|おんな:phụ nữ, nữ:woman|わたし:tôi:I, me|あなた:bạn:you|かぞく:gia đình:family|みんな:mọi người:everyone',
  // đồ ăn, thức uống
  'たまご:trứng:egg|ごはん:cơm, bữa ăn:rice, meal|さかな:cá:fish|にく:thịt:meat|やさい:rau:vegetables|くだもの:trái cây:fruit|りんご:táo:apple|みかん:quýt:mandarin orange|すし:sushi:sushi|うどん:mì udon:udon noodles|みそしる:súp miso:miso soup|おにぎり:cơm nắm:rice ball|おかし:bánh kẹo:sweets|みず:nước:water|さけ:rượu sake:sake|しお:muối:salt|さとう:đường:sugar|しょうゆ:xì dầu:soy sauce|あさごはん:bữa sáng:breakfast|ひるごはん:bữa trưa:lunch|ばんごはん:bữa tối:dinner|おなか:bụng:stomach, belly|たべもの:đồ ăn:food|のみもの:đồ uống:drink|ぶたにく:thịt lợn:pork|とりにく:thịt gà:chicken meat|ぎゅうにく:thịt bò:beef|おいしい:ngon:delicious',
  // động vật
  'いぬ:chó:dog|ねこ:mèo:cat|とり:chim:bird|うま:ngựa:horse|うし:bò:cow|さる:khỉ:monkey|うさぎ:thỏ:rabbit|くま:gấu:bear|ぞう:voi:elephant|とら:hổ:tiger|ひつじ:cừu:sheep|かえる:ếch:frog|へび:rắn:snake|むし:côn trùng:insect|ちょうちょう:bướm:butterfly|いるか:cá heo:dolphin|くじら:cá voi:whale|ぶた:lợn:pig|にわとり:gà:chicken',
  // thiên nhiên, thời tiết, mùa
  'そら:bầu trời:sky|うみ:biển:sea|やま:núi:mountain|かわ:sông:river|はな:hoa:flower|ゆき:tuyết:snow|あめ:mưa:rain|かぜ:gió:wind|くも:mây:cloud|ほし:ngôi sao:star|つき:mặt trăng:moon|たいよう:mặt trời:sun|にじ:cầu vồng:rainbow|もり:rừng:forest|いし:đá:stone|かみなり:sấm sét:thunder|はれ:trời nắng:sunny weather|くもり:trời nhiều mây:cloudy weather|はる:mùa xuân:spring|なつ:mùa hè:summer|あき:mùa thu:autumn|ふゆ:mùa đông:winter|きせつ:mùa:season|あつい:nóng:hot|さむい:lạnh:cold|すずしい:mát mẻ:cool|あたたかい:ấm áp:warm',
  // màu sắc, cơ thể
  'あか:đỏ:red|あお:xanh dương:blue|しろ:trắng:white|くろ:đen:black|きいろ:vàng:yellow|みどり:xanh lá:green|あたま:đầu:head|かお:mặt:face|みみ:tai:ear|くち:miệng:mouth|て:tay:hand|あし:chân:foot, leg|からだ:cơ thể:body|こころ:trái tim, tâm hồn:heart, mind',
  // nơi chốn, phương tiện
  'いえ:nhà:house|えき:ga tàu:station|みせ:cửa hàng:shop|みち:con đường:road|まち:thị trấn:town|くに:đất nước:country|こうえん:công viên:park|ぎんこう:ngân hàng:bank|ゆうびんきょく:bưu điện:post office|としょかん:thư viện:library|びじゅつかん:bảo tàng mỹ thuật:art museum|へや:căn phòng:room|にわ:khu vườn:garden|だいどころ:nhà bếp:kitchen|おふろ:bồn tắm, phòng tắm:bath|げんかん:cửa vào nhà:entrance hall|まど:cửa sổ:window|かいだん:cầu thang:stairs|くうこう:sân bay:airport|ちかてつ:tàu điện ngầm:subway|でんしゃ:tàu điện:train|くるま:ô tô:car|じどうしゃ:ô tô:automobile|ふね:thuyền, tàu:ship',
  // đồ vật, văn hóa
  'ほん:sách:book|かばん:cặp, túi:bag|つくえ:bàn học:desk|いす:ghế:chair|とけい:đồng hồ:clock, watch|かさ:ô, dù:umbrella|くつ:giày:shoes|ぼうし:mũ:hat|めがね:kính mắt:glasses|さいふ:ví:wallet|かぎ:chìa khóa:key|でんわ:điện thoại:telephone|てがみ:thư:letter|じしょ:từ điển:dictionary|えんぴつ:bút chì:pencil|はさみ:kéo:scissors|ふく:quần áo:clothes|くすり:thuốc:medicine|おかね:tiền:money|おもちゃ:đồ chơi:toy|しんぶん:báo:newspaper|おんがく:âm nhạc:music|うた:bài hát:song|えほん:sách tranh thiếu nhi:picture book|まんが:truyện tranh:comic|しゅみ:sở thích:hobby|ゆめ:giấc mơ:dream|ことば:từ ngữ, ngôn ngữ:word, language|にほんご:tiếng Nhật:Japanese language',
  // thời gian
  'あさ:buổi sáng:morning|ひる:buổi trưa:noon|よる:buổi tối:night|ゆうがた:chiều tối:evening|いま:bây giờ:now|あした:ngày mai:tomorrow|まいにち:mỗi ngày:every day|こんしゅう:tuần này:this week|らいしゅう:tuần sau:next week|せんしゅう:tuần trước:last week|ことし:năm nay:this year|らいねん:năm sau:next year|きょねん:năm ngoái:last year|たんじょうび:sinh nhật:birthday|やすみ:ngày nghỉ:holiday, day off|しゅうまつ:cuối tuần:weekend|じかん:thời gian:time|いつも:luôn luôn:always|ときどき:thỉnh thoảng:sometimes|もうすぐ:sắp:soon',
  // đếm
  'ひとつ:một cái:one thing|ふたつ:hai cái:two things|よっつ:bốn cái:four things|いつつ:năm cái:five things|むっつ:sáu cái:six things|ななつ:bảy cái:seven things|ここのつ:chín cái:nine things|とお:mười cái:ten things|ひとり:một người:one person|ふたり:hai người:two people',
  // tính từ, trạng từ
  'たかい:cao, đắt:tall, expensive|やすい:rẻ:cheap|ひろい:rộng:spacious|せまい:chật:narrow|あたらしい:mới:new|ふるい:cũ:old|いい:tốt:good|わるい:xấu, tệ:bad|たのしい:vui:fun|うれしい:vui mừng:happy|かなしい:buồn:sad|おもしろい:thú vị:interesting|むずかしい:khó:difficult|やさしい:dễ, hiền:easy, kind|ながい:dài:long|みじかい:ngắn:short|はやい:nhanh, sớm:fast, early|おそい:chậm, muộn:slow, late|おもい:nặng:heavy|かるい:nhẹ:light|あかるい:sáng:bright|くらい:tối:dark|かわいい:dễ thương:cute|つよい:mạnh:strong|よわい:yếu:weak|すき:thích:to like|きらい:ghét:to dislike|げんき:khỏe mạnh:healthy, energetic|しずか:yên tĩnh:quiet|にぎやか:náo nhiệt:lively|きれい:đẹp, sạch:pretty, clean|べんり:tiện lợi:convenient|だいじょうぶ:ổn, không sao:all right|だめ:không được:no good|ほんとう:thật:true, real|たいへん:vất vả, nghiêm trọng:hard, serious|たくさん:nhiều:a lot|すこし:một chút:a little|ぜんぶ:tất cả:all|いろいろ:nhiều loại:various',
  // động từ, câu chào
  'たべる:ăn:to eat|のむ:uống:to drink|みる:xem, nhìn:to see, watch|きく:nghe, hỏi:to listen, ask|よむ:đọc:to read|かく:viết:to write|はなす:nói chuyện:to speak|いく:đi:to go|くる:đến:to come|する:làm:to do|ねる:ngủ:to sleep|おきる:thức dậy:to wake up|あそぶ:chơi:to play|およぐ:bơi:to swim|はしる:chạy:to run|あるく:đi bộ:to walk|まつ:đợi:to wait|かう:mua:to buy|うる:bán:to sell|つくる:làm, chế tạo:to make|あう:gặp:to meet|わかる:hiểu:to understand|しる:biết:to know|おしえる:dạy, chỉ:to teach|ならう:học (được dạy):to learn|べんきょう:học tập:study|しごと:công việc:work|しつもん:câu hỏi:question|こたえ:câu trả lời:answer|すみません:xin lỗi, xin phép:excuse me, sorry|おはよう:chào buổi sáng:good morning|さようなら:tạm biệt:goodbye|おやすみ:chúc ngủ ngon:good night|いただきます:xin mời (trước khi ăn):said before eating|ごちそうさま:cảm ơn bữa ăn:said after eating|はじめまして:rất vui được gặp:nice to meet you|よろしく:mong được giúp đỡ:pleased to meet you|はい:vâng:yes|いいえ:không:no'
].join('|');

const katakana = [
  // đồ ăn, thức uống
  'コーヒー:cà phê:coffee|ジュース:nước ép:juice|ビール:bia:beer|ミルク:sữa:milk|パン:bánh mì:bread|ケーキ:bánh ngọt:cake|アイス:kem:ice cream|チーズ:phô mai:cheese|バナナ:chuối:banana|トマト:cà chua:tomato|サラダ:salad:salad|スープ:súp:soup|ピザ:pizza:pizza|カレー:cà ri:curry|ラーメン:mì ramen:ramen|ハンバーガー:hamburger:hamburger|サンドイッチ:bánh sandwich:sandwich|チョコレート:sô cô la:chocolate|レストラン:nhà hàng:restaurant|メニュー:thực đơn:menu|ナイフ:dao:knife|フォーク:nĩa:fork|スプーン:thìa:spoon',
  // công nghệ, giải trí, thể thao
  'テレビ:ti vi:television|ラジオ:radio:radio|カメラ:máy ảnh:camera|パソコン:máy tính cá nhân:personal computer|コンピューター:máy tính:computer|スマホ:điện thoại thông minh:smartphone|メール:thư điện tử:email|インターネット:internet:internet|ゲーム:trò chơi điện tử:video game|ニュース:tin tức:news|ドラマ:phim truyền hình:TV drama|アニメ:phim hoạt hình Nhật:anime|ギター:đàn ghita:guitar|ピアノ:đàn piano:piano|コンサート:buổi hòa nhạc:concert|カラオケ:karaoke:karaoke|ビデオ:video:video|ロボット:rô bốt:robot|スポーツ:thể thao:sports|サッカー:bóng đá:soccer|テニス:quần vợt:tennis|ゴルフ:gôn:golf|スキー:trượt tuyết:skiing|プール:hồ bơi:swimming pool|バスケットボール:bóng rổ:basketball|ボール:quả bóng:ball',
  // giao thông, nơi chốn
  'バス:xe buýt:bus|タクシー:taxi:taxi|トラック:xe tải:truck|バイク:xe máy:motorbike|ホテル:khách sạn:hotel|デパート:cửa hàng bách hóa:department store|スーパー:siêu thị:supermarket|コンビニ:cửa hàng tiện lợi:convenience store|ビル:tòa nhà:building|エレベーター:thang máy:elevator|エスカレーター:thang cuốn:escalator|トイレ:nhà vệ sinh:toilet|ドア:cửa ra vào:door|テーブル:bàn ăn:table|ソファー:ghế sofa:sofa|ベッド:giường:bed|カーテン:rèm cửa:curtain',
  // học tập, quần áo, đồ dùng
  'ノート:vở:notebook|ペン:bút:pen|ボールペン:bút bi:ballpoint pen|テスト:bài kiểm tra:test|クラス:lớp học:class|レポート:báo cáo:report|アルバイト:việc làm thêm:part-time job|シャツ:áo sơ mi:shirt|ズボン:quần dài:trousers|スカート:váy:skirt|セーター:áo len:sweater|コート:áo khoác:coat|ネクタイ:cà vạt:tie|ジーンズ:quần jean:jeans|スーツ:bộ vest:suit|バッグ:túi xách:bag|ポケット:túi áo, túi quần:pocket|タオル:khăn tắm:towel|シャワー:vòi sen:shower|シャンプー:dầu gội:shampoo|ティッシュ:khăn giấy:tissue|パーティー:bữa tiệc:party|プレゼント:món quà:present|カード:thẻ:card|チケット:vé:ticket|パスポート:hộ chiếu:passport',
  // địa danh
  'アメリカ:Mỹ:America|イギリス:Anh:United Kingdom|フランス:Pháp:France|ドイツ:Đức:Germany|ロシア:Nga:Russia|インド:Ấn Độ:India|タイ:Thái Lan:Thailand|ベトナム:Việt Nam:Vietnam|ブラジル:Brazil:Brazil|カナダ:Canada:Canada|オーストラリア:Úc:Australia|ニューヨーク:New York:New York|ロンドン:Luân Đôn:London|パリ:Pa-ri:Paris|ハノイ:Hà Nội:Hanoi|ホーチミン:Hồ Chí Minh:Ho Chi Minh City|アジア:châu Á:Asia|ヨーロッパ:châu Âu:Europe|アフリカ:châu Phi:Africa',
  // động vật, tự nhiên, khác
  'ライオン:sư tử:lion|パンダ:gấu trúc:panda|ペンギン:chim cánh cụt:penguin|ゴリラ:khỉ đột:gorilla|コアラ:gấu koala:koala|カンガルー:chuột túi:kangaroo|ペット:thú cưng:pet|バラ:hoa hồng:rose|チューリップ:hoa tulip:tulip|ガス:ga:gas|エネルギー:năng lượng:energy|ピンク:màu hồng:pink|グリーン:màu xanh lá:green|ブルー:màu xanh dương:blue'
].join('|');

export default { hiragana: parse(hiragana), katakana: parse(katakana) };

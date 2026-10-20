# Spec: Thiệp hoa chúc Pành ngày 20/10

Ngày: 2026-10-20
Trạng thái: Đã triển khai và kiểm tra local; còn các kiểm chứng thiết bị/hosting được ghi trong plan. Người dùng đã cho phép commit/push; không yêu cầu deploy.
Điều chỉnh thực thi: người dùng cấm dùng worktree, cho phép subagent; làm trong checkout hiện tại trên nhánh `feature/womens-day-landing`.
Quyết định đã chốt: Âm thanh tương tác nhẹ luôn sẵn sàng, không có nút bật/tắt âm và không nhạc nền (người dùng xác nhận ngày 2026-10-20).
Route mới: `/20-10` (chấp nhận cả `/20-10/`). No-scroll bắt buộc theo AGENTS.md; bản cập nhật này thay thế thiết kế trang dài trước đó.
Route hiện tại: `/` — thiệp chúc mừng KOC.

## 1. Mục tiêu và phạm vi

Thêm một landing page chúc Ngày Phụ nữ Việt Nam dành cho Pành trong cùng dự án. Trang phải có lời chúc ấm áp, hài hước, nhiều chuyển động hoa đẹp và các tương tác tạo bất ngờ. Người xem mở link trên điện thoại là thấy thiệp và có thể chuyển các mặt để đọc đủ lời chúc, nhận hoa, xem ảnh; mọi mặt đều nằm trong cùng viewport.

Đặc điểm chính: một chiếc thiệp hoa đang sống, ảnh Pành ở trung tâm, vườn hoa ở hai góc, cánh hoa bay và một màn bung bó hoa khi người xem nhấn nút.

Giữ nguyên nội dung, URL, âm thanh và các tương tác của trang KOC. Không thêm backend, đăng nhập, thu thập dữ liệu, chỉnh sửa dự án automation hay tự động chuyển route theo ngày. Thiệp tiếp tục sử dụng được sau ngày 20/10; nội dung không gắn năm.

Người nhận mặc định là Pành, dùng ảnh `public/customer.webp` đã có. Chữ ký là bot, không tự đặt tên người gửi hoặc suy diễn quan hệ tình cảm.

Ảnh bổ sung do người dùng cung cấp: `C:/Users/ADMIN/Downloads/Gemini_Generated_Image_sdwjj5sdwjj5sdwj.png`, người gửi mặc vest đang đưa một bông hồng đỏ về phía máy ảnh. Dùng ảnh này cho khoảnh khắc người tặng hoa xuất hiện sau lần nhận hoa đầu tiên, không thay ảnh người nhận ở phần lời chúc. Đây là phương án bố trí bổ sung để người dùng xem xét trong bản nháp.

## 2. Hiện trạng đã kiểm tra

- Dự án dùng React 19, TypeScript, Vite 6, Tailwind CSS 4.
- `src/App.tsx` chứa toàn bộ trang KOC, chưa có router.
- `src/main.tsx` tải App và `src/style.css`.
- `src/style.css` có selector toàn cục và khóa cuộn ở html/body/root; cần giới hạn phạm vi để trang mới cuộn được.
- Có sẵn ảnh Pành, logo bot, âm thanh và hook `useSoundEffects`.
- `index.html` chứa metadata của trang KOC; chưa có cấu hình Vercel trong checkout được kiểm tra.
- Script hiện có: `dev`, `build`, `preview`. Không có script `test`, `typecheck` hoặc `lint` riêng.

## 3. Các phương án và quyết định

| Phương án | Lợi ích | Đánh đổi |
| --- | --- | --- |
| Một HTML, chọn trang theo pathname | Ít thay đổi cấu hình build | Metadata ban đầu giống nhau; cần fallback khi mở link trực tiếp |
| Hai HTML đầu vào Vite, dùng chung React entry — chọn phương án này | Metadata riêng ngay trong HTML; build tạo thư mục route thật; giữ trang gốc | Thêm HTML entry và cấu hình build |
| Thêm thư viện router và prerender | Phù hợp khi có nhiều trang và điều hướng phức tạp | Tăng phụ thuộc và công việc cho hai thiệp tĩnh |

Chọn hai HTML đầu vào, không thêm thư viện router hoặc animation. `App.tsx` chọn component theo pathname đã chuẩn hóa dấu `/` cuối. Liên kết giữa các trang, nếu cần, dùng thẻ a bình thường, không xây cơ chế điều hướng SPA.

Hiệu ứng dùng SVG và CSS, với React quản lý trạng thái tương tác. Không dùng video nền, WebGL hoặc thư viện particle trong phạm vi này.

## 4. Nội dung chính thức

Thứ tự trải nghiệm trong khung no-scroll:

1. Header bot và nút chuyển động; tiêu đề thiệp luôn có tên truy cập đầy đủ.
2. Mặt 1 — Chiếc thiệp: ảnh Pành, lời mở đầu, nút đọc lời chúc và nhận hoa.
3. Mặt 2 — Lời chúc: toàn bộ ba đoạn đã chốt, lời mở đầu, lời kết và chữ ký. Khi không vừa, chia phần theo kích thước thực tế với nút Đoạn trước/Đoạn sau; không mất chữ, không cuộn hoặc thu nhỏ chữ.
4. Mặt 3 — Nhận hoa: bó hoa/lời khen, bot ba lần và các nút tương tác. Nhận hoa mở quyền xem ảnh người giao hoa.
5. Mặt 4 — Người giao hoa: ảnh ngang nguyên bản và lời nhắn. Trước khi nhận hoa, mặt này có lời mời nhận hoa thay cho ảnh.
6. Nút Mặt trước/Mặt tiếp theo luôn ở đáy khung, cùng tên mặt và số thứ tự. Chuyển mặt không đổi route, không phát âm và không xóa trạng thái quà/bot.
7. Footer chữ ký được lặp ở mặt lời chúc để vẫn đọc được khi bố cục thấp ẩn footer trang trí.

Lời chúc:

> Chúc Pành luôn xinh đẹp, ví luôn có tiền, đặt món nào cũng ngon và chụp tấm nào cũng đẹp ngay từ lần đầu!
>
> Mong Pành bớt gặp chuyện đau đầu, gặp nhiều chuyện buồn cười, và luôn có người thương cả những hôm hơi khó ở.
>
> Riêng hôm nay, cứ thoải mái nhận hoa, nhận quà, nhận lời khen. Ai nhờ làm gì thì… để mai tính! 💅

Nút chính: “Nhận hoa, khỏi khách sáo 🌷”.
Nút phụ: “Khen thêm câu nữa 😌”.

Lời kết: “Chúc Pành được cưng cả năm, chứ riêng hôm nay thì ít quá. ♡”
Chữ ký: “Thân ái, bot chăm chỉ của bạn 🤖”.

Danh sách lời khen, mỗi lần bấm sang câu kế tiếp rồi quay vòng:

- “Đẹp vậy rồi, đề nghị bớt khiêm tốn!”
- “Hôm nay Pành đúng. Bot không nhận khiếu nại.”
- “Chúc tiền vào như thông báo nhóm chat. Đều và nhiều.”
- “Nhan sắc này xứng đáng được nghỉ một hôm để ăn mừng!”
- “Việc khó để mai. Hôm nay Pành bận được cưng.”
- “Bot đã kiểm tra: Pành xứng đáng nhận thêm một món quà.”

Không đưa nội dung thắng KOC, hai con quỷ hoặc số liệu sheet vào trang mới.

## 5. Thiết kế và responsive — no-scroll

- Bảng màu giữ nguyên: kem #FFF8F0, hồng #F6ABC4, tím #8652B8, chữ #45253D, lá #7B9B72, vàng #F2C768. Hoa SVG cùng phong cách, ảnh polaroid và chi tiết băng dính.
- Layout chung viewport.css khóa document/root trong 100dvh. Page dùng grid header / nội dung minmax(0,1fr) / footer; card có heading, vùng mặt thiệp linh hoạt và điều hướng cố định 44px. Không có khung cuộn bên trong.
- Ở mobile, mặt đầu có ảnh giữa thiệp; desktop cao đủ dùng ảnh và lời mở đầu hai cột. Màn hình thấp giảm khoảng cách, hình trang trí và chuyển bố cục; không scale toàn bộ page.
- Ở viewport rất nhỏ, giữ ảnh trong mặt đầu và dùng điều hướng chung để đọc lời chúc/nhận hoa; nút quà chuyển thành icon có aria-label đầy đủ, bot vẫn có nút riêng. Header dùng logo và nút chuyển động 44px. Tiêu đề có phiên bản gọn hiển thị nhưng tên truy cập vẫn đầy đủ.
- Lời chúc/lời nhắn có font 16px, line-height 1.5. Caption trang trí có thể nhỏ hơn. Nội dung dài chia theo từ và số dòng thực tế bằng PagedText; nút phân trang có vùng bấm tối thiểu 44px. Không tự xóa phần dư hoặc bật cuộn.
- PagedText đo bằng probe aria-hidden có cùng font/độ rộng, quan sát thay đổi kích thước/font và giữ vị trí đọc khi resize. Các probe không tạo vùng cuộn hoặc xuất hiện trong cây truy cập.
- Ảnh người nhận và ảnh người gửi dùng object-fit:contain để giữ đủ nội dung. Ảnh lỗi có lời thay thế có thể phân trang, không đẩy card dài ra.
- Giữ safe area và theo chiều cao động của trình duyệt. Hoa/hạt nằm trong lớp trang trí riêng, không làm tăng kích thước khung hoặc che nút.
- Mỗi mặt chỉ hiện khi được chọn; mặt ẩn không nhận focus. Chuyển từ nút trong mặt hoặc nút điều hướng vừa bị disable đưa focus tới mặt mới bằng focus({preventScroll:true}); không dùng scrollIntoView.

## 6. Kịch bản chuyển động

Các thời lượng, biên độ dưới đây là giá trị đích cho thiết kế; khi tinh chỉnh thị giác có thể thay đổi trong khoảng 20% và cập nhật lại spec. Giới hạn hạt, các hành vi tương tác và yêu cầu giảm chuyển động vẫn là giới hạn bắt buộc. Hiệu ứng mở đầu kết thúc trong tối đa 2,4 giây. Không đặt opacity 0 cho nội dung đọc chính để chờ animation hoặc JavaScript.

| Hiệu ứng | Thời điểm, thời lượng | Hành vi kết thúc |
| --- | --- | --- |
| Thiệp được đặt xuống | Khi mount; 650ms | Dịch từ 12px về 0, xoay từ -1 độ về 0; giữ trạng thái cuối |
| Vườn hoa mọc và nở | Bắt đầu 100ms; hoàn tất trước 1800ms | Thân scaleY, lá xoay mở, hoa scale; sau đó chuyển sang đung đưa |
| Nhấn tiêu đề | Hai cụm chữ lệch nhau 120ms; mỗi cụm 500ms | Dịch tối đa 6px, scale 0,98 về 1; chữ luôn nhìn thấy |
| Đợt cánh hoa chào | Khi mount; 2400ms | 10 hạt mobile, 18 hạt desktop; xóa sau khi xong |
| Hoa, lá đung đưa | Lặp chu kỳ 5–8 giây, lệch pha | Xoay tối đa 3 độ quanh chân thân |
| Cánh hoa nền | Lặp chu kỳ 9–14 giây, lệch pha | 8 hạt mobile, 14 hạt desktop, bay chéo từ ngoài mép trên xuống dưới |
| Vùng sáng nền | Ba vùng màu; chu kỳ 18–24 giây | Gradient tĩnh dịch chậm tối đa 20px; không animate blur |
| Polaroid nổi nhẹ | Chu kỳ 6 giây | Dịch dọc tối đa 3px, xoay tối đa 1 độ |
| Tim cạnh ảnh | Nhịp đôi mỗi 5 giây | Scale tối đa 1,08; trở về bình thường |
| Sao nhỏ | 4 sao mobile, 6 sao desktop; chu kỳ 4–7 giây | Mờ sáng chậm, không nhấp nháy nhanh |
| Phản hồi nút | Hover desktop hoặc press; 150–200ms | Dịch tối đa 2px, trở về khi kết thúc thao tác |

Hoa góc tối đa 6 bông mỗi cụm. Trang trí dùng `pointer-events: none` và `aria-hidden`. Không có hiệu ứng chạy theo con trỏ toàn màn hình hoặc chuyển động parallax theo cảm biến thiết bị.

Phân cấp chuyển động: lúc nghỉ, hoa góc và cánh hoa nền là chuyển động chính; ảnh, tim và sao chỉ nhấn nhẹ, lệch pha. Khi nhận hoa, tạm pause loop nền trong suốt phiên tương tác để bó hoa là điểm nhìn chính; nền trở lại sau khi phiên kết thúc. Hoa trang trí không bay trực tiếp qua vùng chữ: ưu tiên hai dải ngoài mép thiệp.

Tách wrapper cho các chuyển động cùng tác động lên một vật thể: lớp mọc/nở, lớp đung đưa và lớp phản hồi thao tác không ghi đè transform của nhau. Với polaroid, vòng lặp nổi nhẹ không vô hiệu hóa phản hồi khi nhấn.

## 7. Tương tác và trạng thái

### 7.1. Nhận bó hoa

- Chu kỳ màu cố định: hồng/tím → kem/vàng → hồng/kem; lần đầu luôn hồng/tím.
- Trong 350ms đầu, bó hoa trượt lên 36px trong sân khấu và scale từ 0,85 về 1.
- Từ 150 đến 900ms, bảy bông lần lượt bung nở, lệch nhau 80ms; nơ rung trong 600ms.
- Từ 450ms, bung cánh hoa và trái tim quanh bó hoa: 24 hạt mobile, 40 hạt desktop; kết thúc trong 1400ms.
- Lời nhắn “Hoa này không cần tưới. Pành chỉ cần tươi thôi!” hiện trong sân khấu và được thông báo qua live region.
- Bó hoa và lời nhắn ở lại đến tương tác tiếp theo. Hiệu ứng hạt tự xóa, không tự lặp.
- Bấm lại khởi động một chu kỳ mới với màu tiếp theo và thay thế hiệu ứng cũ, không cộng thêm hạt.
- Lần nhận hoa đầu tiên đồng thời mở phần ảnh người tặng ở mục 7.8. Bó hoa SVG vẫn là hiệu ứng chính; ảnh bổ sung tạo lời chào cá nhân và ở lại trong phiên xem.

### 7.2. Nhận lời khen

- Thay nội dung sân khấu bằng sticker lời khen; lần đầu dùng câu đầu danh sách.
- Sticker nghiêng từ -3 độ về 0 trong 300ms; vòng sáng và 8 sao bung trong 700ms.
- Bot mỉm cười và giơ tay trong 900ms rồi về tư thế nghỉ; nếu đã đeo kính thì giữ kính.
- Lời khen ở lại đến tương tác tiếp theo; live region chỉ đọc câu mới một lần.
- Không lặp liên tiếp cùng một câu. Bấm nhanh thay thế hoạt cảnh trước.

### 7.3. Chạm ảnh

- Ảnh nằm trong nút có nhãn “Chạm ảnh để gửi tim cho Pành”.
- Bật 6 tim trong 900ms, hiện câu “Nhân vật chính hôm nay đây rồi!” trong sân khấu.
- Ảnh không mở modal, không phóng toàn màn hình và không yêu cầu thao tác hover.

### 7.4. Bí mật của bot

- Hai lần đầu: lần lượt thông báo “Chạm thêm 2 lần nhé!” và “Một lần nữa, sắp bật mí rồi!”.
- Lần thứ ba: bot đeo kính, giơ hoa trong 1200ms và nói “Đã bật chế độ cưng Pành hết công suất.”
- Kính được giữ đến khi tải lại trang. Những lần tiếp theo lặp lời nhắn và hoạt cảnh giơ hoa, không tăng bộ đếm vô hạn.
- Nhãn nút nói rõ thao tác ba lần; dùng `aria-pressed` phản ánh trạng thái kính.

### 7.5. Quy tắc dùng chung

- Chỉ một hoạt cảnh tương tác tạm thời hoạt động tại một thời điểm trên toàn trang. Tương tác mới hủy timer/hạt tạm thời của tương tác cũ và cập nhật sân khấu.
- Kết thúc hoặc hủy một phiên phải đưa bot về tư thế nghỉ tương ứng với trạng thái kính hiện tại. Kính, số lần chạm bot, chỉ số màu hoa và chỉ số lời khen là trạng thái bền trong phiên xem; tư thế giơ tay, hạt và nơ rung là trạng thái tạm thời.
- Lần chạm ảnh hoặc bot thay phần lời nhắn trong sân khấu, nhưng giữ bó hoa đã nhận làm nền tĩnh nếu đang có. Nút lời khen thay sân khấu bằng sticker; nhận hoa tiếp theo thay sticker bằng bó hoa. Như vậy một lời nhắn nhỏ không làm bó hoa vừa nhận biến mất bất ngờ.
- Khi trang trí đang chạy, các nút và chữ luôn sử dụng được. Không khóa màn hình hoặc bắt chờ hết animation.
- `/20-10` có âm thanh tương tác nhẹ theo mục 7.7, không có nhạc nền. Âm thanh trang `/` giữ nguyên.
- Không lưu trạng thái vào localStorage, không gọi API hoặc analytics.
- Có nút nhỏ “Tạm dừng chuyển động” ở header, vùng bấm tối thiểu 44px; sau khi bấm đổi thành “Bật chuyển động”. Trạng thái chỉ giữ trong phiên xem. Tạm dừng hủy mở đầu/hạt đang chạy, dừng loop và đưa vật thể về trạng thái cuối tĩnh; mọi tương tác vẫn đổi nội dung và hình minh họa ngay. Bật lại chỉ chạy nền, không phát lại các màn đã bỏ qua. Nếu hệ điều hành yêu cầu giảm chuyển động thì yêu cầu đó được ưu tiên và nút không thể bật animation.

### 7.6. Mô hình sân khấu

Sân khấu có ba chế độ hiển thị: `idle` (bó hoa chờ nhận), `bouquet` (bó hoa đã nhận), `compliment` (sticker). Thông điệp hiện tại và loại phiên animation là hai trạng thái riêng; thông điệp ảnh/bot không tự thay chế độ sân khấu. Nếu chưa nhận hoa hoặc sticker, thông điệp được hiển thị cùng hình chờ nhận. Sân khấu nằm trong mặt nhận hoa; thông điệp tự chia phần nếu không đủ chỗ.

Khi phiên animation hết hạn, chỉ xóa hạt và tư thế tạm thời, không xóa chế độ sân khấu hoặc thông điệp cuối. Khi có tương tác mới, phiên cũ bị vô hiệu hóa trước khi khởi tạo phiên mới; callback cũ không được xóa thông điệp, hạt hoặc tư thế của phiên mới.

### 7.7. Âm thanh tương tác — đã chốt với người dùng

- Không nhạc nền, không âm thanh lặp, không phát khi mở trang, hover, cuộn hoặc khi animation nền tự chạy.
- Nhận hoa: ba nốt chuông mềm đi lên, tổng thời lượng tối đa 650ms.
- Nhận lời khen: hai nốt ting nhẹ, tổng thời lượng tối đa 350ms.
- Chạm ảnh: một nốt pop mềm, tối đa 150ms.
- Hai lần chạm bot đầu tiên: chỉ thông báo chữ. Lần mở bí mật và những lần chạm sau đó: chuỗi bíp vui nhẹ, tối đa 450ms.
- Dùng Web Audio tổng hợp tiếng ngắn tại chỗ, không tải file âm thanh hoặc thêm dependency. Không dùng lại tiếng reo hò/giọng nói của trang KOC. Gain tổng ban đầu tối đa 0,08, có envelope lên/xuống để tránh tiếng click; mức nghe thực tế cần kiểm tra trên thiết bị và không cam kết âm lượng vật lý từ giá trị gain.
- Khởi tạo/resume AudioContext trực tiếp trong thao tác chạm/click hoặc kích hoạt nút bằng bàn phím. Không chờ timer/animation rồi mới xin phát âm; không phát bù tiếng đã bỏ qua nếu resume hoàn tất sau khi phiên tương tác đã hết hiệu lực.
- Âm thanh tương tác luôn sẵn sàng, không có nút bật/tắt, trạng thái mute hoặc bước yêu cầu bật âm riêng. Thao tác đầu tiên thuộc loại có âm phát tiếng ngay nếu trình duyệt cho phép; không tự phát khi mở trang.
- Chỉ một hiệu ứng âm thanh hoạt động tại một thời điểm. Mỗi tương tác mới dừng tiếng trước đó; các thao tác bot không phát tiếng cũng dừng tiếng cũ. Ẩn tab dừng tiếng đang phát ngay, không phát lại khi quay về.
- Giảm chuyển động hoặc tạm dừng animation không tắt âm tương tác. Lời nhắn bằng chữ luôn xuất hiện dù âm lỗi, thiết bị đang im lặng hoặc trình duyệt chặn phát.
- Khi unmount: dừng và ngắt kết nối mọi oscillator/gain node, đóng AudioContext, vô hiệu hóa callback/resume đang chờ. Không để lại âm sau khi rời trang; StrictMode không tạo context hoặc tiếng trùng.

### 7.8. Ảnh người tặng hoa — mặt thiệp riêng

Vị trí: mặt số 4 trong cùng card, không nối thêm section xuống dưới trang.

- Sau lần nhận hoa đầu tiên, mặt số 3 có nút Xem người giao hoa → để chuyển mặt. Điều hướng chung cũng truy cập được mặt số 4; nếu chưa nhận hoa, hiển thị lời mời và nút nhận hoa. Không bật modal hoặc cuộn trang.
- Nhận hoa giữ nguyên bảy bông SVG và tiếng chuông. Asset public/sender-rose.png chỉ bắt đầu tải sau thao tác nhận hoa, kể cả khi chưa chọn mặt ảnh; không thêm âm thanh lúc ảnh tải xong hoặc chuyển mặt.
- Dùng nguyên ảnh ngang 2730×1536, 8.195.400 byte từ nguồn người dùng cung cấp. Giữ đủ mặt, bông hồng, bàn tay; không crop tròn, tách nền, đổi mặt, thêm chữ vào ảnh hoặc thay ảnh Pành.
- Ảnh co vừa vùng linh hoạt bằng object-fit:contain. Lời nhắn gồm “Hoa đã có. Người giao hoa cũng đã có mặt 😎” và “Hoa tặng Pành. Còn người giao hoa xin một lời khen.”, phân trang nếu không đủ chỗ.
- Khi tải, trạng thái “Người giao hoa đang tới…” chiếm chính khung đó. Khi lỗi: “Người giao hoa đang kẹt mạng. Hoa vẫn tới đúng người nhé! 🌷”, cùng nội dung chú thích qua PagedText. Không làm hỏng tương tác khác.
- Ảnh chỉ vào cảnh một lần trong 500ms; đổi mặt qua lại hoặc bật lại chuyển động không phát lại. Khi giảm/tạm dừng chuyển động hoặc ẩn tab, giữ trạng thái cuối tĩnh.
- Ảnh đã mở, bó hoa, chỉ số lời khen và kính bot giữ trong phiên xem, không mất khi đổi mặt. Tải lại trang reset toàn bộ.

## 8. Kiến trúc dự kiến

| Thành phần | Trách nhiệm |
| --- | --- |
| `src/App.tsx` | Chọn trang theo pathname; route lạ có thông báo và liên kết về `/` nếu hosting trả về React entry |
| `src/pages/CelebrationPage.tsx` | Trang KOC được chuyển nguyên hành vi từ App hiện tại |
| `src/pages/WomensDayPage.tsx` | Nội dung, bố cục, kết nối tương tác của thiệp 20/10 |
| `src/components/womens-day/FloralScene.tsx` | SVG hoa góc, vùng sáng và cánh hoa nền |
| `src/components/womens-day/GiftStage.tsx` | Sân khấu bó hoa, sticker, tim và lời nhắn |
| `src/components/womens-day/FlowerBot.tsx` | Bot cầm hoa, kính và hoạt cảnh chào |
| `src/hooks/useWomensDayEffects.ts` | Chỉ số lời khen/màu hoa, đếm chạm bot, một phiên hiệu ứng, visibility và cleanup |
| `src/hooks/useWomensDaySound.ts` | Web Audio riêng cho trang 20/10, luôn sẵn sàng sau cử chỉ người dùng, thay thế âm cũ và cleanup; không sửa âm trang KOC |
| `src/content/womensDay.ts` | Lời chúc, lời khen và nội dung cố định |
| `src/styles/womens-day.css` | Card no-scroll, bốn mặt thiệp và keyframe |
| `src/components/womens-day/PagedText.tsx` | Chia nội dung theo vùng đọc thực tế, không cuộn |
| `src/viewport.css` | Giới hạn viewport dùng chung cho các landing |
| `public/sender-rose.png` | Bản sao nguyên ảnh người gửi cầm hoa; chỉ dùng ở phần quà sau tương tác |
| `src/style.css` | Reset chung; các rule của trang cũ được giới hạn dưới `.celebration-page` |
| `20-10/index.html` | HTML entry riêng, metadata của thiệp 20/10, dùng cùng React entry |
| `vite.config.ts` | Build cả HTML gốc và HTML 20/10 |

Chỉ chia sẻ reset, ảnh và logo; không tạo hệ thống theme hoặc engine thiệp tổng quát. Không sửa hook âm thanh của trang cũ chỉ để phục vụ trang mới.

Giới hạn CSS toàn cục: scroll lock, chiều cao viewport và các selector h1/main/footer của trang cũ phải áp dụng theo route. Khi unmount phải gỡ class/thuộc tính trên html/body nếu có; chuyển route hoặc tải lại không để lại trạng thái khóa cuộn.

## 9. Route, build và metadata

- `/` tải trang KOC; `/20-10` và `/20-10/` tải thiệp mới. Các tham số query và hash không thay đổi nội dung thiệp.
- Build phải sinh `dist/index.html` và `dist/20-10/index.html`, với đường dẫn asset hoạt động ở route lồng nhau.
- Mở link trực tiếp và refresh phải hoạt động trên preview và hosting thực tế. Việc hosting chuyển `/20-10` sang `/20-10/` là chấp nhận được.
- Không thêm catch-all rewrite mặc định vì có hai HTML thật. Chỉ thêm cấu hình hosting nếu kiểm tra cho thấy cần, và không rewrite route mới sang HTML của trang KOC.
- Route không tồn tại trả trang 404 của hosting; nếu hosting có fallback về React, App hiển thị trạng thái không tìm thấy. Không tự hiển thị thiệp 20/10 cho mọi đường dẫn lạ.
- HTML mới có lang vi, viewport hỗ trợ safe area, theme-color kem, favicon logo bot.
- Title: “Pành ơi, 20/10 vui nha! 🌷”.
- Description: “Một chiếc thiệp hoa dành riêng cho Pành: lời chúc vui vẻ, một bó hoa bất ngờ và rất nhiều yêu thương.”
- Khai báo description, `og:title`, `og:description`, `og:type=website` ngay trong HTML mới; metadata trang gốc giữ nguyên.
- Bản đầu không thêm canonical, `og:url` hoặc `og:image` với domain tự đoán. Ảnh preview chia sẻ riêng không thuộc phạm vi; ứng dụng nhắn tin có thể tự chọn ảnh hoặc không hiển thị ảnh. Không cam kết hành vi cache của ứng dụng chia sẻ.

## 10. Hiệu năng, khả năng truy cập và xử lý lỗi

- Không thêm runtime dependency, font ngoài hoặc ảnh tải từ dịch vụ ngoài. SVG hoa/bot được vẽ bằng code và asset ảnh hiện có được đóng gói cùng site.
- Mobile dưới 640px sử dụng ngân sách hạt mobile; số lượng được xác định theo viewport khi bắt đầu phiên hiệu ứng. Resize không tạo thêm phiên hiệu ứng.
- Hạt rời tối đa đồng thời: 42 mobile, 72 desktop, gồm cả nền, mở đầu và tương tác. Khi bắt đầu tương tác, xóa hạt mở đầu. Số DOM không tăng sau mỗi lần bấm.
- Chỉ animate transform/opacity; không animate kích thước bố cục, filter hoặc box-shadow. Không dùng vòng render React từng frame; vị trí ngẫu nhiên được tạo một lần khi bắt đầu phiên hạt.
- Có `prefers-reduced-motion` ngay từ CSS lần tải đầu. Chế độ giảm chuyển động bỏ toàn bộ loop, hạt bay và chuyển vị; hoa/bó hoa/lời khen hiển thị tĩnh và nút vẫn hoạt động.
- Khi tab ẩn: pause CSS, hủy hiệu ứng hạt và timer tạm thời, đưa bot/nơ/hoa về trạng thái cuối tĩnh. Khi quay lại: tiếp tục nền nhẹ nếu người xem chưa tạm dừng và hệ điều hành không yêu cầu giảm chuyển động; không phát lại mở đầu hay phần tương tác đã hủy; giữ lời nhắn và trạng thái kính.
- Khi unmount: dọn timer/listener và mọi class toàn cục theo route. React StrictMode không gây hai phiên mở đầu hoặc listener trùng.
- Hỗ trợ bàn phím, focus rõ, thứ tự DOM hợp lý, một H1. Enter/Space kích hoạt nút giống thao tác chạm.
- Một live region polite chung cho thông điệp tương tác. PagedText mặc định không lặp thông điệp này; riêng mặt lời chúc thông báo đoạn đang đọc khi đổi đoạn. Không đọc hạt/hoa hoặc toàn bộ lời chúc sau mỗi lần tương tác.
- Nội dung và tương tác không phụ thuộc việc tải ảnh thành công. Dùng văn bản React thông thường, không chèn HTML từ URL.

## 11. Tiêu chí nghiệm thu

- [ ] Hai route hoạt động độc lập; link trực tiếp và refresh không lỗi trên hosting đã triển khai.
- [ ] Trang KOC giữ nội dung, ảnh, bố cục và tương tác, bao gồm âm thanh sau thao tác người dùng.
- [ ] Lời chúc và sáu câu khen đúng nội dung mục 4; không còn nội dung KOC trên thiệp mới.
- [ ] Có đủ hoạt cảnh mở thiệp, vườn hoa nở, hoa đung đưa, cánh hoa nền, vùng sáng, ảnh nổi nhẹ, tim và sao.
- [ ] Nút nhận hoa có bó hoa bảy bông, ba phối màu tuần hoàn và màn bung hạt đúng ngân sách.
- [ ] Lời khen, chạm ảnh và bot ba lần hoạt động bằng chuột, chạm và bàn phím.
- [ ] Bấm liên tục hoặc đổi loại tương tác thay thế hiệu ứng cũ; không tích lũy timer, hạt hoặc tăng tốc animation.
- [ ] Không cắt nội dung và không tràn ngang ở 360, 390, 430 và 1280px; kiểm tra thêm landscape 844×390 và mobile thấp 360×568.
- [ ] Nội dung đọc được qua các mặt/phần khi tăng cỡ chữ hoặc giảm viewport; không cuộn để tới nút. Xác minh zoom 200% thực tế khi công cụ hỗ trợ, không coi viewport nhỏ là bằng chứng đã kiểm tra zoom thật.
- [ ] Chế độ giảm chuyển động giữ nội dung, hình hoa tĩnh và toàn bộ chức năng.
- [ ] Các tương tác phát tiếng nhẹ đúng mục 7.7; mở trang/hover/cuộn không phát âm, không có nhạc nền hoặc tiếng lặp.
- [ ] Không có nút hoặc bước bật/tắt âm; tương tác có âm luôn sẵn sàng kể cả khi tạm dừng chuyển động; bấm liên tục không chồng âm; ẩn tab hoặc rời trang dừng âm ngay.
- [ ] Trình duyệt chặn âm hoặc không hỗ trợ Web Audio không làm lỗi trang, không phát bù tiếng cũ và không cản nội dung/tương tác.
- [ ] Nút tạm dừng/bật chuyển động hoạt động; không ghi đè cài đặt giảm chuyển động của hệ điều hành và không phát lại mở đầu.
- [ ] Cả bốn mặt có điều hướng luôn nhìn thấy; lời chúc, thông điệp dài, loading/error không tràn khỏi vùng đọc. Document và từng mặt không cuộn.
- [ ] Chạm ảnh/bot giữ bó hoa đã nhận; timer cũ không xóa trạng thái của tương tác mới; bot trở về tư thế nghỉ sau khi hủy phiên.
- [ ] Ẩn/hiện tab, resize và unmount không để lại animation, listener hoặc scroll lock sai trạng thái.
- [ ] Ảnh bị lỗi vẫn có nội dung thay thế và các nút hoạt động.
- [ ] Ảnh Pành ở mặt đầu; ảnh người tặng được mở sau lần nhận hoa đầu tiên tại mặt riêng, giữ đủ mặt/hoa/tay và không tự cuộn hoặc tự phát âm.
- [ ] Khung ảnh người tặng có trạng thái đang tải/lỗi, chỉ vào cảnh một lần, ở lại khi đổi tương tác và không tải asset trước khi nhận hoa.
- [ ] Bản build có hai HTML với metadata riêng; không có lỗi runtime khi dùng hai trang.
- [ ] Kiểm tra chuyển động trên iPhone Safari/Chrome và Android Chrome nếu có thiết bị; nếu chưa có, báo rõ phần chưa xác nhận, không kết luận từ desktop giả lập.

## 12. Xác minh và trình tự bàn giao

Theo skill `executing-plans` hiện có, khi triển khai không chạy test runner. Dùng kiểm tra tĩnh phù hợp, `npm run build` hiện có và kiểm tra trực tiếp trên trình duyệt. Không thêm lệnh lint/typecheck giả định khi project chưa có script; không thêm test framework cho phạm vi này.

Hiệu năng được đánh giá bằng quan sát trên thiết bị và kiểm tra animation/DOM trong trình duyệt: không có giật kéo dài khi cuộn hoặc bấm, không tích lũy node sau nhiều lần tương tác. Không ghi nhận mượt 60fps nếu chưa đo.

Sau khi người dùng duyệt spec, dùng skill `writing-plans` để viết kế hoạch tại `docs/plans/2026-10-20-womens-day-landing.md`. Plan phải ánh xạ đủ tiêu chí trên, ghi file và thứ tự phụ thuộc cụ thể; không tạo thêm tài liệu tracking/evidence/handoff.

Thứ tự triển khai dự kiến: tách route và cô lập CSS → dựng thiệp/hoa tĩnh → chuyển động nền và mở đầu → tương tác bó hoa/lời khen/bot → kiểm tra build, routing và giao diện.

Không tự commit, push hoặc deploy. Người dùng đã yêu cầu triển khai và sau đó cấm hoàn toàn worktree, cho phép subagent. Chỉ triển khai trong checkout hiện tại trên nhánh feature; chỉ dẫn mới của người dùng thay thế yêu cầu worktree/không subagent trong skill.

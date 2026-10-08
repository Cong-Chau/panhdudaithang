# Pành Đù đại thắng! 🏆

Thiệp chúc mừng KOC bằng React, TypeScript, Tailwind CSS 4 và Vite. Hoàn toàn tĩnh, không gọi API, không thu thập dữ liệu và không cần đăng nhập.

## Chạy local

```sh
npm install
npm run dev
```

## Build để đưa link vào email

```sh
npm run build
npm run preview
```

Đưa thư mục `dist` lên hosting tĩnh và dùng URL HTTPS của trang trong email gửi sau khi cập nhật KOC thành công. Trang là thiệp chúc mừng, không tự kiểm tra trạng thái sheet.

## Tương tác

- Mở phong bì, tiêu đề nảy nhẹ, cúp/vương miện và dấu Đại thắng tạo một đoạn mở đầu ngắn. Nội dung luôn hiển thị, không khóa nút.
- Chạm cúp để nhận lời khen ngẫu nhiên.
- Hai nút ăn mừng tạo thông báo và confetti ngay vị trí chạm (28 hạt mobile, 44 hạt desktop, tự dừng sau 1 giây).
- Chạm bot ba lần để bật kính đen và điệu nhảy. Nút chơi lại đặt lại toàn bộ màn ăn mừng.
- Hiệu ứng động tự chạy khi mở trang. Âm thanh hiệu ứng luôn sẵn sàng và phát ngay khi bấm các nút, không cần nút bật âm riêng. Âm thanh `uiiiiiiii.mp3` của nút “Ăn mừng thôi!”, tiếng “Yay Kids” của nút “Gáy một phát”, tiếng ting của cúp và bíp bot. File của nút “Ăn mừng thôi!” được đóng gói trong `public/sounds/celebration.mp3`. Web Audio tạo các tiếng ngắn khác tại chỗ; tiếng Yay Kids dùng đúng file người dùng cung cấp từ Myinstants, đóng gói trong `public/sounds/yay-kids.mp3` (xem `public/sounds/CREDITS.md`). Mỗi hiệu ứng phát một lần rồi dừng, không có nhạc nền hay âm thanh lặp. Bấm liên tục thay thế âm trước; ẩn tab sẽ dừng âm ngay. AudioContext và các node được dọn khi unmount. Nếu trình duyệt không hỗ trợ, các tương tác hình ảnh vẫn dùng được.
- `prefers-reduced-motion` loại bỏ chuyển động và confetti; thông báo vẫn hoạt động. Khi tab ẩn, CSS animation tạm dừng, timer và confetti được dọn. Timer và listener được dọn khi unmount.

SVG được vẽ trực tiếp; không tải font, ảnh hoặc thư viện hiệu ứng từ dịch vụ ngoài.

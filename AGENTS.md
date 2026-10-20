# Quy tắc dành cho AI trong dự án landing

Áp dụng cho toàn bộ repository, mọi landing page hiện có và mọi route được tạo sau này. Đọc file này trước khi thiết kế, sửa code hoặc cập nhật spec/plan.

## Bắt buộc: mọi landing page đều no-scroll

- Mỗi landing page phải nằm gọn trong viewport hiện tại (`100dvh`), bao gồm header, nội dung, thao tác chính và footer nếu có.
- Không cho phép cuộn dọc hoặc ngang ở document, page hoặc các vùng nội dung bên trong. Không tạo khung cuộn, modal cuộn, carousel cuộn hoặc dùng thao tác vuốt/cuộn để tiếp cận nội dung.
- `overflow: hidden` chỉ là lớp bảo vệ cuối cùng. Phải bố trí nội dung vừa khung; không dùng khóa cuộn để che phần bị tràn.
- Mọi nội dung và chức năng phải tiếp cận được. Không cắt chữ, che nút, đặt nội dung quan trọng ngoài màn hình hoặc thu nhỏ toàn bộ trang bằng transform để ép vừa.
- Nếu nội dung không vừa, ưu tiên giảm khoảng cách, giảm kích thước trang trí và ảnh, thay đổi bố cục theo cả chiều rộng lẫn chiều cao. Nếu vẫn không đủ, đề xuất chia nội dung thành các mặt/trạng thái có nút chuyển trong cùng khung; không tự xóa lời chúc hoặc chức năng đã thống nhất.
- Mỗi mặt/trạng thái cũng phải no-scroll. Nội dung dài có thể chia tiếp thành các phần với nút trước/sau; các nút điều hướng luôn phải nhìn thấy và dùng được bằng bàn phím.
- Popup, lớp phủ, trạng thái đang tải/lỗi, bó hoa, lời khen và ảnh xuất hiện sau tương tác đều phải tuân thủ cùng giới hạn viewport. Không nối thêm khối nội dung làm trang dài ra hoặc gọi `scrollIntoView` để dẫn người xem xuống phần mới.
- Hiệu ứng trang trí không được làm tăng vùng cuộn, che nội dung đọc hoặc chặn thao tác.
- Hỗ trợ safe area, thanh địa chỉ trình duyệt mobile thay đổi chiều cao và màn hình ngang. Không chỉ kiểm tra viewport desktop hoặc chỉ dựa vào `100vh`.
- Giữ chữ dễ đọc và vùng bấm đủ lớn. Khi tăng cỡ chữ/zoom, phải điều chỉnh bố cục hoặc chia nội dung thành nhiều mặt; không giải quyết bằng cách cắt nội dung hay bật cuộn.

## Thiết kế và tích hợp

- Áp dụng giới hạn viewport ở layout chung để route mới mặc định tuân thủ; từng page vẫn chịu trách nhiệm bố trí toàn bộ nội dung trong khung đó.
- Giữ CSS theo phạm vi từng page; không để thay đổi một landing làm hỏng route khác.
- Giữ nguyên nội dung, asset và hành vi không thuộc phạm vi yêu cầu.
- No-scroll là yêu cầu mới nhất của người dùng, được ưu tiên hơn các spec/plan cũ cho phép cuộn hoặc tăng chiều dài trang. Khi thay đổi layout, cập nhật lại các phần tài liệu bị mâu thuẫn.
- File này không tự phê duyệt một thiết kế mới. Nếu cần đổi luồng trải nghiệm hoặc chia thiệp thành nhiều mặt, trình bày phương án cụ thể trước khi triển khai theo workflow đã thống nhất.

## Xác minh

- Khi có thay đổi layout, kiểm tra các route liên quan ở 360×568, 390×844, 430×932, 844×390 và 1280×800; kiểm tra thêm zoom/cỡ chữ 200% khi công cụ cho phép.
- Kiểm tra mọi trạng thái tương tác, không chỉ màn hình ban đầu: nội dung, ảnh, nút, focus và thông điệp phải nằm trong khung và tiếp cận được.
- Kiểm tra cả kích thước thực tế của nội dung và vùng cuộn của document/container. Thanh cuộn biến mất hoặc scrollHeight bị giới hạn không đủ để kết luận đạt nếu nội dung đang bị cắt.
- Chỉ báo đạt những kiểm tra đã thực hiện; nói rõ giới hạn về trình duyệt, thiết bị hoặc công cụ.
- Không chạy test runner theo workflow hiện tại. Chạy kiểm tra tĩnh/build phù hợp với thay đổi code; không cần build cho thay đổi chỉ có tài liệu.

## Giới hạn làm việc

- Tuyệt đối không tạo hoặc sử dụng worktree cho dự án này. Làm trong checkout hiện tại và bảo toàn các thay đổi đang có.
- Người dùng cho phép dùng subagent. Chỉ giao các phần có phạm vi rõ ràng, tránh nhiều agent sửa cùng file.
- Không tự stage, commit, push, merge hoặc deploy khi chưa được người dùng cho phép tương ứng. Cho phép triển khai code không đồng nghĩa cho phép các thao tác Git hoặc phát hành này.
- Chỉ dẫn trực tiếp mới nhất của người dùng được ưu tiên hơn hướng dẫn trong skill hoặc tài liệu repository.

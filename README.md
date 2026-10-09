# Website Thóc tròn 1 tuổi

Website HTML, CSS và JavaScript tĩnh cho lời mời thôi nôi, hành trình 14 chặng và album 154 ảnh của Thóc. Chủ đề là cỗ xe hoàng tử do bạch mã kéo, chở Thóc cùng chùm bóng bay. Màu chủ đạo là xanh trời pastel và kem bơ. Tiệc diễn ra lúc 18h ngày 24/10/2026 tại Ẩm Thực Nhà Tôi, 62-64 Đường Vành Đai Trong, An Lạc, TP. Hồ Chí Minh.

## Hành trình

Hành trình gồm 14 chặng: Chờ Thóc, Chào đời, 1 đến 11 tháng và Tròn 1 tuổi. Mỗi chặng nằm trong danh sách `milestones` của `site-content.js`, có `photo` (tên file trong `assets/photos/full`), `title`, `story` và `date`.

- Tên file giữ số của ảnh gốc: `pic21.jpg` trong thư mục ThocAlbum là `thoc-021.jpg`.
- Thêm `position`, ví dụ `"50% 30%"`, khi khuôn mặt bị cắt trong khung vòm. Để trống `photo` thì khung hiện bạn gấu và dòng "Ba mẹ đang chọn ảnh".
- Ngày tròn tháng tính từ ngày sinh 28/10/2025.
- Chạm ảnh hoặc nút "Xem ảnh tháng này" để xem mọi ảnh chụp trong tháng đó. Ảnh được gán tháng qua trường `chapter`, tính theo ngày chụp.

## Album

Album gom ảnh theo khoảnh khắc, không theo tháng. Danh sách `moments` trong `site-content.js` gồm `key`, `title` và `note`, xếp theo thứ tự hiện trên trang. Mỗi ảnh trong `photos` có `moment` trùng `key` của một khoảnh khắc, và `caption` nếu cần lời chú thích. Chú thích hiện thành bong bóng thoại dưới ảnh và trong lightbox.

Bìa của mỗi khoảnh khắc là ảnh đầu tiên có chú thích. Mục "Tất cả" lần lượt lấy từng ảnh của mỗi khoảnh khắc, ưu tiên ảnh có chú thích, để màn hình đầu đủ loại ảnh.

Ảnh lấy từ thư mục ThocAlbum của gia đình. Bản web được xoay theo EXIF, thu nhỏ và xóa toàn bộ metadata, kể cả vị trí GPS. Bản lớn tối đa 1600 px nằm trong `assets/photos/full`, bản nhỏ rộng 560 px nằm trong `assets/photos/thumb`. Không đưa lên web các ảnh 57, 59, 66, 67, 85, 102, 108 (không có Thóc hoặc bị mờ) và video `pic69.mp4`. Khi thêm ảnh mới, tạo cả bản lớn và bản nhỏ cùng tên, xóa metadata, rồi thêm một dòng vào `photos` với kích thước bản nhỏ.

## Nội dung khác

- Ảnh trong cửa sổ xe ngựa là `assets/photos/full/thoc-135.jpg`, khai báo trong SVG `.carriage` của `index.html`. Khi đổi ảnh, chỉnh `x`, `y`, `width`, `height` của thẻ `<image>` để khuôn mặt nằm giữa ô cửa.
- Ảnh bìa chia sẻ `assets/photos/share-cover.jpg` (1200 × 630 px) cắt từ ảnh 132. Thẻ Open Graph và Twitter nằm trong HTML.
- Icon bóng bay, bánh sinh nhật, hộp quà, gấu teddy, tay cầm chơi game và xe ngựa nhỏ là các `<symbol>` SVG ở đầu `index.html`.
- Nội dung thiệp mời nằm trong `index.html`, gồm ngày giờ, địa chỉ, bản đồ nhúng và link Google Maps do gia đình gửi. Khi đổi lịch tiệc, cập nhật cả nội dung, metadata chia sẻ, `PARTY` (đếm ngày) và tệp lịch `.ics` trong `app.js`. Tệp lịch đặt giờ kết thúc là 21h.

## Xem website

Chạy máy chủ HTTP tĩnh tại thư mục gốc, ví dụ `python -m http.server 8080`. Website không có backend, công cụ build, hệ thống đăng nhập hay biểu mẫu xác nhận tham dự.

- Trên điện thoại có thanh điều hướng ở đáy màn hình: Lời mời, Hành trình, Album, Chỉ đường.
- Vuốt ngang ở phần hành trình, bấm nút trước hoặc tiếp theo, hay bấm một trạm trên con đường. Chiếc xe ngựa nhỏ chạy tới chặng đang xem. Lần đầu cuộn tới, các thẻ nhích nhẹ và có nhãn hướng dẫn vuốt.
- Chạm một bìa khoảnh khắc ở album để xem riêng. Album hiện 24 ảnh mỗi lần.
- Chạm ảnh để xem lớn. Vuốt ngang hoặc dùng nút, phím mũi tên để chuyển ảnh. Vuốt xuống, phím Escape hoặc nút Đóng để đóng. Lần đầu mở có nhãn hướng dẫn, chỉ hiện một lần trên mỗi máy.
- Nút "Thêm vào lịch" tải tệp `.ics` cho lịch điện thoại hoặc máy tính.
- Khi bật chế độ giảm chuyển động, xe ngựa đứng yên, bóng bay không đung đưa và việc cuộn không có hiệu ứng.

## GitHub Pages

Repository `hdnguyen3101/hellothoc` dùng "Deploy from a branch", nhánh `main`, thư mục `/`. Giữ nguyên `.nojekyll` và `CNAME` khi xuất bản.

Sau khi cập nhật `main`, kiểm tra build Pages hoàn tất rồi mở `https://www.hellothoc.io.vn/`. Xác nhận ảnh, font, hành trình, album, lịch tiệc và bản đồ hoạt động từ URL thật.

## Font và giấy phép

Baloo 2 (tiêu đề, bản woff2 rút gọn cho tiếng Việt) và Be Vietnam Pro (nội dung) nằm trong `assets/fonts/`, kèm giấy phép SIL Open Font License. Font Fraunces cũ vẫn nằm trong thư mục nhưng website không dùng.

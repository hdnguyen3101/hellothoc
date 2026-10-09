# Website Thóc tròn 1 tuổi

Website HTML, CSS và JavaScript tĩnh cho lời mời thôi nôi, album 18 ảnh và 4 dấu mốc của Thóc. Tiệc diễn ra lúc 18h ngày 24/10/2026 tại Ẩm Thực Nhà Tôi, 62-64 Đường Vành Đai Trong, An Lạc, TP. Hồ Chí Minh.

## Nội dung và ảnh

Ảnh gốc đến từ thư mục gia đình đã cung cấp. Bản dùng trên web được chỉnh hướng theo EXIF, nén JPEG và bỏ metadata gốc. Bản gốc không bị thay đổi.

- Đổi ảnh mở đầu tại `assets/photos/hero.jpg`. Giữ ảnh thật của Thóc và kiểm tra vùng cắt ảnh trong `styles.css` ở cả máy tính lẫn điện thoại.
- Chỉnh danh sách `photos` trong `site-content.js` để thay ảnh album và chú thích. Mỗi ảnh có `src`, `thumbnail`, `caption`, `alt`; thêm `position` khi cần điều chỉnh vùng cắt ảnh thu nhỏ.
- Chỉnh danh sách `milestones` để thay 4 ảnh tạm. Tên dấu mốc do gia đình chọn. Thêm `story` khi ba mẹ cung cấp câu chuyện; không tự gán ngày biết lật, biết ngồi, biết đứng hoặc mọc răng.
- Nội dung thiệp mời nằm trực tiếp trong `index.html`, gồm ngày giờ, địa chỉ và link Google Maps do gia đình gửi. Khi đổi lịch tiệc, cập nhật cả nội dung và metadata chia sẻ.
- Ảnh bìa chia sẻ nằm ở `assets/photos/share-cover.jpg`, kích thước 1200 × 630 px. Các thẻ Open Graph và Twitter nằm trong HTML để công cụ chia sẻ đọc được mà không chạy JavaScript.

Ảnh minh họa 3D cũ vẫn nằm trong repository để giữ lại nguồn cũ. Website mới không sử dụng ảnh này.

## Xem website

Mở `index.html` hoặc chạy máy chủ HTTP tĩnh tại thư mục gốc. Website không có backend, công cụ build, hệ thống đăng nhập hay biểu mẫu xác nhận tham dự.

- Chạm ảnh album để xem lớn. Dùng nút trước, tiếp theo hoặc phím mũi tên để chuyển ảnh.
- Vuốt ngang trên ảnh khi dùng điện thoại. Phím Escape hoặc nút đóng đưa con trỏ về ảnh vừa chọn.
- Kiểm tra nút bản đồ mở đúng địa điểm Ẩm Thực Nhà Tôi từ link `https://maps.app.goo.gl/rwCZzLZ7KrzvmmYR6`.
- Khi bật chế độ giảm chuyển động, các nội dung vẫn hiển thị và hiệu ứng chuyển động được tắt.

## GitHub Pages

Repository `hdnguyen3101/hellothoc` dùng "Deploy from a branch", nhánh `main`, thư mục `/`. Giữ nguyên `.nojekyll` và `CNAME` khi xuất bản.

Sau khi cập nhật `main`, kiểm tra build Pages hoàn tất rồi mở `https://www.hellothoc.io.vn/`. Xác nhận ảnh, font, album, lịch tiệc và bản đồ hoạt động từ URL thật.

## Font và giấy phép

Fraunces và Be Vietnam Pro nằm trong `assets/fonts/`, kèm giấy phép SIL Open Font License. Khách tải font từ cùng nơi lưu trữ với website.

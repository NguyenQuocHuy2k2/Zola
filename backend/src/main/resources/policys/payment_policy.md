# Chi Tiết Hướng Dẫn Về Việc Thanh Toán Của Nền Tảng Zola

Nhằm mang đến trải nghiệm thanh toán trực tuyến vừa linh hoạt lại vừa tuân thủ tuyệt mật thông tin chuẩn quốc tế PCI DSS (Payment Card Industry Data Security Standard), hệ sinh thái Zola cung cấp một loạt các kênh phương tiện giao dịch như sau.

## 1. Dịch Vụ COD (Cash On Delivery) - Thanh toán tiền mặt khi hoàn thành chuyến giao hàng
- Đơn giản nhất và truyền thống nhất: áp dụng hoàn toàn khi bạn chỉ muốn tự tay mình cầm được sản phẩm rồi mới chi trả số tiền đã hiển thị trên hóa đơn in trực tiếp.
- Khách hàng có thể trả bằng tiền lẻ, tiền chẵn hoặc quét mã QR Code cá nhân của các anh bạn Bưu Tá (Shipper) khi anh ấy mang máy POS di động tới. 
- Giới hạn: Dịch vụ COD sẽ KHÔNG khả dụng cho các cấu hình đơn hàng có tổng trị giá Vượt Ngưỡng 10,000,000 VNĐ (Mười Triệu Đồng). 

## 2. Thanh toán bằng Thẻ Thanh Toán Quốc Tế (Tính năng Visa / Mastercard / Amex / JCB)
- Đối với phân khúc khách hàng ưa chuộng dùng tín dụng trả trước: Cổng thanh toán OnePay / Payoo của Zola sẽ tích hợp mã hóa SSL 256-bit cao cấp nhất. Chúng tôi không hề lưu lại số CVV cũng như không bao giờ hiển thị lại chuỗi PAN của thẻ trên giao diện web.
- Miễn phí phí cà thẻ, không tồn tại chuyện khách hàng phải chịu thêm phí ẩn 2% - 3% như các tiệm cửa hàng vật lý.
- Áp dụng Hỗ trợ cả **Trả Góp Tiện Lợi bằng thẻ tín dụng với mức lãi suất 0%**. (Chỉ cần có thẻ tín dụng của 1 trong số 28 ngân hàng nội địa tại VN, kỳ hạn lựa chọn: 3 tháng, 6 tháng, 9 tháng và 12 tháng). Phí chuyển đổi giao dịch trả góp là 0 đồng.  

## 3. Hệ Sinh Thái Ví Điện Tử Dành Cho Giới Trẻ
- **Ví ZaloPay**: Lên ngôi nhờ thường xuyên thả các Flash-code giảm trực tiếp 10%, có thể thanh toán trực tiếp ngay khi mở app trong mảng mini-app hoặc quét mã QR ngoài ứng dụng browser trên máy tính. 
- **Ví Momo**: Nếu bạn đang dùng Safari hoặc Chrome trên di động, App Momo sẽ gọi deeplink nhảy trực tiếp vào ứng dụng thanh toán tự động, bạn không cần phải đăng nhập các bước phức tạp.
- **VNPAY-QR**: Cách dễ nhất để dùng app Mobile Banking của ngân hàng mà bạn đang xài (VCB Digibank, BIDV, Vietinbank iPay).

## 4. Hướng Dẫn Kỹ Thuật Chuyển Khoản Trực Tiếp Cho Kế Toán Zola (Dành do doanh nghiệp mua sỉ/Lỗi cổng API)
Đôi khi hệ thống API trung gian bảo trì hệ thống (rất hiếm). Giải pháp hoàn hảo thay thế lúc này là Chuyển Khoản Ngân Hàng Kế Toán thông thường 24/7. Hướng dẫn chi tiết:
- Đăng nhập vào App Ngân Hàng của bạn. Chọn Chuyển Tiền Nhanh Napas 24/7.
- **Tên ngân hàng thụ hưởng:** Vietcombank - Ngân hàng TMCP Ngoại thương VN (Chi nhánh Nam Sài Gòn)
- **Số tài khoản giao dịch:** 012 345 678 910
- **Chủ tài khoản:** CTY CP DAU TU VA Phat Trien ZOLA
- **Nội dung/Lý do chuyển tiền (Memmo - Cực kỳ quan trọng để máy chủ dò soát):** `Mã đơn hàng [khoảng trắng] Số điện thoại đặt hàng`
   => *Ví dụ: ZL889988 0901234567*

### 4.1. Quy Chế Xử Lý Lỗi Chuyển Khoản "Gõ Sai" của Khách Hàng:
- **Gõ sai nội dung mã đơn (Memo):** Cỗ máy kế toán sẽ không map được hoá đơn với số tiền. Đơn hàng của bạn sẽ ở trạng thái "Chờ thanh toán" quá giờ và bị hủy tự động sau 2 tiếng. Quý khách vui lòng liên hệ ngay với CSKH Tổng Lãnh Sự 1900-xxxx. Gửi hóa đơn Ủy nhiệm chi / Ảnh chụp màn hình Internet Banking. Nhân viên kế toán sẽ xác minh và gạch nợ thủ công lại đơn hàng cho bạn ngay lập tức.
- **Chuyển thừa số tiền:** Phần tiền còn dư sẽ được hoàn qua mã Voucher mua sắm hoặc bắn trả lại STK gửi tới bạn trong 3-5 ngày làm việc.
- **Chuyển thiếu số tiền:** Đơn hàng sẽ bị pending. Bộ phận Call Center sẽ gọi đến mời bạn bổ sung tiếp số tiến thiếu để Zola đủ điều kiện đóng gói gửi hàng.
- **Xuất hóa đơn đỏ (e-Invoice / Hóa đơn điện tử VAT) cho doanh nghiệp:** Vui lòng check tích vào ô "Yêu cầu hóa đơn cho Công ty" lúc đang checkout, khai báo đầy đủ Mã Số Thuế cá nhân/công ty trước khi ấn kết thúc thanh toán đơn hàng. Biên lai sẽ tự gửi qua Email chỉ 3 phút sau đó.

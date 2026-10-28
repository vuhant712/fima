# FiMa – Quản lý tài chính cá nhân

**Biết tiền đi đâu, tiết kiệm được nhiều hơn.**

FiMa là website giúp bạn ghi chép thu chi hằng ngày, quản lý nhiều ví tiền, đặt ngân sách và xem báo cáo bằng biểu đồ trực quan. Giao diện đơn giản, dễ dùng, có chế độ sáng và tối.

🌐 **Dùng thử:** https://fima-rosy.vercel.app

<img width="946" height="411" alt="image" src="https://github.com/user-attachments/assets/c13f1b7b-072e-4956-a422-3154ff14d1c5" />

---

## FiMa dành cho ai?

- Sinh viên, người trẻ muốn kiểm soát tiền tiêu hằng tháng
- Người đi làm muốn biết mình chi nhiều nhất vào khoản nào
- Bất kỳ ai thấy "thu nhập ổn định mà cuối tháng vẫn không biết tiền đi đâu"

## FiMa làm được gì?

| | Tính năng | Mô tả |
|---|---|---|
| 👛 | **Nhiều ví** | Tiền mặt, ngân hàng, ví điện tử, mỗi nơi một ví riêng |
| 🧾 | **Ghi chép giao dịch** | Tiền chi, tiền thu, chuyển khoản giữa các ví, điều chỉnh số dư |
| 📊 | **Biểu đồ trực quan** | Xem tiền của bạn đi đâu và dòng tiền 7 ngày gần nhất |
| 🎯 | **Ngân sách** | Đặt hạn mức chi tiêu theo danh mục, có cảnh báo khi sắp vượt |
| 📥 | **Báo cáo** | Xem theo tháng, xuất Excel hoặc in thành PDF |
| 🏷️ | **Danh mục riêng** | Có sẵn danh mục phổ biến, bạn tự thêm danh mục theo thói quen của mình |
| 🌙 | **Sáng / Tối** | Đổi giao diện theo sở thích |

---

## Bắt đầu trong 3 bước

### Bước 1: Tạo tài khoản
1. Mở trang chủ FiMa và bấm **Đăng kí**.
2. Nhập **Tài khoản** (3–30 ký tự gồm chữ, số, dấu gạch dưới hoặc dấu chấm) và **Mật khẩu**.
3. Mật khẩu cần **tối thiểu 8 ký tự, có cả chữ và số**. Khi bạn gõ, các điều kiện sẽ chuyển từ ○ sang ✓ để bạn theo dõi.
4. Bấm **Đăng kí**. Khi thấy thông báo **"Đăng kí tài khoản thành công"**, FiMa tự đưa bạn về trang đăng nhập.

### Bước 2: Đăng nhập
- Nhập tài khoản và mật khẩu rồi bấm **Đăng nhập**.
- Hoặc bấm **Tiếp tục với Google** để đăng nhập nhanh, không cần tạo mật khẩu.

### Bước 3: Tạo ví đầu tiên
Lần đầu đăng nhập, FiMa mời bạn tạo ví. Đặt tên (ví dụ *Tiền mặt*) và nhập **số dư hiện tại**. Xong là bạn vào được màn hình chính.

---

## Hướng dẫn sử dụng

### 🏠 Tổng quan
Đây là màn hình chính, cho bạn cái nhìn nhanh về tình hình tài chính:
- **Tổng tài sản:** tổng số dư của tất cả các ví
- **Tổng thu / Tổng chi tháng này:** bạn đã nhận và đã tiêu bao nhiêu
- **Dòng tiền ròng:** thu trừ chi (số dương là bạn đang tiết kiệm được)
- **Cơ cấu chi tiêu:** biểu đồ tròn cho thấy khoản nào tốn tiền nhất
- **Dòng tiền 7 ngày qua:** biểu đồ cột so sánh thu và chi mỗi ngày
- **Giao dịch gần nhất:** các giao dịch mới ghi

### ➕ Thêm giao dịch
Bấm nút **Thêm giao dịch** ở thanh trên cùng, rồi chọn một trong bốn loại:

| Loại | Dùng khi | Cần nhập |
|---|---|---|
| **Tiền chi** | Bạn mua hoặc trả tiền | Số tiền, danh mục, ví, ghi chú, ngày giờ |
| **Tiền thu** | Bạn nhận tiền (lương, thưởng...) | Số tiền, danh mục, ví, ghi chú, ngày giờ |
| **Chuyển khoản** | Chuyển tiền giữa hai ví của bạn | Số tiền, ví nguồn, ví đích |
| **Điều chỉnh số dư** | Số dư trong FiMa lệch so với thực tế | Số dư **mới** của ví, FiMa tự tính phần chênh |

Số dư ví được cập nhật ngay sau khi bạn bấm **Lưu giao dịch**.

> 💡 Ô số tiền tự thêm dấu phẩy, ví dụ gõ `50000` sẽ hiện `50,000`.

### 🧾 Sổ giao dịch
Xem lại toàn bộ lịch sử:
- **Lọc** theo loại giao dịch, theo ví hoặc theo tháng
- **Tìm kiếm** bằng ô tìm ở thanh trên cùng (tìm theo ghi chú hoặc tên danh mục)
- **Sửa:** bấm biểu tượng ✏️ hoặc bấm đúp vào dòng giao dịch
- **Xóa:** bấm biểu tượng 🗑️. Số dư ví sẽ được hoàn lại đúng như chưa từng có giao dịch đó

### 👛 Ví của tôi
- Mỗi ví hiện dưới dạng một thẻ kèm số dư
- **Thêm ví** mới, hoặc bấm ✏️ để đổi tên và icon của ví
- Nút **Chuyển tiền** giúp bạn chuyển nhanh giữa các ví
- Ví đã có giao dịch thì không xóa được, để tránh mất dữ liệu lịch sử

### 🎯 Ngân sách
1. Chọn tháng, rồi bấm **Tạo ngân sách mới**.
2. Chọn danh mục (ví dụ *Cà phê*) và nhập hạn mức (ví dụ 500,000).
3. Thanh tiến độ sẽ đổi màu theo mức đã chi:
   - 🟢 **Xanh:** còn thoải mái
   - 🟡 **Vàng:** đã dùng từ 80% hạn mức
   - 🔴 **Đỏ:** đã vượt, FiMa hiện dòng "Đã vượt ngân sách!"

### 📊 Báo cáo
- Chọn tháng để xem tỷ lệ chi tiêu theo từng danh mục. Rê chuột vào biểu đồ để xem số tiền và phần trăm.
- **Xuất Excel:** tải bảng thống kê và toàn bộ giao dịch của tháng.
- **Xuất PDF:** bấm nút rồi chọn "Lưu dưới dạng PDF" trong hộp thoại in của trình duyệt.

### ⚙️ Cài đặt
- **Giao diện:** chuyển giữa Sáng và Tối
- **Mục icon:** bấm *"Truy cập để chọn icon nhé"* để mở trang chọn icon, rồi dán vào ô icon khi tạo danh mục
- **Quản lý danh mục:** thêm danh mục Thu hoặc Chi theo ý bạn (ví dụ *Tiền mua sữa cho con*), bấm ✕ để xóa
- **Báo lỗi / Góp ý:** viết ý kiến của bạn rồi bấm **Gửi góp ý**
- **Đăng xuất:** thoát khỏi tài khoản

---

## Mẹo dùng FiMa hiệu quả

1. **Ghi ngay khi vừa tiêu.** Để cuối ngày mới ghi rất dễ quên.
2. **Ghi chú ngắn gọn** như "Ăn trưa với đối tác" giúp sau này tìm lại dễ hơn.
3. **Đặt ngân sách cho 2–3 khoản hay vượt** như cà phê, mua sắm, giải trí.
4. **Điều chỉnh số dư** mỗi tuần một lần để FiMa khớp với số tiền thật trong ví và tài khoản.
5. **Xem báo cáo cuối tháng** để biết tháng sau nên cắt giảm khoản nào.

---

## Câu hỏi thường gặp

**Lần đầu mở web thấy chậm, mất khoảng một phút?**
Máy chủ miễn phí sẽ "ngủ" khi lâu không có người dùng. Bạn chờ một chút, lần sau sẽ nhanh bình thường.

**Tôi quên mật khẩu thì sao?**
FiMa hiện chưa có chức năng khôi phục mật khẩu. Bạn hãy ghi nhớ mật khẩu cẩn thận, hoặc dùng **Tiếp tục với Google** để không cần nhớ mật khẩu.

**Số dư ví bị lệch so với thực tế?**
Dùng loại giao dịch **Điều chỉnh số dư**, nhập số dư đúng hiện có, FiMa sẽ tự ghi nhận phần chênh lệch.

**Lỡ nhập sai một giao dịch?**
Bấm sửa hoặc xóa giao dịch đó trong **Sổ giao dịch**, số dư các ví sẽ tự được tính lại đúng.

**Dữ liệu của tôi có người khác xem được không?**
Không. Mỗi tài khoản chỉ xem được dữ liệu của chính mình. Mật khẩu được mã hóa, FiMa không thể đọc được. Chi tiết xem trang **Chính sách quyền riêng tư** ở cuối trang chủ.

**Làm sao xóa tài khoản và dữ liệu?**
Xem hướng dẫn ở trang **Xóa dữ liệu** (cuối trang chủ).

---

## Sắp có

Giao diện tối ưu cho điện thoại, nhắc nhở khi sắp vượt ngân sách, giao dịch lặp lại hằng tháng, tự động gợi ý danh mục bằng AI.

## Liên hệ và góp ý

Bạn gặp lỗi hoặc có ý tưởng hay? Dùng mục **Báo lỗi / Góp ý** trong Cài đặt, hoặc gửi email tới: vuhaltv712gpt@gmail.com

---

*FiMa – Làm chủ tài chính, bắt đầu từ những khoản nhỏ nhất.* 💚

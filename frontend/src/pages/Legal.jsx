import { Link } from 'react-router-dom';

const CONTACT_EMAIL = 'vuhaltv712gpt@gmail.com'; // TODO: đổi thành email thật của bạn
const UPDATED = '26/10/2026';

function Page({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6 leading-relaxed">
      <Link to="/" className="text-green-600">← Về trang chủ FiMa</Link>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-slate-500">Cập nhật lần cuối: {UPDATED}</p>
      {children}
    </div>
  );
}

export function Privacy() {
  return (
    <Page title="Chính sách quyền riêng tư của FiMa">
      <p>FiMa là ứng dụng quản lý thu chi cá nhân. Trang này giải thích chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn như thế nào.</p>

      <h2 className="text-xl font-semibold"><li>Khi đăng ký tài khoản FiMa: tên tài khoản và mật khẩu (mật khẩu được mã hóa một chiều, chúng tôi không đọc được). Khi đăng nhập bằng Google: tên, địa chỉ email và ảnh đại diện công khai. FiMa <b>không</b> nhận mật khẩu Google của bạn.</li></h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Khi đăng nhập bằng Google hoặc Facebook: tên, địa chỉ email và ảnh đại diện công khai của bạn. FiMa <b>không</b> nhận mật khẩu của các tài khoản này.</li>
        <li>Dữ liệu bạn tự nhập vào ứng dụng: ví, danh mục, giao dịch thu chi, ngân sách và ghi chú.</li>
      </ul>

      <h2 className="text-xl font-semibold">2. Mục đích sử dụng</h2>
      <p>Dữ liệu chỉ dùng để nhận diện tài khoản và cung cấp các chức năng của FiMa (ghi chép giao dịch, thống kê, báo cáo, ngân sách). Chúng tôi không bán, cho thuê hay chia sẻ dữ liệu của bạn cho bên thứ ba vì mục đích quảng cáo.</p>

      <h2 className="text-xl font-semibold">3. Lưu trữ và bảo mật</h2>
      <p>Dữ liệu được lưu trong cơ sở dữ liệu PostgreSQL trên hạ tầng của nhà cung cấp dịch vụ đám mây mà FiMa sử dụng. Việc truy cập API được bảo vệ bằng mã thông báo JWT. Trình duyệt của bạn lưu mã thông báo này cục bộ để giữ trạng thái đăng nhập.</p>

      <h2 className="text-xl font-semibold">4. Quyền của bạn</h2>
      <p>Bạn có thể xem, sửa hoặc xóa giao dịch, ví và danh mục ngay trong ứng dụng. Bạn cũng có thể yêu cầu xóa toàn bộ tài khoản và dữ liệu, xem hướng dẫn tại <Link to="/data-deletion" className="text-green-600 underline">trang Xóa dữ liệu</Link>.</p>

      <h2 className="text-xl font-semibold">5. Liên hệ</h2>
      <p>Mọi câu hỏi về quyền riêng tư, vui lòng gửi email tới <a className="text-green-600 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </Page>
  );
}

export function DataDeletion() {
  return (
    <Page title="Hướng dẫn xóa dữ liệu người dùng">
      <p>Bạn có thể yêu cầu FiMa xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên quan (thông tin đăng nhập, ví, giao dịch, ngân sách, danh mục).</p>
      <ol className="list-decimal space-y-1 pl-6">
        <li>Gửi email tới <a className="text-green-600 underline" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Yêu cầu xóa dữ liệu FiMa')}`}>{CONTACT_EMAIL}</a> với tiêu đề “Yêu cầu xóa dữ liệu FiMa”, từ chính địa chỉ email gắn với tài khoản của bạn.</li>
        <li>Chúng tôi sẽ xác minh và xóa dữ liệu trong vòng 30 ngày kể từ khi nhận yêu cầu, sau đó gửi email xác nhận.</li>
      </ol>
    </Page>
  );
}

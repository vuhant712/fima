export function fmtMoney(n) {
  n = Number(n) || 0;
  return new Intl.NumberFormat('vi-VN').format(Math.round(n)) + ' ₫';
}
export const fmtDate = (d) => new Date(d).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
export const thisMonth = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`; };
// 'YYYY-MM' -> [đầu tháng, đầu tháng sau] dạng ISO để gửi lên API
export const monthRange = (m) => { const [y, mo] = m.split('-').map(Number); return [new Date(y, mo - 1, 1).toISOString(), new Date(y, mo, 1).toISOString()]; };
export const nowLocalInput = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

// Ô nhập số tiền, tự thêm dấu phẩy phân cách hàng nghìn (50000 -> 50,000). value là chuỗi số.
export default function MoneyInput({ value, onChange, className = '', ...rest }) {
  const shown = value ? Number(value).toLocaleString('en-US') : '';
  return (
    <input
      {...rest}
      inputMode="numeric"
      className={`input ${className}`}
      value={shown}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
    />
  );
}

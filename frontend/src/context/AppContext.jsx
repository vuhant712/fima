import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fmtMoney } from '../utils/format.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const load = (k, d) => localStorage.getItem(k) ?? d;

export function AppProvider({ children }) {
  const [dark, setDark] = useState(load('dark', '0') === '1');
  const [currency, setCurrency] = useState(load('currency', 'VND'));
  const [lang, setLang] = useState(load('lang', 'vi'));
  const [toastMsg, setToastMsg] = useState(null);
  const [version, setVersion] = useState(0); // tăng lên để các trang tự tải lại dữ liệu (không reload trang)
  const [txModal, setTxModal] = useState({ open: false, editing: null, tab: 'EXPENSE' });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    localStorage.setItem('dark', dark ? '1' : '0');
  }, [dark]);
  useEffect(() => localStorage.setItem('currency', currency), [currency]);
  useEffect(() => localStorage.setItem('lang', lang), [lang]);

  const toast = useCallback((text, type = 'ok') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 2800);
  }, []);
  const bump = useCallback(() => setVersion((v) => v + 1), []);
  const openTxModal = (editing = null, tab = 'EXPENSE') => setTxModal({ open: true, editing, tab });
  const closeTxModal = () => setTxModal((m) => ({ ...m, open: false }));
  const fmt = (n) => fmtMoney(n);

  return (
    <Ctx.Provider value={{ dark, setDark, currency, setCurrency, lang, setLang, toast, version, bump, txModal, openTxModal, closeTxModal, fmt }}>
      {children}
      {toastMsg && (
        <div key={toastMsg.text} role="status" className={`toast ${toastMsg.type === 'err' ? 'toast--err' : 'toast--ok'}`}>
          <span aria-hidden="true">{toastMsg.type === 'err' ? '⚠️' : '✅'}</span>
          {toastMsg.text}
        </div>
      )}
    </Ctx.Provider>
  );
}

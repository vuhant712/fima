import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) return setLoading(false);
    api.get('/auth/me').then((r) => setUser(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // data = { accessToken, refreshToken, user } trả về từ /auth/google hoặc /auth/facebook
  const login = (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

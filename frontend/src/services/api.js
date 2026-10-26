import axios from 'axios';

// Dev: dùng proxy '/api'. Production: đặt VITE_API_URL = https://<backend>.onrender.com/api
const base = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: base });

api.interceptors.request.use((c) => {
  const t = localStorage.getItem('accessToken');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

// Access token hết hạn (401) -> tự dùng refresh token lấy token mới rồi gọi lại
let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    const rt = localStorage.getItem('refreshToken');
    if (err.response?.status === 401 && !orig._retry && rt) {
      orig._retry = true;
      try {
        refreshing = refreshing || axios.post(`${base}/auth/refresh`, { refreshToken: rt }).finally(() => (refreshing = null));
        const { data } = await refreshing;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(orig);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => e.response?.data?.message || e.message || 'Có lỗi xảy ra';
export default api;

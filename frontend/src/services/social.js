// Google: vẽ nút chính thức của Google, trả về ID token qua callback
export function initGoogle(el, onCredential) {
  let tries = 0;
  const init = () => {
    if (!window.google?.accounts?.id) return tries++ < 50 && setTimeout(init, 200);
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (r) => onCredential(r.credential),
    });
    window.google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', text: 'continue_with', width: 300 });
  };
  init();
}

// Facebook: nạp SDK trước (để FB.login chạy ngay trong sự kiện click, không bị chặn popup)
export function loadFacebook() {
  return new Promise((resolve) => {
    if (window.FB) return resolve();
    window.fbAsyncInit = () => {
      window.FB.init({ appId: import.meta.env.VITE_FACEBOOK_APP_ID, version: 'v21.0', cookie: true, xfbml: false });
      resolve();
    };
    const s = document.createElement('script');
    s.src = 'https://connect.facebook.net/en_US/sdk.js';
    s.async = true;
    document.body.appendChild(s);
  });
}

export function facebookLogin() {
  return new Promise((resolve, reject) => {
    if (!window.FB) return reject(new Error('Facebook SDK chưa sẵn sàng'));
    window.FB.login(
      (r) => (r.authResponse ? resolve(r.authResponse.accessToken) : reject(new Error('Bạn đã hủy đăng nhập Facebook'))),
      { scope: 'public_profile,email' }
    );
  });
}

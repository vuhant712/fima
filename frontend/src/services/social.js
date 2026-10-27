export function initGoogle(el, onCredential) {
  let tries = 0;
  const init = () => {
    if (!window.google?.accounts?.id) return tries++ < 50 && setTimeout(init, 200);
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (r) => onCredential(r.credential),
    });
    window.google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', text: 'continue_with', width: 360 });
  };
  init();
}
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const prisma = require('../lib/prisma');
const { wrap, httpErr } = require('../lib/http');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const DEFAULT_CATEGORIES = [
  { type: 'EXPENSE', name: 'Ăn uống', icon: '🍔' },
  { type: 'EXPENSE', name: 'Cà phê', icon: '☕' },
  { type: 'EXPENSE', name: 'Đi lại', icon: '🚕' },
  { type: 'EXPENSE', name: 'Đổ xăng', icon: '⛽' },
  { type: 'EXPENSE', name: 'Tiền nhà', icon: '🏠' },
  { type: 'EXPENSE', name: 'Mua sắm', icon: '🛍️' },
  { type: 'EXPENSE', name: 'Giải trí', icon: '🎬' },
  { type: 'EXPENSE', name: 'Sức khỏe', icon: '💊' },
  { type: 'EXPENSE', name: 'Học tập', icon: '📚' },
  { type: 'EXPENSE', name: 'Khác', icon: '📦' },
  { type: 'INCOME', name: 'Lương', icon: '💼' },
  { type: 'INCOME', name: 'Thưởng', icon: '🎁' },
  { type: 'INCOME', name: 'Đầu tư', icon: '📈' },
  { type: 'INCOME', name: 'Thu nhập khác', icon: '➕' },
];

const signTokens = (id) => ({
  accessToken: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' }),
});

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl, provider: u.provider });

// Tìm theo (provider, providerId) -> theo email -> tạo mới (kèm danh mục mặc định)
async function findOrCreate({ provider, providerId, name, email, avatarUrl }) {
  let user = await prisma.user.findUnique({ where: { provider_providerId: { provider, providerId } } });
  if (!user && email) user = await prisma.user.findUnique({ where: { email } });
  if (user) return { user, isNew: false };
  user = await prisma.user.create({
    data: { provider, providerId, name, email, avatarUrl, categories: { create: DEFAULT_CATEGORIES } },
  });
  return { user, isNew: true };
}

const respond = (res, { user, isNew }) => res.json({ ...signTokens(user.id), user: publicUser(user), isNew });

// Client gửi ID token (credential) lấy từ Google Identity Services
exports.google = wrap(async (req, res) => {
  const { credential } = req.body;
  if (!credential) throw httpErr(400, 'Thiếu credential');
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const p = ticket.getPayload();
  respond(res, await findOrCreate({ provider: 'GOOGLE', providerId: p.sub, name: p.name, email: p.email, avatarUrl: p.picture }));
});

// Client gửi access token từ Facebook SDK
exports.facebook = wrap(async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) throw httpErr(400, 'Thiếu accessToken');
  const appToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
  const dbg = await (await fetch(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appToken}`)).json();
  if (!dbg.data?.is_valid || dbg.data.app_id !== process.env.FACEBOOK_APP_ID) throw httpErr(401, 'Token Facebook không hợp lệ');
  const me = await (await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`)).json();
  if (!me.id) throw httpErr(401, 'Không lấy được thông tin Facebook');
  respond(res, await findOrCreate({ provider: 'FACEBOOK', providerId: me.id, name: me.name, email: me.email, avatarUrl: me.picture?.data?.url }));
});

exports.refresh = wrap(async (req, res) => {
  try {
    const { id } = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET);
    res.json(signTokens(id));
  } catch {
    throw httpErr(401, 'Refresh token không hợp lệ');
  }
});

exports.me = wrap(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) throw httpErr(401, 'Người dùng không tồn tại');
  res.json(publicUser(user));
});

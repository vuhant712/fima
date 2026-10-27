const bcrypt = require('bcryptjs');
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

const USERNAME_RE = /^[a-z0-9_.]{3,30}$/;
const validPassword = (p) => typeof p === 'string' && p.length >= 8 && p.length <= 72 && /[A-Za-z]/.test(p) && /\d/.test(p);
const DUMMY_HASH = bcrypt.hashSync('dummy-password-1', 10); // chống dò tài khoản qua thời gian phản hồi
const normUser = (v) => String(v || '').trim().toLowerCase();

exports.register = wrap(async (req, res) => {
  const username = normUser(req.body.username);
  const { password } = req.body;
  if (!USERNAME_RE.test(username)) throw httpErr(400, 'Tài khoản gồm 3-30 ký tự: chữ, số, dấu _ hoặc .');
  if (!validPassword(password)) throw httpErr(400, 'Mật khẩu tối thiểu 8 ký tự, gồm cả chữ và số');
  try {
    await prisma.user.create({
      data: {
        provider: 'LOCAL', providerId: username, username, name: username,
        passwordHash: await bcrypt.hash(password, 10),
        categories: { create: DEFAULT_CATEGORIES },
      },
    });
  } catch (e) {
    if (e.code === 'P2002') throw httpErr(409, 'Tài khoản đã tồn tại');
    throw e;
  }
  res.status(201).json({ message: 'Đăng kí tài khoản thành công' });
});

exports.login = wrap(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { username: normUser(req.body.username) } });
  const ok = await bcrypt.compare(String(req.body.password || ''), user?.passwordHash || DUMMY_HASH);
  if (!user || !user.passwordHash || !ok) throw httpErr(401, 'Sai tài khoản hoặc mật khẩu');
  respond(res, { user, isNew: false });
});
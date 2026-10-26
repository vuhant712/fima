const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const { wrap, httpErr } = require('../lib/http');

const D = (v) => new Prisma.Decimal(v);
const include = { category: true, wallet: true, toWallet: true };
const TYPES = ['INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT'];

// Tác động của 1 giao dịch lên số dư ví: [[walletId, delta], ...]
function effects(t) {
  const a = D(t.amount);
  if (t.type === 'INCOME' || t.type === 'ADJUSTMENT') return [[t.walletId, a]]; // ADJUSTMENT: amount có dấu (+/-)
  if (t.type === 'EXPENSE') return [[t.walletId, a.neg()]];
  return [[t.walletId, a.neg()], [t.toWalletId, a]]; // TRANSFER
}

// sign = 1: áp dụng, sign = -1: hoàn tác
async function apply(tx, t, sign) {
  for (const [id, delta] of effects(t)) {
    await tx.wallet.update({ where: { id }, data: { balance: { increment: sign === 1 ? delta : delta.neg() } } });
  }
}

// Kiểm tra + chuẩn hóa dữ liệu từ client (ví/danh mục phải thuộc về user)
async function clean(tx, userId, b) {
  if (!TYPES.includes(b.type)) throw httpErr(400, 'Loại giao dịch không hợp lệ');
  let amount;
  try { amount = D(b.amount); } catch { throw httpErr(400, 'Số tiền không hợp lệ'); }
  if (b.type === 'ADJUSTMENT' ? amount.isZero() : amount.lte(0)) throw httpErr(400, 'Số tiền không hợp lệ');

  const walletId = Number(b.walletId);
  const own = async (id) => id && (await tx.wallet.count({ where: { id, userId } }));
  if (!(await own(walletId))) throw httpErr(400, 'Ví không hợp lệ');

  let toWalletId = null;
  if (b.type === 'TRANSFER') {
    toWalletId = Number(b.toWalletId);
    if (toWalletId === walletId || !(await own(toWalletId))) throw httpErr(400, 'Ví đích không hợp lệ');
  }

  let categoryId = null;
  if (b.type === 'INCOME' || b.type === 'EXPENSE') {
    categoryId = Number(b.categoryId);
    const ok = await tx.category.count({ where: { id: categoryId, userId, type: b.type } });
    if (!ok) throw httpErr(400, 'Danh mục không hợp lệ');
  }

  return { type: b.type, amount, walletId, toWalletId, categoryId, note: b.note?.trim() || null, date: b.date ? new Date(b.date) : new Date() };
}

exports.list = wrap(async (req, res) => {
  const { type, walletId, categoryId, from, to, q, limit = 200 } = req.query;
  const AND = [{ wallet: { userId: req.userId } }];
  if (type) AND.push({ type });
  if (categoryId) AND.push({ categoryId: Number(categoryId) });
  if (walletId) AND.push({ OR: [{ walletId: Number(walletId) }, { toWalletId: Number(walletId) }] });
  if (from) AND.push({ date: { gte: new Date(from) } });
  if (to) AND.push({ date: { lt: new Date(to) } });
  if (q) AND.push({ OR: [{ note: { contains: q, mode: 'insensitive' } }, { category: { name: { contains: q, mode: 'insensitive' } } }] });
  res.json(await prisma.transaction.findMany({ where: { AND }, include, orderBy: { date: 'desc' }, take: Math.min(Number(limit), 5000) }));
});

exports.create = wrap(async (req, res) => {
  const row = await prisma.$transaction(async (tx) => {
    const data = await clean(tx, req.userId, req.body);
    const created = await tx.transaction.create({ data, include });
    await apply(tx, created, 1);
    return created;
  });
  res.status(201).json(row);
});

exports.update = wrap(async (req, res) => {
  const id = Number(req.params.id);
  const row = await prisma.$transaction(async (tx) => {
    const old = await tx.transaction.findFirst({ where: { id, wallet: { userId: req.userId } } });
    if (!old) throw httpErr(404, 'Không tìm thấy giao dịch');
    await apply(tx, old, -1);
    const data = await clean(tx, req.userId, req.body);
    const updated = await tx.transaction.update({ where: { id }, data, include });
    await apply(tx, updated, 1);
    return updated;
  });
  res.json(row);
});

exports.remove = wrap(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.$transaction(async (tx) => {
    const old = await tx.transaction.findFirst({ where: { id, wallet: { userId: req.userId } } });
    if (!old) throw httpErr(404, 'Không tìm thấy giao dịch');
    await apply(tx, old, -1); // hoàn lại tiền cho ví
    await tx.transaction.delete({ where: { id } });
  });
  res.status(204).end();
});

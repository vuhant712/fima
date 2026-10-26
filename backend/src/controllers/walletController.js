const prisma = require('../lib/prisma');
const { wrap, httpErr } = require('../lib/http');

exports.list = wrap(async (req, res) => {
  res.json(await prisma.wallet.findMany({ where: { userId: req.userId }, orderBy: { id: 'asc' } }));
});

exports.create = wrap(async (req, res) => {
  const { name, balance = 0, icon } = req.body;
  if (!name?.trim()) throw httpErr(400, 'Thiếu tên ví');
  const wallet = await prisma.wallet.create({ data: { userId: req.userId, name: name.trim(), balance, icon: icon || '💰' } });
  res.status(201).json(wallet);
});

exports.update = wrap(async (req, res) => {
  const id = Number(req.params.id);
  const r = await prisma.wallet.updateMany({ where: { id, userId: req.userId }, data: { name: req.body.name, icon: req.body.icon } });
  if (!r.count) throw httpErr(404, 'Không tìm thấy ví');
  res.json(await prisma.wallet.findUnique({ where: { id } }));
});

exports.remove = wrap(async (req, res) => {
  const id = Number(req.params.id);
  const used = await prisma.transaction.count({ where: { OR: [{ walletId: id }, { toWalletId: id }] } });
  if (used) throw httpErr(400, 'Ví đã có giao dịch, không thể xóa');
  const r = await prisma.wallet.deleteMany({ where: { id, userId: req.userId } });
  if (!r.count) throw httpErr(404, 'Không tìm thấy ví');
  res.status(204).end();
});

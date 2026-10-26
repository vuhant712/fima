const prisma = require('../lib/prisma');
const { wrap, httpErr } = require('../lib/http');

exports.list = wrap(async (req, res) => {
  res.json(await prisma.category.findMany({ where: { userId: req.userId }, orderBy: [{ type: 'asc' }, { id: 'asc' }] }));
});

exports.create = wrap(async (req, res) => {
  const { type, name, icon } = req.body;
  if (!['INCOME', 'EXPENSE'].includes(type) || !name?.trim()) throw httpErr(400, 'Dữ liệu danh mục không hợp lệ');
  res.status(201).json(await prisma.category.create({ data: { userId: req.userId, type, name: name.trim(), icon: icon || '📁' } }));
});

exports.remove = wrap(async (req, res) => {
  const r = await prisma.category.deleteMany({ where: { id: Number(req.params.id), userId: req.userId } });
  if (!r.count) throw httpErr(404, 'Không tìm thấy danh mục');
  res.status(204).end();
});

const prisma = require('../lib/prisma');
const { wrap, httpErr } = require('../lib/http');

const currentMonth = () => new Date().toISOString().slice(0, 7);
const range = (m) => { const [y, mo] = m.split('-').map(Number); return [new Date(y, mo - 1, 1), new Date(y, mo, 1)]; };

exports.list = wrap(async (req, res) => {
  const month = req.query.month || currentMonth();
  const [gte, lt] = range(month);
  const budgets = await prisma.budget.findMany({ where: { userId: req.userId, month }, include: { category: true } });
  const spentRows = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { type: 'EXPENSE', wallet: { userId: req.userId }, date: { gte, lt } },
    _sum: { amount: true },
  });
  const spent = Object.fromEntries(spentRows.map((r) => [r.categoryId, Number(r._sum.amount)]));
  res.json(budgets.map((b) => ({ ...b, limitAmount: Number(b.limitAmount), spent: spent[b.categoryId] || 0 })));
});

exports.create = wrap(async (req, res) => {
  const { categoryId, limitAmount, month = currentMonth() } = req.body;
  const cat = await prisma.category.findFirst({ where: { id: Number(categoryId), userId: req.userId, type: 'EXPENSE' } });
  if (!cat || !(Number(limitAmount) > 0)) throw httpErr(400, 'Dữ liệu ngân sách không hợp lệ');
  const data = { userId: req.userId, categoryId: cat.id, month };
  const b = await prisma.budget.upsert({
    where: { userId_categoryId_month: data },
    update: { limitAmount },
    create: { ...data, limitAmount },
  });
  res.status(201).json(b);
});

exports.remove = wrap(async (req, res) => {
  const r = await prisma.budget.deleteMany({ where: { id: Number(req.params.id), userId: req.userId } });
  if (!r.count) throw httpErr(404, 'Không tìm thấy ngân sách');
  res.status(204).end();
});

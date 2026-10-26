const prisma = require('../lib/prisma');
const { wrap } = require('../lib/http');

const monthStart = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); };
const sumOf = async (userId, type, gte) => {
  const r = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { type, wallet: { userId }, date: { gte } } });
  return Number(r._sum.amount || 0);
};
const key = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

// 3 thẻ: tổng tài sản, thu & chi tháng này
exports.summary = wrap(async (req, res) => {
  const assets = await prisma.wallet.aggregate({ _sum: { balance: true }, where: { userId: req.userId } });
  const gte = monthStart();
  res.json({
    totalAssets: Number(assets._sum.balance || 0),
    monthIncome: await sumOf(req.userId, 'INCOME', gte),
    monthExpense: await sumOf(req.userId, 'EXPENSE', gte),
  });
});

// Cơ cấu chi tiêu theo danh mục: [{ name, icon, value }]
exports.expenses = wrap(async (req, res) => {
  const { from, to } = req.query;
  const date = { gte: from ? new Date(from) : monthStart() };
  if (to) date.lt = new Date(to);
  const rows = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { type: 'EXPENSE', wallet: { userId: req.userId }, date },
    _sum: { amount: true },
  });
  const cats = await prisma.category.findMany({ where: { userId: req.userId } });
  const byId = Object.fromEntries(cats.map((c) => [c.id, c]));
  res.json(
    rows
      .map((r) => ({ name: byId[r.categoryId]?.name || 'Khác', icon: byId[r.categoryId]?.icon || '', value: Number(r._sum.amount) }))
      .sort((a, b) => b.value - a.value)
  );
});

// Thu - chi 7 ngày gần nhất: [{ date: '26/10', income, expense }]
exports.weekly = wrap(async (req, res) => {
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i); days.push(d); }
  const rows = await prisma.transaction.findMany({
    where: { type: { in: ['INCOME', 'EXPENSE'] }, wallet: { userId: req.userId }, date: { gte: days[0] } },
    select: { type: true, amount: true, date: true },
  });
  const out = days.map((d) => ({ k: key(d), date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`, income: 0, expense: 0 }));
  for (const r of rows) {
    const o = out.find((x) => x.k === key(r.date));
    if (o) o[r.type === 'INCOME' ? 'income' : 'expense'] += Number(r.amount);
  }
  res.json(out.map(({ k, ...rest }) => rest));
});

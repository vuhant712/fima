const prisma = require('../lib/prisma');
const { wrap, httpErr } = require('../lib/http');

const serialize = (goal) => ({
  ...goal,
  targetAmount: Number(goal.targetAmount),
  savedAmount: Number(goal.savedAmount),
});

exports.list = wrap(async (req, res) => {
  const goals = await prisma.savingsGoal.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(goals.map(serialize));
});

exports.create = wrap(async (req, res) => {
  const { name, description, icon = '🎯', targetAmount, savedAmount = 0, targetDate } = req.body;
  const target = Number(targetAmount);
  const saved = Number(savedAmount);
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80
    || !Number.isFinite(target) || target <= 0
    || !Number.isFinite(saved) || saved < 0 || saved > target
    || (description != null && (typeof description !== 'string' || description.length > 240))
    || (targetDate && Number.isNaN(new Date(targetDate).getTime()))) {
    throw httpErr(400, 'Dữ liệu mục tiêu tiết kiệm không hợp lệ');
  }

  const goal = await prisma.savingsGoal.create({
    data: {
      userId: req.userId,
      name: name.trim(),
      description: description?.trim() || null,
      icon: typeof icon === 'string' && icon.length <= 8 ? icon : '🎯',
      targetAmount: target,
      savedAmount: saved,
      targetDate: targetDate ? new Date(targetDate) : null,
    },
  });
  res.status(201).json(serialize(goal));
});

exports.contribute = wrap(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw httpErr(400, 'Số tiền đóng góp phải lớn hơn 0');

  const goal = await prisma.savingsGoal.findFirst({ where: { id: Number(req.params.id), userId: req.userId } });
  if (!goal) throw httpErr(404, 'Không tìm thấy mục tiêu tiết kiệm');
  if (amount > Number(goal.targetAmount) - Number(goal.savedAmount)) {
    throw httpErr(400, 'Số tiền đóng góp vượt quá số tiền còn lại của mục tiêu');
  }

  const updated = await prisma.savingsGoal.update({
    where: { id: goal.id },
    data: { savedAmount: { increment: amount } },
  });
  res.json(serialize(updated));
});

exports.remove = wrap(async (req, res) => {
  const result = await prisma.savingsGoal.deleteMany({
    where: { id: Number(req.params.id), userId: req.userId },
  });
  if (!result.count) throw httpErr(404, 'Không tìm thấy mục tiêu tiết kiệm');
  res.status(204).end();
});

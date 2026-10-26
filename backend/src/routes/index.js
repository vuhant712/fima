const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const a = require('../controllers/authController');
const w = require('../controllers/walletController');
const c = require('../controllers/categoryController');
const t = require('../controllers/transactionController');
const b = require('../controllers/budgetController');
const r = require('../controllers/reportController');

// Công khai
router.post('/auth/google', a.google);
router.post('/auth/facebook', a.facebook);
router.post('/auth/refresh', a.refresh);

// Cần JWT
router.use(auth);
router.get('/auth/me', a.me);

router.get('/wallets', w.list);
router.post('/wallets', w.create);
router.put('/wallets/:id', w.update);
router.delete('/wallets/:id', w.remove);

router.get('/categories', c.list);
router.post('/categories', c.create);
router.delete('/categories/:id', c.remove);

router.get('/transactions', t.list);
router.post('/transactions', t.create);
router.put('/transactions/:id', t.update);
router.delete('/transactions/:id', t.remove);

router.get('/budgets', b.list);
router.post('/budgets', b.create);
router.delete('/budgets/:id', b.remove);

router.get('/reports/summary', r.summary);
router.get('/reports/expenses', r.expenses);
router.get('/reports/weekly', r.weekly);

module.exports = router;

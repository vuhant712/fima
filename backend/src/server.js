require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api', routes);

// Error handler chung
app.use((err, req, res, next) => {
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Lỗi máy chủ' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`FiMa API chạy tại http://localhost:${port}`));

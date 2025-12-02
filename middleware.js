import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import rateRouter from './src/routes/rateRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 首先定义动态路由，确保它们优先于静态文件服务

// 根路径重定向到 /currencies-rate，/currencies-rate 显示货币列表页面
app.get(['/', '/currencies-rate'], (req, res) => {
  if (req.path === '/') {
    res.redirect('/currencies-rate');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// 处理 /currencies-rate/:baseCurrency/:targetCurrency 路径，显示货币兑换详情页面
app.get('/currencies-rate/:baseCurrency/:targetCurrency', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rate-detail.html'));
});

// 处理 /currencies-rate/:currencyCode 路径，显示汇率详情页面
app.get('/currencies-rate/:currencyCode', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rate-detail.html'));
});

// 添加静态文件服务，只服务于特定文件类型，避免拦截动态路由
app.use('/public', express.static('./public', { index: false }));

app.use('', rateRouter);

export default app;

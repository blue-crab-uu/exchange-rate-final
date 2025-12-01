import express from 'express';

import cors from 'cors';

import rateRouter from './src/routes/rateRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
// 添加静态文件服务
app.use(express.static('.'));
app.use('', rateRouter);

export default app;

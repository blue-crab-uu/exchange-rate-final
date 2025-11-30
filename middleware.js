import express from 'express';

import cors from 'cors';

import rateRouter from './src/routes/rateRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('', rateRouter);

export default app;

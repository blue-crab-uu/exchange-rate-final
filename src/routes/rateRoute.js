import express from 'express';
import { getDayALLRatesController, getONneHistoryRatesController, getCurrencyListController } from '../controllers/rateController.js';

const router = express.Router();

// 获取指定日期的所有汇率
router.get('/day-all-rates', getDayALLRatesController);

// 获取指定日期的指定货币对汇率 - 使用查询字符串格式
router.get('/history-rates', getONneHistoryRatesController);

// 获取支持的货币列表
router.get('/currency-list', getCurrencyListController);

export default router;
import express from 'express';
import { getDayALLRatesController, getONneHistoryRatesController, getCurrencyListController, getLatestRateDateController, getHistoricalRatesController, getTargetCurrencyRatesController } from '../controllers/rateController.js';
import { getExchangeRateListController, fetchHistoricalRatesController, fetchLatestRatesController } from '../controllers/devRateContorller.js';
const router = express.Router();

// 获取指定日期的所有汇率
router.post('/day-all-rates', getDayALLRatesController);

// 获取指定日期的指定货币对汇率 - 使用查询字符串格式
router.post('/history-rates', getONneHistoryRatesController);

// 获取支持的货币列表
router.get('/currency-list', getCurrencyListController);

// 获取数据库中最新的rate_date
router.get('/latest-rate-date', getLatestRateDateController);

// 获取除去最新日期的5天历史数据
router.get('/historical-rates', getHistoricalRatesController);

// 获取指定基础货币，目标货币最近datetime天的历史汇率，默认为base_currency = 'EUR',datetime = 7
router.post('/target-currency-rates', getTargetCurrencyRatesController);

// 开发用 - 获取 Frankfurter 支持的所有货币列表并存储到数据库
router.get('/dev/currency-list', getExchangeRateListController);

// 开发用 - 获取指定日期范围内的历史汇率数据并存储到数据库
router.post('/dev/historical-rates', fetchHistoricalRatesController);

// 开发用 - 获取 Frankfurter 的最新汇率数据并存储到数据库
router.get('/dev/latest-rates', fetchLatestRatesController);

export default router;
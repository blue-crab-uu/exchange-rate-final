import { getDayALLRates, getONneHistoryRates, getCurrencyList, getLatestRateDate, getHistoricalRates, getTargetCurrencyRates } from '../server/rateServer.js';


// 查询数据库指定日期默认货币为EUR的汇率
export async function getDayALLRatesController(req, res) {
  const { base_currency, date } = req.body;
  console.log('收到一日多货币汇率查询请求:', { base_currency, date });
  try {
    const historyRates = await getDayALLRates(base_currency, date);
    console.log('查询成功，返回数据条数:', historyRates.length);
    res.json(historyRates);
  } catch (error) {
    console.error('查询失败:', error);
    res.status(500).json({ error: '获取汇率失败' });
  }
};

// 查询数据库指定日期指定目标货币的汇率，默认基础货币为EUR
export async function getONneHistoryRatesController(req, res) {
  const { base_currency, target_currency, date } = req.body;
  try {
    const historyRates = await getONneHistoryRates(base_currency, target_currency, date);
    res.json(historyRates);
  } catch (error) {
    res.status(500).json({ error: '获取汇率失败' });
  }
};

// 查询数据库所有支持的货币列表
export async function getCurrencyListController(_req, res) {
  try {
    const currencyList = await getCurrencyList();
    res.json(currencyList);
  } catch (error) {
    res.status(500).json({ error: '获取货币列表失败' });
  }
};

// 获取数据库中最新的rate_date
export async function getLatestRateDateController(req, res) {
  const { currency } = req.query;
  try {
    const latestRates = await getLatestRateDate(currency);
    res.json({ latestRates });
  } catch (error) {
    res.status(500).json({ error: '获取最新汇率日期失败' });
  }
}

// 获取除去最新日期的5天历史数据
export async function getHistoricalRatesController(req, res) {
  const { currency } = req.query;
  try {
    const historicalRates = await getHistoricalRates(currency);
    res.json({ historicalRates });
  } catch (error) {
    console.error('获取历史汇率失败:', error);
    res.status(500).json({ error: '获取历史汇率失败' });
  }
}

// 查询数据库指定基础货币，目标货币最近datetime天的历史汇率，默认为base_currency = 'EUR',datetime = 7
export async function getTargetCurrencyRatesController(req, res) {
  const { target_currency, datetime = 7, base_currency = 'EUR' } = req.body;

  if (!target_currency) {
    return res.status(400).json({ error: '目标货币不能为空' });
  }

  try {
    const historicalRates = await getTargetCurrencyRates(target_currency, datetime, base_currency);
    res.json({ historicalRates });
  } catch (error) {
    console.error('获取历史汇率失败:', error);
    res.status(500).json({ error: '获取历史汇率失败' });
  }
}

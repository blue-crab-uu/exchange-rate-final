import { getDayALLRates, getONneHistoryRates, getCurrencyList } from '../server/rateServer.js';

// 查询数据库指定日期默认货币为USD的汇率
export async function getDayALLRatesController(req, res) {
  const { base_currency, date } = req.query;
  try {
    const historyRates = await getDayALLRates(base_currency, date);
    res.json(historyRates);
  } catch (error) {
    res.status(500).json({ error: '获取汇率失败' });
  }
};

// 查询数据库指定日期指定目标货币的汇率，默认基础货币为USD
export async function getONneHistoryRatesController(req, res) {
  const { base_currency, target_currency, date } = req.query;
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
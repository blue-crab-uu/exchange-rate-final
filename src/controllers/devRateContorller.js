import { fetchHistoricalRates, getExchangeRateList, fetchLatestRates } from '../server/frankfutureService.js'
// 从 Frankfurter 获取所有支持的货币列表并更新到数据库
export async function getExchangeRateListController(req, res) {
  try {
    const currencyList = await getExchangeRateList();
    res.json(currencyList);
  } catch (error) {
    res.status(500).json({ error: '获取货币列表失败' });
  }
}

// 从 Frankfurter 获取指定日期范围内的历史汇率数据并更新到数据库
export async function fetchHistoricalRatesController(req, res) {
  const { startDate, endDate } = req.body;
  try {
    await fetchHistoricalRates(startDate, endDate);
    res.json({ message: `成功更新 ${startDate} 到 ${endDate} 的历史汇率数据` });
  } catch (error) {
    res.status(500).json({ error: '获取历史汇率数据失败' });
  }
}

// 从 Frankfurter 获取最新汇率数据并更新到数据库
export async function fetchLatestRatesController(req, res) {
  try {
    const data = await fetchLatestRates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '获取最新汇率数据失败' });
  }
}
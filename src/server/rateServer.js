import HistoryRate from "../models/historyRateModels.js";
import CurrencyListModel from "../models/currencies.js";

// 查询数据库指定日期默认货币为EUR的汇率
export async function getDayALLRates(date, base_currency = 'EUR',) {
  console.log(`getDayALLRates 被调用: base_currency=${base_currency}, date=${date}`);
  if (!date) {
    throw new Error('日期不能为空');
  }
  try {
    const historyRates = await HistoryRate.findAll({
      where: {
        base_currency: base_currency,
        rate_date: date
      }
    });
    console.log(`getDayALLRates 查询成功: 找到 ${historyRates.length} 条记录`);
    return historyRates;
  } catch (error) {
    console.error(`获取${base_currency}到所有货币的汇率失败:`, error);
    throw error;
  }
}


// 查询数据库指定日期指定目标货币的汇率，默认基础货币为EUR
export async function getONneHistoryRates(base_currency = 'EUR', target_currency, date) {
  if (!target_currency && !date) {
    throw new Error('目标货币和日期不能为空');
  }
  try {
    const historyRates = await HistoryRate.findOne({
      where: {
        base_currency: base_currency,
        target_currency: target_currency,
        rate_date: date
      }
    });
    return historyRates;
  } catch (error) {
    console.error(`获取日期为${date}的${base_currency}到${target_currency}的汇率失败:`, error);
    throw error;
  }
};

// 查询数据库所有支持的货币列表
export async function getCurrencyList() {
  try {
    const currencies = await CurrencyListModel.findAll();
    return currencies;
  } catch (error) {
    console.error(`获取货币列表失败:`, error);
    throw error;
  }
}

// 查找数据库中最新的rate_date
export async function getLatestRateDate() {
  try {
    const latestRate = await HistoryRate.findOne({
      order: [['rate_date', 'DESC']],
      attributes: ['rate_date']
    });
    const latestDate = latestRate ? latestRate.rate_date : null;
    const latestRates = await getDayALLRates(latestDate);

    return latestRates;
  } catch (error) {
    console.error(`获取最新汇率日期失败:`, error);
    throw error;
  }
}






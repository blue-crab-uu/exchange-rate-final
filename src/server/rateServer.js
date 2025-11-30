import HistoryRate from "../models/historyRateModels.js";
import CurrencyListModel from "../models/currencies.js";
// 查询数据库指定日期默认货币为EUR的汇率
export async function getDayALLRates(base_currency = 'EUR', date) {
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
    return historyRates;
  } catch (error) {
    console.error(`获取${base_currency}到所有货币的汇率失败:`, error);
    throw error;
  }
}


// 查询数据库指定日期指定目标货币的汇率，默认基础货币为EUR
export async function getONneHistoryRates(baseCurrency = 'EUR', targetCurrency, date) {
  if (!targetCurrency && !date) {
    throw new Error('目标货币和日期不能为空');
  }
  try {
    const historyRates = await HistoryRate.findOne({
      where: {
        base_currency: baseCurrency,
        target_currency: targetCurrency,
        rate_date: date
      }
    });
    return historyRates;
  } catch (error) {
    console.error(`获取日期为${date}的${baseCurrency}到${targetCurrency}的汇率失败:`, error);
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






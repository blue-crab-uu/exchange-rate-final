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

// 获取除去最新日期的5天历史数据
export async function getHistoricalRates() {
  try {
    // 获取所有不同的日期，按日期降序排列
    const allDates = await HistoryRate.findAll({
      attributes: ['rate_date'],
      group: ['rate_date'],
      order: [['rate_date', 'DESC']]
    });

    console.log(`数据库中不同的日期数量: ${allDates.length}`);

    // 如果数据不足2天，则返回空数组
    if (allDates.length <= 1) {
      console.log('数据不足，无法获取历史数据');
      return [];
    }

    // 获取除去最新日期的前5天历史日期
    const historicalDates = allDates.slice(1, 6);
    console.log(`历史日期: ${historicalDates.map(d => d.rate_date).join(', ')}`);

    const historicalRates = [];

    // 为每个历史日期获取汇率数据
    for (const dateObj of historicalDates) {
      const date = dateObj.rate_date;
      console.log(`获取日期 ${date} 的汇率数据...`);
      const ratesForDate = await getDayALLRates(date);

      historicalRates.push({
        date: date,
        rates: ratesForDate
      });
    }

    console.log(`获取历史数据成功: 共 ${historicalRates.length} 天的数据`);
    return historicalRates;
  } catch (error) {
    console.error(`获取历史汇率数据失败:`, error);
    throw error;
  }
}

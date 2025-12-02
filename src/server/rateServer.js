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
export async function getLatestRateDate(base_currency = 'EUR') {
  try {
    const latestRate = await HistoryRate.findOne({
      where: { base_currency },
      order: [['rate_date', 'DESC']],
      attributes: ['rate_date']
    });

    // 如果没有找到指定货币的数据，返回空数组
    if (!latestRate) {
      console.log(`未找到${base_currency}货币的汇率数据`);
      return [];
    }

    const latestDate = latestRate.rate_date;
    const latestRates = await getDayALLRates(latestDate, base_currency);

    return latestRates;
  } catch (error) {
    console.error(`获取${base_currency}最新汇率日期失败:`, error);
    throw error;
  }
}

// 获取除去最新日期的5天历史数据
export async function getHistoricalRates(base_currency = 'EUR') {
  try {
    // 获取所有不同的日期，按日期降序排列
    const allDates = await HistoryRate.findAll({
      where: { base_currency },
      attributes: ['rate_date'],
      group: ['rate_date'],
      order: [['rate_date', 'DESC']]
    });

    console.log(`数据库中${base_currency}不同的日期数量: ${allDates.length}`);

    // 如果数据不足2天，则返回空数组
    if (allDates.length <= 1) {
      console.log('数据不足，无法获取历史数据');
      return [];
    }

    // 获取除去最新日期的前5天历史日期
    const historicalDates = allDates.slice(1, 6);
    console.log(`${base_currency}历史日期: ${historicalDates.map(d => d.rate_date).join(', ')}`);

    const historicalRates = [];

    // 为每个历史日期获取汇率数据
    for (const dateObj of historicalDates) {
      const date = dateObj.rate_date;
      console.log(`获取${base_currency}日期 ${date} 的汇率数据...`);
      const ratesForDate = await getDayALLRates(date, base_currency);

      historicalRates.push({
        date: date,
        rates: ratesForDate
      });
    }

    console.log(`获取${base_currency}历史数据成功: 共 ${historicalRates.length} 天的数据`);
    return historicalRates;
  } catch (error) {
    console.error(`获取${base_currency}历史汇率数据失败:`, error);
    throw error;
  }
}

// 查询指定基础货币，目标货币最近datetime天的历史汇率，默认为base_currency = 'EUR',datetime = 7
export async function getTargetCurrencyRates(target_currency, datetime = 7, base_currency = 'EUR') {
  try {
    const allDates = await HistoryRate.findAll({
      where: { base_currency, target_currency },
      attributes: ['rate_date'],
      group: ['rate_date'],
      order: [['rate_date', 'DESC']]
    });



    // 获取datetime天历史日期
    const historicalDates = allDates.slice(0, datetime);


    const historicalRates = [];

    // 为每个历史日期获取目标货币的汇率数据
    for (const dateObj of historicalDates) {
      const date = dateObj.rate_date;
      console.log(`获取${base_currency}日期 ${date} 的${target_currency}汇率数据...`);
      const rateForDate = await getONneHistoryRates(base_currency, target_currency, date);

      historicalRates.push({
        date: date,
        target_currency: target_currency,
        rate: rateForDate
      });
    }
    return historicalRates;
  } catch (error) {
    console.error(`获取${base_currency}到${target_currency}最近${datetime}天历史汇率数据失败:`, error);
    throw error;
  }
}

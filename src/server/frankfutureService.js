import axios from 'axios';

import CurrencyList from '../models/currencies.js';
import HistoryRate from '../models/historyRateModels.js';

const frankfurterbaseURL = process.env.FRANKFURTER_API_URL || 'https://api.frankfurter.dev/v1'

// 获取 Frankfurter 支持的所有货币列表并且更新到数据库
export async function getExchangeRate() {
  try {
    const response = await axios.get(`${frankfurterbaseURL}/currencies`, {
      timeout: 5000  // 5秒超时
    });
    const currencyCount = Object.keys(response.data).length;
    console.log(`✅ 获取到 ${currencyCount} 种支持的货币`);
    // 如果表格不存在，则建一个表格
    await CurrencyList.sync({ force: false });
    // 更新数据库 - 修复：移到try块内，return之前执行
    await CurrencyList.bulkCreate(
      Object.keys(response.data).map(code => ({
        currency_code: code,
        currency_name: response.data[code]
      })),
      {
        updateOnDuplicate: ['currency_code', 'currency_name']  // 存在则更新货币名称
      }
    );
    console.log(`✅ 成功更新 ${currencyCount} 条货币记录到数据库`);

    return response.data;
  } catch (error) {
    console.error('❌ 获取货币列表失败:', error.message);
    throw error;
  }
}

// 获取以EUR为基准的历史汇率
// 抓取指定日期范围内的历史汇率数据并存储到数据库中
export async function fetchHistoricalRates(startDate, endDate) {
  try {
    console.log(`\n📊 开始抓取 ${startDate} 到 ${endDate} 的历史汇率数据...`);

    const response = await axios.get(`${frankfurterbaseURL}/${startDate}..${endDate}`, {
      timeout: 10000  // 增加到10秒超时
    });

    const { base, rates } = response.data;
    const dates = Object.keys(rates);

    console.log(`✅ 成功获取 ${dates.length} 天的汇率数据，基准货币: ${base}`);

    // 同步数据库模型
    await HistoryRate.sync({ force: false });

    // 分批处理数据（每批1000条）
    const allRecords = [];
    dates.forEach(date => {
      Object.keys(rates[date]).forEach(targetCurrency => {
        const rate = rates[date][targetCurrency];
        // 数据验证
        if (typeof rate === 'number' && rate > 0) {
          allRecords.push({
            rate_date: date,
            base_currency: base,
            target_currency: targetCurrency,
            exchange_rate: rate
          });
        }
      });
    });

    console.log(`📝 准备插入 ${allRecords.length} 条有效汇率记录`);

    // 分批插入（每批1000条）
    const batchSize = 1000;
    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, i + batchSize);
      await HistoryRate.bulkCreate(batch, {
        updateOnDuplicate: ['exchange_rate'], // 存在则更新汇率
        validate: true
      });
      console.log(`✅ 已插入第 ${Math.floor(i / batchSize) + 1} 批数据 (${batch.length} 条)`);
    }

    console.log(`🎉 历史汇率数据存储完成，共 ${allRecords.length} 条记录`);
    return rates;

  } catch (error) {
    console.error('❌ 抓取历史汇率数据失败:', error.message);

    // 添加重试逻辑
    if (error.code === 'ECONNABORTED' || error.response?.status >= 500) {
      console.log('🔄 5秒后重试...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return fetchHistoricalRates(startDate, endDate);
    }

    throw error;
  }
}
// 测试脚本：运行 frankfurtuer 服务功能
import dotenv from 'dotenv';
import { fetchHistoricalRates } from './src/server/frankfutureService.js';

// 加载环境变量
dotenv.config();

async function testServices() {
  try {
    console.log('🔍 开始测试服务功能...');


    const startDate = '2025-01-04';
    const endDate = '2025-11-29';
    const historicalRates = await fetchHistoricalRates(startDate, endDate);
    console.log(`\n📅 示例日期：${startDate}`);
    console.log(`💱 该日期汇率数据：${Object.keys(historicalRates[startDate]).length} 种货币`);
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('   错误详情:', error);
    process.exit(1);
  }
}

// 执行测试
testServices();
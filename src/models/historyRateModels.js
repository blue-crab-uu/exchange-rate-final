import sequelize from '../utils/dbHelper.js';

import { DataTypes } from 'sequelize';


const HistoryRate = sequelize.define('HistoryRate', {
  // 主键ID - 每条记录的唯一标识
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  base_currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate: {
      isUppercase: true,
      len: [3, 3]
    },
    comment: '基础货币代码，3位大写字母'
  },
  target_currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate: {
      isUppercase: true,
      len: [3, 3]
    },
    comment: '目标货币代码，3位大写字母'
  },
  rate_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    },
    comment: '汇率的生效日期'
  },
  exchange_rate: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    },
    comment: '汇率数值，精确到6位小数'
  }
},
  {
    tableName: 'history_rate',
    timestamps: true,
    underscored: false,
    indexes: [
      {
        unique: true,
        fields: ['base_currency', 'target_currency', 'rate_date'],
        name: 'unique_history_currency_pair_date'
      },
      {
        fields: ['base_currency'],
        name: 'idx_history_base_currency'
      },
      {
        fields: ['rate_date'],
        name: 'idx_history_rate_date'
      }
    ],

    // 表注释
    comment: '存储历史汇率数据'
  });
export default HistoryRate;

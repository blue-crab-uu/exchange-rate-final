import sequelize from '../utils/dbHelper.js';
import { DataTypes } from 'sequelize';
// 支持的货币列表

const CurrencyList = sequelize.define('currencyList', {
  // 主键ID - 每条记录的唯一标识
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  currency_code: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate: {
      isUppercase: true,
      len: [3, 3]
    },
    comment: '货币代码，3位大写字母'
  },
  currency_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '货币名称，最大50个字符'
  },
},
  {
    tableName: 'currency_list',
    timestamps: true,
    underscored: false,
    indexes: [
      {
        unique: true,
        fields: ['currency_code'],
        name: 'unique_currency_list'
      }
    ],

    // 表注释
    comment: '存储支持的货币列表'
  });
export default CurrencyList;

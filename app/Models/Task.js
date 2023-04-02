'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  Task.init({
    user_id      : DataTypes.INTEGER,
    title        : DataTypes.STRING,
    description        : DataTypes.STRING,
    due        : DataTypes.DATE,
    expires_at   : DataTypes.DATE,
  }, {
    sequelize,
      modelName: 'Task',
      timestamps: true,
      paranoid: true,
      underscored: true
  });
  return Task;
};
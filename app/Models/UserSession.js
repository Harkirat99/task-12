'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  UserSession.init({
    user_id      : DataTypes.INTEGER,
    token        : DataTypes.STRING,
    expires_at   : DataTypes.DATE,
    created_at   : DataTypes.DATE
  }, {
    sequelize,
      modelName: 'UserSession',
      timestamps: false,
      underscored: true
  });
  return UserSession;
};
'use strict';
const bcrypt = require("bcrypt");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Auth.init({
    authId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    passwordhash: {
     type: DataTypes.STRING,
     allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expireAt: {
      type:DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Auth',
  });
  Auth.beforeCreate(async (auth)=> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(auth.passwordhash, salt);
    auth.passwordhash = hashedPassword;
  });
  return Auth;
};
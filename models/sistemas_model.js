'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sistemas_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sistemas_model.init({
    cn_id_sistema: DataTypes.INTEGER,
    ct_descripcion_sistema: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sistemas_model',
  });
  return sistemas_model;
};
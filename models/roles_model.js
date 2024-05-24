'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  roles_model.init({
    cn_id_rol: DataTypes.INTEGER,
    ct_descripcion_rol: DataTypes.STRING,
    cn_id_sistema: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'roles_model',
  });
  return roles_model;
};
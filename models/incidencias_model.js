const { DataTypes } = require('sequelize');
const sequelize = require('../database');

    const incidencias_model = sequelize.define('usuario', {
    ct_id_incidencia:  {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    ct_titulo_incidencia:  {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    ct_descripcion_incidencia:  {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    ct_lugar:  {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cf_fecha_completa_incidencia:  {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.DATE
    },
    cn_id_estado:  {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.INTEGER,
      references: {
        model: 't_estados',
        key: 'cn_id_pantalla'
      }
    },
    ct_justificacion_incidencia:  {
      allowNull: true,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cn_id_prioridad:  {
      allowNull: true,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cn_id_riesgo:  {
      allowNull: true,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cn_id_categoria:  {
      allowNull: true,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cn_monto_compra_materiales:  {
      allowNull: true,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cn_duracion_compra:  {
      allowNull: true,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cn_id_image:  {
      allowNull: true,
      autoIncrement: false,
      type: DataTypes.STRING
    },
    cn_id_usuario_registro:  {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.STRING
    }
  },  {
    timestamps: false,
    tableName: 't_incidentes',
});
 
module.exports = incidencias_model;

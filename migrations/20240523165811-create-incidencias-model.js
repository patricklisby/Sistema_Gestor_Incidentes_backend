'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incidencias_models', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ct_id_incidencia: {
        type: Sequelize.STRING
      },
      ct_titulo_incidencia: {
        type: Sequelize.STRING
      },
      ct_descripcion_incidencia: {
        type: Sequelize.STRING
      },
      ct_lugar: {
        type: Sequelize.STRING
      },
      cf_fecha_completa_incidencia: {
        type: Sequelize.DATE
      },
      cn_id_estado: {
        type: Sequelize.INTEGER
      },
      ct_justificacion_incidencia: {
        type: Sequelize.STRING
      },
      cn_id_prioridad: {
        type: Sequelize.INTEGER
      },
      cn_id_riesgo: {
        type: Sequelize.INTEGER
      },
      cn_id_categoria: {
        type: Sequelize.INTEGER
      },
      cn_monto_compra_materiales: {
        type: Sequelize.INTEGER
      },
      cn_duracion_compra: {
        type: Sequelize.INTEGER
      },
      cn_id_image: {
        type: Sequelize.INTEGER
      },
      cn_id_usuario_registro: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('incidencias_models');
  }
};
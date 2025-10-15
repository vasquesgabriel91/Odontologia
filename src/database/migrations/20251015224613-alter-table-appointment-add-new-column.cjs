"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("appointments", "descricao", {
      type: Sequelize.STRING(30),
      allowNull: true,
      after: "status", 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("appointments", "descricao");
  },
};

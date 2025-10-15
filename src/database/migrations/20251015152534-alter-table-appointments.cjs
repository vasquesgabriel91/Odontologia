"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("appointments", "startTime", {
      type: Sequelize.STRING(10),
      allowNull: false,
      after: "date", 
    });

    await queryInterface.addColumn("appointments", "endTime", {
      type: Sequelize.STRING(10),
      allowNull: false,
      after: "startTime",
    });
  },

  async down(queryInterface, Sequelize) {
    // remove colunas caso o rollback seja executado
    await queryInterface.removeColumn("appointments", "startTime");
    await queryInterface.removeColumn("appointments", "endTime");
  },
};

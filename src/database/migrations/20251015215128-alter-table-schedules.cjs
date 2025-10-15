"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("doctor_schedules", "dateOfWeek", {
      type: Sequelize.STRING(10),
      allowNull: true,
      after: "dayOfWeek", 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("doctor_schedules", "dateOdWeek");
  },
};

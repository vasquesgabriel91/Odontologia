"use strict";

const { QueryInterface } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ObservationAppointments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      appointmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "appointments",
          key: "id",
        },
      },
      diagnostic: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      procedures: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      exams: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      recommendations: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ObservationAppointments");
  },
};

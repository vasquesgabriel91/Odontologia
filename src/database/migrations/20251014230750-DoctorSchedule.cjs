"use strict";

const { BelongsTo } = require("sequelize");
const { default: sequelize } = require("../database");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctor_schedules", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      doctorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      dayOfWeek: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "08:00:00", 
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "16:00:00", 
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
    await queryInterface.dropTable("doctor_schedules");
  },
};

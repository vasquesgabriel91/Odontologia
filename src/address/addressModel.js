import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database.js";
import User from "../user/UserModel.js";
import e from "express";

class AddressModel extends Model {}

AddressModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,   
        primaryKey: true,
    },
    idUser: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    {   
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: true,
    }
);

AddressModel.belongsTo(User, { foreignKey: "idUser", as: "user" });
User.hasMany(AddressModel, { foreignKey: "idUser", as: "addresses" });

export default AddressModel;
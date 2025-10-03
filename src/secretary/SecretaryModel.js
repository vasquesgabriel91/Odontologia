import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database.js";

class SecretaryModel extends Model {}

SecretaryModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(100), allowNull: true, unique: true },
    telephone: { type: DataTypes.STRING(15), allowNull: true, unique: true },
    role: { type: DataTypes.STRING(20), allowNull: true },
    cro: { type: DataTypes.STRING(20), allowNull: true, unique: true },
    password: { type: DataTypes.STRING(100), allowNull: false },
},{
    sequelize,
    modelName: "Secretary",
    tableName: "users",
    timestamps: true,
});
export default SecretaryModel;
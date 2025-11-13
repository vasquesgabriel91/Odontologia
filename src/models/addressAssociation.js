import UserModel from "../user/UserModel.js";
import AddressModel from "../address/addressModel.js";

UserModel.hasMany(AddressModel, { foreignKey: "idUser", as: "addresses" });
AddressModel.belongsTo(UserModel, { foreignKey: "idUser", as: "user" });


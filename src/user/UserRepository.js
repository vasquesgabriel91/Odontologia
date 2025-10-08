import UserModel from "./UserModel.js";
import { Op } from "sequelize";
class UsersRepository {
  async create(userData) {
    const secretary = await UserModel.create(userData);
    return secretary;
  }

  async findByUserName(username) {
    return await UserModel.findOne({ where: { username } });
  }
  async findByUserNameOrEmail(usernameOrEmail) {
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    return user;
  }
  async findByTelephone(telephone) {
    return await UserModel.findOne({ where: { telephone } });
  }

  async findByEmail(email) {
    return await UserModel.findOne({ where: { email } });
  }

  async delete(id) {
    const secretary = await UserModel.findByPk(id);
    if (!secretary) throw new Error("Usuário não encontrado");
    await secretary.destroy();
    return secretary;
  }
}
export default new UsersRepository();

import SecretaryModel from "./UserModel.js";

class UsersRepository {
  async create(userData) {
    const secretary = await SecretaryModel.create(userData);
    return secretary;
  }

  async findByUserName(username) {
    return await SecretaryModel.findOne({ where: { username } });
  }

  async delete(id) {
    const secretary = await SecretaryModel.findByPk(id);
    if (!secretary) throw new Error("Usuário não encontrado");
    await secretary.destroy();
    return secretary;
  }
}
export default new UsersRepository();

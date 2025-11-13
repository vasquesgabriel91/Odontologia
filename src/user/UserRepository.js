import UserModel from "./UserModel.js";
import AddressModel from "../address/addressModel.js";
import AppointmentModel from "../appointments/AppointmentsModel.js";
import { Op } from "sequelize";

class UsersRepository {
  async create(userData) {
    const secretary = await UserModel.create(userData, {
      include: [{ model: AddressModel, as: "addresses" }],
    });
    return secretary;
  }
  async findById(id) {
    const getUser = await UserModel.findByPk(id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    return getUser;
  }
  async findByIdAddressModel(id) {
    const getUser = await UserModel.findByPk( id,{
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [{ model: AddressModel, as: "addresses" }],
    });
    console.log("User with address:", getUser);
    return getUser;
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

  async findAll() {
    const allUsers = await UserModel.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    return allUsers;
  }

  async update(id, userData) {
    await UserModel.update(userData, { where: { id } });
    return await UserModel.findByPk(id);
  }
  async getAppointmentsByClientId(clientId) {
    const appointments = await AppointmentModel.findAll({
      where: { patientId: clientId },
    });
    return appointments;
  }
  async updateAppointmentStatusById(appointmentId, status) {
    const appointment = await AppointmentModel.findByPk(appointmentId);
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }
    const updatedAppointment = await AppointmentModel.update(
      { status },
      { where: { id: appointmentId } }
    );

    return appointment;
  }
}
export default new UsersRepository();

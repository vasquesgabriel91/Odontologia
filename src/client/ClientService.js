import UserRepository from "../user/UserRepository.js";
import validatePassword from "../helpers/passwordValidator.js";
import validateFields from "../helpers/validateField.js";
import bcrypt from "bcryptjs";
const API_PREFIX = process.env.API_PREFIX;
const baseUrl = process.env.BASE_URL;

class ClientService {
  async validateUserNameUnique(username) {
    const existingUser = await UserRepository.findByUserName(username);
    if (existingUser) throw new Error("Nome de usuário já está em uso");
  }
  async validateEmailUnique(email) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error("Este email já está em uso");
  }
  async validateTelephoneUnique(telephone) {
    const existingUser = await UserRepository.findByTelephone(telephone);
    if (existingUser) throw new Error("Número de celular já está em uso");
  }
  async validateCellphoneUnique(telephone) {
    if (!validateFields.validateCellphone(telephone))
      throw new Error("Telefone inválido");
  }
  async validateForEmail(email) {
    validateFields.validateEmail(email);
  }

  async isPasswordStrong(password) {
    validatePassword(password);
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async createClient(userData) {
    const { username, password, email, telephone } = userData;
    const role = "client";
    await this.validateUserNameUnique(username);
    await this.isPasswordStrong(password);
    await this.validateEmailUnique(email);
    await this.validateTelephoneUnique(telephone);
    await this.validateCellphoneUnique(telephone);
    await this.validateForEmail(email);

    const hashedPassword = await this.hashPassword(password);
    const newUserData = {
      ...userData,
      role,
      password: hashedPassword,
    };
    const execute = await UserRepository.create(newUserData);

    const output = {
      message: "Paciente criado com sucesso",
      id: execute.id,
      username: execute.username,
      email: execute.email,
      telephone: execute.telephone,
    };

    return output;
  }
  async listMyAppointmentsClient(clientId) {
    try {
      const appointments = await UserRepository.getAppointmentsByClientId(
        clientId
      );
      const output = appointments.map((appointment) => ({
        appointment,
        link: {
          create: `${baseUrl}${API_PREFIX}/myAppointment/Cancel/${appointment.id}`,
        },
      }));
      return output;
    } catch (error) {
      throw new Error("Erro ao listar os agendamentos: " + error.message);
    }
  }
  async updateAppointmentClient(appointmentId, status) {
    try {
      const appointment = await UserRepository.updateAppointmentStatusById(
        appointmentId,
        status
      );
      return appointment;
    } catch (error) {
      throw new Error("Erro ao atualizar o agendamento: " + error.message);
    }
  }
}

export default new ClientService();

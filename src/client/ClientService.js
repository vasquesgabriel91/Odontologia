import UserRepository from "../user/UserRepository.js";
import AddressModel from "../address/addressModel.js"; 
import validatePassword from "../helpers/passwordValidator.js";
import validateFields from "../helpers/validateField.js";
import bcrypt from "bcryptjs";

const API_PREFIX = process.env.API_PREFIX;
const baseUrl = process.env.BASE_URL;

class ClientService {
  // --- CORREÇÃO NAS VALIDAÇÕES PARA IGNORAR O PRÓPRIO ID ---
  async validateUserNameUnique(username, idToExclude = null) {
    const existingUser = await UserRepository.findByUserName(username);
    if (existingUser && existingUser.id !== idToExclude) {
        throw new Error("Nome de usuário já está em uso");
    }
  }

  async validateEmailUnique(email, idToExclude = null) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser && existingUser.id !== idToExclude) {
        throw new Error("Este email já está em uso");
    }
  }

  async validateTelephoneUnique(telephone, idToExclude = null) {
    const existingUser = await UserRepository.findByTelephone(telephone);
    if (existingUser && existingUser.id !== idToExclude) {
        throw new Error("Número de celular já está em uso");
    }
  }
  // ---------------------------------------------------------

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
  async validateZipCode(zipCode) {
    const isValid = validateFields.validateZipCode(zipCode);
    if (!isValid) throw new Error("CEP inválido");
  }

  async createClient(userData) {
    const { username, password, email, telephone, zipCode } = userData;
    const role = "client";
    
    // Na criação não passamos ID para excluir
    await this.validateUserNameUnique(username);
    await this.isPasswordStrong(password);
    await this.validateEmailUnique(email);
    await this.validateTelephoneUnique(telephone);
    await this.validateCellphoneUnique(telephone);
    await this.validateForEmail(email);
    await this.validateZipCode(zipCode);

    const hashedPassword = await this.hashPassword(password);
    const newUserData = {
      username,
      password: hashedPassword,
      email,
      telephone,
      role,
      addresses: [
        {
          zipCode: userData.zipCode,
          street: userData.street,
          number: userData.number,
          state: userData.state,
          neighborhood: userData.neighborhood,
        },
      ],
    };

    const execute = await UserRepository.create(newUserData);

    const output = {
      message: "Paciente criado com sucesso",
      id: execute.id,
      username: execute.username,
      email: execute.email,
      telephone: execute.telephone,
      addresses: execute.addresses?.map((addr) => ({
        zipCode: addr.zipCode,
        street: addr.street,
        number: addr.number,
        state: addr.state,
        neighborhood: addr.neighborhood,
      })),
    };

    return output;
  }

  async listMyAppointmentsClient(clientId) {
    try {
      const appointments = await UserRepository.getAppointmentsByClientIdWithDoctor(
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
  async getClientProfile(clientId) {
    try {
      const client = await UserRepository.findByIdAddressModel(clientId);
      if (!client) throw new Error("Cliente não encontrado");
      const output = {
        ...client,
        link: {
          update: `http://localhost:3000/api/v1/patient/update/${client.id}`,
        },
      };
      return output;
    } catch (error) {
      throw new Error("Erro ao obter o perfil do cliente: " + error.message);
    }
  }

  async getProfile(clientId) {
      return this.getClientProfile(clientId);
  }
  
  async updateProfile(clientId, data) {
      // Lógica auxiliar se necessário
  }
}

export default new ClientService();
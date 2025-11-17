import UserRepository from "../user/UserRepository.js";
import AddressModel from "../address/addressModel.js"; 
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
  async validateZipCode(zipCode) {
    const isValid = validateFields.validateZipCode(zipCode);
    if (!isValid) throw new Error("CEP inválido");
  }

  async createClient(userData) {
    const { username, password, email, telephone, zipCode } = userData;
    const role = "client";
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

  async getProfile(clientId) {
    const user = await UserRepository.findByIdAddressModel(clientId);
    if (!user) throw new Error("Usuário não encontrado.");
    
    // Garantir que retornamos apenas 1 endereço na visualização se houver múltiplos (apenas visualmente, a limpeza real ocorre no update)
    if (user.addresses && user.addresses.length > 1) {
        user.addresses = [user.addresses[0]];
    }
    
    return user;
  }

  async updateProfile(clientId, data) {
    const { username, email, telephone, password, zipCode, street, number, state, neighborhood } = data;

    if (email) {
        validateFields.validateEmail(email);
    }
    if(zipCode) {
        validateFields.validateZipCode(zipCode);
    }

    // 1. Atualiza dados do Usuário
    const userUpdateData = {};
    if (username) userUpdateData.username = username;
    if (email) userUpdateData.email = email;
    if (telephone) userUpdateData.telephone = telephone;
    
    if (password && password.trim() !== "") {
      await this.isPasswordStrong(password);
      userUpdateData.password = await this.hashPassword(password);
    }

    if (Object.keys(userUpdateData).length > 0) {
        await UserRepository.update(clientId, userUpdateData);
    }

    // 2. Atualiza ou Cria dados do Endereço (Lógica corrigida para SINGLE ADDRESS)
    if (zipCode || street || number || state || neighborhood) {
        const addressUpdateData = {};
        if (zipCode) addressUpdateData.zipCode = zipCode;
        if (street) addressUpdateData.street = street;
        if (number) addressUpdateData.number = number;
        if (state) addressUpdateData.state = state;
        if (neighborhood) addressUpdateData.neighborhood = neighborhood;

        // Busca usuário e seus endereços atuais
        const user = await UserRepository.findByIdAddressModel(clientId);
        const addresses = user.addresses || [];

        if (addresses.length > 0) {
            // --- CORREÇÃO: Atualiza o primeiro e deleta o resto ---
            
            // 1. Atualiza o primeiro endereço encontrado (o mais antigo ou principal)
            const primaryAddressId = addresses[0].id;
            await AddressModel.update(addressUpdateData, { where: { id: primaryAddressId } });

            // 2. Se houver endereços "extras" (lixo no banco), deleta eles agora
            if (addresses.length > 1) {
                const idsToDelete = addresses.slice(1).map(addr => addr.id);
                if (idsToDelete.length > 0) {
                    await AddressModel.destroy({ where: { id: idsToDelete } });
                }
            }
        } else {
            // Se não existe nenhum, cria um novo
            await AddressModel.create({ ...addressUpdateData, idUser: clientId });
        }
    }

    return await this.getProfile(clientId);
  }
}

export default new ClientService();
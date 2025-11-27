import ClientService from "./ClientService.js";
import UserRepository from "../user/UserRepository.js";

class ClientUseCase {
  async execute(userData) {
    try {
      const result = await ClientService.createClient(userData);
      return result;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
  async getMyAppointmentsClient(clientId) {
    try {
      const appointments = await ClientService.listMyAppointmentsClient(
        clientId
      );
      return appointments;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateAppointment(appointmentId) {
    try {
      const status = "cancelado";
      const updateAppointment = await ClientService.updateAppointmentClient(
        appointmentId,
        status
      );
      return updateAppointment;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getMyProfile(clientId) {
    try {
      const clientProfile = await ClientService.getClientProfile(clientId);
      return clientProfile;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  async updateUser(userData, idParam) {
    const { username, email, telephone, addresses } = userData;
    const zipCode = addresses?.zipCode;

    try {
      // --- CORREÇÃO: Passamos idParam como segundo argumento ---
      // Isso diz ao serviço: "Verifique se o nome existe, mas ignore se o dono for este ID"
      await ClientService.validateUserNameUnique(username, idParam);
      await ClientService.validateEmailUnique(email, idParam);
      await ClientService.validateTelephoneUnique(telephone, idParam);
      // --------------------------------------------------------

      await ClientService.validateCellphoneUnique(telephone);
      if (email) await ClientService.validateForEmail(email);
      if (zipCode) await ClientService.validateZipCode(zipCode);

      const updatedUser = await UserRepository.updateUserAndAddresses(
        idParam,
        userData
      );
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProfile(clientId) {
    try {
      return await ClientService.getProfile(clientId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProfile(clientId, data) {
    try {
      return await this.updateUser(data, clientId);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export default new ClientUseCase();
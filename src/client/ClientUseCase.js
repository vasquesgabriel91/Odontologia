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
<<<<<<< HEAD
 async getMyAppointmentsClient(clientId) {
    try {
        // [V51 - CORREÇÃO]
        // Apenas repassa a chamada. O Service fará o trabalho.
      const appointments = await ClientService.listMyAppointmentsClient(clientId);
      return appointments;
    } catch (error) {
      throw new Error(error.message);
    }   
  }
=======
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
>>>>>>> c6569ed0bc3880f7c1c9ca572e5e8e067e90d82a
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
      console.log(userData, idParam);
      await ClientService.validateUserNameUnique(username);
      await ClientService.validateEmailUnique(email);
      await ClientService.validateTelephoneUnique(telephone);
      await ClientService.validateCellphoneUnique(telephone);
      if (email) await ClientService.validateForEmail(email);
      if (zipCode) await ClientService.validateZipCode(zipCode);

      console.log(idParam, userData);
      const updatedUser = await UserRepository.updateUserAndAddresses(
        idParam,
        userData
      );
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
export default new ClientUseCase();

import ClientService from "./ClientService.js";

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
        // [V51 - CORREÇÃO]
        // Apenas repassa a chamada. O Service fará o trabalho.
      const appointments = await ClientService.listMyAppointmentsClient(clientId);
      return appointments;
    } catch (error) {
      throw new Error(error.message);
    }   
  }
  async updateAppointment(appointmentId) {
    try {
      const status = "cancelado";
      const updateAppointment = await ClientService.updateAppointmentClient(appointmentId, status);
      return updateAppointment;
    } catch (error) {
      throw new Error(error.message);
    } 
  }
}
export default new ClientUseCase();

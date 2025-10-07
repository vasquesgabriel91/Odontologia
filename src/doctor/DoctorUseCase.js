import DoctorService from "./DoctorService.js";

class DoctorUseCase {
  async execute(userData) {
    try {
      const result = await DoctorService.createDoctor(userData);
      return result;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
}
export default new DoctorUseCase();
import DoctorService from "./DoctorService.js";

class DoctorUseCase {
  async execute(userData) {
    try {
      const result = await DoctorService.createDoctor(userData);
      return result;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async schedule(userData, id) {
    try {
      const result = await DoctorService.doctorSchedule(userData, id);
      return result;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
}
export default new DoctorUseCase();

import ObservationRepository from "./ObservationRepository.js";

class ObservationService {
  async createObservationAppointment(observationData, idParams) {
    try {
      const observation = await ObservationRepository.create(
        observationData,
        idParams
      );
      return observation;
    } catch (error) {
      throw new Error(
        "Error ao criar prontuário: " + error.message
      );
    }
  }
}
export default new ObservationService();

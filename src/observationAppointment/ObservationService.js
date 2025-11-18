// src/observationAppointment/ObservationService.js (Corrigido)

import ObservationRepository from "./ObservationRepository.js";
// [CORREÇÃO] Importamos o UserRepository para poder atualizar o agendamento
import UserRepository from "../user/UserRepository.js"; 

class ObservationService {
  async createObservationAppointment(observationData, idParams) {
    try {
      const observation = await ObservationRepository.create(
        observationData,
        idParams
      );
      if (observation) {
        await UserRepository.updateAppointmentStatusById(idParams, "concluído");
      }
      return observation;
    } catch (error) {
      throw new Error(
        "Error ao criar prontuário: " + error.message
      );
    }
  }
}
export default new ObservationService();
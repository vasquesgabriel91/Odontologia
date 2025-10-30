// src/observationAppointment/ObservationService.js (Corrigido)

import ObservationRepository from "./ObservationRepository.js";
// [CORREÇÃO] Importamos o UserRepository para poder atualizar o agendamento
import UserRepository from "../user/UserRepository.js"; 

class ObservationService {
  async createObservationAppointment(observationData, idParams) {
    try {
      // 1. Cria o prontuário (como já fazia)
      const observation = await ObservationRepository.create(
        observationData,
        idParams
      );

      // --- [ INÍCIO DA CORREÇÃO ] ---
      // 2. Se o prontuário foi criado com sucesso, atualiza o status do agendamento pai
      if (observation) {
        // O 'idParams' é o ID do agendamento (appointmentId)
        await UserRepository.updateAppointmentStatusById(idParams, "concluído");
      }
      // --- [ FIM DA CORREÇÃO ] ---

      return observation;
    } catch (error) {
      throw new Error(
        "Error ao criar prontuário: " + error.message
      );
    }
  }
}
export default new ObservationService();
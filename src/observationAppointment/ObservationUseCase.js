import ObservationService from "./ObservationService.js";

class ObservationUseCase {  
    async addObservationAppointment(observationData, idParams) {
       try {
         const observation = await ObservationService.createObservationAppointment(observationData, idParams);
         return observation;
       } catch (error) {
         throw new Error(error.message);
       }
    }
}

export default new ObservationUseCase();

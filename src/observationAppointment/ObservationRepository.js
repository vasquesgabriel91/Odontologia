import ObservationModel from "./ObservationModel.js";

class ObservationRepository {
  async create(observationData, id) {
    const createObservation = await ObservationModel.create({
        ...observationData,
        appointmentId: id
    });
    return createObservation;
  } 
}
export default new ObservationRepository();